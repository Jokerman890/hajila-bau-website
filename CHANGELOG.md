# Changelog

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
