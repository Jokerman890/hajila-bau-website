import { supabase } from './client' // Öffentlicher Client für getPublicUrl
import { supabaseAdmin } from './client' // Admin Client für Upload/Delete
import { v4 as uuidv4 } from 'uuid'

export const CAROUSEL_BUCKET_NAME = 'carousel_gallery'

interface UploadCarouselImageResult {
  data: {
    path: string // Der von Supabase zurückgegebene Pfad, z.B. "public/image-uuid.jpg"
    fullPath: string // Der vollständige Pfad in Supabase, den upload zurückgibt
    publicUrl: string
  } | null
  error: Error | null
}

/**
 * Lädt ein Bild in den Carousel-Storage-Bucket hoch.
 * Verwendet den Admin-Client für diese Operation.
 * @param file Die hochzuladende Datei.
 * @returns Ein Objekt mit dem Pfad der hochgeladenen Datei und der öffentlichen URL oder einem Fehler.
 */
export async function uploadCarouselImage(
  file: File
): Promise<UploadCarouselImageResult> {
  if (!supabaseAdmin) {
    return { data: null, error: new Error('Supabase Admin Client nicht initialisiert.') }
  }

  const fileExtension = file.name.split('.').pop()
  if (!fileExtension) {
    return { data: null, error: new Error('Ungültiger Dateiname ohne Erweiterung.') }
  }

  // Erzeugt einen eindeutigen Dateinamen, um Kollisionen zu vermeiden
  // Der Pfad im Bucket ist einfach der Dateiname, da es ein dedizierter Bucket ist.
  const uniqueFileName = `${uuidv4()}.${fileExtension}`

  const { data, error } = await supabaseAdmin.storage
    .from(CAROUSEL_BUCKET_NAME)
    .upload(uniqueFileName, file, {
      cacheControl: '3600', // Cache für 1 Stunde
      upsert: false, // Nicht überschreiben, falls der UUID-Name kollidieren sollte (extrem unwahrscheinlich)
    })

  if (error) {
    console.error('Supabase Storage Upload Fehler:', error)
    return { data: null, error: new Error(error.message) }
  }

  if (!data || !data.path) {
    return { data: null, error: new Error('Upload erfolgreich, aber kein Pfad zurückgegeben.') }
  }

  // Generiere die öffentliche URL für das hochgeladene Bild
  if (!supabase) {
    return { data: null, error: new Error('Supabase Client nicht initialisiert.') }
  }
  const publicUrlResult = supabase.storage
    .from(CAROUSEL_BUCKET_NAME)
    .getPublicUrl(data.path)


  return {
    data: {
      path: data.path, // z.B. "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg"
      fullPath: data.path, // In diesem Fall ist der von upload zurückgegebene `path` bereits der vollständige Pfad im Bucket.
      publicUrl: publicUrlResult.data.publicUrl,
    },
    error: null,
  }
}

/**
 * Löscht ein Bild aus dem Carousel-Storage-Bucket anhand seines Storage-Pfads.
 * Verwendet den Admin-Client für diese Operation.
 * @param storagePath Der Pfad der Datei im Storage Bucket (z.B. "image-uuid.jpg").
 * @returns Ein Objekt, das einen Fehler enthält, falls einer aufgetreten ist.
 */
export async function deleteCarouselImageByPath(
  storagePath: string
): Promise<{ error: Error | null }> {
  if (!supabaseAdmin) {
    return { error: new Error('Supabase Admin Client nicht initialisiert.') }
  }

  if (!storagePath) {
    return { error: new Error('Kein Storage-Pfad zum Löschen angegeben.')}
  }

  const { error } = await supabaseAdmin.storage
    .from(CAROUSEL_BUCKET_NAME)
    .remove([storagePath]) // `remove` erwartet ein Array von Pfaden

  if (error) {
    console.error('Supabase Storage Delete Fehler:', error)
    return { error: new Error(error.message) }
  }

  return { error: null }
}

/**
 * Ruft die öffentliche URL für ein Bild im Carousel-Storage-Bucket ab.
 * Verwendet den öffentlichen Client, da dies eine reine Leseoperation ist.
 * @param storagePath Der Pfad der Datei im Storage Bucket.
 * @returns Die öffentliche URL als String.
 */
export function getPublicImageUrl(storagePath: string): string {
   if (!supabase) {
    // Fallback oder Fehler, falls Supabase Client nicht verfügbar ist
    // Dies sollte im normalen Betrieb nicht passieren, wenn die Konfiguration korrekt ist.
    console.error('Supabase Client nicht initialisiert für getPublicImageUrl.')
    return `/placeholder-image.jpg?error=supabase-not-init&path=${storagePath}` // Fallback-URL
  }
  const { data } = supabase.storage
    .from(CAROUSEL_BUCKET_NAME)
    .getPublicUrl(storagePath)

  return data?.publicUrl || `/placeholder-image.jpg?error=url-not-found&path=${storagePath}` // Fallback
}

/**
 * Ruft Metadaten für ein Objekt im Storage ab.
 * Kann nützlich sein, um Größe, Mime-Typ etc. nach dem Upload zu verifizieren.
 * Verwendet den Admin-Client.
 */
export async function getCarouselImageMetadata(): Promise<{ data: unknown; error: Error | null }> {
  if (!supabaseAdmin) {
    return { data: null, error: new Error('Supabase Admin Client nicht initialisiert.') }
  }
  // In der aktuellen Supabase JS Version gibt es keine direkte Methode, um Metadaten
  // eines einzelnen Objekts abzurufen. Diese Funktion dient daher nur als Platzhalter
  // und gibt einen Fehler zurück. Metadaten sollten beim Upload in einer Datenbank
  // gespeichert oder über die `list` Methode ermittelt werden.
  return { data: null, error: new Error('getProperties ist nicht implementiert') }
}
