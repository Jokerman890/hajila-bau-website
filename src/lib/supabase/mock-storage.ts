// Mock Storage für Demo-Zwecke
// Simuliert Supabase Storage ohne echte Backend-Verbindung

import { 
  StorageInitResult, 
  UploadResult, 
  SignedUrlResult, 
  DeleteResult, 
  ListResult,
  PhotoMetadata 
} from './types'

// In-Memory Storage für Demo
const mockStorage = new Map<string, PhotoMetadata>()

export async function checkBucketExists(): Promise<boolean> {
  console.log('Mock: Prüfe Bucket user-photos...')
  return true
}

export async function createBucket(): Promise<StorageInitResult> {
  console.log('Mock: Erstelle Bucket user-photos...')
  return { success: true }
}

export async function setupRLSPolicies(): Promise<StorageInitResult> {
  console.log('Mock: Richte RLS-Policies ein...')
  return { success: true }
}

export async function uploadUserPhoto(
  file: File,
  userId: string
): Promise<UploadResult> {
  console.log(`Mock: Lade Foto hoch für User ${userId}...`)
  
  // Validierung
  if (file.size > 6 * 1024 * 1024) {
    return {
      success: false,
      error: 'Datei zu groß (max. 6MB)'
    }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: `Dateityp ${file.type} nicht erlaubt`
    }
  }

  // Mock Upload
  const timestamp = Date.now()
  const extension = file.name.split('.').pop() || 'jpg'
  const _filePath = `${userId}/${timestamp}.${extension}`
  
  const metadata: PhotoMetadata = {
    id: `mock-${timestamp}`,
    userId,
    filename: file.name,
    originalName: file.name,
    path: _filePath,
    size: file.size,
    mimeType: file.type,
    uploadedAt: new Date()
  }

  // Speichere in Mock Storage
  mockStorage.set(_filePath, metadata)

  const signedUrl = `https://mock-storage.example.com/${_filePath}?signed=true`

  return {
    success: true,
    data: {
      path: _filePath,
      signedUrl,
      metadata
    }
  }
}

export async function getSignedUrl(
  path: string,
  options?: { expiresIn?: number }
): Promise<SignedUrlResult> {
  console.log(`Mock: Generiere Signed URL für ${path}...`)
  
  // Simuliere Fehler für explizit nicht existierende Dateien
  if (path.includes('non-existent')) {
    return {
      success: false,
      error: 'Datei nicht gefunden'
    }
  }

  const expiresIn = options?.expiresIn || 3600
  const signedUrl = `https://mock-signed-url.example.com/${path}?expires=${expiresIn}&token=mock-token-${Date.now()}`

  return {
    success: true,
    signedUrl
  }
}

export async function deleteUserPhoto(path: string): Promise<DeleteResult> {
  console.log(`Mock: Lösche Foto ${path}...`)
  
  if (!mockStorage.has(path)) {
    return {
      success: false,
      error: 'Datei nicht gefunden'
    }
  }

  mockStorage.delete(path)

  return {
    success: true,
    deletedPaths: [path]
  }
}

export async function listUserPhotos(userId: string): Promise<ListResult> {
  console.log(`Mock: Liste Fotos für User ${userId}...`)
  
  const userPhotos: PhotoMetadata[] = []
  
for (const [, metadata] of mockStorage.entries()) {
  if (metadata.userId === userId) {
    userPhotos.push(metadata)
  }
}

  // Sortiere nach Upload-Datum (neueste zuerst)
  userPhotos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  return {
    success: true,
    photos: userPhotos
  }
}

export async function initializeStorage(): Promise<StorageInitResult> {
  console.log('Mock: Initialisiere Storage...')
  
  // Simuliere Initialisierung
  const bucketExists = await checkBucketExists()
  
  if (!bucketExists) {
    const createResult = await createBucket()
    if (!createResult.success) {
      return createResult
    }
  }

  const rlsResult = await setupRLSPolicies()
  if (!rlsResult.success) {
    return rlsResult
  }

  console.log('Mock: Storage erfolgreich initialisiert!')
  return { success: true }
}

// Demo-Daten hinzufügen
function addMockData() {
  const demoPhotos: PhotoMetadata[] = [
    {
      id: 'demo-1',
      userId: 'demo-user-123',
      filename: 'demo-photo-1.jpg',
      originalName: 'demo-photo-1.jpg',
      path: 'demo-user-123/1704067200000.jpg',
      size: 1024 * 500, // 500KB
      mimeType: 'image/jpeg',
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Gestern
    },
    {
      id: 'demo-2',
      userId: 'demo-user-123',
      filename: 'demo-photo-2.png',
      originalName: 'demo-photo-2.png',
      path: 'demo-user-123/1704153600000.png',
      size: 1024 * 750, // 750KB
      mimeType: 'image/png',
      uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12h ago
    }
  ]

  demoPhotos.forEach(photo => {
    mockStorage.set(photo.path, photo)
  })

  console.log('Mock: Demo-Daten hinzugefügt!')
}

// Initialisiere mit Demo-Daten
addMockData()
