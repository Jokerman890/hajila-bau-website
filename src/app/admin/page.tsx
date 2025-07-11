"use client"

import React, { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import {
  Image as ImageIcon,
  Settings,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Users,
  Globe,
} from "lucide-react"

import { useAuth } from "@/components/AuthProvider"
import LoginForm from "@/components/LoginForm"
import LogoutButton from "@/components/LogoutButton"
import { supabase } from "@/lib/supabase/client"

// **Nur Typ-Import – kein Laufzeit-Bundle nötig**
import type { CarouselDisplayImage } from "@/components/ui/admin-dashboard"

// Dashboard wird client-seitig dynamisch nachgeladen (kein SSR)
const DynamicAdminDashboard = dynamic(
  () => import("@/components/ui/admin-dashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading Hajila Bau Admin…
          </p>
        </div>
      </div>
    ),
  },
)

export default function HajilaBauAdminPage() {
  /* ------------------------------------------------------------------ */
  /* Auth / State */
  const auth = useAuth()
  const user = auth?.user ?? null
  const authLoading = auth?.loading ?? true

  const [images, setImages] = useState<CarouselDisplayImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ------------------------------------------------------------------ */
  /* Helpers */
  const fetchImages = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!supabase) throw new Error("Supabase nicht konfiguriert")

      const { data, error: fetchError } = await supabase
        .from("carousel_images_metadata")
        .select("*")
        .order("order", { ascending: true })

      if (fetchError) throw fetchError
      setImages(data ?? [])
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Fehler beim Laden der Bilder."
      console.error(message)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /* ------------------------------------------------------------------ */
  /* Effects */
  useEffect(() => {
    if (user) fetchImages()
  }, [user, fetchImages])

  /* ------------------------------------------------------------------ */
  /* CRUD Callbacks */
  const handleImageUpload = async (files: FileList) => {
    setIsLoading(true)
    let uploadError: string | null = null

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/admin/carousel/upload", {
          method: "POST",
          body: formData,
        })
        const result = await res.json()
        if (!res.ok || result.error)
          throw new Error(result.error ?? `Upload-Fehler: ${file.name}`)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unbekannter Fehler"
        console.error("Upload-Fehler:", file.name, msg)
        uploadError = msg
      }
    }

    await fetchImages()
    setIsLoading(false)
    if (uploadError) alert(`Einige Uploads fehlgeschlagen: ${uploadError}`)
  }

  const handleImageDelete = async (id: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/carousel/delete?id=${id}`, {
        method: "DELETE",
      })
      const result = await res.json()
      if (!res.ok || result.error) throw new Error(result.error)
      await fetchImages()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unbekannter Fehler"
      console.error("Lösch-Fehler:", msg)
      alert(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpdate = async (
    id: string,
    updates: Partial<CarouselDisplayImage>,
  ) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/carousel/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      const result = await res.json()
      if (!res.ok || result.error) throw new Error(result.error)
      await fetchImages()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unbekannter Fehler"
      console.error("Update-Fehler:", msg)
      alert(msg)
    } finally {
      setIsLoading(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render Guards */
  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Authentifizierung wird geladen…</div>
      </div>
    )
  if (!user) return <LoginForm />

  /* ------------------------------------------------------------------ */
  /* UI */
  const imageCount = images.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Hajila Bau GmbH – Admin Dashboard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Verwalten Sie Website-Inhalte, Projektbilder und
            Unternehmens­darstellung
          </p>
        </div>

        {/* Stats */}
        {/* … (unverändert, gekürzt für Brevity) … */}

        {/* Dashboard */}
        <DynamicAdminDashboard
          images={images}
          isLoading={isLoading}
          hasError={Boolean(error)}
          onRetry={fetchImages}
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          onImageUpdate={handleImageUpdate}
          maxImages={50}
          allowedFormats={["image/jpeg", "image/png", "image/webp", "image/jpg"]}
          maxFileSize={5 * 1024 * 1024}
        />
        {error && <p className="text-red-500 mt-4">Fehler: {error}</p>}

        {/* … Restliche Sektionen bleiben unverändert … */}
      </div>
    </div>
  )
}
