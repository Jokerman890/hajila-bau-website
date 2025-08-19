# Assets Scanner – Nutzung und Auswertung

Dieses Dokument beschreibt die Verwendung des Scanners sowie die Interpretation der erzeugten Reports.

## Zweck

- Duplikate in `public/uploads/` erkennen (SHA256-Hash)
- Verwaiste Dateien identifizieren (keine Referenz im Code/Content)
- Große Bilder (über Schwellwert) für Optimierung erkennen

## Ausführen

Lokaler Lauf:
```
npm run assets:scan
# oder mit höherem Grenzwert (z. B. 500 KB)
npm run assets:scan:hires
```

CI (GitHub Actions):
- Workflow: `.github/workflows/maintenance.yml`
- Monatlicher Cron-Lauf + manueller Trigger möglich
- Artefakte: Reports werden als Build-Artefakte hochgeladen

## Reports

Die Reports werden unter `docs/assets/` generiert:

- `duplicates.csv` + `duplicates.md`
- `orphaned.csv` + `orphaned.md`
- `large-images.csv`

### Duplikate

- `duplicates.csv` Spalten:
  - `hash`: SHA256-Hash der Datei-Inhalte
  - `path`: relativer Pfad (z. B. `uploads/...`)
  - `size_bytes`, `size_kb`
  - `mtime_iso`: letzter Änderungszeitpunkt
- Konsolidieren Sie Duplikate gezielt auf eine primäre Referenz und entfernen/archivieren Sie redundante Kopien.

### Verwaiste Dateien

- `orphaned.csv` Spalten:
  - `path`, `size_bytes`, `size_kb`, `mtime_iso`
- Ermittlung über Referenzen in Textdateien:
  - Vorkommen von `/uploads/...` Pfaden
  - Vorkommen des Dateinamens
- Achtung: False Positives sind möglich (z. B. in Kommentaren/Beispielen). Vor dem Löschen unbedingt verifizieren.

### Große Bilder

- `large-images.csv` Spalten:
  - `path`, `size_bytes`, `size_kb`, `threshold_kb`
- Kandidaten für Optimierung (z. B. WEBP, Kompression, maßvolle Auflösung)

## Empfohlener Workflow (monatlich)

1. `npm run assets:scan`
2. `docs/assets/*.csv|md` prüfen
3. Maßnahmen
   - Duplikate zusammenführen
   - Verwaiste Dateien löschen/archivieren (nach Verifikation)
   - Große Bilder optimieren (WEBP/Kompression/Skalierung)
4. Ergebnisse dokumentieren:
   - Cleanup-Protokoll fortschreiben (z. B. in `docs/assets-cleanup-checklist`)
   - KPIs in **Status-Report** (siehe `docs/status/`) aktualisieren

## Anpassungen

- Schwellwert: `--thresholdKB=300` (Standard) per CLI änderbar
- Textdatei-Suche: siehe `TEXT_EXTENSIONS` in `scripts/assets-scan.js`

## Hinweise

- Der Scanner ignoriert nicht-Textdateien bei der Referenzsuche.
- Ordner, die ignoriert werden: `node_modules`, `.git`, `.next`, `out`, `.vercel`, `.turbo`, sowie `public/uploads` selbst für die Referenzsuche.
