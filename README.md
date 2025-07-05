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
git clone https://github.com/[username]/hajila-bau-website.git
cd hajila-bau-website

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die Website ist dann unter `http://localhost:3000` erreichbar.

### Build für Produktion
```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start
```

## 📁 Projektstruktur

```
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

- **Branching-Strategie**: Für jede neue Funktion, die für die Seite generiert wird, soll ein extra Branch erstellt werden. Dies ermöglicht eine isolierte Entwicklung und Überprüfung neuer Features vor der Integration in den Haupt-Branch.

## 📜 Changelog

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
- **TypeScript Optimierungen** - 100% Typisierung und Strict Mode
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

## 📞 Kontakt

**Hajila Bau GmbH**
- 📍 Wildeshauser Straße 3, 49088 Osnabrück
- 📞 Büro: 0541 44026213
- 📱 Mobil: 0152 23000800
- 📧 E-Mail: info@hajila-bau.de

## 📄 Lizenz

© 2025 Hajila Bau GmbH. Alle Rechte vorbehalten.

---

*Entwickelt mit ❤️ für professionelle Baudienstleistungen in Osnabrück*
