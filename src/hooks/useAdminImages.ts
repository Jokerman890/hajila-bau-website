import { useState, useEffect, useCallback } from "react";

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

  // Bilder laden
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/images");
      if (!res.ok) throw new Error("Fehler beim Laden");
      const data = await res.json();
      setImages(data);
    } catch (e: any) {
      setError(e.message);
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
      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload fehlgeschlagen");
      await fetchImages();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Bild löschen
  const deleteImage = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/images?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Löschen fehlgeschlagen");
      await fetchImages();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Bild aktualisieren
  const updateImage = async (id: string, updates: Partial<CarouselImage>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/images?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update fehlgeschlagen");
      await fetchImages();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reihenfolge ändern (optional)
  const reorderImages = async (imageIds: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/images/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds }),
      });
      if (!res.ok) throw new Error("Reihenfolge ändern fehlgeschlagen");
      await fetchImages();
    } catch (e: any) {
      setError(e.message);
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
    retry: fetchImages,
    clearError: () => setError(null),
  };
}
