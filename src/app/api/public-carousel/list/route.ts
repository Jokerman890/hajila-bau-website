import { NextResponse } from 'next/server'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'carousel')

export async function GET() {
  try {
    const files = await readdir(UPLOADS_DIR)
    const images = files
      .filter((name) => /\.(jpe?g|png|webp|gif)$/i.test(name))
      .sort((a, b) => a.localeCompare(b))
      .map((fileName, index) => {
        const url = `/uploads/carousel/${fileName}`
        const base = fileName.split('.').slice(0, -1).join('.')
        return {
          id: `${index}-${fileName}`,
          file_name: fileName,
          url,
          alt: base.replace(/[-_]/g, ' '),
          title: base.replace(/[-_]/g, ' '),
        }
      })

    return NextResponse.json({ success: true, images })
  } catch (error) {
    console.error('Fehler beim Lesen des lokalen Upload-Verzeichnisses:', error)
    return NextResponse.json(
      { success: false, error: 'Upload-Verzeichnis nicht gefunden oder nicht lesbar' },
      { status: 500 },
    )
  }
}

