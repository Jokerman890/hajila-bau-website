/**
 * Hilfsfunktionen für Supabase-Storage (Carousel-Bucket).
 */
import { supabase, supabaseAdmin } from './client' // beide Clients aus einer Datei
import { v4 as uuidv4 } from 'uuid'
import { imageSize } from 'image-size'
import { promisify } from 'util'
import { Readable } from 'stream'

const imageSizeFromStream = promisify(imageSize)

export const CAROUSEL_BUCKET_NAME = 'carousel-gallery'

/* ------------------------------------------------------------------ */
/* Typen                                                               */
/* ------------------------------------------------------------------ */
interface CarouselImageMetadata {
  alt?: string
  title?: string
  caption?: string
  is_active?: boolean
  target_url?: string
  [key: string]: any
}

interface UploadCarouselImageResult {
  data: {
    path: string // z. B. "xxxxxxxx-xxxx-xxxx.jpg"
    fullPath: string // identisch zu `path`, da kein Ordner
    publicUrl: string
    width: number
    height: number
    mimeType: string
    metadata: CarouselImageMetadata
  } | null
  error: Error | null
}

/* ------------------------------------------------------------------ */
/* Upload                                                              */
/* ------------------------------------------------------------------ */
export async function uploadCarouselImage(
  file: File,
  metadata: Partial<CarouselImageMetadata> = {}
): Promise<UploadCarouselImageResult> {
  if (!supabaseAdmin) {
    return {
      data: null,
      error: new Error('Supabase Admin Client nicht initialisiert.'),
    }
  }

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  const MAX_FILE_SIZE_MB = 5
  const MAX_WIDTH = 1920
  const MAX_HEIGHT = 1080

  /* Dateiendung und MIME-Typ prüfen */
  const fileExtension = file.name.split('.').pop()
  if (!fileExtension) {
    return { data: null, error: new Error('Ungültiger Dateiname.') }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      data: null,
      error: new Error(
        `Ungültiger Dateityp: ${file.type}. Erlaubt sind: ${ALLOWED_MIME_TYPES.join(', ')}.`,
      ),
    }
  }

  /* Dateigröße prüfen */
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      data: null,
      error: new Error(
        `Datei ist zu groß. Maximal erlaubt sind ${MAX_FILE_SIZE_MB} MB.`,
      ),
    }
  }

  /* Bildabmessungen prüfen und Metadaten erfassen */
  let width: number | undefined
  let height: number | undefined
  let mimeType: string | undefined

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const dimensions = imageSize(buffer)
    width = dimensions.width
    height = dimensions.height
    mimeType = dimensions.type ? `image/${dimensions.type}` : undefined

    if (width && height) {
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        return {
          data: null,
          error: new Error(
            `Bildabmessungen zu groß. Maximal erlaubt sind ${MAX_WIDTH}x${MAX_HEIGHT} Pixel.`,
          ),
        }
      }
    } else {
      return { data: null, error: new Error('Bildabmessungen konnten nicht ermittelt werden.') }
    }
  } catch (dimError: any) {
    return {
      data: null,
      error: new Error(`Fehler beim Ermitteln der Bildabmessungen: ${dimError.message}`),
    }
  }

  /* eindeutigen Dateinamen erzeugen */
  const uniqueFileName = `${uuidv4()}.${fileExtension}`

  /* Upload */
  const { data, error: uploadError } = await supabaseAdmin.storage
    .from(CAROUSEL_BUCKET_NAME)
    .upload(uniqueFileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: mimeType, // Setze den korrekten MIME-Typ
    })

  if (uploadError) {
    console.error('Supabase Storage Upload Fehler:', uploadError)
    // Rollback-Mechanismus: Wenn der Upload fehlschlägt, aber die Datei bereits existiert (z.B. durch Race Condition),
    // versuchen wir nicht, sie zu löschen, da der Fehler von Supabase kommt.
    // Ein "echter" Rollback wäre hier komplexer und würde eine Transaktion erfordern,
    // die Supabase Storage nicht direkt bietet.
    return { data: null, error: new Error(uploadError.message) }
  }
  if (!data?.path) {
    return {
      data: null,
      error: new Error('Upload erfolgreich, aber kein Pfad zurückgegeben.'),
    }
  }

  /* Öffentliche URL ermitteln (öffentlicher Client reicht) */
  if (!supabase) {
    return {
      data: null,
      error: new Error('Supabase Client nicht initialisiert.'),
    }
  }
  const { data: urlData } = supabase.storage
    .from(CAROUSEL_BUCKET_NAME)
    .getPublicUrl(data.path)

  // Default-Metadaten mit übergebenen Metadaten kombinieren
  const defaultMetadata: CarouselImageMetadata = {
    alt: '',
    title: file.name.replace(/\.[^/.]+$/, ''), // Dateiname ohne Endung als Standardtitel
    caption: '',
    is_active: true,
    target_url: '',
    ...metadata
  }

  try {
    // Speichere Metadaten in der Datenbank
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('carousel_images')
      .insert({
        storage_path: data.path,
        public_url: urlData.publicUrl,
        filename: file.name,
        mime_type: file.type,
        width: width || 0,
        height: height || 0,
        size: file.size,
        metadata: defaultMetadata,
        order_index: 0 // Wird später beim Reordering gesetzt
      })
      .select()
      .single()

    if (dbError) {
      // Lösche das hochgeladene Bild, wenn die Datenbankoperation fehlschlägt
      await supabaseAdmin.storage
        .from(CAROUSEL_BUCKET_NAME)
        .remove([data.path])

      return {
        data: null,
        error: new Error(`Datenbankfehler: ${dbError.message}`)
      }
    }

    return {
      data: {
        path: data.path,
        fullPath: data.path,
        publicUrl: urlData.publicUrl,
        width: width || 0,
        height: height || 0,
        mimeType: mimeType || file.type,
        metadata: defaultMetadata
      },
      error: null
    }
  } catch (error: any) {
    console.error('Fehler beim Einfügen der Bildmetadaten (catch):', error)
    // Rollback: Datei von Storage entfernen
    await supabaseAdmin?.storage
      .from(CAROUSEL_BUCKET_NAME)
      .remove([data.path])
    return {
      data: null,
      error: new Error(`Fehler beim Speichern der Bildmetadaten: ${error.message}`)
    }
  }
}

/* ------------------------------------------------------------------ */
/* Delete                                                              */
/* ------------------------------------------------------------------ */
export async function deleteCarouselImageByPath(
  storagePath: string,
): Promise<{ error: Error | null }> {
  if (!supabaseAdmin) {
    return { error: new Error('Supabase Admin Client nicht initialisiert.') }
  }
  if (!storagePath) {
    return { error: new Error('Kein Storage-Pfad angegeben.') }
  }

  const { error } = await supabaseAdmin.storage
    .from(CAROUSEL_BUCKET_NAME)
    .remove([storagePath])

  if (error) {
    console.error('Supabase Storage Delete Fehler:', error)
    return { error: new Error(error.message) }
  }
  return { error: null }
}

/* ------------------------------------------------------------------ */
/* Public URL-Helper                                                   */
/* ------------------------------------------------------------------ */
export function getPublicImageUrl(storagePath: string): string {
  if (!supabase) {
    console.error('Supabase Client nicht initialisiert (getPublicImageUrl).')
    return `/placeholder-image.jpg?error=supabase-not-init&path=${storagePath}`
  }
  const { data } = supabase.storage
    .from(CAROUSEL_BUCKET_NAME)
    .getPublicUrl(storagePath)

  return (
    data?.publicUrl ??
    `/placeholder-image.jpg?error=url-not-found&path=${storagePath}`
  )
}

/* ------------------------------------------------------------------ */
/* Metadaten – Platzhalter                                             */
/* ------------------------------------------------------------------ */
export async function getCarouselImageMetadata(
  storagePath: string,
): Promise<{ data: unknown; error: Error | null }> {
  void storagePath
  // Supabase v2 bietet keine direkte getProperties-API.
  // Metadaten sollten beim Upload in der DB gespeichert oder über `list` ermittelt werden.
  return {
    data: null,
    error: new Error(
      'getCarouselImageMetadata ist nicht implementiert; Metadaten beim Upload speichern.',
    ),
  }
}
