/**
 * Hilfsfunktionen für Supabase-Storage (Carousel-Bucket).
 */
import { supabase, supabaseAdmin } from './client' // beide Clients aus einer Datei
import { v4 as uuidv4 } from 'uuid'

export const CAROUSEL_BUCKET_NAME = 'carousel_gallery'

/* ------------------------------------------------------------------ */
/* Typen                                                               */
/* ------------------------------------------------------------------ */
interface UploadCarouselImageResult {
  data: {
    path: string // z. B. "xxxxxxxx-xxxx-xxxx.jpg"
    fullPath: string // identisch zu `path`, da kein Ordner
    publicUrl: string
  } | null
  error: Error | null
}

/* ------------------------------------------------------------------ */
/* Upload                                                              */
/* ------------------------------------------------------------------ */
export async function uploadCarouselImage(
  file: File,
): Promise<UploadCarouselImageResult> {
  if (!supabaseAdmin) {
    return {
      data: null,
      error: new Error('Supabase Admin Client nicht initialisiert.'),
    }
  }

  /* Dateiendung prüfen */
  const fileExtension = file.name.split('.').pop()
  if (!fileExtension) {
    return { data: null, error: new Error('Ungültiger Dateiname.') }
  }

  /* eindeutigen Dateinamen erzeugen */
  const uniqueFileName = `${uuidv4()}.${fileExtension}`

  /* Upload */
  const { data, error: uploadError } = await supabaseAdmin.storage
    .from(CAROUSEL_BUCKET_NAME)
    .upload(uniqueFileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Supabase Storage Upload Fehler:', uploadError)
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

  return {
    data: {
      path: data.path,
      fullPath: data.path,
      publicUrl: urlData.publicUrl,
    },
    error: null,
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
