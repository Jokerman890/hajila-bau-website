import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { deleteFileLocally } from '@/lib/local-storage.server' // Korrigierter Import für Server-Datei

export async function DELETE(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin Client nicht initialisiert.' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Bild-ID fehlt.' }, { status: 400 })
    }

    // 1. Metadaten aus DB holen, um den storage_path zu bekommen
    const { data: imageMeta, error: fetchError } = await supabaseAdmin
      .from('carousel_images_metadata')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (fetchError || !imageMeta) {
      console.error('Fehler beim Abrufen der Bildmetadaten zum Löschen:', fetchError)
      return NextResponse.json({ error: 'Bild nicht gefunden oder Fehler beim Abrufen: ' + (fetchError?.message || '') }, { status: 404 })
    }

    // 2. Bild aus dem lokalen Dateisystem löschen
    if (imageMeta.storage_path) {
      const deleteStorageResult = await deleteFileLocally(imageMeta.storage_path)
      if (deleteStorageResult.error) {
        // Fehler beim lokalen Löschen ist nicht ideal, aber wir versuchen trotzdem, den DB-Eintrag zu löschen.
        console.warn('Fehler beim Löschen der lokalen Datei, fahre aber mit DB-Löschung fort:', deleteStorageResult.error.message)
      }
    } else {
        console.warn(`Kein storage_path für Bild-ID ${id} gefunden, Überspringe Löschung der Datei.`)
    }


    // 3. Eintrag aus der Datenbank löschen
    const { error: dbDeleteError } = await supabaseAdmin
      .from('carousel_images_metadata')
      .delete()
      .eq('id', id)

    if (dbDeleteError) {
      console.error('Fehler beim Löschen der Bildmetadaten aus DB:', dbDeleteError)
      return NextResponse.json({ error: 'Fehler beim Löschen der Metadaten aus der Datenbank: ' + dbDeleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Bild erfolgreich gelöscht.' }, { status: 200 })
  } catch (error: unknown) {
    console.error('Delete API Fehler:', error)
    const message = error instanceof Error ? error.message : 'Interner Serverfehler beim Löschen.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

