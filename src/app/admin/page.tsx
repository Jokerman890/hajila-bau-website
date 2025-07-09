"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import { 
  Image as ImageIcon,
  Settings,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Users,
  Globe
} from 'lucide-react'

import { useState, useEffect, useCallback } from 'react' // Hinzugefügt
import { useAuth } from '@/components/AuthProvider' // Korrekter Pfad
import LoginForm from '@/components/LoginForm' // Korrekter Pfad
import LogoutButton from '@/components/LogoutButton' // Korrekter Pfad
import { supabase } from '@/lib/supabase/client' // Supabase Client importieren

// AdminDashboard und sein Interface importieren
import { CarouselDisplayImage } from '@/components/ui/admin-dashboard'


// Dynamically import the dashboard to avoid SSR issues
// Das CarouselImage Interface wird nicht mehr hier definiert, sondern aus admin-dashboard.tsx importiert

const DynamicAdminDashboard = dynamic(() => import('@/components/ui/admin-dashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading Hajila Bau Admin...</p>
      </div>
    </div>
  )
})

// Mock-Daten und useHajilaBauDashboard Hook entfernt


export default function HajilaBauAdminPage() {
  const auth = useAuth()
  const user = auth?.user ?? null
  const authLoading = auth?.loading ?? true
  const [images, setImages] = useState<CarouselDisplayImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Da RLS für SELECT auf carousel_images_metadata für 'anon' und 'authenticated' freigegeben ist,
      // können wir den normalen Supabase-Client verwenden.
      // Für eine sicherere Implementierung in der Zukunft könnte man eine dedizierte
      // serverseitige Funktion erstellen, die nur Admins aufrufen dürfen.
      if (!supabase) throw new Error('Supabase nicht konfiguriert')
      const { data, error: fetchError } = await supabase
        .from('carousel_images_metadata')
        .select('*')
        .order('order', { ascending: true })

      if (fetchError) throw fetchError
      setImages(data || [])
    } catch (e: unknown) {
      console.error('Fehler beim Laden der Bilder:', e)
      const message = e instanceof Error ? e.message : 'Fehler beim Laden der Bilder.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) { // Nur Bilder laden, wenn der Benutzer angemeldet ist
      fetchImages()
    }
  }, [user, fetchImages])

  const handleImageUpload = async (files: FileList) => {
    // Da wir mehrere Dateien gleichzeitig hochladen könnten, iterieren wir hier.
    // Die AdminDashboard Komponente ist aktuell so ausgelegt, dass sie mehrere Dateien auf einmal annimmt.
    // Die API-Route /api/admin/carousel/upload verarbeitet aktuell nur eine Datei pro Request (formData.get('file')).
    // Dies muss konsistent gemacht werden. Fürs Erste: Upload einzeln.

    setIsLoading(true) // Global loading state
    let uploadError: string | null = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // const meta = metadataArray[i]; // Metadaten für diese Datei

      const formData = new FormData()
      formData.append('file', file)
      // Die Metadaten (width, height, size_kb) werden jetzt in der API-Route selbst ermittelt oder könnten hier mitgesendet werden.
      // formData.append('width', meta.width?.toString() || '');
      // formData.append('height', meta.height?.toString() || '');
      // formData.append('size_kb', meta.size_kb.toString());
      // formData.append('alt_text', meta.name.split('.').slice(0, -1).join('.') || 'Neues Bild');
      // formData.append('title', meta.name.split('.').slice(0, -1).join('.') || 'Neues Bild');


      try {
        const response = await fetch('/api/admin/carousel/upload', {
          method: 'POST',
          body: formData,
          // Authentifizierungstoken mitsenden, falls die API-Route es erfordert/prüft
          // headers: { 'Authorization': `Bearer ${user?.token}` },
        })
        const result = await response.json()
        if (!response.ok || result.error) {
          throw new Error(result.error || `Fehler beim Upload von ${file.name}`)
        }
        // Erfolgreich: UI aktualisieren
        // setImages(prev => [...prev, result.image].sort((a,b) => a.order - b.order)) // Besser: fetchImages() neu aufrufen
      } catch (e: unknown) {
        console.error('Upload-Fehler für Datei:', file.name, e)
        const message = e instanceof Error ? e.message : 'Unbekannter Fehler'
        uploadError = message // Letzten Fehler speichern
        // Hier könnte man überlegen, ob man bei einem Fehler abbricht oder weitermacht
      }
    }
    await fetchImages() // Daten neu laden, um alle Änderungen zu sehen
    setIsLoading(false)
    if(uploadError) {
        alert(`Einige Uploads sind fehlgeschlagen: ${uploadError}`);
    }
  }

  const handleImageDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/carousel/delete?id=${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Fehler beim Löschen des Bildes')
      }
      // Erfolgreich: UI aktualisieren
      // setImages(prev => prev.filter(img => img.id !== id)) // Besser: fetchImages() neu aufrufen
      await fetchImages()
    } catch (e: unknown) {
      console.error('Lösch-Fehler:', e)
      const message = e instanceof Error ? e.message : 'Unbekannter Fehler'
      alert(message)
    }
    setIsLoading(false);
  }

  const handleImageUpdate = async (id: string, updates: Partial<CarouselDisplayImage>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/carousel/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      const result = await response.json()
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Fehler beim Aktualisieren des Bildes')
      }
      // Erfolgreich: UI aktualisieren
      // setImages(prev => prev.map(img => img.id === id ? result.image : img).sort((a,b) => a.order - b.order) ); // Besser: fetchImages()
      await fetchImages()
    } catch (e: unknown) {
      console.error('Update-Fehler:', e)
      const message = e instanceof Error ? e.message : 'Unbekannter Fehler'
      alert(message)
    }
    setIsLoading(false);
  }


  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Authentifizierung wird geladen...</div>
    </div>
  );
  if (!user) return <LoginForm />;

  // Die Stats-Sektion verwendet noch dashboard.images.length etc. Muss angepasst werden.
  // Fürs Erste, die Werte auf Basis des neuen `images` State setzen.
  const imageCount = images.length;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4"><LogoutButton /></div>
        {/* Header */}
        <div className="mb-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Hajila Bau GmbH - Admin Dashboard
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Verwalten Sie Ihre Website-Inhalte, Projektbilder und Unternehmensdarstellung
            </p>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Projekt Bilder</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {imageCount} {/* Angepasst */}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Aktive Projekte</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</p> {/* Mock-Wert, anpassen falls nötig */}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Team Mitglieder</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">8</p> {/* Mock-Wert, anpassen falls nötig */}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Jahre Erfahrung</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">8+</p> {/* Mock-Wert, anpassen falls nötig */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Projekt-Galerie Verwaltung
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Verwalten Sie die Bilder für Ihr Website-Karussell und Projektgalerie
              </p>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-400 text-sm font-medium">
                System Online
              </span>
            </div>
          </div>

          {/* Admin Dashboard Component */}
          <DynamicAdminDashboard
            images={images}
            isLoading={isLoading}
            hasError={!!error}
            onRetry={fetchImages}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            onImageUpdate={handleImageUpdate}
            maxImages={50} // Erhöhtes Limit
            allowedFormats={['image/jpeg', 'image/png', 'image/webp', 'image/jpg']}
            maxFileSize={5 * 1024 * 1024} // 5MB
          />
          {error && <p className="text-red-500 mt-4">Fehler: {error}</p>}
        </div>

        {/* Company Information Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Kontaktinformationen
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  +49 541 123456789
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  info@hajila-bau.de
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Osnabrück, Niedersachsen
                </span>
              </div>
            </div>
          </div>

          {/* Services Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Unsere Leistungen
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Klinkerarbeiten</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Verblendmauerwerk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Betonbau</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">WDVS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Hochbau</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Letzte Aktivitäten
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  Neues Projektbild "Klinkerarbeiten Projekt" hochgeladen
                </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      vor 2 Minuten
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      Karussell-Reihenfolge aktualisiert
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      vor 15 Minuten
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      Website-Inhalte überprüft und aktualisiert
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      vor 1 Stunde
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  Neues Projekt "WDVS Installation" hinzugefügt
                </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      vor 3 Stunden
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
<p>
  Hajila Bau GmbH Admin Dashboard • 
  Ihr Partner für Hochbau & Klinkerarbeiten in Osnabrück
</p>
            <p className="mt-1">
              Gegründet 2016 • Qualität und Präzision seit über 8 Jahren
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
