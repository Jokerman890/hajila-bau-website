'use client'

import React, { useState, useEffect, useCallback } from 'react'
import AdminDashboard from '@/components/ui/admin-dashboard'
import { getLocalPublicUrl } from '@/lib/local-storage'
import { getAssetPath } from '@/lib/utils'
import { CarouselDisplayImage } from '@/components/ui/admin-dashboard'

interface CarouselImageApiResponse {
  id: string
  public_url: string
  title: string
  description: string
  alt_text: string
  order: number
  is_active: boolean
  uploaded_at: string
  size_kb: number
  width: number
  height: number
  file_name: string
  storage_path: string
}

function mapApiImageToDisplay(image: CarouselImageApiResponse): CarouselDisplayImage {
  return {
    id: image.id,
    public_url: getLocalPublicUrl(image.public_url || image.storage_path),
    title: image.title || '',
    description: image.description || '',
    alt_text: image.alt_text || image.title || '',
    order: image.order ?? 0,
    is_active: image.is_active ?? false,
    uploaded_at: image.uploaded_at,
    size_kb: image.size_kb ?? 0,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
    file_name: image.file_name ?? null,
    storage_path: image.storage_path || image.public_url,
  }
}

export default function HajilaBauAdminPage() {
  const [carouselImages, setCarouselImages] = useState<CarouselDisplayImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasError, setHasError] = useState(false)

  const fetchCarouselImages = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const response = await fetch(getAssetPath('/api/admin/images'), {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Karussell-Bilder: ${response.statusText}`)
      }

      const result = (await response.json()) as {
        images?: CarouselImageApiResponse[]
        success?: boolean
      }

      const processedImages = (result.images ?? [])
        .map((img) => mapApiImageToDisplay(img))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      setCarouselImages(processedImages)
    } catch (error) {
      console.error('Unexpected error fetching carousel images:', error)
      setHasError(true)
      setCarouselImages([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCarouselImages()
  }, [fetchCarouselImages])

  const handleImageUpload = async (
    files: FileList,
    _metadata: Array<{
      width?: number
      height?: number
      size_kb: number
      name: string
      type: string
    }>,
  ) => {
    void _metadata
    if (files.length === 0) return

    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append('files', file)
    })

    try {
      const response = await fetch(getAssetPath('/api/admin/images'), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || response.statusText)
      }

      const result = (await response.json()) as {
        images?: CarouselImageApiResponse[]
        success?: boolean
      }

      if (!result.success || !result.images) {
        throw new Error('Upload fehlgeschlagen: Keine gültige Antwort erhalten')
      }

      const mappedImages = result.images.map((img) => mapApiImageToDisplay(img))
      setCarouselImages((prevImages) =>
        [...prevImages, ...mappedImages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      )
    } catch (error) {
      console.error('Error uploading images:', error)
    }
  }

  const handleImageDelete = async (id: string) => {
    try {
      const response = await fetch(`${getAssetPath('/api/admin/images')}?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete image ${id}`)
      }

      setCarouselImages((prevImages) =>
        prevImages.filter((img) => img.id !== id),
      )
    } catch (error) {
      console.error(`Error deleting image ${id}:`, error)
    }
  }

  const handleImageUpdate = async (
    id: string,
    updates: Partial<CarouselDisplayImage>,
  ) => {
    try {
      const response = await fetch(getAssetPath('/api/admin/images'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, updates }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to update image ${id}`)
      }

      const result = (await response.json()) as {
        image: CarouselImageApiResponse
        success: boolean
      }

      if (!result.success || !result.image) {
        throw new Error('Fehlerhafte Antwort beim Aktualisieren des Bildes')
      }

      const updatedImage = mapApiImageToDisplay(result.image)
      setCarouselImages((prevImages) =>
        prevImages
          .map((img) => (img.id === id ? updatedImage : img))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      )
    } catch (error) {
      console.error(`Error updating image ${id}:`, error)
    }
  }

  async function handleImageReorder(orderedIds: string[]) {
    try {
      const response = await fetch(getAssetPath('/api/admin/images'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Reorder fehlgeschlagen')
      }
      const result = (await response.json()) as {
        success: boolean
        images: CarouselImageApiResponse[]
      }
      if (!result.success || !result.images) {
        throw new Error('Ungültige Antwort beim Neuordnen erhalten')
      }
      const mapped = result.images.map((img) => mapApiImageToDisplay(img))
      setCarouselImages(mapped)
    } catch (e) {
      console.error('Reorder-Fehler:', e)
    }
  }

  const handleImageSync = async () => {
    setIsSyncing(true)
    try {
      await fetchCarouselImages()
    } catch (error) {
      console.error('Error syncing images:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="brand-gradient-text">Hajila Bau GmbH</span>
            <span className="text-slate-900 dark:text-slate-100"> – Admin Dashboard</span>
          </h1>
        </div>

        <AdminDashboard
          images={carouselImages}
          isLoading={isLoading || isSyncing}
          hasError={hasError}
          onRetry={fetchCarouselImages}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          onImageUpdate={handleImageUpdate}
          onImageReorder={handleImageReorder}
          onImageSync={handleImageSync}
        />
      </div>
    </div>
  )
}
