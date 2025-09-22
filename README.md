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

## 📜 Changelog

### Version 0.5.2 (2025-08-25)

- **Fix**: Die CI-Build-Pipeline wurde endgültig repariert, indem die `package-lock.json` wiederhergestellt und der `eslint.yml`-Workflow auf eine robuste Konfiguration mit `npm ci` und Caching umgestellt wurde.

### Version 0.5.1 (2025-08-25)

- **Fix**: Korrektur der `.github/workflows/eslint.yml`-Datei, die aufgrund von ungültiger Syntax (Diff-Marker) zu Build-Fehlern führte.

### Version 0.4.6 (2025-07-18)

- Erstellung der fehlenden Memory-Bank-Dateien (`projectbrief.md`, `systemPatterns.md`, `techContext.md`, `progress.md`).
- Behebung von Markdown-Linting-Fehlern (MD022, MD032, MD036, MD034) in allen Memory-Bank-Dateien und der `README.md`.
- Aktualisierung der Memory-Bank-Dateien mit aktuellen Informationen zu ungelösten Problemen (Supabase-Autorisierung, Submodul-Commits).

### Version 0.4.5 (2025-07-16)

- Behebung des "null.from" Fehlers in `premium-website.tsx` durch robustere API-Abfrage.
- Behebung des "Cannot read properties of null (reading 'auth')" Fehlers in `AuthProvider.tsx` durch Prüfung auf `supabase`.
- Hinzufügung eines Buffer-Polyfills in `polyfills.ts` und Import in `AuthProvider.tsx`.
- Behebung des ESLint-Fehlers "A `require()` style import is forbidden." durch Migration der Next.js-Konfiguration von `next.config.js` nach `next.config.ts` und Korrektur des `ProvidePlugin`-Imports.
- Behebung des Fehlers "Doppelter Objektschlüssel" in `package.json` durch Entfernen des doppelten "buffer"-Eintrags.

### Version 0.4.2 (2025-07-05)

- Logo und Favicon auf transparentes logo_2d.png gesetzt
- Memorybank und Changelog gepflegt

### Version 0.4.1 (2025-07-05)

- Statischer Export für GitHub Pages, basePath/assetPrefix überall korrekt
- AnimatedButton und Logo3D überall integriert
- Karussell zeigt alle Bilder aus Upload-Ordner automatisch
- MCP-Memorybank und Changelog gepflegt

### Version 0.3.0 (03.07.2025) - Aktuelle Version

- **Supabase Photo Storage System** - Vollständiges Foto-Management mit API-Endpunkten
- **Mock Storage System** - Demo-Funktionalität ohne externe Abhängigkeiten
- **Jest Testing Framework** - 16 Unit-Tests und E2E-Workflows
- **Admin Dashboard Erweiterungen** - Erweiterte Content-Management-Funktionen
- **TypeScript Optimierungen** - 100% Typierung und Strict Mode
- **API-Struktur** - RESTful Endpunkte für Photos, Admin und Memory-Bank
- **Dokumentation** - Vollständige API-Docs und Supabase-Integration-Guide

### Version 0.2.0 (15.01.2025)

- **Content Management System** - Bilder-Karussell und Admin-Dashboard
- **Firebase Integration** - Storage und Admin SDK für Bildverwaltung
- **Drag & Drop Upload** - Intuitive Bildverwaltung mit Sortierung

### Version 0.1.0 (02.01.2025)

- **Initiale Website-Erstellung** - Next.js 15 mit TypeScript und Tailwind CSS
- **Premium Glassmorphism-Design** - 3D-Effekte und moderne Optik
- **Responsive Design** - Optimiert für alle Bildschirmgrößen
- **Rechtliche Compliance** - DSGVO-konforme Seiten (Impressum, Datenschutz, Cookies)
- **3D-Animationen** - Three.js Integration mit interaktiven Elementen

## 🔐 Supabase Authentifizierung (feature/supabase-auth)

- Admin-Bereich und API sind mit Supabase Auth geschützt.
- .env.local benötigt:
  - NEXT_PUBLIC_SUPABASE_URL=...
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=...
- E-Mail/Passwort-Login und Google Login im Admin-Bereich
- Logout-Button oben rechts im Admin
- API-Requests müssen den Bearer-Token mitsenden (siehe Beispiel in src/app/api/admin/images/route.ts)

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
