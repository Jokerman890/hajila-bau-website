import { NextRequest, NextResponse } from 'next/server'
import { listUserPhotos as mockListUserPhotos } from '@/lib/supabase/mock-storage'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'Benutzer-ID erforderlich' },
        { status: 400 }
      )
    }

    // Verwende Mock-Storage für Demo
    const result = await mockListUserPhotos(userId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      photos: result.photos || []
    })

  } catch (error) {
    console.error('List Photos API Fehler:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  }
}
