import { useState, useEffect, useCallback } from "react";
import supabaseDefault, { supabase as supabaseMaybe } from "@/lib/supabase/client";
const supabase = supabaseMaybe ?? supabaseDefault;

export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  alt: string;
  order: number;
  isActive: boolean;
  uploadedAt: string; // als ISO-String von der API
  size: number;
  dimensions: { width: number; height: number };
}

export function useAdminImages() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hilfsfunktion: Auth-Header mit Access Token
  const getAuthHeaders = async (extraHeaders: HeadersInit = {}) => {
    const headers: HeadersInit = { ...extraHeaders };
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  // Bilder laden
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/images", { headers });
      if (!res.ok) throw new Error("Fehler beim Laden");
      const data = await res.json();
      // API liefert { images, success }; kompatibel halten:
      const list = Array.isArray(data) ? data : data.images ?? [];
      setImages(list);
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Bild hochladen
  const uploadImages = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    setIsLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders(); // FormData: Content-Type automatisch
      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
        headers,
      });
      if (!res.ok) throw new Error("Upload fehlgeschlagen");
      await fetchImages();
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Bild löschen
  const deleteImage = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/images?id=${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Löschen fehlgeschlagen");
      await fetchImages();
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Bilder neu anordnen
  const reorderImages = async (imageIds: string[]) => {
    if (!imageIds || !imageIds.length) {
      setError('Keine gültigen Bild-IDs zum Sortieren erhalten');
      return { success: false, error: 'Ungültige Bild-IDs' };
    }

    // Speichere die ursprüngliche Reihenfolge für den Fall eines Fehlers
    const originalOrder = [...images];
    
    // Optimiertes Update der lokalen State
    setImages(prevImages => {
      const imageMap = new Map(prevImages.map(img => [img.id, img]));
      return imageIds
        .map((id, index) => {
          const img = imageMap.get(id);
          return img ? { ...img, order: index + 1 } : null;
        })
        .filter(Boolean) as CarouselImage[];
    });

    try {
      const headers = await getAuthHeaders({
        'Content-Type': 'application/json',
      });
      
      const res = await fetch('/api/admin/carousel/reorder', {
        method: 'POST',
        headers,
        body: JSON.stringify({ imageIds }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Fehler beim Speichern der neuen Reihenfolge');
      }

      // Bestätige die erfolgreiche Aktualisierung
      const result = await res.json();
      if (result.images) {
        setImages(result.images);
      }

      return { success: true };
    } catch (e: unknown) {
      // Bei Fehler: Zurück zur ursprünglichen Reihenfolge
      setImages(originalOrder);
      const error = e as Error;
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Bild aktualisieren
  const updateImage = async (id: string, updates: Partial<CarouselImage>) => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders({ "Content-Type": "application/json" });
      const res = await fetch(`/api/admin/images?id=${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Aktualisierung fehlgeschlagen");
      await fetchImages();
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    images,
    isLoading,
    error,
    uploadImages,
    deleteImage,
    updateImage,
    reorderImages,
    refresh: fetchImages,
    clearError: () => setError(null),
  };
}
