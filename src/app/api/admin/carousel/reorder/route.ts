import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin Client nicht initialisiert.' }, { status: 500 })
  }
  // Server-seitige Authentifizierung (nur eingeloggte Benutzer zulassen)
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const schema = z.object({ imageIds: z.array(z.string().uuid()).min(1) })
    const { imageIds } = schema.parse(body)

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json({ error: 'imageIds muss ein nicht-leeres Array sein.' }, { status: 400 })
    }

    // Prüfe, ob alle IDs existieren
    const { data: existing, error: existErr } = await supabaseAdmin
      .from('carousel_images_metadata')
      .select('id')
      .in('id', imageIds)
    if (existErr) {
      return NextResponse.json({ error: 'Validierung fehlgeschlagen: ' + existErr.message }, { status: 400 })
    }
    if (!existing || existing.length !== imageIds.length) {
      return NextResponse.json({ error: 'Einige IDs existieren nicht.' }, { status: 400 })
    }

    // Aktualisiere display_order global entsprechend ihrer Position
    const updates = imageIds.map((id, index) => ({ id, display_order: index + 1 }))

    // 1) Versuche atomare Transaktion via RPC (falls in DB vorhanden)
    const { data: rpcData, error: rpcError } = await supabaseAdmin
      .rpc('reorder_carousel', { _pairs: JSON.stringify(updates) })
    if (!rpcError && rpcData) {
      return NextResponse.json({ success: true, images: rpcData }, { status: 200 })
    }

    // Fallback: Mehrere Updates sequentiell/parallel (ohne RPC-Transaktion)
    const results = await Promise.all(
      updates.map((u) =>
        supabaseAdmin!
          .from('carousel_images_metadata')
          .update({ display_order: u.display_order })
          .eq('id', u.id)
          .select()
          .single(),
      ),
    )

    const firstError = results.find((r) => r.error)
    if (firstError) {
      return NextResponse.json({ error: 'Fehler beim Neuordnen: ' + firstError.error!.message }, { status: 500 })
    }

    const reordered = results.map((r) => r.data)
    return NextResponse.json({ success: true, images: reordered }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Interner Serverfehler beim Neuordnen.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}