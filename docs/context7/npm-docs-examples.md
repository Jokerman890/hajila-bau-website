# Dokumentation der Kernpaket-Beispiele

## 1. npm CLI

### 1.1 Paket-Installation (install)
```javascript
// ID für npm CLI ermitteln
const npmId = await resolveLibraryId("npm");

// Dokumentation zum Installationsprozess abrufen
const installDocs = await getLibraryDocs({
  context7CompatibleLibraryID: npmId,
  topic: "install",
  tokens: 3000
});
```
**Ergebnis:**
- Enthält detaillierte Informationen zu Installationsbefehlen
- Beschreibt verschiedene Installationsszenarien (lokale/globale Installation, Entwicklung/Produktion)
- Erwähnung von `--save` und `--save-dev` Flags

### 1.2 npm-Befehle (commands)
```javascript
const npmCommands = await getLibraryDocs({
  context7CompatibleLibraryID: npmId,
  topic: "commands",
  tokens: 3000
});
```
**Ergebnis:**
- Übersicht über häufig verwendete Befehle (install, run, test, etc.)
- Erklärung der Befehlssyntax
- Hinweise zur Verwendung von npm-Skripten

## 2. Next.js

### 2.1 Routing
```javascript
const nextJsId = await resolveLibraryId("next.js");

const nextRouting = await getLibraryDocs({
  context7CompatibleLibraryID: nextJsId,
  topic: "routing",
  tokens: 3500
});
```
**Ergebnis:**
- Erklärung des Dateisystem-basierten Routings
- Dynamische Routen mit `[param]`
- API-Routen und Middleware

### 2.2 Konfiguration (config)
```javascript
const nextConfig = await getLibraryDocs({
  context7CompatibleLibraryID: nextJsId,
  topic: "config",
  tokens: 3500
});
```
**Ergebnis:**
- next.config.js Optionen
- Umgebungsvariablen
- Build-Optimierungen

## 3. React

### 3.1 Hooks
```javascript
const reactId = await resolveLibraryId("react");

const reactHooks = await getLibraryDocs({
  context7CompatibleLibraryID: reactId,
  topic: "hooks",
  tokens: 4000
});
```
**Ergebnis:**
- Grundlegende Hooks (useState, useEffect)
- Erweiterte Hooks (useContext, useReducer)
- Best Practices und Regeln für Hooks

### 3.2 Komponenten (components)
```javascript
const reactComponents = await getLibraryDocs({
  context7CompatibleLibraryID: reactId,
  topic: "components",
  tokens: 3500
});
```
**Ergebnis:**
- Funktionskomponenten vs. Klassenkomponenten
- Props und State
- Lebenszyklusmethoden (für Klassenkomponenten)

## Auswertung der Ergebnisse

### Gemeinsamkeiten
- Konsistente API über alle Pakete hinweg
- Ähnliche Fehlerbehandlung
- Vergleichbare Token-Nutzung pro Abfrage

### Herausforderungen
- Unterschiedliche Qualität der Dokumentation zwischen den Paketen
- Variierende Granularität der Themen
- Unterschiedliche Aktualisierungszyklen

## Best Practices

### Effiziente Abfragen
- Spezifische Themen verwenden
- Token-Limit beachten
- Ergebnisse zwischenspeichern

### Wartung
- Regelmäßige Aktualisierung der Beispiele
- Überprüfung der API-Kompatibilität
- Dokumentation von Änderungen

---
Zuletzt aktualisiert: 2025-08-18
