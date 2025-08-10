import { NextRequest, NextResponse } from 'next/server'
import { firebaseAdminBucket, isFirebaseAdminConfigured } from '@/lib/firebase-admin'
import { supabaseAdmin } from '@/lib/supabase/client'
import { CAROUSEL_BUCKET_NAME } from '@/lib/supabase/carousel-storage'

export async function POST(request: NextRequest) {
  if (!isFirebaseAdminConfigured || !firebaseAdminBucket) {
    return NextResponse.json({ error: 'Firebase Admin nicht konfiguriert' }, { status: 500 })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin nicht konfiguriert' }, { status: 500 })
  }

  try {
    const { folder = 'photos/' } = (await request.json().catch(() => ({}))) as { folder?: string }

    const [files] = await firebaseAdminBucket.getFiles({ prefix: folder })
    const imageFiles = files.filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f.name))

    const imported: Array<{ id: string; file_name: string }> = []
    for (const file of imageFiles) {
      const [buffer] = await file.download()
      const fileName = file.name.split('/').pop() as string
      const uniqueName = `${Date.now()}-${fileName}`

      // In Supabase Storage hochladen
      const { data: up, error: upErr } = await supabaseAdmin.storage
        .from(CAROUSEL_BUCKET_NAME)
        .upload(uniqueName, buffer, { upsert: false, contentType: file.metadata?.contentType || undefined })

      if (upErr || !up?.path) {
        console.warn('Upload-Fehler für', file.name, upErr?.message)
        continue
      }

      // Metadaten in DB anlegen (display_order am Ende)
      const { data: maxOrderRows } = await supabaseAdmin
        .from('carousel_images_metadata')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)

      const nextOrder = (maxOrderRows?.[0]?.display_order ?? 0) + 1
      const { data: row, error: dbErr } = await supabaseAdmin
        .from('carousel_images_metadata')
        .insert({
          file_name: up.path,
          storage_path: up.path,
          alt_text: fileName.split('.').slice(0, -1).join('.') || 'Importiertes Bild',
          title: fileName.split('.').slice(0, -1).join('.') || 'Importiertes Bild',
          is_active: true,
          display_order: nextOrder,
        })
        .select()
        .single()

      if (dbErr || !row) {
        console.warn('DB-Fehler für', file.name, dbErr?.message)
        continue
      }

      imported.push({ id: row.id, file_name: row.file_name })
    }

    return NextResponse.json({ success: true, importedCount: imported.length, imported })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unbekannter Import-Fehler'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}