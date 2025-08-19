# Assets-Workflow Spezifikation

## 1. Einführung
Dieses Dokument beschreibt den Workflow für die Verwaltung von Assets (Bilder, Dokumente, Medien) im Projekt.

## 2. Ordnerstruktur

### 2.1 Hauptverzeichnisse
```
public/
├── uploads/           # Hochgeladene Dateien
│   ├── images/        # Bilder
│   ├── documents/     # PDFs und Dokumente
│   └── media/         # Andere Medien
└── assets/            # Statische Assets
    ├── img/          # Optimierte Bilder
    ├── icons/        # Icons und Logos
    └── fonts/        # Schriftarten
```

## 3. Benennungskonventionen

### 3.1 Dateinamen
- **Format:** `kategorie-beschreibung-v01.ext`
- **Beispiele:**
  - `hero-banner-main-v01.jpg`
  - `product-showcase-2023-v02.webp`
  - `document-privacy-policy-v01.pdf`

### 3.2 Versionierung
- Erhöhung der Versionsnummer bei Aktualisierungen
- Alte Versionen archivieren, nicht überschreiben

## 4. Qualitätsanforderungen

### 4.1 Bilder
- **Formate:**
  - **WebP** (präferiert)
  - **JPEG** für Fotos
  - **PNG** für Transparenz
- **Maximale Größen:**
  - Hero-Bilder: 1920x1080px
  - Thumbnails: 400x400px
  - Icons: 64x64px
- **Komprimierung:**
  - WebP: Qualität 80%
  - JPEG: Qualität 85%
  - PNG: Verwendung von TinyPNG/TinyJPG

### 4.2 PDF-Dokumente
- PDF/A-2b Standard
- Eingebettete Schriftarten
- Maximale Dateigröße: 5MB
- Metadaten:
  - Titel
  - Autor
  - Erstellungsdatum
  - Schlagwörter

## 5. Upload-Prozess

### 5.1 Automatisierte Prüfungen
1. Dateityp-Validierung
2. Größenüberprüfung
3. Virenscan
4. Metadaten-Extraktion

### 5.2 Manuelle Schritte
1. Datei hochladen
2. Metadaten überprüfen
3. Vorschau generieren
4. Freigabe erteilen

## 6. Backup-Strategie

### 6.1 Automatische Backups
- Tägliche inkrementelle Backups
- Wöchentliche Volldaten-Backups
- Monatliche Archivierung

### 6.2 Aufbewahrungsfristen
- Tägliche Backups: 30 Tage
- Wöchentliche Backups: 12 Wochen
- Monatliche Backups: 12 Monate

## 7. Cleanup-Prozess

### 7.1 Automatische Bereinigung
- Unbenutzte Assets nach 90 Tagen
- Duplikate identifizieren
- Beschädigte Dateien melden

### 7.2 Manuelle Überprüfung
- Quartalsweise Überprüfung
- Archivierung veralteter Assets
- Dokumentation von Löschungen

## 8. Monitoring & KPIs

### 8.1 Überwachte Metriken
- Gesamtgröße der Assets
- Anzahl der Dateien
- Auslastung des Speichers
- Backup-Status

### 8.2 Berichtswesen
- Monatlicher Statusbericht
- Quartalsliche Optimierungsempfehlungen
- Jährliche Bestandsaufnahme

## 9. Verantwortlichkeiten

### 9.1 Rollen
- **Redakteure:** Upload und Pflege
- **Entwickler:** Workflow-Implementierung
- **Admin:** Backup und Wartung

## 10. Änderungshistorie

| Version | Datum       | Autor | Beschreibung der Änderung |
|---------|-------------|--------|---------------------------|
| 1.0     | 2025-08-18  | AI     | Erste Version erstellt    |

## 11. Monatlicher Cleanup-Prozess

### 11.1 Automatisierter Ablauf
Der monatliche Cleanup wird durch den Befehl ausgeführt:
```bash
node scripts/monthly-asset-cleanup.js
```

Optionen:
- `--dry-run`: Zeigt an, welche Aktionen durchgeführt würden, ohne Änderungen vorzunehmen
- `--thresholdKB=300`: Legt die Mindestgröße für die Bildoptimierung fest (Standard: 300KB)
- `--archive-days=90`: Legt das Mindestalter für die Archivbereinigung fest (Standard: 90 Tage)

### 11.2 Cleanup-Schritte
1. **Sicherung erstellen**
   - Erstellt eine komprimierte Sicherung des `public/uploads`-Verzeichnisses
   - Speichert sie in `backups/assets/` mit Zeitstempel

2. **Verwaiste Dateien finden**
   - Identifiziert Dateien ohne Referenzen im Code
   - Erzeugt eine Liste in `docs/status/orphaned-{date}.csv`

3. **Duplikate entfernen**
   - Findet doppelte Dateien anhand des SHA-256-Hash
   - Behält die zuerst hochgeladene Version bei
   - Dokumentiert die Änderungen in `docs/status/duplicates-{date}.csv`

4. **Bilder optimieren**
   - Konvertiert große Bilder in das WebP-Format
   - Wendet Kompression an, während die Qualität erhalten bleibt
   - Protokolliert die Optimierungen in `docs/status/optimizations-{date}.log`

5. **Alte Archive bereinigen**
   - Löscht Sicherungen, die älter als 6 Monate sind
   - Behält mindestens die 5 neuesten Sicherungen

6. **Bericht erstellen**
   - Generiert einen Zusammenfassungsbericht in `docs/status/status-{date}.md`
   - Aktualisiert die KPIs für das Asset-Management

## 12. Anhänge

### 12.1 Tools
- [ImageOptim](https://imageoptim.com/)
- [TinyPNG](https://tinypng.com/)
- [PDF/A Validator](https://www.pdfa.org/)
- [Sharp](https://sharp.pixelplumbing.com/) - Für die Bildoptimierung

### 12.2 Referenzen
- [WebP Dokumentation](https://developers.google.com/speed/webp)
- [PDF/A Standard](https://www.pdfa.org/)
- [Node.js File System](https://nodejs.org/api/fs.html)

---
**Status:** Review Ready  
**Nächste Überprüfung:** 2025-11-18  
**Letzte Aktualisierung:** 2025-08-18
