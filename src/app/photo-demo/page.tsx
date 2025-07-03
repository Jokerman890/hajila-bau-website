'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface UploadResult {
  success: boolean
  data?: {
    path: string
    signedUrl: string
    metadata: {
      userId: string
      filename: string
      size: number
      mimeType: string
      uploadedAt: string
    }
  }
  error?: string
}

interface Photo {
  path: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
  signedUrl?: string
}

export default function PhotoDemoPage() {
  const [userId, setUserId] = useState('demo-user-123')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      setMessage({ type: 'error', text: 'Bitte wähle eine Datei und gib eine User-ID ein' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('userId', userId)

      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData
      })

      const result: UploadResult = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: `Foto erfolgreich hochgeladen: ${result.data?.path}` })
        setSelectedFile(null)
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        // Refresh photo list
        await loadPhotos()
      } else {
        setMessage({ type: 'error', text: result.error || 'Upload fehlgeschlagen' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Netzwerkfehler beim Upload' })
    } finally {
      setUploading(false)
    }
  }

  const loadPhotos = async () => {
    if (!userId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/photos/${userId}`)
      const result = await response.json()

      if (result.success) {
        setPhotos(result.photos || [])
      } else {
        setMessage({ type: 'error', text: result.error || 'Fehler beim Laden der Fotos' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Netzwerkfehler beim Laden der Fotos' })
    } finally {
      setLoading(false)
    }
  }

  const deletePhoto = async (path: string) => {
    try {
      const response = await fetch('/api/photos/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Foto erfolgreich gelöscht' })
        await loadPhotos()
      } else {
        setMessage({ type: 'error', text: result.error || 'Löschen fehlgeschlagen' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Netzwerkfehler beim Löschen' })
    }
  }

  const getSignedUrl = async (path: string) => {
    try {
      const response = await fetch('/api/photos/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      })

      const result = await response.json()

      if (result.success) {
        return result.signedUrl
      } else {
        setMessage({ type: 'error', text: result.error || 'Fehler beim Generieren der Signed URL' })
        return null
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Netzwerkfehler bei Signed URL' })
      return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Supabase Photo Storage Demo</h1>
      
      {message && (
        <Alert className={`mb-4 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
          <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Foto hochladen</CardTitle>
            <CardDescription>
              Lade ein Foto in den Supabase Storage hoch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="z.B. user-123"
              />
            </div>
            
            <div>
              <Label htmlFor="file-input">Datei auswählen</Label>
              <Input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>

            {selectedFile && (
              <div className="text-sm text-gray-600">
                <p>Datei: {selectedFile.name}</p>
                <p>Größe: {formatFileSize(selectedFile.size)}</p>
                <p>Typ: {selectedFile.type}</p>
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Foto hochladen'}
            </Button>
          </CardContent>
        </Card>

        {/* Photo List Section */}
        <Card>
          <CardHeader>
            <CardTitle>Meine Fotos</CardTitle>
            <CardDescription>
              Alle hochgeladenen Fotos für User: {userId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={loadPhotos} 
              disabled={loading || !userId}
              className="w-full mb-4"
            >
              {loading ? 'Laden...' : 'Fotos laden'}
            </Button>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {photos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Keine Fotos gefunden</p>
              ) : (
                photos.map((photo, index) => (
                  <div key={index} className="border rounded p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{photo.filename}</p>
                        <p className="text-xs text-gray-500">{photo.path}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(photo.size)} • {photo.mimeType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(photo.uploadedAt).toLocaleString('de-DE')}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePhoto(photo.path)}
                      >
                        Löschen
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={async () => {
                        const signedUrl = await getSignedUrl(photo.path)
                        if (signedUrl) {
                          window.open(signedUrl, '_blank')
                        }
                      }}
                    >
                      Foto anzeigen
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Bucket:</strong> user-photos</p>
              <p><strong>Max. Dateigröße:</strong> 6 MB</p>
              <p><strong>Erlaubte Formate:</strong> JPEG, PNG, WebP, GIF</p>
            </div>
            <div>
              <p><strong>Pfad-Schema:</strong> {`{userId}/{timestamp}.{ext}`}</p>
              <p><strong>Signed URL Ablauf:</strong> 60 Minuten</p>
              <p><strong>TUS Upload:</strong> Für Dateien &gt; 6MB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
