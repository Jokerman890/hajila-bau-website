import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

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

// Pfad für Bild-Uploads
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'carousel')

// Hilfsfunktionen
async function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true })
  }
}

async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  // Einfache Implementierung - in Produktion sollte eine Bibliothek wie 'sharp' verwendet werden
  return { width: 800, height: 600 } // Placeholder
}

// Memory Storage - Einfache In-Memory-Speicherung als Fallback
declare global {
  var memoryStorage: CarouselImage[] | undefined
}

// Initialisiere globale Memory Storage
if (!global.memoryStorage) {
  global.memoryStorage = []
}

async function loadImagesFromMemory(): Promise<CarouselImage[]> {
  try {
    // Versuche zuerst aus der Memory Bank zu laden
    return global.memoryStorage || []
  } catch (error) {
    console.error('Error loading images from memory:', error)
    return []
  }
}

async function saveImageToMemory(image: CarouselImage): Promise<void> {
  try {
    // Füge zur Memory Storage hinzu
    if (!global.memoryStorage) {
      global.memoryStorage = []
    }
    global.memoryStorage.push(image)
  } catch (error) {
    console.error('Error saving image to memory:', error)
    throw error
  }
}

async function updateImageInMemory(image: CarouselImage): Promise<void> {
  try {
    // Finde und aktualisiere das Bild in der Memory Storage
    if (!global.memoryStorage) {
      global.memoryStorage = []
    }
    const index = global.memoryStorage.findIndex(img => img.id === image.id)
    if (index !== -1) {
      global.memoryStorage[index] = image
    }
  } catch (error) {
    console.error('Error updating image in memory:', error)
    throw error
  }
}

async function deleteImageFromMemory(imageId: string): Promise<void> {
  try {
    // Entferne das Bild aus der Memory Storage
    if (!global.memoryStorage) {
      global.memoryStorage = []
    }
    global.memoryStorage = global.memoryStorage.filter(img => img.id !== imageId)
  } catch (error) {
    console.error('Error deleting image from memory:', error)
    throw error
  }
}

// GET - Alle Bilder aus Memory abrufen
export async function GET() {
  try {
    const images = await loadImagesFromMemory()
    return NextResponse.json({ images, success: true })
  } catch (error) {
    console.error('Fehler beim Abrufen der Bilder aus Memory:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Bilder', success: false },
      { status: 500 }
    )
  }
}

// POST - Neue Bilder hochladen und in Memory speichern
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Keine Dateien hochgeladen', success: false },
        { status: 400 }
      )
    }

    await ensureDirectoryExists(UPLOAD_DIR)
    
    const existingImages = await loadImagesFromMemory()
    const newImages: CarouselImage[] = []
    
    for (const file of files) {
      // Validierung
      if (!file.type.startsWith('image/')) {
        continue // Überspringe Nicht-Bild-Dateien
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        continue // Überspringe zu große Dateien
      }
      
      // Datei speichern
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const fileExtension = path.extname(file.name)
      const filename = `${uuidv4()}${fileExtension}`
      const filepath = path.join(UPLOAD_DIR, filename)
      
      await writeFile(filepath, buffer)
      
      // Bildmetadaten erstellen
      const dimensions = await getImageDimensions(buffer)
      const maxOrder = existingImages.length > 0 ? Math.max(...existingImages.map(img => img.order)) : 0
      
      const newImage: CarouselImage = {
        id: uuidv4(),
        url: `/uploads/carousel/${filename}`,
        title: file.name.replace(fileExtension, ''),
        description: '',
        alt: file.name.replace(fileExtension, ''),
        order: maxOrder + newImages.length + 1,
        isActive: true,
        uploadedAt: new Date(),
        size: file.size,
        dimensions,
        filename
      }
      
      // In Memory speichern
      await saveImageToMemory(newImage)
      newImages.push(newImage)
    }
    
    return NextResponse.json({
      images: newImages,
      message: `${newImages.length} Bilder erfolgreich hochgeladen`,
      success: true
    })
    
  } catch (error) {
    console.error('Fehler beim Hochladen der Bilder:', error)
    return NextResponse.json(
      { error: 'Fehler beim Hochladen der Bilder', success: false },
      { status: 500 }
    )
  }
}

// PUT - Bild in Memory aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Bild-ID erforderlich', success: false },
        { status: 400 }
      )
    }
    
    const images = await loadImagesFromMemory()
    const image = images.find(img => img.id === id)
    
    if (!image) {
      return NextResponse.json(
        { error: 'Bild nicht gefunden', success: false },
        { status: 404 }
      )
    }
    
    // Bild aktualisieren
    const updatedImage = { ...image, ...updates }
    await updateImageInMemory(updatedImage)
    
    return NextResponse.json({
      image: updatedImage,
      message: 'Bild erfolgreich aktualisiert',
      success: true
    })
    
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Bildes:', error)
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Bildes', success: false },
      { status: 500 }
    )
  }
}

// DELETE - Bild aus Memory löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Bild-ID erforderlich', success: false },
        { status: 400 }
      )
    }
    
    const images = await loadImagesFromMemory()
    const image = images.find(img => img.id === id)
    
    if (!image) {
      return NextResponse.json(
        { error: 'Bild nicht gefunden', success: false },
        { status: 404 }
      )
    }
    
    // Datei vom Dateisystem löschen
    try {
      const filepath = path.join(UPLOAD_DIR, image.filename)
      if (existsSync(filepath)) {
        await unlink(filepath)
      }
    } catch (fileError) {
      console.warn('Warnung: Datei konnte nicht gelöscht werden:', fileError)
    }
    
    // Bild aus Memory löschen
    await deleteImageFromMemory(id)
    
    return NextResponse.json({
      message: 'Bild erfolgreich gelöscht',
      success: true
    })
    
  } catch (error) {
    console.error('Fehler beim Löschen des Bildes:', error)
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Bildes', success: false },
      { status: 500 }
    )
  }
}
