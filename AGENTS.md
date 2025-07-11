# AGENTS.md

## Projekt-Übersicht

HajilaBau ist eine **statisch exportierte Next.js-15-Site** (React 19, TypeScript 5).

⚒️ **Stack:** Tailwind CSS 4, Radix UI, Supabase Auth/DB, Firebase (optional), Three.js

---

## Code-Style

- **Formatter:** Prettier (`npm run format` – eigenes Script in `package.json` anlegen)  
- **Linting:** ESLint Flat mit Regelwerk `next/core-web-vitals` (`npm run lint`)  
- **TypeScript:** `strict`-Modus in `tsconfig.json`; Imports via Alias `@/*`  
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:` …)  

---

## Build & Tests (Agent-Sandbox)

```bash
# 1) Dependencies
npm ci

# 2) Lint + Typecheck
npm run lint
tsc -p tsconfig.json --noEmit

# 3) Unit-Tests
npm test -- --runInBand

# 4) Produktions-Build inkl. statischem Export
npm run build
Hinweis: Der statische Export landet im Verzeichnis out. Bei Bedarf in next.config.js anpassen.

CI / PR-Richtlinien
Branches

main → GitHub Pages Deploy

dev → Preview-Umgebung

Feature-Branches: feat/<ticket>

Jeder PR muss enthalten:

✅ Lint

✅ Tests

✅ Typecheck

GitHub Actions: Workflow deploy.yml baut & pusht /out nach jedem Merge in main

Umgebungs-Variablen
Name	Zweck	Setzt Codex?
NEXT_PUBLIC_BASE_PATH	Base-Path für GitHub Pages	✅
NEXT_PUBLIC_SUPABASE_URL	URL der Supabase-Instanz	❌
NEXT_PUBLIC_SUPABASE_ANON_KEY	Public Anon-Key für Supabase	❌
FIREBASE_API_KEY …	Firebase-Konfiguration	❌

Sicherheit: Secrets nur in Repository → Settings → Secrets; niemals im Code committen!

Bekannte Stolperfallen
Static Export: Kein app/(server)-Code verwenden – nur RSC/CSR

Remote-Assets: Nur von images.unsplash.com (siehe next.config.ts)

Tests: Supabase/Firebase-Calls mit msw oder lokalem Stub mocken

Polyfill: @supabase/supabase-js@2 benötigt fetch-Polyfill in Jest

Assets > 50 MB: Nicht in public/ – lange Exportzeiten!

Nützliche Kommandos
bash
Kopieren
Bearbeiten
npm run dev              # TurboPack Dev-Server
npm run test:watch       # Jest Watch-Mode
npm run test:coverage    # Coverage Report
npm run deploy           # gh-pages -d out
node scripts/test-supabase-connection.js  # Validierung der DB-Keys
Letzte Worte
Bleib strikt an diese Anleitung – dann bleibt der Bauplan stabil! 🏗️