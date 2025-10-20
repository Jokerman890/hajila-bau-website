# Hajila Bau GmbH - Premium Website

Eine moderne, professionelle Website für Hajila Bau GmbH - Ihr Partner für Hochbau & Klinkerarbeiten in Osnabrück.

## 🏗️ Über Hajila Bau GmbH

Hajila Bau GmbH ist ein etabliertes Bauunternehmen in Osnabrück, spezialisiert auf:

- Klinkerarbeiten & Verblendmauerwerk
- Klinker-Detailarbeiten (z. B. Bögen, Gesimse, Pfeiler)
- Wärmedämmverbundsysteme mit Klinkeroptik
- Schornstein- und Kaminverkleidungen
- Betonbau (Fundamente, Bodenplatten etc.)
- Eisenflechterarbeiten (Bewehrung binden)
- Bauausführung im Rohbau (komplette Rohbauten)

Seit 2016 steht die Hajila Bau GmbH für zuverlässige Bauleistungen im Raum Osnabrück. Als spezialisierter Handwerksbetrieb für Klinkerarbeiten und Rohbau setzen wir auf Qualität, Termintreue und persönliche Betreuung. Unsere Kunden profitieren von langjähriger Erfahrung und sauberer handwerklicher Ausführung. Wir freuen uns auf Ihr Bauprojekt!

## ✨ Website Features

### Design & UX

- **Premium Glassmorphism-Design** mit 3D-Effekten
- **Responsive Design** für alle Bildschirmgrößen
- **Dark/Light Mode Toggle** mit vollständiger Theme-Unterstützung
- **Typewriter-Effekt** im Hero-Bereich
- **3D-Logo-Animation** mit interaktiven Elementen
- **Particle Wave Background** für moderne Optik

### Technische Features

- **Next.js 15** mit TypeScript
- **Tailwind CSS** für modernes Styling
- **Framer Motion** für flüssige Animationen
- **Three.js** für 3D-Effekte
- **Lokale Dateispeicherung** für das Karussell (JSON + `public/uploads`)
- **SEO-optimiert** mit Meta-Tags
- **DSGVO-konform** mit rechtlichen Seiten

### Rechtliche Compliance

- ✅ **Impressum** (/impressum) - TMG/DL-InfoV-konform
- ✅ **Datenschutzerklärung** (/datenschutz) - DSGVO-konform
- ✅ **Cookie-Hinweis** (/cookies) - Detaillierte Cookie-Informationen
- ✅ **Cookie-Banner** mit Akzeptieren-Funktion

## 🚀 Installation & Setup

### Voraussetzungen

- Node.js 18+
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone [https://github.com/[username]/hajila-bau-website.git](https://github.com/[username]/hajila-bau-website.git)
cd hajila-bau-website

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die Website ist dann unter `http://localhost:3000` erreichbar.

### Build für Produktion

```bash
# Production Build + statischer Export ("out/" wird automatisch erstellt)
npm run build
```

Der statische Ordner `/out` wird nur erzeugt, wenn `NEXT_PUBLIC_GITHUB_PAGES=true` gesetzt ist (GitHub Pages Modus). Für Server-Deployments (z. B. Hostinger VPS) wird regulär mit `next start` gestartet.

```bash
# Production Server starten
npm start
```

### Tests

Basis-Unit-Tests für das Karussell sind vorhanden.

```bash
npm test
```

Weitere Varianten:

```bash
npm run test:watch
npm run test:coverage
```

## 📁 Projektstruktur

```treeview
hajila-website/
├── public/                 # Statische Assets
│   ├── favicon.ico        # Favicon (Hajila Logo)
│   ├── favicon-16x16.png  # Favicon 16x16
│   ├── favicon-32x32.png  # Favicon 32x32
│   └── apple-touch-icon.png # Apple Touch Icon
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── impressum/     # Impressum-Seite
│   │   ├── datenschutz/   # Datenschutz-Seite
│   │   ├── cookies/       # Cookie-Hinweis-Seite
│   │   ├── layout.tsx     # Root Layout
│   │   ├── page.tsx       # Homepage
│   │   └── globals.css    # Globale Styles
│   ├── components/        # React Components
│   │   └── ui/           # UI Components
│   │       ├── premium-website.tsx # Haupt-Website-Component
│   │       └── glass-card.tsx      # Glassmorphism Card Component
│   └── lib/              # Utilities
│       └── utils.ts      # Helper Functions
├── components.json        # shadcn/ui Konfiguration
├── next.config.ts         # Next.js Konfiguration
└── package.json          # Dependencies
```

## 🎨 Design System

### Farben

- **Primary**: Cyan/Türkis (#00bcd4)
- **Secondary**: Gold/Gelb (#ffd700)
- **Background**: Dunkle Gradienten
- **Glass Effects**: Transparente Overlays mit Blur

### Typografie

- **Headlines**: Merriweather (Serif)
- **Body Text**: Open Sans (Sans-serif)

### Animationen

- **Framer Motion** für Seitenübergänge
- **CSS Animations** für Hover-Effekte
- **Three.js** für 3D-Logo-Animation

## 📱 Responsive Design

Die Website ist vollständig responsive und optimiert für:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🔧 Technologie-Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Merriweather, Open Sans)

## 🛠️ Entwicklungsrichtlinien

### Branching-Strategie

- Für jede neue Funktion, die für die Seite generiert wird, soll ein extra Branch erstellt werden. Dies ermöglicht eine isolierte Entwicklung und Überprüfung neuer Features vor der Integration in den Haupt-Branch.
- Bei Entwicklung hinter einem Proxy setze `npm_config_proxy` und `npm_config_https_proxy` (statt `npm_config_http_proxy`), um Warnungen wie `Unknown env config "http-proxy"` zu vermeiden.

## 📜 Release Timeline

Aktuelle Version: **0.6.0** (2025-09-24). Ausführliche Änderungen findest du in der [CHANGELOG.md](CHANGELOG.md).

| Version | Datum | Höhepunkte |
| --- | --- | --- |
| 0.6.0 | 2025-09-24 | Supabase entfernt, lokale JSON-Datenquelle als Single-Source-of-Truth, vereinheitlichte Asset-Pfade |
| 0.5.3 | 2025-08-30 | `display_order`-Fix im Karussell, BasePath-sichere Assets, neue Dokumentation (Hostinger, SECURITY, README) |
| 0.5.2 | 2025-08-25 | CI-Pipeline mit `npm ci` stabilisiert, `package-lock.json` wiederhergestellt |
| 0.5.1 | 2025-08-25 | Fehlerhafte `eslint.yml` behoben und Workflow validiert |
| 0.4.10 | 2025-08-10 | Persistentes Reordering, Upload-Härtung und Next/Image-Anpassungen |
| 0.4.9 | 2025-07-25 | Stats-Section ergänzt, Rainbow-Glow-Effekte eingeführt |
| 0.4.8 | 2025-07-20 | SEO-Features, MetadataBase, umfangreiche Produktiv- und Troubleshooting-Dokus |
| 0.4.7 | 2025-07-19 | Hybrid-Deployment, Storage-Bucket-Fixes, vollständige API-Wiederherstellung |
| 0.4.6 | 2025-07-18 | Admin-Dashboard für Karussell-Verwaltung, Memory-Bank-Dateien erstellt |
| 0.4.5 | 2025-07-16 | Supabase-/Buffer-Bugfixes, Migration auf `next.config.ts` |
| 0.4.2 | 2025-07-05 | Transparente Logos, Memory-Bank- und Changelog-Pflege |
| 0.4.1 | 2025-07-05 | GitHub-Pages-Export aktiviert, 3D-Logo & AnimatedButton integriert |
| 0.3.0 | 2025-07-03 | Supabase Photo Storage, Mock Storage und erweitertes Admin-Dashboard |
| 0.2.0 | 2025-01-15 | CMS mit Drag & Drop Upload, Firebase Storage-Integration |
| 0.1.0 | 2025-01-02 | Initialer Launch mit Premium-Design, Responsive Setup und Rechtstexten |

## 💾 Lokale Bildverwaltung

- **Ohne externe Dienste**: Das Karussell speichert Metadaten in `public/data/carousel-images.json` und legt Bilder direkt unter `public/uploads/carousel` ab.
- **Admin-Dashboard**: Bild-Uploads, Bearbeitungen, Löschungen und Sortierung laufen über die lokale API `/api/admin/images`.
- **Sofort verfügbar**: Für lokale Tests und statische Deployments ist kein Login oder Supabase-Setup mehr nötig.
- **Nachvollziehbar**: JSON-Daten und Assets werden versioniert, wodurch Änderungen transparent bleiben.

## 📞 Kontakt

### Hajila Bau GmbH

- 📍 Wildeshauser Straße 3, 49088 Osnabrück
- 📞 Büro: 0541 44026213
- 📱 Mobil: 0152 23000800
- 📧 E-Mail: <info@hajila-bau.de>

## 📄 Lizenz

© 2025 Hajila Bau GmbH. Alle Rechte vorbehalten.

## Entwicklung

### Entwickelt mit ❤️ für professionelle Baudienstleistungen in Osnabrück
