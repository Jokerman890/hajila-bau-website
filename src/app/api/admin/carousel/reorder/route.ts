import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

interface ReorderRequest {
  imageIds: string[]
  metadata?: Record<string, any>
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase Admin Client nicht initialisiert.' }, 
      { status: 500 }
    )
  }

  try {
    const { imageIds, metadata } = (await request.json()) as ReorderRequest

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: 'imageIds muss ein nicht-leeres Array sein.' }, 
        { status: 400 }
      )
    }

    // Starte eine Transaktion für atomare Updates
    const { data: updatedImages, error: updateError } = await supabaseAdmin.rpc(
      'reorder_carousel_images',
      {
        image_ids: imageIds,
        metadata_updates: metadata || {}
      }
    )

    if (updateError) {
      console.error('Fehler beim Neuordnen der Bilder:', updateError)
      return NextResponse.json(
        { error: 'Fehler beim Neuordnen: ' + updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        images: updatedImages,
        message: 'Bilder erfolgreich neu geordnet.'
      }, 
      { status: 200 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Interner Serverfehler beim Neuordnen.'
    console.error('Fehler in der Reorder-API:', error)
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    )
  }
}