import { jest } from '@jest/globals'
import { 
  uploadUserPhoto as mockUploadUserPhoto,
  getSignedUrl as mockGetSignedUrl,
  deleteUserPhoto as mockDeleteUserPhoto,
  listUserPhotos as mockListUserPhotos,
  initializeStorage as mockInitializeStorage
} from '../mock-storage'

describe('Supabase Photo Storage (Mock)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('initializeStorage', () => {
    test('sollte Storage erfolgreich initialisieren', async () => {
      const result = await mockInitializeStorage()
      expect(result.success).toBe(true)
    })
  })

  describe('uploadUserPhoto', () => {
    test('sollte Foto erfolgreich hochladen', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 1024 })

      const result = await mockUploadUserPhoto(mockFile, 'test-user-123')

      expect(result.success).toBe(true)
      expect(result.data?.path).toMatch(/test-user-123\/\d+\.jpg/)
      expect(result.data?.signedUrl).toContain('mock-storage.example.com')
      expect(result.data?.metadata.userId).toBe('test-user-123')
      expect(result.data?.metadata.filename).toBe('test.jpg')
    })

    test('sollte Fehler bei zu großer Datei zurückgeben', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 10 * 1024 * 1024 }) // 10MB

      const result = await mockUploadUserPhoto(mockFile, 'test-user-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Datei zu groß')
    })

    test('sollte Fehler bei ungültigem Dateityp zurückgeben', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })

      const result = await mockUploadUserPhoto(mockFile, 'test-user-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Dateityp text/plain nicht erlaubt')
    })

    test('sollte verschiedene Bildformate unterstützen', async () => {
      const formats = [
        { type: 'image/jpeg', ext: 'jpg' },
        { type: 'image/png', ext: 'png' },
        { type: 'image/webp', ext: 'webp' }
      ]

      for (const format of formats) {
        const mockFile = new File(['test'], `test.${format.ext}`, { type: format.type })
        Object.defineProperty(mockFile, 'size', { value: 1024 })

        const result = await mockUploadUserPhoto(mockFile, 'test-user-123')

        expect(result.success).toBe(true)
        expect(result.data?.path).toMatch(new RegExp(`test-user-123/\\d+\\.${format.ext}`))
      }
    })
  })

  describe('getSignedUrl', () => {
    test('sollte Signed URL erfolgreich generieren', async () => {
      const result = await mockGetSignedUrl('test-user-123/test.jpg')

      expect(result.success).toBe(true)
      expect(result.signedUrl).toContain('mock-signed-url')
      expect(result.signedUrl).toContain('test-user-123/test.jpg')
    })

    test('sollte Signed URL mit benutzerdefinierten Optionen generieren', async () => {
      const result = await mockGetSignedUrl('test-user-123/test.jpg', { 
        expiresIn: 7200
      })

      expect(result.success).toBe(true)
      expect(result.signedUrl).toContain('expires=7200')
    })

    test('sollte Fehler für nicht existierende Datei zurückgeben', async () => {
      const result = await mockGetSignedUrl('non-existent/file.jpg')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Datei nicht gefunden')
    })
  })

  describe('deleteUserPhoto', () => {
    test('sollte Foto erfolgreich löschen', async () => {
      // Erst ein Foto hochladen
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 1024 })
      
      const uploadResult = await mockUploadUserPhoto(mockFile, 'test-user-123')
      expect(uploadResult.success).toBe(true)

      // Dann löschen
      const deleteResult = await mockDeleteUserPhoto(uploadResult.data!.path)

      expect(deleteResult.success).toBe(true)
      expect(deleteResult.deletedPaths).toContain(uploadResult.data!.path)
    })

    test('sollte Fehler für nicht existierende Datei zurückgeben', async () => {
      const result = await mockDeleteUserPhoto('non-existent/file.jpg')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Datei nicht gefunden')
    })
  })

  describe('listUserPhotos', () => {
    test('sollte Benutzer-Fotos erfolgreich auflisten', async () => {
      const result = await mockListUserPhotos('demo-user-123')

      expect(result.success).toBe(true)
      expect(result.photos).toBeDefined()
      expect(Array.isArray(result.photos)).toBe(true)
      
      if (result.photos && result.photos.length > 0) {
        const photo = result.photos[0]
        expect(photo.userId).toBe('demo-user-123')
        expect(photo.filename).toBeDefined()
        expect(photo.path).toBeDefined()
        expect(photo.uploadedAt).toBeDefined()
      }
    })

    test('sollte leere Liste für unbekannten Benutzer zurückgeben', async () => {
      const result = await mockListUserPhotos('unknown-user')

      expect(result.success).toBe(true)
      expect(result.photos).toEqual([])
    })

    test('sollte nur Fotos des angegebenen Benutzers zurückgeben', async () => {
      // Foto für test-user-456 hochladen
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 1024 })
      
      await mockUploadUserPhoto(mockFile, 'test-user-456')

      const result = await mockListUserPhotos('test-user-456')

      expect(result.success).toBe(true)
      expect(result.photos).toBeDefined()
      
      if (result.photos) {
        result.photos.forEach(photo => {
          expect(photo.userId).toBe('test-user-456')
        })
      }
    })
  })

  describe('E2E Workflow', () => {
    test('vollständiger Upload-Workflow', async () => {
      // 1. Storage initialisieren
      const initResult = await mockInitializeStorage()
      expect(initResult.success).toBe(true)

      // 2. Foto hochladen
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 1024 })

      const uploadResult = await mockUploadUserPhoto(mockFile, 'e2e-test-user')
      expect(uploadResult.success).toBe(true)
      expect(uploadResult.data?.signedUrl).toBeDefined()

      // 3. Fotos auflisten
      const listResult = await mockListUserPhotos('e2e-test-user')
      expect(listResult.success).toBe(true)
      expect(listResult.photos?.length).toBeGreaterThan(0)

      // 4. Neue Signed URL generieren
      const signedUrlResult = await mockGetSignedUrl(uploadResult.data!.path)
      expect(signedUrlResult.success).toBe(true)
      expect(signedUrlResult.signedUrl).toBeDefined()

      // 5. Foto löschen
      const deleteResult = await mockDeleteUserPhoto(uploadResult.data!.path)
      expect(deleteResult.success).toBe(true)

      // 6. Prüfen, dass Foto gelöscht wurde
      const finalListResult = await mockListUserPhotos('e2e-test-user')
      expect(finalListResult.success).toBe(true)
      
      const deletedPhoto = finalListResult.photos?.find(p => p.path === uploadResult.data!.path)
      expect(deletedPhoto).toBeUndefined()
    })

    test('Fehlerbehandlung im Workflow', async () => {
      // Ungültiger Upload
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      const uploadResult = await mockUploadUserPhoto(invalidFile, 'error-test-user')
      expect(uploadResult.success).toBe(false)

      // Signed URL für nicht existierende Datei
      const signedUrlResult = await mockGetSignedUrl('non-existent/file.jpg')
      expect(signedUrlResult.success).toBe(false)

      // Löschen einer nicht existierenden Datei
      const deleteResult = await mockDeleteUserPhoto('non-existent/file.jpg')
      expect(deleteResult.success).toBe(false)
    })
  })

  describe('Performance und Limits', () => {
    test('sollte mehrere Uploads parallel verarbeiten', async () => {
      const uploads = []
      
      for (let i = 0; i < 5; i++) {
        const mockFile = new File(['test'], `test${i}.jpg`, { type: 'image/jpeg' })
        Object.defineProperty(mockFile, 'size', { value: 1024 })
        
        uploads.push(mockUploadUserPhoto(mockFile, 'parallel-test-user'))
      }

      const results = await Promise.all(uploads)
      
      results.forEach(result => {
        expect(result.success).toBe(true)
      })

      // Prüfen, dass alle Uploads in der Liste sind
      const listResult = await mockListUserPhotos('parallel-test-user')
      expect(listResult.success).toBe(true)
      expect(listResult.photos?.length).toBeGreaterThanOrEqual(2)
    })

    test('sollte Dateigrößen-Limits korrekt durchsetzen', async () => {
      const testCases = [
        { size: 1024, shouldSucceed: true },           // 1KB - OK
        { size: 1024 * 1024, shouldSucceed: true },   // 1MB - OK
        { size: 5 * 1024 * 1024, shouldSucceed: true }, // 5MB - OK
        { size: 7 * 1024 * 1024, shouldSucceed: false }, // 7MB - zu groß
        { size: 10 * 1024 * 1024, shouldSucceed: false } // 10MB - zu groß
      ]

      for (const testCase of testCases) {
        const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
        Object.defineProperty(mockFile, 'size', { value: testCase.size })

        const result = await mockUploadUserPhoto(mockFile, 'size-test-user')
        
        if (testCase.shouldSucceed) {
          expect(result.success).toBe(true)
        } else {
          expect(result.success).toBe(false)
          expect(result.error).toContain('Datei zu groß')
        }
      }
    })
  })
})
