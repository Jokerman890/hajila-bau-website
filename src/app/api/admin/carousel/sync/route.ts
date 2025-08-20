import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { readdir, stat, readFile } from 'node:fs/promises' // readFile hinzugefügt
import path from 'node:path'
import sizeOf from 'image-size'

// Definiere den Pfad zum Upload-Verzeichnis
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'carousel')
const PUBLIC_UPLOADS_PATH = '/uploads/carousel'

export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase Admin Client nicht initialisiert.' },
      { status: 500 },
    )
  }

  try {
    // 1. Dateien aus dem Verzeichnis lesen
    let filesInDir: string[]
    try {
      filesInDir = await readdir(UPLOADS_DIR)
    } catch {
      // Wenn das Verzeichnis nicht existiert, gibt es nichts zu synchronisieren.
      return NextResponse.json({ success: true, message: 'Upload-Verzeichnis nicht gefunden, nichts zu synchronisieren.', added: 0 })
    }


    // 2. Bildpfade aus der Datenbank abrufen
    const { data: dbImages, error: dbError } = await supabaseAdmin
      .from('carousel_images_metadata')
      .select('file_name')

    if (dbError) {
      throw new Error(`Fehler beim Abrufen der Datenbankbilder: ${dbError.message}`)
    }

    const dbFileNames = new Set(dbImages.map(img => img.file_name))

    // 3. Listen vergleichen, um neue Dateien zu finden
    const newFiles = filesInDir.filter(fileName =>
      !dbFileNames.has(fileName) && /\.(jpe?g|png|webp)$/i.test(fileName)
    )

    if (newFiles.length === 0) {
      return NextResponse.json({ success: true, message: 'Keine neuen Bilder zum Synchronisieren gefunden.', added: 0 })
    }

    // 4. Höchste bestehende display_order ermitteln
    const { data: orderRows, error: orderErr } = await supabaseAdmin
      .from('carousel_images_metadata')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)

    let nextOrder = orderErr || !orderRows || orderRows.length === 0 ? 1 : (orderRows[0].display_order ?? 0) + 1

    // 5. Metadaten für neue Bilder vorbereiten
    const imagesToInsert: Record<string, any>[] = [] // Array explizit typisieren
    for (const fileName of newFiles) {
      const filePath = path.join(UPLOADS_DIR, fileName)
      // Erstellt einen Pfad, der im Web zugänglich ist (z.B. /uploads/carousel/bild.jpg)
      const storagePath = path.join(PUBLIC_UPLOADS_PATH, fileName).replace(/\\/g, '/')

      try {
        const fileBuffer = await readFile(filePath) // Datei als Buffer lesen
        const stats = await stat(filePath)
        const dimensions = sizeOf(fileBuffer) // Buffer an sizeOf übergeben

        imagesToInsert.push({
          file_name: fileName,
          storage_path: storagePath,
          alt_text: fileName.split('.').slice(0, -1).join(' ').replace(/[-_]/g, ' '),
          title: fileName.split('.').slice(0, -1).join(' ').replace(/[-_]/g, ' '),
          is_active: false, // Standardmäßig inaktiv, damit der Admin sie prüfen kann
          display_order: nextOrder++,
          size_kb: Math.round(stats.size / 1024),
          width: dimensions.width,
          height: dimensions.height,
        })
      } catch (e) {
        console.error(`Konnte Metadaten für Datei ${fileName} nicht verarbeiten:`, e)
        // Diese Datei überspringen, aber mit den anderen weitermachen
      }
    }

    // 6. Neue Bilder in die Datenbank einfügen
    if (imagesToInsert.length > 0) {
        const { data: insertedData, error: insertError } = await supabaseAdmin
            .from('carousel_images_metadata')
            .insert(imagesToInsert)
            .select()

        if (insertError) {
            throw new Error(`Fehler beim Einfügen der neuen Bilder in die DB: ${insertError.message}`)
        }

        return NextResponse.json({
          success: true,
          message: `${imagesToInsert.length} neue Bilder erfolgreich synchronisiert.`,
          added: imagesToInsert.length,
          newImages: insertedData // Die neu eingefügten Bilder zurückgeben
        })
    }

    return NextResponse.json({ success: true, message: 'Keine gültigen neuen Bilder zum Einfügen gefunden.', added: 0 })

  } catch (error: unknown) {
    console.error('Sync API Fehler:', error)
    const message =
      error instanceof Error ? error.message : 'Interner Serverfehler.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
