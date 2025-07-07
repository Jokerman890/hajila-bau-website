import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function PUT(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin Client nicht initialisiert.' }, { status: 500 })
  }

  try {
    const payload = await request.json()
    const { id, ...updates } = payload

    if (!id) {
      return NextResponse.json({ error: 'Bild-ID fehlt.' }, { status: 400 })
    }

    // Nicht erlaubte Felder für direktes Update entfernen (z.B. generierte Felder oder PK)
    delete updates.public_url
    delete updates.uploaded_at
    // storage_path und file_name sollten normalerweise nicht über diesen Weg geändert werden.

    const { data, error } = await supabaseAdmin
      .from('carousel_images_metadata')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Fehler beim Aktualisieren der Bildmetadaten:', error)
      return NextResponse.json({ error: 'Fehler beim Aktualisieren der Metadaten: ' + error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Bild nicht gefunden oder Update fehlgeschlagen.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, image: data }, { status: 200 })
  } catch (error: unknown) {
    console.error('Update API Fehler:', error)
    const message = error instanceof Error ? error.message : 'Interner Serverfehler beim Update.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
