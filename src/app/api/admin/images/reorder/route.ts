import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const IMAGES_JSON_PATH = path.join(process.cwd(), 'data', 'carousel-images.json')

async function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true })
  }
}

export interface LocalImageMeta {
  id: string
  url: string
  title: string
  description?: string
  alt: string
  order: number
  isActive: boolean
  uploadedAt: string | Date
  size: number
  dimensions: { width: number; height: number }
  filename: string
}

async function loadImagesData(): Promise<LocalImageMeta[]> {
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

async function saveImagesData(images: LocalImageMeta[]): Promise<void> {
  await ensureDirectoryExists(path.dirname(IMAGES_JSON_PATH))
  await writeFile(IMAGES_JSON_PATH, JSON.stringify(images, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { imageIds } = await request.json()
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json({ success: false, error: 'imageIds required' }, { status: 400 })
    }

    const images = await loadImagesData()
    const idToImage = new Map(images.map((img) => [img.id, img]))

    const reordered: LocalImageMeta[] = []
    imageIds.forEach((id: string, index: number) => {
      const img = idToImage.get(id)
      if (img) {
        reordered.push({ ...img, order: index + 1 })
      }
    })

    // Include any images not in imageIds at the end, preserving relative order
    images
      .filter((img) => !imageIds.includes(img.id))
      .forEach((img) => {
        reordered.push({ ...img, order: reordered.length + 1 })
      })

    await saveImagesData(reordered)

    return NextResponse.json({ success: true, images: reordered })
  } catch (error) {
    console.error('Fehler beim Neuordnen der Bilder:', error)
    return NextResponse.json(
      { success: false, error: 'Fehler beim Neuordnen der Bilder' },
      { status: 500 },
    )
  }
}

