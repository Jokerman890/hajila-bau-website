/**
 * Hilfsfunktionen für die lokale Dateispeicherung (Bilder) - Client-sichere Funktionen.
 */

/**
 * Gibt den öffentlichen URL-Pfad für eine lokal gespeicherte Datei zurück.
 * Da die Dateien im `public`-Ordner liegen, ist der Pfad direkt die URL.
 * Diese Funktion ist sicher für den Gebrauch im Client-Code.
 *
 * @param storagePath Der in der DB gespeicherte Pfad.
 * @returns Der als URL nutzbare Pfad.
 */
export function getLocalPublicUrl(storagePath: string): string {
  // Der in der DB gespeicherte Pfad ist bereits der öffentliche Pfad.
  // Es wird sichergestellt, dass der Pfad mit einem / beginnt, falls er fehlt.
  if (storagePath && !storagePath.startsWith('/')) {
    return `/${storagePath}`
  }
  return storagePath
}
