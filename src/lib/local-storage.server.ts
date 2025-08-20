/**
 * Hilfsfunktionen für die lokale Dateispeicherung (Bilder).
 * Ersatz für Supabase Storage für die lokale Entwicklung und Nutzung.
 */
import { writeFile, unlink, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'

// Basispfad für Uploads im `public` Verzeichnis
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'carousel')

// Stellt sicher, dass das Upload-Verzeichnis existiert
async function ensureUploadDirExists() {
  try {
    await mkdir(UPLOADS_DIR, { recursive: true })
  } catch (error) {
    console.error('Fehler beim Erstellen des Upload-Verzeichnisses:', error)
    throw new Error('Upload-Verzeichnis konnte nicht erstellt werden.')
  }
}

interface LocalUploadResult {
  data: {
    path: string // Relativer Pfad für die DB, z.B. /uploads/carousel/image.jpg
    fileName: string // Nur der Dateiname, z.B. image.jpg
  } | null
  error: Error | null
}

/**
 * Speichert eine Datei lokal im `public/uploads/carousel`-Verzeichnis.
 *
 * @param file Das hochgeladene File-Objekt.
 * @returns Ein Objekt mit dem relativen Pfad zur Datei oder einem Fehler.
 */
export async function saveFileLocally(
  file: File,
): Promise<LocalUploadResult> {
  await ensureUploadDirExists()

  const fileExtension = file.name.split('.').pop()
  if (!fileExtension) {
    return { data: null, error: new Error('Ungültiger Dateiname.') }
  }

  const uniqueFileName = `${uuidv4()}.${fileExtension}`
  const localPath = path.join(UPLOADS_DIR, uniqueFileName)
  const publicPath = `/uploads/carousel/${uniqueFileName}`

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(localPath, buffer)

    return {
      data: {
        path: publicPath,
        fileName: uniqueFileName,
      },
      error: null,
    }
  } catch (error) {
    console.error('Fehler beim lokalen Speichern der Datei:', error)
    return {
      data: null,
      error: new Error('Datei konnte nicht lokal gespeichert werden.'),
    }
  }
}

/**
 * Löscht eine Datei aus dem lokalen `public/uploads/carousel`-Verzeichnis.
 *
 * @param storagePath Der in der DB gespeicherte relative Pfad (z.B. /uploads/carousel/image.jpg).
 * @returns Ein Objekt, das einen Fehler enthält, falls das Löschen fehlschlägt.
 */
export async function deleteFileLocally(
  storagePath: string,
): Promise<{ error: Error | null }> {
  if (!storagePath) {
    return { error: new Error('Kein Dateipfad zum Löschen angegeben.') }
  }

  // Konvertiert den öffentlichen Pfad in einen lokalen Dateisystempfad
  const fileName = path.basename(storagePath)
  const localPath = path.join(UPLOADS_DIR, fileName)

  try {
    await unlink(localPath)
    return { error: null }
  } catch (error) {
    console.error(`Fehler beim lokalen Löschen der Datei ${localPath}:`, error)
    return { error: new Error(`Datei ${storagePath} konnte nicht gelöscht werden.`) }
  }
}
