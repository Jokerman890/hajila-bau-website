'use client'

import { useState, useEffect, useCallback } from 'react'
import { MemoryAdminAPI } from '@/lib/api/memory-admin'
import { CarouselImage, validateImageFiles } from '@/lib/api/admin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiResponse } from '@/lib/api/admin'

export interface UseAdminDashboardReturn {
  // State
  images: CarouselImage[]
  isLoading: boolean
  error: string | null
  uploadProgress: number
  isUploading: boolean
  
  // Computed values
  activeImages: CarouselImage[]
  inactiveImages: CarouselImage[]
  totalSize: number
  
  // Actions
  loadImages: () => Promise<void>
  uploadImages: (files: FileList) => Promise<void>
  updateImage: (id: string, updates: Partial<CarouselImage>) => Promise<void>
  deleteImage: (id: string) => Promise<void>
  reorderImages: (imageIds: string[]) => Promise<void>
  clearError: () => void
  retry: () => Promise<void>
}

export const useAdminDashboard = (): UseAdminDashboardReturn => { // eslint-disable-line @typescript-eslint/no-unused-vars
  // State
  const [images, setImages] = useState<CarouselImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Computed values
  const activeImages = images.filter(img => img.isActive)
  const inactiveImages = images.filter(img => !img.isActive)
  const totalSize = images.reduce((sum, img) => sum + img.size, 0)

  // Bilder laden
  const loadImages = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const images = await MemoryAdminAPI.getImages()
      setImages(images.sort((a: CarouselImage, b: CarouselImage) => a.order - b.order))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Bilder hochladen
  const uploadImages = useCallback(async (files: FileList) => {
    try {
      setIsUploading(true)
      setUploadProgress(0)
      setError(null)

      // Dateien validieren
      const { valid, invalid } = validateImageFiles(files)
      
      if (invalid.length > 0) {
        const errorMessages = invalid.map(({ file, error }) => `${file.name}: ${error}`)
        setError(`Einige Dateien konnten nicht hochgeladen werden:\n${errorMessages.join('\n')}`)
      }

      if (valid.length === 0) {
        setError('Keine gültigen Bilddateien zum Hochladen gefunden')
        return
      }

      // Erstelle FileList nur mit gültigen Dateien
      const validFileList = new DataTransfer()
      valid.forEach(file => validFileList.items.add(file))

      setUploadProgress(50) // Simuliere Progress

      const newImages = await MemoryAdminAPI.uploadImages(validFileList.files)
      
      // Neue Bilder zur Liste hinzufügen
      setImages(prev => [...prev, ...newImages].sort((a: CarouselImage, b: CarouselImage) => a.order - b.order))
      setUploadProgress(100)
      
      // Success-Nachricht könnte hier gezeigt werden
      console.log(`${newImages.length} Bilder erfolgreich hochgeladen`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Hochladen')
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 2000) // Reset progress nach 2s
    }
  }, [])

  // Bild aktualisieren
  const updateImage = useCallback(async (id: string, updates: Partial<CarouselImage>) => {
    try {
      setError(null)
      
      const updatedImage = await MemoryAdminAPI.updateImage(id, updates)
      
      setImages(prev => 
        prev.map(img => 
          img.id === id ? updatedImage : img
        ).sort((a: CarouselImage, b: CarouselImage) => a.order - b.order)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Aktualisieren')
    }
  }, [])

  // Bild löschen
  const deleteImage = useCallback(async (id: string) => {
    try {
      setError(null)
      
      await MemoryAdminAPI.deleteImage(id)
      setImages(prev => prev.filter(img => img.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Löschen')
    }
  }, [])

  // Bilder neu ordnen
  const reorderImages = useCallback(async (imageIds: string[]) => {
    try {
      setError(null)
      
      // Erstelle ein Array von CarouselImage-Objekten basierend auf den IDs
      const reorderedImages = imageIds.map((id, index) => {
        const image = images.find(img => img.id === id)
        if (image) {
          return { ...image, order: index + 1 }
        }
        return null
      }).filter(Boolean) as CarouselImage[]
      
      const updatedImages = await MemoryAdminAPI.reorderImages(reorderedImages)
      setImages(updatedImages.sort((a: CarouselImage, b: CarouselImage) => a.order - b.order))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Neuordnen')
    }
  }, [images])

  // Fehler löschen
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Retry-Funktion
  const retry = useCallback(async () => {
    await loadImages()
  }, [loadImages])

  // Initial load
  useEffect(() => {
    loadImages()
  }, [loadImages])

  return {
    // State
    images,
    isLoading,
    error,
    uploadProgress,
    isUploading,
    
    // Computed values
    activeImages,
    inactiveImages,
    totalSize,
    
    // Actions
    loadImages,
    uploadImages,
    updateImage,
    deleteImage,
    reorderImages,
    clearError,
    retry
  }
}

// Hook für Drag & Drop Funktionalität
export const useDragAndDrop = (onFilesDropped: (files: FileList) => void) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFilesDropped(files)
    }
  }, [onFilesDropped])

  return {
    isDragOver,
    dragHandlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop
    }
  }
}

// Hook für Bildvorschau
export const useImagePreview = () => {
  const [previewImage, setPreviewImage] = useState<CarouselImage | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const openPreview = useCallback((image: CarouselImage) => {
    setPreviewImage(image)
    setIsPreviewOpen(true)
  }, [])

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false)
    // Verzögerung beim Zurücksetzen des Bildes für sanfte Animation
    setTimeout(() => setPreviewImage(null), 300)
  }, [])

  return {
    previewImage,
    isPreviewOpen,
    openPreview,
    closePreview
  }
}

// Hook für lokale Speicherung von Einstellungen
export const useAdminSettings = () => {
  const [language, setLanguage] = useState<'de' | 'sr'>('de')
  const [maxImages, setMaxImages] = useState(20)
  const [maxFileSize, setMaxFileSize] = useState(5 * 1024 * 1024) // 5MB

  // Einstellungen aus localStorage laden
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('admin-language') as 'de' | 'sr'
      const savedMaxImages = localStorage.getItem('admin-max-images')
      const savedMaxFileSize = localStorage.getItem('admin-max-file-size')

      if (savedLanguage) setLanguage(savedLanguage)
      if (savedMaxImages) setMaxImages(parseInt(savedMaxImages))
      if (savedMaxFileSize) setMaxFileSize(parseInt(savedMaxFileSize))
    } catch (error) {
      console.warn('Fehler beim Laden der Einstellungen:', error)
    }
  }, [])

  // Sprache ändern und speichern
  const changeLanguage = useCallback((newLanguage: 'de' | 'sr') => {
    setLanguage(newLanguage)
    try {
      localStorage.setItem('admin-language', newLanguage)
    } catch (error) {
      console.warn('Fehler beim Speichern der Sprache:', error)
    }
  }, [])

  // Maximale Anzahl Bilder ändern
  const changeMaxImages = useCallback((newMaxImages: number) => {
    setMaxImages(newMaxImages)
    try {
      localStorage.setItem('admin-max-images', newMaxImages.toString())
    } catch (error) {
      console.warn('Fehler beim Speichern der maximalen Bildanzahl:', error)
    }
  }, [])

  // Maximale Dateigröße ändern
  const changeMaxFileSize = useCallback((newMaxFileSize: number) => {
    setMaxFileSize(newMaxFileSize)
    try {
      localStorage.setItem('admin-max-file-size', newMaxFileSize.toString())
    } catch (error) {
      console.warn('Fehler beim Speichern der maximalen Dateigröße:', error)
    }
  }, [])

  return {
    language,
    maxImages,
    maxFileSize,
    changeLanguage,
    changeMaxImages,
    changeMaxFileSize
  }
}
