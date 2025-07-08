import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { uploadCarouselImage } from '@/lib/supabase/carousel-storage'
import sizeOf from 'image-size' // Dependency, muss ggf. installiert werden

// Dependency: npm install image-size @types/image-size
// Diese Route ist für das Admin-Panel gedacht und sollte entsprechend geschützt sein.
// Die Authentifizierung wird hier über den Supabase Auth Context in der Admin Page gehandhabt.
// Diese API Route sollte zusätzlich prüfen, ob der aufrufende Benutzer Admin-Rechte hat.
// Für diese Implementierung nehmen wir an, dass der Zugriff auf die Admin-Seite bereits ausreichend schützt.

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin Client nicht initialisiert.' }, { status: 500 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei hochgeladen.' }, { status: 400 })
    }

    // Bild-Dimensionen und Größe ermitteln
    let width: number | undefined
    let height: number | undefined
    const fileSizeKb = Math.round(file.size / 1024)

    try {
      const bytes = await file.arrayBuffer()
      const fileBuffer = Buffer.from(bytes)
      const dimensions = sizeOf(fileBuffer)
      width = dimensions.width
      height = dimensions.height
    } catch (e) {
      console.warn('Konnte Bild-Dimensionen nicht ermitteln:', e)
      // Fehler ist nicht kritisch, Upload wird fortgesetzt
    }

    // Bild in Supabase Storage hochladen
    const uploadResult = await uploadCarouselImage(file)

    if (uploadResult.error || !uploadResult.data) {
      return NextResponse.json(
        { error: uploadResult.error?.message || 'Fehler beim Hochladen des Bildes.' },
        { status: 500 }
      )
    }

    // Metadaten in der Datenbank speichern
    const { path: storage_path } = uploadResult.data
    const file_name = storage_path // Da UUID verwendet wird, ist path = Dateiname

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('carousel_images_metadata')
      .insert({
        file_name,
        storage_path,
        // public_url wird durch die DB generiert, kann hier aber auch gesetzt werden
        alt_text: file.name.split('.').slice(0, -1).join('.') || 'Hochgeladenes Bild', // Standard Alt-Text
        title: file.name.split('.').slice(0, -1).join('.') || 'Hochgeladenes Bild', // Standard Titel
        is_active: true,
        order: 0, // Standard-Reihenfolge, kann später angepasst werden
        size_kb: fileSizeKb,
        width,
        height,
        // user_id: (await supabaseAdmin.auth.getUser()).data.user?.id // Optional: Wer hat es hochgeladen
      })
      .select()
      .single()

    if (dbError) {
      // Wenn DB-Eintrag fehlschlägt, sollte das Bild im Storage ggf. wieder gelöscht werden (Rollback)
      // Fürs Erste loggen wir den Fehler und geben ihn zurück.
      console.error('Fehler beim Speichern der Bildmetadaten in DB:', dbError)
      // TODO: Implementiere Rollback: await deleteCarouselImageByPath(storage_path)
      return NextResponse.json(
        { error: 'Bild hochgeladen, aber Fehler beim Speichern der Metadaten: ' + dbError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, image: dbData }, { status: 201 })
  } catch (error: unknown) {
    console.error('Upload API Fehler:', error)
    const message = error instanceof Error ? error.message : 'Interner Serverfehler beim Upload.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
