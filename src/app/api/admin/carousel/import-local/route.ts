import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { CAROUSEL_BUCKET_NAME } from '@/lib/supabase/carousel-storage'
import path from 'path'
import { promises as fs } from 'fs'
import sizeOf from 'image-size'

const LOCAL_CAROUSEL_DIR = path.join(process.cwd(), 'public', 'uploads', 'carousel')

function guessContentType(filename: string): string | undefined {
  const ext = filename.toLowerCase().split('.').pop()
  if (!ext) return undefined
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'gif') return 'image/gif'
  return undefined
}

export async function POST(request: NextRequest) {
  void request
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin Client nicht initialisiert.' }, { status: 500 })
  }

  try {
    // Lese lokale Dateien
    const entries = await fs.readdir(LOCAL_CAROUSEL_DIR)
    const files = entries.filter((name) => /\.(png|jpg|jpeg|webp|gif)$/i.test(name))

    if (files.length === 0) {
      return NextResponse.json({ success: true, message: 'Keine lokalen Bilder gefunden.', importedCount: 0, imported: [] })
    }

    // Aktuelle max display_order ermitteln (einmalig)
    const { data: maxRows } = await supabaseAdmin
      .from('carousel_images_metadata')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
    let nextOrder = (maxRows?.[0]?.display_order ?? 0) + 1

    const imported: Array<{ file_name: string; id?: string; skipped?: boolean; reason?: string }> = []

    for (const fileName of files) {
      const absPath = path.join(LOCAL_CAROUSEL_DIR, fileName)
      try {
        const fileBuffer = await fs.readFile(absPath)
        const stat = await fs.stat(absPath)
        let width: number | undefined
        let height: number | undefined
        try {
          const dim = sizeOf(fileBuffer)
          width = dim.width
          height = dim.height
        } catch {
          // Dimensionen optional
        }

        // Versuche Upload mit Original-Dateinamen; wenn existiert, überspringen
        const { error: upErr } = await supabaseAdmin.storage
          .from(CAROUSEL_BUCKET_NAME)
          .upload(fileName, fileBuffer, {
            upsert: false,
            cacheControl: '3600',
            contentType: guessContentType(fileName),
          })

        if (upErr) {
          // Falls Datei bereits existiert, überspringen wir den Import
          imported.push({ file_name: fileName, skipped: true, reason: upErr.message })
          continue
        }

        // Metadaten in DB anlegen
        const baseName = fileName.split('.').slice(0, -1).join('.') || 'Importiertes Bild'
        const { data: row, error: dbErr } = await supabaseAdmin
          .from('carousel_images_metadata')
          .insert({
            file_name: fileName,
            storage_path: fileName,
            alt_text: baseName,
            title: baseName,
            is_active: true,
            display_order: nextOrder++,
            size_kb: Math.round(stat.size / 1024),
            width,
            height,
          })
          .select()
          .single()

        if (dbErr || !row) {
          imported.push({ file_name: fileName, skipped: true, reason: dbErr?.message || 'DB insert fehlgeschlagen' })
          continue
        }

        imported.push({ file_name: fileName, id: row.id })
      } catch (e) {
        imported.push({ file_name: fileName, skipped: true, reason: e instanceof Error ? e.message : 'Unbekannter Fehler' })
      }
    }

    const importedCount = imported.filter((x) => !x.skipped).length
    return NextResponse.json({ success: true, importedCount, imported })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Interner Serverfehler beim lokalen Import.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}