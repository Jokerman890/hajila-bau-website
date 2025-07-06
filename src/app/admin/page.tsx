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

// Dynamically import the dashboard to avoid SSR issues
interface CarouselImage {
  id: string
  url: string
  title: string
  description?: string
  alt: string
  order: number
  isActive: boolean
  uploadedAt: Date
  size: number
  dimensions: {
    width: number
    height: number
  }
}

const AdminDashboard = dynamic(() => import('@/components/ui/admin-dashboard'), {
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

import { useAdminImages } from '@/hooks/useAdminImages';

import { useAuth } from '@/components/AuthProvider';
import LoginForm from '@/components/LoginForm';
import LogoutButton from '@/components/LogoutButton';
import { APP_VERSION, APP_BUILD_DATE } from '@/version';

export default function HajilaBauAdminPage() {
  const { user, loading } = useAuth() ?? { user: null, loading: false };
  const dashboard = useAdminImages();

  if (loading) return <div>Lade...</div>;
  if (!user) return <LoginForm />;

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
                  {dashboard.images.length}
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
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</p>
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
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">8</p>
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
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">8+</p>
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
<AdminDashboard
  images={dashboard.images}
  isLoading={dashboard.isLoading}
  hasError={!!dashboard.error}
  onRetry={dashboard.retry}
  onImageUpload={dashboard.uploadImages}
  onImageDelete={dashboard.deleteImage}
  onImageUpdate={dashboard.updateImage}
  maxImages={20}
  allowedFormats={['image/jpeg', 'image/png', 'image/webp']}
  maxFileSize={5 * 1024 * 1024}
/>
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
<p className="mt-2 text-xs text-slate-400 dark:text-slate-600">
  Version {APP_VERSION} • Build {APP_BUILD_DATE}
</p>
          </div>
        </div>
      </div>
    </div>
  )
}
