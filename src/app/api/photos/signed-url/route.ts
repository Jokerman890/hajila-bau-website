import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrl } from '@/lib/supabase/storage'

export async function POST(request: NextRequest) {
  try {
    const { path, expiresIn } = await request.json()

    if (!path) {
      return NextResponse.json(
        { error: 'Dateipfad erforderlich' },
        { status: 400 }
      )
    }

    const result = await getSignedUrl(path, { expiresIn })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      signedUrl: result.signedUrl,
      expiresIn: expiresIn || 3600
    })

  } catch (error) {
    console.error('Signed URL API Fehler:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  }
}
