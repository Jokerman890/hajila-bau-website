import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, unlink, stat, readFile } from 'fs/promises'
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
const IMAGES_JSON_PATH = path.join(process.cwd(), 'data', 'carousel-images.json')

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

async function loadImagesData(): Promise<CarouselImage[]> {
  try {
    await ensureDirectoryExists(path.dirname(IMAGES_JSON_PATH))
    if (existsSync(IMAGES_JSON_PATH)) {
      const data = await readFile(IMAGES_JSON_PATH, 'utf-8')
      return JSON.parse(data) || []
    }
    return []
  } catch (error) {
    console.error('Error loading images data:', error)
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

// GET - Alle Bilder abrufen
export async function GET() {
  try {
    const images = await loadImagesData()
    return NextResponse.json({ images, success: true })
  } catch (error) {
    console.error('Fehler beim Abrufen der Bilder:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Bilder', success: false },
      { status: 500 }
    )
  }
}

// POST - Neue Bilder hochladen
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
    
    const images = await loadImagesData()
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
      const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.order)) : 0
      
      const newImage: CarouselImage = {
        id: uuidv4(),
        url: `/uploads/carousel/${filename}`,
        title: file.name.replace(fileExtension, ''),
        description: '',
        alt: file.name.replace(fileExtension, ''),
        order: maxOrder + 1,
        isActive: true,
        uploadedAt: new Date(),
        size: file.size,
        dimensions,
        filename
      }
      
      newImages.push(newImage)
    }
    
    // Neue Bilder zur Liste hinzufügen
    const updatedImages = [...images, ...newImages]
    await saveImagesData(updatedImages)
    
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

// PUT - Bild aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Bild-ID erforderlich', success: false },
        { status: 400 }
      )
    }
    
    const images = await loadImagesData()
    const imageIndex = images.findIndex(img => img.id === id)
    
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Bild nicht gefunden', success: false },
        { status: 404 }
      )
    }
    
    // Bild aktualisieren
    images[imageIndex] = { ...images[imageIndex], ...updates }
    await saveImagesData(images)
    
    return NextResponse.json({
      image: images[imageIndex],
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

// DELETE - Bild löschen
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
    
    const images = await loadImagesData()
    const imageIndex = images.findIndex(img => img.id === id)
    
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Bild nicht gefunden', success: false },
        { status: 404 }
      )
    }
    
    const image = images[imageIndex]
    
    // Datei vom Dateisystem löschen
    try {
      const filepath = path.join(UPLOAD_DIR, image.filename)
      if (existsSync(filepath)) {
        await unlink(filepath)
      }
    } catch (fileError) {
      console.warn('Warnung: Datei konnte nicht gelöscht werden:', fileError)
    }
    
    // Bild aus der Liste entfernen
    images.splice(imageIndex, 1)
    await saveImagesData(images)
    
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
