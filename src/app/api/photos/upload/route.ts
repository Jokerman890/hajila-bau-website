import { NextResponse } from 'next/server'
import { uploadUserPhoto as mockUploadUserPhoto, initializeStorage as mockInitializeStorage } from '@/lib/supabase/mock-storage'

export async function POST(request: Request) {
  try {
    // Initialisiere Storage (Bucket + RLS) falls noch nicht geschehen
    const initResult = await mockInitializeStorage()
    if (!initResult.success) {
      return NextResponse.json(
        { error: `Storage-Initialisierung fehlgeschlagen: ${initResult.error}` },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Keine Datei bereitgestellt' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Benutzer-ID erforderlich' },
        { status: 400 }
      )
    }

    // Upload durchführen
    const result = await mockUploadUserPhoto(file, userId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    console.error('Upload API Fehler:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  }
}
