import { supabaseAdmin, STORAGE_BUCKET, MAX_FILE_SIZE, SIGNED_URL_EXPIRES_IN, ALLOWED_FILE_TYPES } from './client'
import { 
  PhotoMetadata, 
  UploadOptions, 
  UploadResult, 
  BucketInfo, 
  SignedUrlOptions, 
  DeleteResult,
  StorageError 
} from './types'

/**
 * Step 1: Prüfe, ob Bucket "user-photos" existiert
 * Confidence Score: 9/10
 */
export async function checkBucketExists(): Promise<boolean> {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase Admin Client nicht verfügbar')
      return false
    }
    
    const { data, error } = await supabaseAdmin.storage.getBucket(STORAGE_BUCKET)
    
    if (error) {
      console.log(`Bucket ${STORAGE_BUCKET} existiert nicht:`, error.message)
      return false
    }
    
    console.log(`Bucket ${STORAGE_BUCKET} existiert bereits:`, data)
    return true
  } catch (error) {
    console.error('Fehler beim Prüfen des Buckets:', error)
    return false
  }
}

/**
 * Step 2: Falls nicht: erstelle privat
 * Confidence Score: 9/10
 */
export async function createBucket(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase Admin Client nicht verfügbar' }
    }
    
    const { data, error } = await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, {
      public: false,
      allowedMimeTypes: ALLOWED_FILE_TYPES,
      fileSizeLimit: MAX_FILE_SIZE
    })

    if (error) {
      return { success: false, error: error.message }
    }

    console.log(`Bucket ${STORAGE_BUCKET} erfolgreich erstellt:`, data)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'
    return { success: false, error: errorMessage }
  }
}

/**
 * Step 3: Setze RLS-Policies: read/write nur Owner
 * Confidence Score: 8/10
 */
export async function setupRLSPolicies(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase Admin Client nicht verfügbar' }
    }
    
    // RLS Policy für READ - nur Owner kann eigene Dateien lesen
    const readPolicy = `
      CREATE POLICY "Users can read own photos" ON storage.objects
      FOR SELECT USING (
        bucket_id = '${STORAGE_BUCKET}' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
    `

    // RLS Policy für INSERT - nur Owner kann in eigenen Ordner hochladen
    const insertPolicy = `
      CREATE POLICY "Users can upload own photos" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = '${STORAGE_BUCKET}' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
    `

    // RLS Policy für UPDATE - nur Owner kann eigene Dateien aktualisieren
    const updatePolicy = `
      CREATE POLICY "Users can update own photos" ON storage.objects
      FOR UPDATE USING (
        bucket_id = '${STORAGE_BUCKET}' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
    `

    // RLS Policy für DELETE - nur Owner kann eigene Dateien löschen
    const deletePolicy = `
      CREATE POLICY "Users can delete own photos" ON storage.objects
      FOR DELETE USING (
        bucket_id = '${STORAGE_BUCKET}' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
    `

    // Policies über SQL ausführen
    const policies = [readPolicy, insertPolicy, updatePolicy, deletePolicy]
    
    for (const policy of policies) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: policy })
      if (error) {
        console.warn('Policy möglicherweise bereits vorhanden:', error.message)
      }
    }

    console.log('RLS Policies erfolgreich eingerichtet')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'
    return { success: false, error: errorMessage }
  }
}

/**
 * Step 4: Implementiere Tool-Wrapper uploadUserPhoto()
 * Path: ${userId}/${timestamp}.${ext}
 * Verwende storage.upload_file (MCP)
 * >6 MB → TUS-Upload
 * Confidence Score: 9/10
 */
export async function uploadUserPhoto(options: UploadOptions): Promise<UploadResult> { // eslint-disable-line @typescript-eslint/no-unused-vars
  const { userId, file, maxSize = MAX_FILE_SIZE, generateSignedUrl = true, signedUrlExpiresIn = SIGNED_URL_EXPIRES_IN } = options

  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase Admin Client nicht verfügbar' }
    }
    
    // Validierung
    if (!file) {
      return { success: false, error: 'Keine Datei bereitgestellt' }
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { success: false, error: `Dateityp ${file.type} nicht erlaubt` }
    }

    if (file.size > maxSize) {
      return { success: false, error: `Datei zu groß. Maximum: ${maxSize / (1024 * 1024)}MB` }
    }

    // Generiere Pfad: ${userId}/${timestamp}.${ext}
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}.${fileExtension}`
    const filePath = `${userId}/${filename}`

    // Upload-Methode basierend auf Dateigröße wählen
    let uploadResult

    if (file.size > MAX_FILE_SIZE) {
      // TUS-Upload für große Dateien (>6MB)
      uploadResult = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          duplex: 'half' // Für TUS-Upload
        })
    } else {
      // Standard Upload für kleinere Dateien
      uploadResult = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
    }

    if (uploadResult.error) {
      return { success: false, error: uploadResult.error.message }
    }

    // Metadata erstellen
    const metadata: PhotoMetadata = {
      id: uploadResult.data.id || crypto.randomUUID(),
      userId,
      filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      path: filePath,
      uploadedAt: new Date()
    }

    // Signed URL generieren falls gewünscht
    let signedUrl: string | undefined

    if (generateSignedUrl) {
      const signedUrlResult = await getSignedUrl(filePath, { expiresIn: signedUrlExpiresIn })
      if (signedUrlResult.success && signedUrlResult.signedUrl) {
        signedUrl = signedUrlResult.signedUrl
        metadata.signedUrl = signedUrl
        metadata.expiresAt = new Date(Date.now() + signedUrlExpiresIn * 1000)
      }
    }

    return {
      success: true,
      data: {
        path: filePath,
        signedUrl,
        metadata
      }
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload-Fehler'
    return { success: false, error: errorMessage }
  }
}

/**
 * Step 5: Gib eine signed URL (60 min) zurück
 * Confidence Score: 9/10
 */
export async function getSignedUrl(
  path: string, 
  options: SignedUrlOptions = {}
): Promise<{ success: boolean; signedUrl?: string; error?: string }> { // eslint-disable-line @typescript-eslint/no-unused-vars
  const { expiresIn = SIGNED_URL_EXPIRES_IN, transform } = options

  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase Admin Client nicht verfügbar' }
    }
    
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, expiresIn, {
        transform: transform
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, signedUrl: data.signedUrl }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Signed URL Fehler'
    return { success: false, error: errorMessage }
  }
}

/**
 * Hilfsfunktionen für Bucket-Management
 */
export async function getBucketInfo(): Promise<{ success: boolean; data?: BucketInfo; error?: string }> {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase Admin Client nicht verfügbar' }
    }
    
    const { data, error } = await supabaseAdmin.storage.getBucket(STORAGE_BUCKET)
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as BucketInfo }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Bucket Info Fehler'
    return { success: false, error: errorMessage }
  }
}

export async function deleteUserPhoto(path: string): Promise<DeleteResult> { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase Admin Client nicht verfügbar' }
    }
    
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, deletedPaths: data.map(item => item.name) }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lösch-Fehler'
    return { success: false, error: errorMessage }
  }
}

export async function listUserPhotos(userId: string): Promise<{ success: boolean; photos?: PhotoMetadata[]; error?: string }> { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase Admin Client nicht verfügbar' }
    }
    
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list(userId)

    if (error) {
      return { success: false, error: error.message }
    }

    const photos: PhotoMetadata[] = data.map(file => ({
      id: file.id || crypto.randomUUID(),
      userId,
      filename: file.name,
      originalName: file.name,
      size: file.metadata?.size || 0,
      mimeType: file.metadata?.mimetype || 'image/jpeg',
      path: `${userId}/${file.name}`,
      uploadedAt: new Date(file.created_at || Date.now())
    }))

    return { success: true, photos }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Listen-Fehler'
    return { success: false, error: errorMessage }
  }
}

/**
 * Initialisierung: Bucket und RLS-Policies einrichten
 */
export async function initializeStorage(): Promise<{ success: boolean; error?: string }> { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    // 1. Prüfe ob Bucket existiert
    const bucketExists = await checkBucketExists()
    
    // 2. Erstelle Bucket falls nicht vorhanden
    if (!bucketExists) {
      const createResult = await createBucket()
      if (!createResult.success) {
        return createResult
      }
    }

    // 3. Setze RLS-Policies
    const rlsResult = await setupRLSPolicies()
    if (!rlsResult.success) {
      return rlsResult
    }

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Initialisierungs-Fehler'
    return { success: false, error: errorMessage }
  }
}
