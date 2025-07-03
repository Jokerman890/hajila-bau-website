import { 
  uploadUserPhoto,
  listUserPhotos,
  getSignedUrl,
  deleteUserPhoto,
  initializeStorage,
  checkBucketExists,
  createBucket,
  setupRLSPolicies,
  addMockData
} from '../mock-storage'

describe('Mock Storage Tests', () => {
  beforeEach(() => {
    // Reset Mock-Storage vor jedem Test
    jest.clearAllMocks()
  })

  describe('checkBucketExists', () => {
    it('sollte immer true zurückgeben', async () => {
      const result = await checkBucketExists()
      expect(result).toBe(true)
    })
  })

  describe('createBucket', () => {
    it('sollte erfolgreich sein', async () => {
      const result = await createBucket()
      expect(result.success).toBe(true)
    })
  })

  describe('setupRLSPolicies', () => {
    it('sollte erfolgreich sein', async () => {
      const result = await setupRLSPolicies()
      expect(result.success).toBe(true)
    })
  })

  describe('uploadUserPhoto', () => {
    it('sollte Foto erfolgreich hochladen', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { 
        type: 'image/jpeg' 
      })

      const result = await uploadUserPhoto(mockFile, 'test-user-123')

      expect(result.success).toBe(true)
      expect(result.data?.path).toMatch(/test-user-123\/\d+\.jpg/)
      expect(result.data?.signedUrl).toContain('mock-storage.example.com')
      expect(result.data?.metadata.userId).toBe('test-user-123')
      expect(result.data?.metadata.filename).toBe('test.jpg')
      expect(result.data?.metadata.mimeType).toBe('image/jpeg')
    })

    it('sollte Fehler bei zu großer Datei zurückgeben', async () => {
      const largeContent = 'x'.repeat(7 * 1024 * 1024) // 7MB
      const mockFile = new File([largeContent], 'large.jpg', { 
        type: 'image/jpeg' 
      })

      const result = await uploadUserPhoto(mockFile, 'test-user-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Datei zu groß (max. 6MB)')
    })

    it('sollte Fehler bei ungültigem Dateityp zurückgeben', async () => {
      const mockFile = new File(['test'], 'test.txt', { 
        type: 'text/plain' 
      })

      const result = await uploadUserPhoto(mockFile, 'test-user-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Ungültiger Dateityp')
    })
  })

  describe('listUserPhotos', () => {
    it('sollte Demo-Fotos für demo-user-123 zurückgeben', async () => {
      const result = await listUserPhotos('demo-user-123')

      expect(result.success).toBe(true)
      expect(result.photos).toHaveLength(2)
      expect(result.photos?.[0].userId).toBe('demo-user-123')
      expect(result.photos?.[1].userId).toBe('demo-user-123')
    })

    it('sollte leere Liste für unbekannten User zurückgeben', async () => {
      const result = await listUserPhotos('unknown-user')

      expect(result.success).toBe(true)
      expect(result.photos).toHaveLength(0)
    })

    it('sollte hochgeladene Fotos in der Liste anzeigen', async () => {
      // Erst ein Foto hochladen
      const mockFile = new File(['test'], 'new-photo.jpg', { 
        type: 'image/jpeg' 
      })
      await uploadUserPhoto(mockFile, 'test-user-456')

      // Dann die Liste abrufen
      const result = await listUserPhotos('test-user-456')

      expect(result.success).toBe(true)
      expect(result.photos?.length).toBeGreaterThan(0)
      expect(result.photos?.[0].filename).toBe('new-photo.jpg')
    })
  })

  describe('getSignedUrl', () => {
    it('sollte Signed URL für existierende Datei generieren', async () => {
      // Erst ein Foto hochladen
      const mockFile = new File(['test'], 'test.jpg', { 
        type: 'image/jpeg' 
      })
      const uploadResult = await uploadUserPhoto(mockFile, 'test-user-123')
      
      expect(uploadResult.success).toBe(true)
      const path = uploadResult.data!.path

      // Dann Signed URL generieren
      const result = await getSignedUrl(path)

      expect(result.success).toBe(true)
      expect(result.signedUrl).toContain('mock-storage.example.com')
      expect(result.signedUrl).toContain(path)
      expect(result.signedUrl).toContain('signed=true')
    })

    it('sollte Fehler für nicht existierende Datei zurückgeben', async () => {
      const result = await getSignedUrl('non-existent/file.jpg')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Datei nicht gefunden')
    })

    it('sollte benutzerdefinierte Ablaufzeit verwenden', async () => {
      // Erst ein Foto hochladen
      const mockFile = new File(['test'], 'test.jpg', { 
        type: 'image/jpeg' 
      })
      const uploadResult = await uploadUserPhoto(mockFile, 'test-user-123')
      const path = uploadResult.data!.path

      // Signed URL mit 2 Stunden Ablaufzeit
      const result = await getSignedUrl(path, { expiresIn: 7200 })

      expect(result.success).toBe(true)
      expect(result.signedUrl).toContain('expires=')
    })
  })

  describe('deleteUserPhoto', () => {
    it('sollte Foto erfolgreich löschen', async () => {
      // Erst ein Foto hochladen
      const mockFile = new File(['test'], 'to-delete.jpg', { 
        type: 'image/jpeg' 
      })
      const uploadResult = await uploadUserPhoto(mockFile, 'test-user-123')
      const path = uploadResult.data!.path

      // Dann löschen
      const deleteResult = await deleteUserPhoto(path)

      expect(deleteResult.success).toBe(true)
      expect(deleteResult.deletedPaths).toContain(path)

      // Prüfen, dass es nicht mehr in der Liste ist
      const listResult = await listUserPhotos('test-user-123')
      const remainingPhotos = listResult.photos?.filter(p => p.path === path)
      expect(remainingPhotos).toHaveLength(0)
    })

    it('sollte Fehler für nicht existierende Datei zurückgeben', async () => {
      const result = await deleteUserPhoto('non-existent/file.jpg')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Datei nicht gefunden')
    })
  })

  describe('initializeStorage', () => {
    it('sollte Storage erfolgreich initialisieren', async () => {
      const result = await initializeStorage()

      expect(result.success).toBe(true)
    })
  })

  describe('E2E Workflow', () => {
    it('vollständiger Upload-Workflow', async () => {
      const userId = 'e2e-test-user'
      
      // 1. Storage initialisieren
      const initResult = await initializeStorage()
      expect(initResult.success).toBe(true)

      // 2. Foto hochladen
      const mockFile = new File(['test content'], 'e2e-test.jpg', { 
        type: 'image/jpeg' 
      })
      const uploadResult = await uploadUserPhoto(mockFile, userId)
      expect(uploadResult.success).toBe(true)
      
      const path = uploadResult.data!.path
      const signedUrl = uploadResult.data!.signedUrl

      // 3. Signed URL sollte generiert worden sein
      expect(signedUrl).toBeTruthy()
      expect(signedUrl).toContain('mock-storage.example.com')

      // 4. Foto in Liste finden
      const listResult = await listUserPhotos(userId)
      expect(listResult.success).toBe(true)
      expect(listResult.photos?.some(p => p.path === path)).toBe(true)

      // 5. Neue Signed URL generieren
      const newSignedUrlResult = await getSignedUrl(path, { expiresIn: 1800 })
      expect(newSignedUrlResult.success).toBe(true)

      // 6. Foto löschen
      const deleteResult = await deleteUserPhoto(path)
      expect(deleteResult.success).toBe(true)

      // 7. Prüfen, dass Foto nicht mehr in Liste ist
      const finalListResult = await listUserPhotos(userId)
      expect(finalListResult.photos?.some(p => p.path === path)).toBe(false)
    })
  })
})
