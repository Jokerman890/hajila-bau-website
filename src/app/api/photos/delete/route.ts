import { NextResponse } from 'next/server'
import { deleteUserPhoto } from '@/lib/supabase/storage'

export async function DELETE(request: Request) {
  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json(
        { error: 'Dateipfad erforderlich' },
        { status: 400 }
      )
    }

    const result = await deleteUserPhoto(path)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      deletedPaths: result.deletedPaths
    })

  } catch (error) {
    console.error('Delete Photo API Fehler:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  }
}
