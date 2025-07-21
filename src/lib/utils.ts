import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Erstellt einen korrekten Asset-Pfad für GitHub Pages oder lokale Entwicklung
 * @param path - Der relative Pfad zur Asset-Datei (z.B. "/uploads/logo.png")
 * @returns Der korrekte Pfad mit basePath für GitHub Pages
 */
export function getAssetPath(path: string): string {
  // Entferne führenden Slash wenn vorhanden
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In der Produktion (GitHub Pages) füge basePath hinzu
  const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';
  if (isGitHubPages) {
    return `/hajila-bau-website/${cleanPath}`;
  }
  
  // Lokale Entwicklung - verwende normalen Pfad
  return `/${cleanPath}`;
}

