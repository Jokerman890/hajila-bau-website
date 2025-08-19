import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

interface UpdateMetadataRequest {
  imageId: string
  metadata: Record<string, unknown>
}

export async function PUT(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase Admin Client not initialized' },
      { status: 500 }
    )
  }

  try {
    const { imageId, metadata } = (await request.json()) as UpdateMetadataRequest

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    if (!metadata || typeof metadata !== 'object') {
      return NextResponse.json(
        { error: 'Valid metadata object is required' },
        { status: 400 }
      )
    }

    // Only allow specific metadata fields to be updated
    const allowedFields = ['alt', 'title', 'caption', 'is_active', 'target_url']
    const validUpdates: Record<string, unknown> = {}
    
    // Filter and validate metadata fields
    for (const [key, value] of Object.entries(metadata)) {
      if (allowedFields.includes(key)) {
        validUpdates[key] = value
      }
    }

    // Update the image metadata in the database
    const { data: updatedImage, error: updateError } = await supabaseAdmin
      .from('carousel_images')
      .update({
        metadata: supabaseAdmin.rpc('jsonb_merge_keep_existing', {
          source: 'metadata',
          updates: JSON.stringify(validUpdates)
        }),
        updated_at: new Date().toISOString()
      })
      .eq('id', imageId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating image metadata:', updateError)
      return NextResponse.json(
        { error: 'Failed to update image metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      image: updatedImage
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Error in metadata update endpoint:', error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
