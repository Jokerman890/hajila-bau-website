import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import sizeOf from 'image-size'

export const dynamic = 'force-static'

interface StoredCarouselImage {
  id: string
  url: string
  title: string
  description: string
  alt: string
  order: number
  isActive: boolean
  uploadedAt: string
  size: number
  dimensions: {
    width: number
    height: number
  }
  filename: string
}

interface CarouselImageResponse {
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

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'carousel')
const IMAGES_JSON_PATH = path.join(
  process.cwd(),
  'public',
  'data',
  'carousel-images.json',
)
const BYTES_PER_KB = 1024

async function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true })
  }
}

async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  try {
    const dimensions = sizeOf(buffer)
    return {
      width: dimensions.width ?? 800,
      height: dimensions.height ?? 600,
    }
  } catch (error) {
    console.error('Fehler beim Ermitteln der Bildabmessungen:', error)
    return { width: 800, height: 600 }
  }
}

async function loadImagesData(): Promise<StoredCarouselImage[]> {
  try {
    await ensureDirectoryExists(path.dirname(IMAGES_JSON_PATH))
    if (!existsSync(IMAGES_JSON_PATH)) {
      return []
    }
    const data = await readFile(IMAGES_JSON_PATH, 'utf-8')
    const parsed = JSON.parse(data) as StoredCarouselImage[]
    return parsed.map((image) => ({
      ...image,
      title: image.title ?? '',
      description: image.description ?? '',
      alt: image.alt ?? image.title ?? '',
      order: image.order ?? 0,
      isActive: image.isActive ?? true,
      uploadedAt: image.uploadedAt ?? new Date().toISOString(),
      size: image.size ?? 0,
      dimensions: {
        width: image.dimensions?.width ?? 0,
        height: image.dimensions?.height ?? 0,
      },
    }))
  } catch (error) {
    console.error('Error loading images data:', error)
    return []
  }
}

async function saveImagesData(images: StoredCarouselImage[]): Promise<void> {
  try {
    await ensureDirectoryExists(path.dirname(IMAGES_JSON_PATH))
    const sorted = [...images].sort((a, b) => a.order - b.order)
    await writeFile(IMAGES_JSON_PATH, JSON.stringify(sorted, null, 2))
  } catch (error) {
    console.error('Fehler beim Speichern der Bilddaten:', error)
    throw error
  }
}

function normalizePublicPath(url: string): string {
  if (!url) return ''
  return url.startsWith('/') ? url : `/${url}`
}

function toResponse(image: StoredCarouselImage): CarouselImageResponse {
  return {
    id: image.id,
    public_url: normalizePublicPath(image.url),
    title: image.title,
    description: image.description,
    alt_text: image.alt || image.title,
    order: image.order,
    is_active: image.isActive,
    uploaded_at: image.uploadedAt,
    size_kb: Math.max(0, Math.round(image.size / BYTES_PER_KB)),
    width: image.dimensions.width,
    height: image.dimensions.height,
    file_name: image.filename,
    storage_path: normalizePublicPath(image.url),
  }
}

export async function GET() {
  try {
    const images = await loadImagesData()
    const sorted = images.sort((a, b) => a.order - b.order)
    return NextResponse.json({
      images: sorted.map(toResponse),
      success: true,
    })
  } catch (error) {
    console.error('Fehler beim Abrufen der Bilder:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Bilder', success: false },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const filesField = formData.getAll('files')
    const singleFile = formData.get('file')

    const files: File[] = []
    for (const entry of filesField) {
      if (entry instanceof File) {
        files.push(entry)
      }
    }
    if (singleFile instanceof File) {
      files.push(singleFile)
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Keine Dateien hochgeladen', success: false },
        { status: 400 },
      )
    }

    await ensureDirectoryExists(UPLOAD_DIR)

    const images = await loadImagesData()
    let maxOrder = images.reduce((acc, img) => Math.max(acc, img.order), 0)
    const newImages: StoredCarouselImage[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        console.warn('Überspringe Nicht-Bild-Datei:', file.name)
        continue
      }

      const bytes = Buffer.from(await file.arrayBuffer())
      const dimensions = await getImageDimensions(bytes)

      const fileExtension = path.extname(file.name)
      const filename = `${uuidv4()}${fileExtension}`
      const filepath = path.join(UPLOAD_DIR, filename)
      const url = `/uploads/carousel/${filename}`

      await writeFile(filepath, bytes)

      maxOrder += 1

      newImages.push({
        id: uuidv4(),
        url,
        title: file.name.replace(fileExtension, ''),
        description: '',
        alt: file.name.replace(fileExtension, ''),
        order: maxOrder,
        isActive: true,
        uploadedAt: new Date().toISOString(),
        size: file.size,
        dimensions,
        filename,
      })
    }

    if (newImages.length === 0) {
      return NextResponse.json(
        { error: 'Keine gültigen Bilddateien gefunden', success: false },
        { status: 400 },
      )
    }

    const updatedImages = [...images, ...newImages]
    await saveImagesData(updatedImages)

    return NextResponse.json({
      images: newImages.map(toResponse),
      message: `${newImages.length} Bilder erfolgreich hochgeladen`,
      success: true,
    })
  } catch (error) {
    console.error('Fehler beim Hochladen der Bilder:', error)
    return NextResponse.json(
      { error: 'Fehler beim Hochladen der Bilder', success: false },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = (await request.json()) as {
      id?: string
      updates?: Partial<{
        title: string
        description: string
        alt_text: string
        order: number
        is_active: boolean
      }>
    }

    if (!id || !updates) {
      return NextResponse.json(
        { error: 'Bild-ID und Updates erforderlich', success: false },
        { status: 400 },
      )
    }

    const images = await loadImagesData()
    const imageIndex = images.findIndex((img) => img.id === id)

    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Bild nicht gefunden', success: false },
        { status: 404 },
      )
    }

    const image = images[imageIndex]

    if (typeof updates.title === 'string') {
      image.title = updates.title
    }
    if (typeof updates.description === 'string') {
      image.description = updates.description
    }
    if (typeof updates.alt_text === 'string') {
      image.alt = updates.alt_text
    }
    if (typeof updates.order === 'number') {
      image.order = updates.order
    }
    if (typeof updates.is_active === 'boolean') {
      image.isActive = updates.is_active
    }

    images[imageIndex] = image
    await saveImagesData(images)

    return NextResponse.json({
      image: toResponse(image),
      message: 'Bild erfolgreich aktualisiert',
      success: true,
    })
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Bildes:', error)
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Bildes', success: false },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderedIds } = (await request.json()) as { orderedIds?: string[] }

    if (!orderedIds || !Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: 'orderedIds muss ein nicht-leeres Array sein', success: false },
        { status: 400 },
      )
    }

    const images = await loadImagesData()
    const imageMap = new Map(images.map((image) => [image.id, image]))
    const seen = new Set<string>()

    const reordered: StoredCarouselImage[] = []
    orderedIds.forEach((id, index) => {
      const image = imageMap.get(id)
      if (!image || seen.has(id)) return
      seen.add(id)
      reordered.push({ ...image, order: index + 1 })
    })

    if (reordered.length === 0) {
      return NextResponse.json(
        { error: 'Keine passenden Bilder für die angegebene Reihenfolge gefunden', success: false },
        { status: 400 },
      )
    }

    let nextOrder = reordered.length + 1
    const remaining = images
      .filter((img) => !seen.has(img.id))
      .sort((a, b) => a.order - b.order)
      .map((img) => ({ ...img, order: nextOrder++ }))

    const updatedImages = [...reordered, ...remaining]
    await saveImagesData(updatedImages)

    return NextResponse.json({
      images: updatedImages.map(toResponse),
      message: 'Reihenfolge erfolgreich aktualisiert',
      success: true,
    })
  } catch (error) {
    console.error('Fehler beim Neuordnen der Bilder:', error)
    return NextResponse.json(
      { error: 'Fehler beim Neuordnen der Bilder', success: false },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Bild-ID erforderlich', success: false },
        { status: 400 },
      )
    }

    const images = await loadImagesData()
    const imageIndex = images.findIndex((img) => img.id === id)

    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Bild nicht gefunden', success: false },
        { status: 404 },
      )
    }

    const [image] = images.splice(imageIndex, 1)

    try {
      const filepath = path.join(UPLOAD_DIR, image.filename)
      if (existsSync(filepath)) {
        await unlink(filepath)
      }
    } catch (fileError) {
      console.warn('Warnung: Datei konnte nicht gelöscht werden:', fileError)
    }

    await saveImagesData(images)

    return NextResponse.json({
      message: 'Bild erfolgreich gelöscht',
      success: true,
    })
  } catch (error) {
    console.error('Fehler beim Löschen des Bildes:', error)
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Bildes', success: false },
      { status: 500 },
    )
  }
}
