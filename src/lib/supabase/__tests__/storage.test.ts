import { jest } from '@jest/globals'
import { 
  checkBucketExists, 
  createBucket, 
  setupRLSPolicies, 
  uploadUserPhoto, 
  getSignedUrl,
  deleteUserPhoto,
  listUserPhotos,
  initializeStorage
} from '../storage'

// Mock Supabase Admin Client
jest.mock('../client', () => ({
  supabaseAdmin: {
    storage: {
      getBucket: jest.fn(),
      createBucket: jest.fn(),
      from: jest.fn(() => ({
        upload: jest.fn(),
        createSignedUrl: jest.fn(),
        remove: jest.fn(),
        list: jest.fn()
      }))
    },
    rpc: jest.fn()
  },
  STORAGE_BUCKET: 'user-photos',
  MAX_FILE_SIZE: 6 * 1024 * 1024,
  SIGNED_URL_EXPIRES_IN: 3600,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
}))

describe('Supabase Photo Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkBucketExists', () => {
    test('sollte true zurückgeben wenn Bucket existiert', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockGetBucket = supabaseAdmin.storage.getBucket as jest.MockedFunction<any>
      
      mockGetBucket.mockResolvedValue({
        data: { name: 'user-photos', id: '123' },
        error: null
      })

      const result = await checkBucketExists()
      expect(result).toBe(true)
      expect(mockGetBucket).toHaveBeenCalledWith('user-photos')
    })

    test('sollte false zurückgeben wenn Bucket nicht existiert', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockGetBucket = supabaseAdmin.storage.getBucket as jest.MockedFunction<any>
      
      mockGetBucket.mockResolvedValue({
        data: null,
        error: { message: 'Bucket not found' }
      })

      const result = await checkBucketExists()
      expect(result).toBe(false)
    })
  })

  describe('createBucket', () => {
    test('sollte Bucket erfolgreich erstellen', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockCreateBucket = supabaseAdmin.storage.createBucket as jest.MockedFunction<any>
      
      mockCreateBucket.mockResolvedValue({
        data: { name: 'user-photos' },
        error: null
      })

      const result = await createBucket()
      expect(result.success).toBe(true)
      expect(mockCreateBucket).toHaveBeenCalledWith('user-photos', {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 6 * 1024 * 1024
      })
    })

    test('sollte Fehler bei Bucket-Erstellung behandeln', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockCreateBucket = supabaseAdmin.storage.createBucket as jest.MockedFunction<any>
      
      mockCreateBucket.mockResolvedValue({
        data: null,
        error: { message: 'Bucket creation failed' }
      })

      const result = await createBucket()
      expect(result.success).toBe(false)
      expect(result.error).toBe('Bucket creation failed')
    })
  })

  describe('setupRLSPolicies', () => {
    test('sollte RLS-Policies erfolgreich einrichten', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockRpc = supabaseAdmin.rpc as jest.MockedFunction<any>
      
      mockRpc.mockResolvedValue({ error: null })

      const result = await setupRLSPolicies()
      expect(result.success).toBe(true)
      expect(mockRpc).toHaveBeenCalledTimes(4) // 4 Policies
    })
  })

  describe('uploadUserPhoto', () => {
    test('sollte Foto erfolgreich hochladen', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockFrom = supabaseAdmin.storage.from as jest.MockedFunction<any>
      const mockUpload = jest.fn()
      const mockCreateSignedUrl = jest.fn()

      mockFrom.mockReturnValue({
        upload: mockUpload,
        createSignedUrl: mockCreateSignedUrl
      })

      mockUpload.mockResolvedValue({
        data: { id: 'file-123', path: 'user-123/1234567890.jpg' },
        error: null
      })

      mockCreateSignedUrl.mockResolvedValue({
        data: { signedUrl: 'https://example.com/signed-url' },
        error: null
      })

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 1024 })

      const result = await uploadUserPhoto({
        userId: 'user-123',
        file: mockFile
      })

      expect(result.success).toBe(true)
      expect(result.data?.path).toBe('user-123/1234567890.jpg')
      expect(result.data?.signedUrl).toBe('https://example.com/signed-url')
      expect(result.data?.metadata.userId).toBe('user-123')
    })

    test('sollte Fehler bei zu großer Datei zurückgeben', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 10 * 1024 * 1024 }) // 10MB

      const result = await uploadUserPhoto({
        userId: 'user-123',
        file: mockFile
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Datei zu groß')
    })

    test('sollte Fehler bei ungültigem Dateityp zurückgeben', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })

      const result = await uploadUserPhoto({
        userId: 'user-123',
        file: mockFile
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Dateityp text/plain nicht erlaubt')
    })

    test('sollte TUS-Upload für große Dateien verwenden', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockFrom = supabaseAdmin.storage.from as jest.MockedFunction<any>
      const mockUpload = jest.fn()

      mockFrom.mockReturnValue({
        upload: mockUpload,
        createSignedUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: 'https://example.com/signed-url' },
          error: null
        })
      })

      mockUpload.mockResolvedValue({
        data: { id: 'file-123', path: 'user-123/1234567890.jpg' },
        error: null
      })

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 7 * 1024 * 1024 }) // 7MB

      await uploadUserPhoto({
        userId: 'user-123',
        file: mockFile
      })

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/user-123\/\d+\.jpg/),
        mockFile,
        expect.objectContaining({
          duplex: 'half' // TUS-Upload Option
        })
      )
    })
  })

  describe('getSignedUrl', () => {
    test('sollte Signed URL erfolgreich generieren', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockFrom = supabaseAdmin.storage.from as jest.MockedFunction<any>
      const mockCreateSignedUrl = jest.fn()

      mockFrom.mockReturnValue({
        createSignedUrl: mockCreateSignedUrl
      })

      mockCreateSignedUrl.mockResolvedValue({
        data: { signedUrl: 'https://example.com/signed-url' },
        error: null
      })

      const result = await getSignedUrl('user-123/test.jpg')

      expect(result.success).toBe(true)
      expect(result.signedUrl).toBe('https://example.com/signed-url')
      expect(mockCreateSignedUrl).toHaveBeenCalledWith('user-123/test.jpg', 3600, {
        transform: undefined
      })
    })

    test('sollte Signed URL mit 60 Minuten Ablaufzeit generieren', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockFrom = supabaseAdmin.storage.from as jest.MockedFunction<any>
      const mockCreateSignedUrl = jest.fn()

      mockFrom.mockReturnValue({
        createSignedUrl: mockCreateSignedUrl
      })

      mockCreateSignedUrl.mockResolvedValue({
        data: { signedUrl: 'https://example.com/signed-url' },
        error: null
      })

      await getSignedUrl('user-123/test.jpg', { expiresIn: 3600 })

      expect(mockCreateSignedUrl).toHaveBeenCalledWith('user-123/test.jpg', 3600, {
        transform: undefined
      })
    })
  })

  describe('deleteUserPhoto', () => {
    test('sollte Foto erfolgreich löschen', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockFrom = supabaseAdmin.storage.from as jest.MockedFunction<any>
      const mockRemove = jest.fn()

      mockFrom.mockReturnValue({
        remove: mockRemove
      })

      mockRemove.mockResolvedValue({
        data: [{ name: 'user-123/test.jpg' }],
        error: null
      })

      const result = await deleteUserPhoto('user-123/test.jpg')

      expect(result.success).toBe(true)
      expect(result.deletedPaths).toEqual(['user-123/test.jpg'])
      expect(mockRemove).toHaveBeenCalledWith(['user-123/test.jpg'])
    })
  })

  describe('listUserPhotos', () => {
    test('sollte Benutzer-Fotos erfolgreich auflisten', async () => {
      const { supabaseAdmin } = await import('../client')
      const mockFrom = supabaseAdmin.storage.from as jest.MockedFunction<any>
      const mockList = jest.fn()

      mockFrom.mockReturnValue({
        list: mockList
      })

      mockList.mockResolvedValue({
        data: [
          {
            id: 'file-1',
            name: 'test1.jpg',
            metadata: { size: 1024, mimetype: 'image/jpeg' },
            created_at: '2023-01-01T00:00:00Z'
          },
          {
            id: 'file-2',
            name: 'test2.jpg',
            metadata: { size: 2048, mimetype: 'image/jpeg' },
            created_at: '2023-01-02T00:00:00Z'
          }
        ],
        error: null
      })

      const result = await listUserPhotos('user-123')

      expect(result.success).toBe(true)
      expect(result.photos).toHaveLength(2)
      expect(result.photos?.[0].filename).toBe('test1.jpg')
      expect(result.photos?.[0].userId).toBe('user-123')
      expect(mockList).toHaveBeenCalledWith('user-123')
    })
  })

  describe('initializeStorage', () => {
    test('sollte Storage erfolgreich initialisieren', async () => {
      const { supabaseAdmin } = await import('../client')
      
      // Mock für checkBucketExists (Bucket existiert nicht)
      const mockGetBucket = supabaseAdmin.storage.getBucket as jest.MockedFunction<any>
      mockGetBucket.mockResolvedValue({
        data: null,
        error: { message: 'Bucket not found' }
      })

      // Mock für createBucket
      const mockCreateBucket = supabaseAdmin.storage.createBucket as jest.MockedFunction<any>
      mockCreateBucket.mockResolvedValue({
        data: { name: 'user-photos' },
        error: null
      })

      // Mock für setupRLSPolicies
      const mockRpc = supabaseAdmin.rpc as jest.MockedFunction<any>
      mockRpc.mockResolvedValue({ error: null })

      const result = await initializeStorage()

      expect(result.success).toBe(true)
      expect(mockGetBucket).toHaveBeenCalled()
      expect(mockCreateBucket).toHaveBeenCalled()
      expect(mockRpc).toHaveBeenCalledTimes(4)
    })
  })
})

// E2E Test Suite
describe('Supabase Photo Storage E2E', () => {
  test('vollständiger Upload-Workflow', async () => {
    const { supabaseAdmin } = await import('../client')
    
    // Setup Mocks für kompletten Workflow
    const mockGetBucket = supabaseAdmin.storage.getBucket as jest.MockedFunction<any>
    const mockCreateBucket = supabaseAdmin.storage.createBucket as jest.MockedFunction<any>
    const mockRpc = supabaseAdmin.rpc as jest.MockedFunction<any>
    const mockFrom = supabaseAdmin.storage.from as jest.MockedFunction<any>
    const mockUpload = jest.fn()
    const mockCreateSignedUrl = jest.fn()

    // Bucket existiert nicht
    mockGetBucket.mockResolvedValue({
      data: null,
      error: { message: 'Bucket not found' }
    })

    // Bucket wird erstellt
    mockCreateBucket.mockResolvedValue({
      data: { name: 'user-photos' },
      error: null
    })

    // RLS Policies werden gesetzt
    mockRpc.mockResolvedValue({ error: null })

    // Upload funktioniert
    mockFrom.mockReturnValue({
      upload: mockUpload,
      createSignedUrl: mockCreateSignedUrl
    })

    mockUpload.mockResolvedValue({
      data: { id: 'file-123', path: 'user-123/1234567890.jpg' },
      error: null
    })

    mockCreateSignedUrl.mockResolvedValue({
      data: { signedUrl: 'https://example.com/signed-url' },
      error: null
    })

    // 1. Storage initialisieren
    const initResult = await initializeStorage()
    expect(initResult.success).toBe(true)

    // 2. Foto hochladen
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(mockFile, 'size', { value: 1024 })

    const uploadResult = await uploadUserPhoto({
      userId: 'user-123',
      file: mockFile
    })

    expect(uploadResult.success).toBe(true)
    expect(uploadResult.data?.signedUrl).toBe('https://example.com/signed-url')

    // 3. Signed URL generieren
    const signedUrlResult = await getSignedUrl(uploadResult.data!.path)
    expect(signedUrlResult.success).toBe(true)
    expect(signedUrlResult.signedUrl).toBe('https://example.com/signed-url')
  })
})
