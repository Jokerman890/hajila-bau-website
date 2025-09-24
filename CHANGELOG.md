# Changelog

## [0.6.0] - 2025-09-24

### Geändert

- **Supabase-Abhängigkeiten entfernt**: Karussell-APIs, Admin-Dashboard und Premium-Website greifen jetzt ausschließlich auf die lokale Dateispeicherung zu.
- **Lokale Assets vereinheitlicht**: Alle Bildpfade nutzen `getAssetPath`/`getLocalPublicUrl`, damit Deployments ohne externe Services funktionieren.
- **Admin-Dashboard vereinfacht**: Supabase-Authentifizierung und Login-Oberfläche entfernt; die lokale Verwaltung ist sofort nutzbar.
- **Veraltete Supabase-Dokumente bereinigt**: Setup-Guides, Skripte und Test-Hilfen aus dem Repository entfernt.

### Hinzugefügt

- **Persistente JSON-Datenquelle**: `public/data/carousel-images.json` dient als Versionierte Single-Source-of-Truth für die Karussell-Metadaten.

### Build

- Version auf 0.6.0 erhöht.

## [0.5.2] - 2025-08-25

### Behoben

- CI-Build-Pipeline endgültig repariert, indem die `package-lock.json` wiederhergestellt und der Workflow `eslint.yml` auf eine robuste Konfiguration mit `npm ci` und Caching umgestellt wurde.

## [0.5.1] - 2025-08-25

### Behoben

- Korrektur der `.github/workflows/eslint.yml`, die aufgrund von Diff-Markern und ungültiger Syntax zu Build-Fehlern geführt hatte.

## [0.4.9] - 2025-07-25

### Hinzugefügt

- **Stats-Section**: Direkt nach dem Hero platziert
- **Rainbow Glow**: Rotierender Farbverlauf um alle Statistik-Karten

### Geändert

- **Version auf 0.4.9 erhöht**: UI-Verbesserungen sichtbar

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
  - Anzeige und Verwaltung von Bildern über Supabase Storage und die `carousel_images_metadata`-Tabelle
  - Funktionalität zum Hochladen, Löschen, Aktualisieren von Metadaten (Titel, Beschreibung, Alt-Text, Aktivierungsstatus) und Vorschau von Bildern
  - Integration des `AdminDashboard`-UI-Komponenten mit den entsprechenden Handlern für Datenoperationen
- Erstellung der fehlenden Memory-Bank-Dateien (`projectbrief.md`, `systemPatterns.md`, `techContext.md`, `progress.md`)

### Behoben

- Behebung von Markdown-Linting-Fehlern (MD022, MD032, MD036, MD034) in allen Memory-Bank-Dateien und der `README.md`
- Behebung des Cookie-Banner-Hintergrunds in `src/components/ui/premium-website.tsx`
- Korrektur der Position der Überschrift "Unsere Leistungen" in `src/components/ui/premium-website.tsx`
- Behebung von Hydration-Mismatch-Problemen bei Image-Komponenten in `src/components/ui/premium-website.tsx` durch Hinzufügen von `className="rounded-none"` und `priority`

### Geändert

- Aktualisierung der Memory-Bank-Dateien mit aktuellen Informationen zu ungelösten Problemen (Supabase-Autorisierung, Submodul-Commits)

## [0.4.5] - 2025-07-16

### Behoben

- Behebung des "null.from" Fehlers in `premium-website.tsx` durch robustere API-Abfrage
- Behebung des "Cannot read properties of null (reading 'auth')" Fehlers in `AuthProvider.tsx` durch Prüfung auf `supabase`
- Hinzufügung eines Buffer-Polyfills in `polyfills.ts` und Import in `AuthProvider.tsx`
- Behebung des ESLint-Fehlers "A `require()` style import is forbidden." durch Migration der Next.js-Konfiguration von `next.config.js` nach `next.config.ts` und Korrektur des `ProvidePlugin`-Imports
- Behebung des Fehlers "Doppelter Objektschlüssel" in `package.json` durch Entfernen des doppelten "buffer"-Eintrags

## [0.4.2] - 2025-07-05

### Geändert

- Logo und Favicon auf transparentes `logo_2d.png` gesetzt
- Memory Bank und Changelog gepflegt

## [0.4.1] - 2025-07-05

### Hinzugefügt

- Statischer Export für GitHub Pages, basePath/assetPrefix überall korrekt
- AnimatedButton und Logo3D überall integriert
- Karussell zeigt alle Bilder aus Upload-Ordner automatisch

### Geändert

- MCP-Memory Bank und Changelog gepflegt

## [0.3.0] - 2025-07-03

### Hinzugefügt

- **Supabase Photo Storage System** - Vollständiges Foto-Management mit API-Endpunkten
- **Mock Storage System** - Demo-Funktionalität ohne externe Abhängigkeiten
- **Jest Testing Framework** - 16 Unit-Tests und E2E-Workflows
- **Admin Dashboard Erweiterungen** - Erweiterte Content-Management-Funktionen
- **TypeScript Optimierungen** - 100% Typierung und Strict Mode
- **API-Struktur** - RESTful Endpunkte für Photos, Admin und Memory-Bank
- **Dokumentation** - Vollständige API-Docs und Supabase-Integration-Guide

## [0.2.0] - 2025-01-15

### Hinzugefügt

- **Content Management System** - Bilder-Karussell und Admin-Dashboard
- **Firebase Integration** - Storage und Admin SDK für Bildverwaltung
- **Drag & Drop Upload** - Intuitive Bildverwaltung mit Sortierung

## [0.1.0] - 2025-01-02

### Hinzugefügt

- **Initiale Website-Erstellung** - Next.js 15 mit TypeScript und Tailwind CSS
- **Premium Glassmorphism-Design** - 3D-Effekte und moderne Optik
- **Responsive Design** - Optimiert für alle Bildschirmgrößen
- **Rechtliche Compliance** - DSGVO-konforme Seiten (Impressum, Datenschutz, Cookies)
- **3D-Animationen** - Three.js Integration mit interaktiven Elementen

---

## 🔐 Supabase Authentifizierung

### Authentifizierung-Features

- Admin-Bereich und API sind mit Supabase Auth geschützt
- E-Mail/Passwort-Login und Google Login im Admin-Bereich
- Logout-Button oben rechts im Admin
- API-Requests müssen den Bearer-Token mitsenden (siehe Beispiel in `src/app/api/admin/images/route.ts`)

### Environment-Variablen

Erforderliche Umgebungsvariablen in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Sicherheitsfeatures

- Row Level Security (RLS) Policies für alle Datenbankoperationen
- UUID-basierte Dateinamen für Upload-Sicherheit
- Input-Validierung und Sanitisierung
- CORS-Konfiguration für sichere API-Zugriffe

## [0.4.10] - 2025-08-10

### Hinzugefügt

- Persistentes Reordering der Karussell-Bilder:
  - Neue API-Route `POST /api/admin/carousel/reorder`
  - Admin-Dashboard: Auf/Ab-Buttons, Reorder-Handler aktiviert
- Upload-Härtung:
  - MIME-Validierung (JPEG/PNG/WebP)
  - Größenlimit 10MB
  - Automatische Vergabe von `display_order = max + 1`

### Geändert

- Einheitliches Mapping von `order` (Frontend) zu `display_order` (DB) in Upload/Update/Lesen
- Admin-Frontend liest mit `supabase` (public), Admin-Operationen laufen über serverseitige API
- Next/Image für Hostinger VPS optimiert:
  - Bildoptimierung aktiv (außer bei GitHub Pages)
  - `remotePatterns` für Supabase- und Hostinger-Domains ergänzt

### Behoben

- Typisierung/ESLint in Update-API (keine `any` mehr)
- Inkonsistente Sortierung nach `order` vs. `display_order`

### Technische Details

- Build & Tests grün
- Routen: Upload/Update/Delete/Reorder aktiv

## [0.5.3] - 2025-08-30

### Geändert

- Startseite: Abfrage auf `display_order` korrigiert, BasePath-sichere Bildpfade via `getAssetPath` verwendet
- Karussell: Fehler-Logging für Bildladefehler (großes Bild + Thumbnails)

### Hinzugefügt

- Dokumentation: Hostinger-VPS Setup-Guide unter `docs/hostinger_vps_setup.md`
- README: Hinweise zu lokaler Dateispeicherung vs. Supabase Storage und Test-/Build-Abschnitt aktualisiert
- SECURITY.md: Unterstützte Versionen und Prozess zur Schwachstellenmeldung ergänzt

### Build

- Dependencies installiert, Build erfolgreich, Tests grün (`image-carousel`)
