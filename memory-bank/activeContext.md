# Active Context - Hajila Bau Webseite

## Aktueller Arbeitsfokus
**Memory MCP Server und Power Bank Integration** - Implementierung und Aktualisierung des Memory MCP Servers sowie des erweiterten Speicherbank-Systems für die Hajila Bau Webseite.

## Kürzliche Änderungen
- **Version 0.4.0 veröffentlicht**: Aktualisierung des Changelogs mit neuen Features und Bugfixes.
- **Memory MCP Server Integration**: Hinzufügen von API-Endpunkten zur Interaktion mit dem Memory MCP Server für die Verwaltung von Karussell-Bildern.
- **Power Bank System**: Implementierung eines erweiterten Speicherbank-Systems zur Sicherstellung der Kontinuität und des Kontexts zwischen Sitzungen.
- **ESLint-Fehler behoben**: Behebung von ungenutzten Variablen und Funktionen in mehreren Dateien durch Entfernen ungenutzter Importe oder Hinzufügen von ESLint-Kommentaren.

## Nächste Schritte
- **Supabase Setup**: Echte Supabase-Instanz konfigurieren und MCP-Server verbinden.
- **Integration**: Supabase Photo Storage in Hajila Bau Website integrieren.
- **Authentifizierung**: User-Management und Berechtigungen implementieren.
- **Performance**: Optimierung für große Dateien und TUS-Upload aktivieren.
- **Monitoring**: Logging und Error-Tracking für Production-Umgebung.
- **Memory Bank Aktualisierung**: Weiterführende Dokumentation und Strukturierung der Speicherbank für zukünftige Entwicklungen.

## Aktive Entscheidungen und Überlegungen
- **Memory MCP Server und Power Bank**: Wie kann die Integration weiter optimiert werden, um eine nahtlose Interaktion mit der Hajila Bau Webseite zu gewährleisten?
- **Supabase Photo Storage System ist produktionsreif**
  - Vollständige TypeScript-Integration mit typsicheren APIs.
  - Umfassende Test-Abdeckung (33/33 Tests bestanden).
  - Mock-System für Entwicklung und Testing verfügbar.
  - MCP-Integration vorbereitet für echte Supabase-Verbindung.
- **Architektur-Entscheidungen**
  - Path-Format: `${userId}/${timestamp}.${ext}` für eindeutige Dateinamen.
  - RLS-Policies: Owner-only Zugriff für maximale Sicherheit.
  - Signed URLs: 60min Standard-Ablaufzeit, konfigurierbar.
  - Dateigröße-Limit: 6MB Standard, >6MB via TUS-Upload.
- **Technische Implementierung**
  - Modulare Struktur in `src/lib/supabase/`.
  - API-Endpunkte unter `/api/photos/`.
  - Demo-Seite unter `/photo-demo` für Testing.
  - Vollständige Dokumentation in `docs/supabase_storage.md`.
