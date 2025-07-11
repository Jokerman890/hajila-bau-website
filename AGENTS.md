# AGENTS.md

## Projekt-Übersicht
HajilaBau ist eine **statisch exportierte Next.js‑15‑Site** (React 19, TypeScript 5).  
⚒️ Stack: Tailwind CSS 4, Radix UI, Supabase Auth/DB, Firebase (optional), Three.js.

---

## Code‑Style
- **Formatter:** Prettier (`npm run format` – eigenes Script anlegen)
- **ESLint Flat:** `npm run lint` mit `next/core-web-vitals`
- **TypeScript:** `strict` (siehe `tsconfig.json`), Imports über Alias `@/*`
- **Commits:** Conventional Commits `feat:`, `fix:`, `chore:` …

---

## Build & Tests (Agent‑Sandbox)
```bash
# 1) Dependencies
run: npm ci

# 2) Lint + Typecheck
run: npm run lint
run: tsc -p tsconfig.json --noEmit

# 3) Unit‑Tests
run: npm test -- --runInBand

# 4) Produktions‑Build inkl. statischem Export (output: 'export')
run: npm run build
```

---

## CI / PR‑Richtlinien
1. **Branches**  
   - `main` → GitHub Pages Deploy  
   - `dev` → Preview  
   - Feature‑Branches: `feat/<ticket>`  
2. Jeder PR: **Lint ✅ Tests ✅ Typecheck ✅**  
3. GitHub Actions‑Workflow **Deploy to GitHub Pages** baut & pusht `/out` (→ `.github/workflows/deploy.yml`)

---

## Umgebungs‑Variablen
| Name | Zweck | Setzt Codex? |
|------|-------|-------------|
| `NEXT_PUBLIC_BASE_PATH` | Base‑Path für GitHub Pages | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase‑Instanz | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon‑Key | ❌ |
| `FIREBASE_API_KEY` … | Firebase‑Config | ❌ |
> **Hinweis:** Secrets nur in *Repository → Settings → Actions Secrets*; niemals committen!

---

## Bekannte Stolperfallen
- **Static Export:** Keinen `app/(server)`‑Code verwenden; nur RSC/CSR
- Remote‑Assets nur von `images.unsplash.com` (vgl. `next.config.ts`)
- Supabase/Firebase‑Calls in Tests via **msw** oder lokalen Stub
- `@supabase/supabase-js` 2 benötigt `fetch`‑Polyfill in Jest
- Assets > 50 MB nicht in `public/` → lange Export‑Zeit

---

## Nützliche Kommandos
```bash
npm run dev            # TurboPack Dev‑Server
npm run test:watch     # Jest Watch‑Mode
npm run test:coverage  # Coverage Report
npm run deploy         # gh‑pages -d out
node scripts/test-supabase-connection.js  # DB‑Keys prüfen
```

---

## Letzte Worte
> Codex, halte dich strikt an diese Anleitung – dann bleibt der Bauplan stabil! 🏗️
