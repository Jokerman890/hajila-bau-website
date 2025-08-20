'use client'

import React, { useState, useEffect, useCallback } from 'react'
import LoginForm from '@/components/LoginForm'
import LogoutButton from '@/components/LogoutButton'
import AdminDashboard from '@/components/ui/admin-dashboard' // Import AdminDashboard
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase/client' // Import public supabase client statt supabaseAdmin
import { getLocalPublicUrl } from '@/lib/local-storage' // Geändert für lokale Speicherung
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
  const [isSyncing, setIsSyncing] = useState(false) // Zustand für den Sync-Vorgang
  const [hasError, setHasError] = useState(false)

  // Fetch initial carousel images
  const fetchCarouselImages = useCallback(async () => {
    if (!supabase) {
      console.error('Supabase Client not initialized.')
      setHasError(true)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setHasError(false)
    try {
      const { data, error } = await supabase
        .from('carousel_images_metadata')
        .select('*') // Select all columns
        .order('display_order', { ascending: true }) // Order by display order

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
          public_url: getLocalPublicUrl(img.storage_path), // Use helper to get public URL
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

    // Upload via API-Route, kein supabaseAdmin-Check im Client nötig
    for (const file of Array.from(files)) {
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
          const newImage: CarouselDisplayImage = {
            id: result.image.id,
            public_url: getLocalPublicUrl(result.image.storage_path),
            title: result.image.title,
            description: result.image.description,
            alt_text: result.image.alt_text,
            order: result.image.display_order, // Korrektur
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
      }
    }
  }

  // Handler for image deletion
  const handleImageDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/carousel/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete image ${id}`)
      }

      setCarouselImages((prevImages) =>
        prevImages.filter((img) => img.id !== id),
      )
    } catch (error: unknown) {
      console.error(`Error deleting image ${id}:`, error)
    }
  }

  // Handler for image update (metadata, active status, order)
  const handleImageUpdate = async (
    id: string,
    updates: Partial<CarouselDisplayImage>,
  ) => {
    try {
      // Mappe ggf. order -> display_order für die API
      const payload = { ...updates } as Record<string, unknown>
      if (typeof updates.order === 'number') {
        payload.display_order = updates.order
        delete payload.order
      }

      const response = await fetch('/api/admin/carousel/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...payload }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to update image ${id}`)
      }

      const result = await response.json()
      setCarouselImages((prevImages) =>
        prevImages.map((img) =>
          img.id === id
            ? {
                ...img,
                ...result.image,
                order: result.image.display_order, // sicherstellen, dass order aktualisiert wird
              }
            : img,
        ),
      )
    } catch (error: unknown) {
      console.error(`Error updating image ${id}:`, error)
    }
  }

  // Hinweis: Reordering-Funktion optional aktivierbar
  async function handleImageReorder(orderedIds: string[]) {
    try {
      const response = await fetch('/api/admin/carousel/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: orderedIds }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Reorder fehlgeschlagen')
      }
      const result: { success: boolean; images: Array<{ id: string; display_order: number }> } = await response.json()
      setCarouselImages((prev) => {
        const map = new Map(result.images.map((img) => [img.id, img.display_order]))
        return [...prev]
          .map((img) => ({ ...img, order: map.get(img.id) ?? img.order }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      })
    } catch (e) {
      console.error('Reorder-Fehler:', e)
    }
  }

  // Handler for image sync
  const handleImageSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/admin/carousel/sync', {
        method: 'POST',
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync images.')
      }

      if (result.success && result.added > 0 && result.newImages) {
        // Definiere einen Typ für die neuen Bilder von der API
        interface SyncedImage {
          id: string;
          storage_path: string;
          title: string | null;
          description: string | null;
          alt_text: string;
          display_order: number;
          is_active: boolean;
          uploaded_at: string;
          size_kb: number | null;
          width: number | null;
          height: number | null;
          file_name: string | null;
        }

        // Neue Bilder zur Anzeige aufbereiten
        const newImagesProcessed = result.newImages.map((img: SyncedImage) => ({
          id: img.id,
          public_url: getLocalPublicUrl(img.storage_path),
          title: img.title,
          description: img.description,
          alt_text: img.alt_text,
          order: img.display_order,
          is_active: img.is_active,
          uploaded_at: img.uploaded_at,
          size_kb: img.size_kb,
          width: img.width,
          height: img.height,
          file_name: img.file_name,
          storage_path: img.storage_path,
        }))

        setCarouselImages((prevImages) => [...prevImages, ...newImagesProcessed]);
        alert(`${result.added} neue Bilder wurden hinzugefügt. Sie sind zunächst inaktiv.`);
      } else {
        alert(result.message || 'Synchronisierung abgeschlossen.');
      }

    } catch (error: unknown) {
      console.error('Error syncing images:', error)
      alert(`Ein Fehler ist aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsSyncing(false)
    }
  }

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
          <h1 className="text-4xl font-bold mb-4">
            <span className="brand-gradient-text">Hajila Bau GmbH</span>
            <span className="text-slate-900 dark:text-slate-100"> – Admin Dashboard</span>
          </h1>
          {/* Removed "Debug Mode" and "Weitere Debugging-Schritte erforderlich." */}
        </div>

        {/* Render the AdminDashboard component */}
        <AdminDashboard
          images={carouselImages}
          isLoading={isLoading || isSyncing} // Kombinierter Ladezustand
          hasError={hasError}
          onRetry={fetchCarouselImages}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          onImageUpdate={handleImageUpdate}
          onImageReorder={handleImageReorder}
          onImageSync={handleImageSync} // Sync-Handler übergeben
        />
      </div>
    </div>
  )
}
