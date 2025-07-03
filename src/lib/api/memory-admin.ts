// Memory MCP-basierte Admin API für Karussell-Bilder
import { CarouselImage } from './admin'

// Hilfsfunktionen für Memory MCP Integration
export class MemoryAdminAPI {
  
  // Alle Bilder aus der Memory Bank abrufen
  static async getImages(): Promise<CarouselImage[]> {
    try {
      const response = await fetch('/api/admin/memory/images', {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.images || []
    } catch (error) {
      console.error('Fehler beim Abrufen der Bilder aus Memory:', error)
      throw error
    }
  }

  // Neue Bilder in Memory Bank speichern
  static async uploadImages(files: FileList): Promise<CarouselImage[]> {
    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/admin/memory/images', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.images || []
    } catch (error) {
      console.error('Fehler beim Hochladen der Bilder in Memory:', error)
      throw error
    }
  }

  // Bild in Memory Bank aktualisieren
  static async updateImage(id: string, updates: Partial<CarouselImage>): Promise<CarouselImage> {
    try {
      const response = await fetch('/api/admin/memory/images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, updates }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.image
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Bildes in Memory:', error)
      throw error
    }
  }

  // Bild aus Memory Bank löschen
  static async deleteImage(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/admin/memory/images?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Bildes aus Memory:', error)
      throw error
    }
  }

  // Bilder in Memory Bank neu sortieren
  static async reorderImages(images: CarouselImage[]): Promise<CarouselImage[]> {
    try {
      const response = await fetch('/api/admin/memory/images/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.images || []
    } catch (error) {
      console.error('Fehler beim Neuordnen der Bilder in Memory:', error)
      throw error
    }
  }
}

export default MemoryAdminAPI
