'use client'

import React, { useState, useEffect, useCallback } from 'react'
import LoginForm from '@/components/LoginForm'
import LogoutButton from '@/components/LogoutButton'
import AdminDashboard from '@/components/ui/admin-dashboard' // Import AdminDashboard
import { useAuth } from '@/components/AuthProvider'
import { supabaseAdmin } from '@/lib/supabase/client' // Import supabaseAdmin client
import { getPublicImageUrl } from '@/lib/supabase/carousel-storage' // Import helper for public URLs
import { CarouselDisplayImage } from '@/components/ui/admin-dashboard' // Import the type

// Define the AdminPage component
export default function HajilaBauAdminPage() {
  const auth = useAuth()
  const user = auth?.user ?? null
  const authLoading = auth?.loading ?? true

  const [carouselImages, setCarouselImages] = useState<CarouselDisplayImage[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Fetch initial carousel images
  const fetchCarouselImages = useCallback(async () => {
    if (!supabaseAdmin) {
      console.error('Supabase Admin Client not initialized.')
      setHasError(true)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setHasError(false)
    try {
      const { data, error } = await supabaseAdmin
        .from('carousel_images_metadata')
        .select('*') // Select all columns
        .order('order', { ascending: true }) // Order by display order

      if (error) {
        console.error('Error fetching carousel images:', error)
        setHasError(true)
        setCarouselImages([])
        return
      }

      if (data) {
        interface CarouselImageRow {
          id: string
          storage_path: string
          title: string | null
          description: string | null
          alt_text: string
          display_order: number
          is_active: boolean
          uploaded_at: string
          size_kb: number | null
          width: number | null
          height: number | null
          file_name: string | null
        }

        const processedImages = data.map((img: CarouselImageRow) => ({
          id: img.id,
          public_url: getPublicImageUrl(img.storage_path), // Use helper to get public URL
          title: img.title,
          description: img.description,
          alt_text: img.alt_text,
          order: img.display_order, // Map to 'order' prop
          is_active: img.is_active,
          uploaded_at: img.uploaded_at,
          size_kb: img.size_kb,
          width: img.width,
          height: img.height,
          file_name: img.file_name,
          storage_path: img.storage_path,
        }))
        setCarouselImages(processedImages)
      }
    } catch (error: unknown) {
      console.error('Unexpected error fetching carousel images:', error)
      setHasError(true)
      setCarouselImages([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      // Fetch only if user is authenticated
      fetchCarouselImages()
    }
  }, [user, fetchCarouselImages]) // Re-fetch if user changes

  // Handler for image upload
  const handleImageUpload = async (
    files: FileList,
    metadata: Array<{
      width?: number
      height?: number
      size_kb: number
      name: string
      type: string
    }>,
  ) => {
    void metadata
    if (!supabaseAdmin) {
      console.error('Supabase Admin Client not initialized for upload.')
      return
    }

    // This function will be called by AdminDashboard's ImageUploadZone
    // It needs to upload the file to storage and then save metadata to DB via API
    for (const file of Array.from(files)) {
      // Call the API route for upload
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/admin/carousel/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Upload failed for ${file.name}`)
        }

        const result = await response.json()
        if (result.success && result.image) {
          // Add the newly uploaded image to the state
          const newImage: CarouselDisplayImage = {
            id: result.image.id,
            public_url: getPublicImageUrl(result.image.storage_path), // Ensure public URL is correct
            title: result.image.title,
            description: result.image.description,
            alt_text: result.image.alt_text,
            order: result.image.order,
            is_active: result.image.is_active,
            uploaded_at: result.image.uploaded_at,
            size_kb: result.image.size_kb,
            width: result.image.width,
            height: result.image.height,
            file_name: result.image.file_name,
            storage_path: result.image.storage_path,
          }
          setCarouselImages((prevImages) => [...prevImages, newImage])
        } else {
          throw new Error(
            `Upload failed for ${file.name}: ${result.error || 'Unknown error'}`,
          )
        }
      } catch (error: unknown) {
        console.error(`Error uploading ${file.name}:`, error)
        // Handle individual file upload errors, maybe show a message to the user
        // For simplicity, we'll just log and continue with other files if possible
      }
    }
    // The function is expected to return Promise<void>, so no explicit return value needed here.
  }

  // Handler for image deletion
  const handleImageDelete = async (id: string) => {
    // Confirmation is handled within AdminDashboard's ImageCard
    if (!supabaseAdmin) {
      console.error('Supabase Admin Client not initialized for delete.')
      return
    }
    try {
      const response = await fetch(`/api/admin/carousel/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete image ${id}`)
      }

      // Remove the deleted image from the state
      setCarouselImages((prevImages) =>
        prevImages.filter((img) => img.id !== id),
      )
    } catch (error: unknown) {
      console.error(`Error deleting image ${id}:`, error)
      // Show error message to user
    }
  }

  // Handler for image update (metadata, active status, order)
  const handleImageUpdate = async (
    id: string,
    updates: Partial<CarouselDisplayImage>,
  ) => {
    if (!supabaseAdmin) {
      console.error('Supabase Admin Client not initialized for update.')
      return
    }
    try {
      const response = await fetch('/api/admin/carousel/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to update image ${id}`)
      }

      const result = await response.json()
      // Update the image in the state with the new data from the API response
      setCarouselImages((prevImages) =>
        prevImages.map((img) =>
          img.id === id ? { ...img, ...result.image } : img,
        ),
      )
    } catch (error: unknown) {
      console.error(`Error updating image ${id}:`, error)
      // Show error message to user
    }
  }

  // Handler for reordering (if implemented)
  // const handleImageReorder = async (orderedImages: CarouselDisplayImage[]) => {
  //   // This would involve sending the new order to the backend API
  //   // and updating the 'order' field for each image.
  //   // For now, we'll assume updates are handled individually.
  // };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Authentifizierung wird geladen…</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Hajila Bau GmbH – Admin Dashboard
          </h1>
          {/* Removed "Debug Mode" and "Weitere Debugging-Schritte erforderlich." */}
        </div>

        {/* Render the AdminDashboard component */}
        <AdminDashboard
          images={carouselImages}
          isLoading={isLoading}
          hasError={hasError}
          onRetry={fetchCarouselImages} // Pass the fetch function for retry
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          onImageUpdate={handleImageUpdate}
          // onImageReorder={handleImageReorder} // Uncomment if reordering is implemented
        />
      </div>
    </div>
  )
}
