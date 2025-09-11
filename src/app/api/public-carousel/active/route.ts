import { NextResponse } from 'next/server'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import type { LocalImageMeta } from '../../admin/images/reorder/route'

const IMAGES_JSON_PATH = path.join(process.cwd(), 'data', 'carousel-images.json')

async function ensureJson(): Promise<LocalImageMeta[]> {
  try {
    if (!existsSync(path.dirname(IMAGES_JSON_PATH))) {
      await mkdir(path.dirname(IMAGES_JSON_PATH), { recursive: true })
    }
    if (!existsSync(IMAGES_JSON_PATH)) {
      await writeFile(IMAGES_JSON_PATH, '[]')
      return []
    }
    const data = await readFile(IMAGES_JSON_PATH, 'utf-8')
    return JSON.parse(data) || []
  } catch (e) {
    console.error('Kann lokale Metadaten nicht lesen:', e)
    return []
  }
}

export async function GET() {
  const images = (await ensureJson())
    .filter((img) => img.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      title: img.title,
    }))

  return NextResponse.json({ success: true, images })
}

