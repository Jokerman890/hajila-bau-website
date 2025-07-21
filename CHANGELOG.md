# Changelog

## [0.4.8] - 2025-07-20

### Hinzugefügt
- **Vollständige Systemanalyse**: Komplette Bildkarussell-Implementierung analysiert und dokumentiert
- **SEO-Optimierungen**: 
  - Sitemap-Generierung (`src/app/sitemap.ts`) für automatische Suchmaschinenindexierung
  - Robots.txt (`src/app/robots.ts`) für Crawler-Steuerung
  - MetadataBase-Konfiguration in `layout.tsx` für vollständige OpenGraph/Twitter Card Integration
- **Umfassende Produktivkonfiguration-Dokumentation**:
  - `docs/supabase_produktivkonfiguration.md` - Detaillierte Supabase-Setup-Anleitung
  - `docs/produktiv-setup-checkliste.md` - Praktische Checkliste für Deployment
  - `docs/SUPABASE_MANUAL_SETUP.md` - Schritt-für-Schritt Setup-Guide
  - `docs/ADMIN_USER_SETUP.md` - Dedizierte Admin-User-Erstellung
- **Memory Bank Update**: Aktuelle Systemanalyse und Erkenntnisse vollständig dokumentiert

### Behoben
- **SEO-Metadaten**: Vollständige Integration von metadataBase für korrekte URL-Generierung
- **Browser-Kompatibilität**: Sitemap und Robots.txt erfolgreich getestet

### Geändert
- **Version auf 0.4.8 erhöht**: Systemanalyse-Update markiert
- **Documentation**: Erweiterte Troubleshooting-Guides und Debug-Commands

### Technische Details
- **Status**: System vollständig analysiert und produktionsreif
- **Architektur**: Frontend/Backend/API/Storage vollständig dokumentiert
- **Sicherheit**: RLS-Policies, UUID-basierte Dateinamen, Input-Validierung
- **Deployment**: Hybrid-Strategie für GitHub Pages und Development-Server

## [0.4.7] - 2025-07-19

### Hinzugefügt
- **Kritischer Deployment-Fix**: Hybrid-Deployment-Strategie implementiert
  - Bedingte Aktivierung von `output: 'export'` nur für GitHub Pages (NEXT_PUBLIC_GITHUB_PAGES=true)
  - API-Routen für lokale Entwicklung wieder verfügbar
- **Storage-Integration korrigiert**: Bucket-Name von `carousel_gallery` zu `carousel-gallery` standardisiert
- **Vollständige API-Funktionalität wiederhergestellt**:
  - `/api/admin/carousel/upload` - Funktionsfähig
  - `/api/admin/carousel/update` - Funktionsfähig  
  - `/api/admin/carousel/delete` - Funktionsfähig

### Behoben
- **Kritischer Fix**: Statischer Export blockierte alle API-Routen - durch bedingte Konfiguration gelöst
- **Storage-Bucket-Integration**: Korrekte Bucket-Namen-Konsistenz zwischen Code und Supabase
- **Admin-Dashboard**: Login und Authentifizierung vollständig funktionsfähig
- **Browser-Tests**: Admin-Login, API-Verfügbarkeit bestätigt

### Geändert
- **next.config.ts**: Bedingte Export-Konfiguration für flexible Deployment-Optionen
- **carousel-storage.ts**: Bucket-Namen auf `carousel-gallery` standardisiert
- **Fehlerbehandlung**: Rollback-Mechanismen in Upload-APIs implementiert

### Technische Meilensteine
- **Content Management System**: Vollständig funktionsfähiges Admin-Dashboard
- **CRUD-Operationen**: Komplette Bildverwaltung mit Metadaten-Bearbeitung
- **Produktionsbereit**: System bereit für Supabase-Produktivkonfiguration

## [0.4.6] - 2025-07-18

### Hinzugefügt

- Implementierung der Bildercarousel-Verwaltung im Admin-Dashboard. Dies beinhaltet:
    - Anzeige und Verwaltung von Bildern über Supabase Storage und die `carousel_images_metadata`-Tabelle.
    - Funktionalität zum Hochladen, Löschen, Aktualisieren von Metadaten (Titel, Beschreibung, Alt-Text, Aktivierungsstatus) und Vorschau von Bildern.
    - Integration des `AdminDashboard`-UI-Komponenten mit den entsprechenden Handlern für Datenoperationen.
- Erstellung der fehlenden Memory-Bank-Dateien (`projectbrief.md`, `systemPatterns.md`, `techContext.md`, `progress.md`).

### Behoben

- Behebung von Markdown-Linting-Fehlern (MD022, MD032, MD036, MD034) in allen Memory-Bank-Dateien und der `README.md`.
- Behebung des Cookie-Banner-Hintergrunds in `src/components/ui/premium-website.tsx`.
- Korrektur der Position der Überschrift "Unsere Leistungen" in `src/components/ui/premium-website.tsx`.
- Behebung von Hydration-Mismatch-Problemen bei Image-Komponenten in `src/components/ui/premium-website.tsx` durch Hinzufügen von `className="rounded-none"` und `priority`.

### Änderungen

- Aktualisierung der Memory-Bank-Dateien mit aktuellen Informationen zu ungelösten Problemen (Supabase-Autorisierung, Submodul-Commits).

## [0.4.5] - 2025-07-16

### Behoben

- Behebung des "null.from" Fehlers in `premium-website.tsx` durch robustere API-Abfrage.
- Behebung des "Cannot read properties of null (reading 'auth')" Fehlers in `AuthProvider.tsx` durch Prüfung auf `supabase`.
- Hinzufügung eines Buffer-Polyfills in `polyfills.ts` und Import in `AuthProvider.tsx`.
- Behebung des ESLint-Fehlers "A `require()` style import is forbidden." durch Migration der Next.js-Konfiguration von `next.config.js` nach `next.config.ts` und Korrektur des `ProvidePlugin`-Imports.
- Behebung des Fehlers "Doppelter Objektschlüssel" in `package.json` durch Entfernen des doppelten "buffer"-Eintrags.

## [0.4.4] - Datum unbekannt

### Änderungen

- Vorherige Änderungen und Versionen sind nicht dokumentiert.
