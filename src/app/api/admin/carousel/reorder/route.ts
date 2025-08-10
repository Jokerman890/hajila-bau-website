import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin Client nicht initialisiert.' }, { status: 500 })
  }

  try {
    const { imageIds } = (await request.json()) as { imageIds: string[] }

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json({ error: 'imageIds muss ein nicht-leeres Array sein.' }, { status: 400 })
    }

    // Aktualisiere display_order für jede ID entsprechend ihrer Position
    const updates = imageIds.map((id, index) => ({ id, display_order: index + 1 }))

    // Supabase unterstützt kein Bulk-Update mit unterschiedlichen Werten in einem Call.
    // Wir führen daher mehrere Updates parallel aus.
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