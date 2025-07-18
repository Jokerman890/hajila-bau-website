# Changelog

## [0.4.6] - 2025-07-18

### Hinzugefügt

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
