// API-Client für Admin Dashboard

export interface CarouselImage {
  id: string
  url: string
  title: string
  description?: string
  alt: string
  order: number
  isActive: boolean
  uploadedAt: Date
  size: number
  dimensions: {
    width: number
    height: number
  }
  filename: string
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
/* eslint-enable @typescript-eslint/no-unused-vars */

class AdminAPI {
  private baseUrl = '/api/admin'

  // Alle Bilder abrufen
  async getImages(): Promise<ApiResponse<CarouselImage[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/images`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abrufen der Bilder')
      }
      
      // Datum-Strings zu Date-Objekten konvertieren
      const images = data.images.map((img: CarouselImage) => ({
        ...img,
        uploadedAt: new Date(img.uploadedAt)
      }))
      
      return {
        success: true,
        data: images
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Bilder:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }
    }
  }

  // Bilder hochladen
  async uploadImages(files: FileList): Promise<ApiResponse<CarouselImage[]>> {
    try {
      const formData = new FormData()
      
      // Alle Dateien zur FormData hinzufügen
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })
      
      const response = await fetch(`${this.baseUrl}/images`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Hochladen der Bilder')
      }
      
      // Datum-Strings zu Date-Objekten konvertieren
      const images = data.images.map((img: CarouselImage) => ({
        ...img,
        uploadedAt: new Date(img.uploadedAt)
      }))
      
      return {
        success: true,
        data: images,
        message: data.message
      }
    } catch (error) {
      console.error('Fehler beim Hochladen der Bilder:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }
    }
  }

  // Bild aktualisieren
  async updateImage(id: string, updates: Partial<CarouselImage>): Promise<ApiResponse<CarouselImage>> {
    try {
      const response = await fetch(`${this.baseUrl}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, updates })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Aktualisieren des Bildes')
      }
      
      // Datum-String zu Date-Objekt konvertieren
      const image = {
        ...data.image,
        uploadedAt: new Date(data.image.uploadedAt)
      }
      
      return {
        success: true,
        data: image,
        message: data.message
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Bildes:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }
    }
  }

  // Bild löschen
  async deleteImage(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/images?id=${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Löschen des Bildes')
      }
      
      return {
        success: true,
        message: data.message
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Bildes:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }
    }
  }

  // Bilder neu ordnen
  async reorderImages(imageIds: string[]): Promise<ApiResponse<CarouselImage[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/images/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageIds })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Neuordnen der Bilder')
      }
      
      // Datum-Strings zu Date-Objekten konvertieren
      const images = data.images.map((img: CarouselImage) => ({
        ...img,
        uploadedAt: new Date(img.uploadedAt)
      }))
      
      return {
        success: true,
        data: images,
        message: data.message
      }
    } catch (error) {
      console.error('Fehler beim Neuordnen der Bilder:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }
    }
  }
}

// Singleton-Instanz exportieren
export const adminAPI = new AdminAPI()

// Utility-Funktionen
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Dateityp prüfen
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Nur Bilddateien sind erlaubt' }
  }
  
  // Dateigröße prüfen (5MB Limit)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'Datei ist zu groß (max. 5MB)' }
  }
  
  // Unterstützte Formate prüfen
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'Nicht unterstütztes Dateiformat' }
  }
  
  return { valid: true }
}

export const validateImageFiles = (files: FileList): { valid: File[]; invalid: { file: File; error: string }[] } => {
  const valid: File[] = []
  const invalid: { file: File; error: string }[] = []
  
  Array.from(files).forEach(file => {
    const validation = validateImageFile(file)
    if (validation.valid) {
      valid.push(file)
    } else {
      invalid.push({ file, error: validation.error || 'Unbekannter Fehler' })
    }
  })
  
  return { valid, invalid }
}
