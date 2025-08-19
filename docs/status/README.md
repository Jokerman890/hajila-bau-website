# Status-Reporting – Nutzung

Dieses Dokument beschreibt, wie der monatliche Status-Report erzeugt und genutzt wird.

## Ziel

- KPIs aus Assets-Scans und weiteren Quellen aggregieren
- Monatsbericht als Markdown und CSV erzeugen
- Grundlage für Dashboard/Reporting und Entscheidungen

## Quellen

Der Generator wertet folgende Dateien aus:

- `docs/assets/duplicates.csv`
- `docs/assets/orphaned.csv`
- `docs/assets/large-images.csv`

Diese entstehen durch den Assets-Scanner (siehe `docs/assets/README.md`).

## Ausführen

Lokal:
```
# Assets-Scan starten (erzeugt CSVs)
npm run assets:scan

# Status-Report generieren (MD + CSV)
npm run report:status
```

CI (GitHub Actions):
- Workflow: `.github/workflows/maintenance.yml`
- Läuft monatlich automatisch (Cron) und kann manuell getriggert werden
- Artefakte: `docs/status/status-*.md` und `status-*.csv` werden als Build-Artefakte hochgeladen

## Ausgabe

- Markdown: `docs/status/status-YYYYMM.md`
  - Zusammenfassung der KPIs
  - Top-Liste großer Bilder
  - Quellenhinweise
  - Nächste Schritte (Checkliste)

- CSV: `docs/status/status-YYYYMM.csv`
  - Key/Value-Tabelle der wichtigsten Kennzahlen (duplicate_groups, orphaned_files, large_images, …)

## Empfohlener Monatsablauf

1. Assets-Scan ausführen:
   ```
   npm run assets:scan
   ```
2. Reports unter `docs/assets/` prüfen:
   - Duplikate konsolidieren
   - Verwaiste Dateien verifizieren und entfernen/archivieren
   - Große Bilder optimieren (WEBP/Kompression/Skalierung)
3. Status-Report generieren:
   ```
   npm run report:status
   ```
4
