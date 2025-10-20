# Changelog
# Changelog

## Release Timeline

| Version | Datum | Kernänderungen |
| --- | --- | --- |
| 0.6.0 | 2025-09-24 | Supabase entfernt, lokale JSON-Datenquelle als Single-Source-of-Truth, vereinheitlichte Asset-Pfade |
| 0.5.3 | 2025-08-30 | `display_order`-Fix im Karussell, Build- und Doku-Aktualisierungen |
| 0.5.2 | 2025-08-25 | CI-Pipeline stabilisiert (`npm ci`, wiederhergestellte `package-lock.json`) |
| 0.5.1 | 2025-08-25 | Fehlerhafte `eslint.yml` behoben (Diff-Marker entfernt) |
| 0.4.10 | 2025-08-10 | Persistentes Reordering, Upload-Härtung und BasePath-sichere Bildoptimierung |
| 0.4.9 | 2025-07-25 | Stats-Section ergänzt und Rainbow-Glow-Effekte eingeführt |
| 0.4.8 | 2025-07-20 | SEO-/Metadata-Ausbau, umfangreiche Produktiv-Dokumentation |
| 0.4.7 | 2025-07-19 | Hybrid-Deployment, Storage-Fixes und vollständige API-Wiederherstellung |
| 0.4.6 | 2025-07-18 | Admin-Dashboard für Karussell-Verwaltung und Memory-Bank-Erstellung |
| 0.4.5 | 2025-07-16 | Supabase-/Buffer-Bugfixes, Next.js-Konfiguration auf TypeScript migriert |
| 0.4.2 | 2025-07-05 | Transparente Logos, Memory-Bank- und Changelog-Pflege |
| 0.4.1 | 2025-07-05 | GitHub-Pages-Export, 3D-Logo & AnimatedButton überall integriert |
| 0.3.0 | 2025-07-03 | Supabase Photo Storage, Mock Storage und vollständiges Admin-Dashboard |
| 0.2.0 | 2025-01-15 | CMS mit Drag & Drop Upload, Firebase Storage-Integration |
| 0.1.0 | 2025-01-02 | Initialer Launch mit Premium-Design, Responsive Setup und Rechtstexten |

---

## [0.6.0] - 2025-09-24

### Geändert

- **Supabase-Abhängigkeiten entfernt**: Karussell-APIs, Admin-Dashboard und Premium-Website greifen jetzt ausschließlich auf lokale Dateispeicherung zu.
- **Lokale Assets vereinheitlicht**: Alle Bildpfade nutzen `getAssetPath`/`getLocalPublicUrl`, damit Deployments ohne externe Services funktionieren.
- **Admin-Dashboard vereinfacht**: Supabase-Authentifizierung und Login-Oberfläche entfernt; die lokale Verwaltung ist sofort nutzbar.
- **Veraltete Supabase-Dokumente bereinigt**: Setup-Guides, Skripte und Test-Hilfen aus dem Repository entfernt.

### Hinzugefügt

- **Persistente JSON-Datenquelle**: `public/data/carousel-images.json` dient als versionierte Single-Source-of-Truth für die Karussell-Metadaten.

### Build

- Version auf 0.6.0 erhöht.

---

## [0.5.3] - 2025-08-30

### Geändert

- Startseite: Abfrage auf `display_order` korrigiert, BasePath-sichere Bildpfade via `getAssetPath` verwendet.
- Karussell: Fehler-Logging für Bildladefehler (großes Bild + Thumbnails).

### Hinzugefügt

- Dokumentation: Hostinger-VPS Setup-Guide unter `docs/hostinger_vps_setup.md`.
- README: Hinweise zu lokaler Dateispeicherung vs. Supabase Storage und Test-/Build-Abschnitt aktualisiert.
- SECURITY.md: Unterstützte Versionen und Prozess zur Schwachstellenmeldung ergänzt.

### Build

- Dependencies installiert, Build erfolgreich, Tests grün (`image-carousel`).

---

## [0.5.2] - 2025-08-25

### Behoben

- CI-Build-Pipeline endgültig repariert, indem die `package-lock.json` wiederhergestellt und der Workflow `eslint.yml` auf eine robuste Konfiguration mit `npm ci` und Caching umgestellt wurde.

---

## [0.5.1] - 2025-08-25

### Behoben

- Korrektur der `.github/workflows/eslint.yml`, die aufgrund von Diff-Markern und ungültiger Syntax zu Build-Fehlern geführt hatte.

---

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

---

## [0.4.9] - 2025-07-25

### Hinzugefügt

- **Stats-Section**: Direkt nach dem Hero platziert
- **Rainbow Glow**: Rotierender Farbverlauf um alle Statistik-Karten

### Geändert

- **Version auf 0.4.9 erhöht**: UI-Verbesserungen sichtbar

---

## [0.4.8] - 2025-07-20

### Hinzugefügt

- **Vollständige Systemanalyse** und Dokumentation
- **SEO-Optimierungen**: Sitemap, Robots.txt, MetadataBase
- **Produktivkonfigurations-Dokumentation**: Setup-Guides, Checklisten
- **Memory Bank Update**

### Behoben

- SEO-Metadaten & Browser-Kompatibilität

### Geändert

- **Version auf 0.4.8 erhöht**

---

## [0.4.7] - 2025-07-19

### Hinzugefügt

- **Hybrid-Deployment-Strategie**
- **Storage-Integration korrigiert**
- **API-Funktionalität wiederhergestellt**

### Behoben

- Export- und Bucket-Namen-Fehler
- API- und Auth-Fixes

---

## [0.4.6] - 2025-07-18

### Hinzugefügt

- Admin-Dashboard für Bilderverwaltung
- Memory-Bank-Dateien erstellt

### Behoben

- UI-, Markdown- und Hydration-Fixes

### Geändert

- Aktualisierung aller Memory-Bank-Dateien

---

## [0.4.5] - 2025-07-16

### Behoben

- Diverse Supabase-/Buffer-Fehler
- Next.js-Konfiguration auf TypeScript migriert

---

## [0.4.2] - 2025-07-05

### Geändert

- Logo & Favicon auf transparent gesetzt
- Memory Bank und Changelog gepflegt

---

## [0.4.1] - 2025-07-05

### Hinzugefügt

- Statischer Export für GitHub Pages
- AnimatedButton & 3D-Logo integriert

---

## [0.3.0] - 2025-07-03

### Hinzugefügt

- Supabase Photo Storage & Mock System
- Admin Dashboard Erweiterungen
- TypeScript & API-Dokumentation

---

## [0.2.0] - 2025-01-15

### Hinzugefügt

- CMS mit Drag & Drop Upload
- Firebase Storage Integration

---

## [0.1.0] - 2025-01-02

### Hinzugefügt

- Initiale Website-Erstellung (Next.js 15, Tailwind)
- Glassmorphism-Design, 3D-Effekte
- Responsive Setup, DSGVO-Seiten

---

## 🔐 Historischer Hinweis (≤0.5.x): Supabase Authentifizierung

Seit Version 0.6.0 wird keine Supabase-Integration mehr ausgeliefert.  
Die folgenden Informationen dienen ausschließlich zur Nachverfolgung älterer Releases (≤0.5.x).

### Authentifizierung-Features

- Admin-Bereich und API mit Supabase Auth geschützt  
- Login via E-Mail/Passwort oder Google  
- Logout-Button im Admin-Bereich  
- API-Requests erfordern Bearer-Token

### Environment-Variablen

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...


### Sicherheitsfeatures

- Row Level Security (RLS) Policies für alle Datenbankoperationen
- UUID-basierte Dateinamen für Upload-Sicherheit
- Input-Validierung und Sanitisierung
- CORS-Konfiguration für sichere API-Zugriffe

