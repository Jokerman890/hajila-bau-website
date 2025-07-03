import { NextRequest, NextResponse } from 'next/server'

// Typen für die API
interface CarouselImage {
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

// Memory Storage - Einfache In-Memory-Speicherung als Fallback
// Diese Variable wird mit der Hauptroute geteilt
declare global {
  var memoryStorage: CarouselImage[] | undefined
}

// POST - Bilder neu sortieren
export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json()
    
    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Ungültige Bilddaten', success: false },
        { status: 400 }
      )
    }
    
    // Aktualisiere die Reihenfolge in der Memory Storage
    if (!global.memoryStorage) {
      global.memoryStorage = []
    }
    
    // Aktualisiere die Reihenfolge für jedes Bild
    images.forEach((updatedImage: CarouselImage, index: number) => {
      const existingIndex = global.memoryStorage!.findIndex(img => img.id === updatedImage.id)
      if (existingIndex !== -1) {
        global.memoryStorage![existingIndex] = {
          ...global.memoryStorage![existingIndex],
          order: index + 1
        }
      }
    })
    
    // Sortiere die Memory Storage nach der neuen Reihenfolge
    global.memoryStorage.sort((a, b) => a.order - b.order)
    
    return NextResponse.json({
      images: global.memoryStorage,
      message: 'Bilder erfolgreich neu sortiert',
      success: true
    })
    
  } catch (error) {
    console.error('Fehler beim Neuordnen der Bilder:', error)
    return NextResponse.json(
      { error: 'Fehler beim Neuordnen der Bilder', success: false },
      { status: 500 }
    )
  }
}
