import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

export async function PUT(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin Client nicht initialisiert.' }, { status: 500 })
  }
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const baseSchema = z.object({
      id: z.string().uuid(),
      title: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      alt_text: z.string().optional(),
      display_order: z.number().int().optional(),
      order: z.number().int().optional(),
      is_active: z.boolean().optional(),
      size_kb: z.number().int().nullable().optional(),
      width: z.number().int().nullable().optional(),
      height: z.number().int().nullable().optional(),
      storage_path: z.string().nullable().optional(),
      file_name: z.string().nullable().optional(),
      public_url: z.string().optional(),
      uploaded_at: z.string().optional(),
    })
    const parsed = baseSchema.parse(payload)
    const { id, ...updates } = parsed as { id: string } & Partial<{
      title: string | null
      description: string | null
      alt_text: string
      display_order: number
      order?: number
      is_active: boolean
      size_kb: number | null
      width: number | null
      height: number | null
      storage_path?: string | null
      file_name?: string | null
      public_url?: string
      uploaded_at?: string
    }>

    if (!id) {
      return NextResponse.json({ error: 'Bild-ID fehlt.' }, { status: 400 })
    }

    // Nicht erlaubte Felder für direktes Update entfernen (z.B. generierte Felder oder PK)
    delete updates.public_url
    delete updates.uploaded_at
    // storage_path und file_name sollten normalerweise nicht über diesen Weg geändert werden.

    // Mapping: order -> display_order, falls vorhanden
    if (typeof updates.order === 'number') {
      updates.display_order = updates.order
      delete updates.order
    }

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

