import { NextResponse } from 'next/server'
import { listUserPhotos } from '@/lib/supabase/storage'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [{ userId: 'demo-user' }];
}

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

    const result = await listUserPhotos(userId)

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
