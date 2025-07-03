import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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

const IMAGES_JSON_PATH = path.join(process.cwd(), 'data', 'carousel-images.json')

async function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true })
  }
}

async function loadImagesData(): Promise<CarouselImage[]> {
  try {
    await ensureDirectoryExists(path.dirname(IMAGES_JSON_PATH))
    if (existsSync(IMAGES_JSON_PATH)) {
      const fileContent = await readFile(IMAGES_JSON_PATH, 'utf-8')
      return JSON.parse(fileContent)
    }
    return []
  } catch (error) {
    console.error('Fehler beim Laden der Bilddaten:', error)
    return []
  }
}

async function saveImagesData(images: CarouselImage[]): Promise<void> {
  try {
    await ensureDirectoryExists(path.dirname(IMAGES_JSON_PATH))
    await writeFile(IMAGES_JSON_PATH, JSON.stringify(images, null, 2))
  } catch (error) {
    console.error('Fehler beim Speichern der Bilddaten:', error)
    throw error
  }
}

// POST - Bilder neu ordnen
export async function POST(request: NextRequest) {
  try {
    const { imageIds } = await request.json()
    
    if (!Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: 'Ungültiges Format für Bild-IDs', success: false },
        { status: 400 }
      )
    }
    
    const images = await loadImagesData()
    
    // Neue Reihenfolge zuweisen
    const reorderedImages = images.map(image => {
      const newOrder = imageIds.indexOf(image.id)
      return {
        ...image,
        order: newOrder !== -1 ? newOrder + 1 : image.order
      }
    })
    
    // Nach Reihenfolge sortieren
    reorderedImages.sort((a, b) => a.order - b.order)
    
    await saveImagesData(reorderedImages)
    
    return NextResponse.json({
      images: reorderedImages,
      message: 'Bilder erfolgreich neu geordnet',
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
