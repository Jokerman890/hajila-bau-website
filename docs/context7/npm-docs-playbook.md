# npm/Package Documentation Fetch Playbook

## Einführung
Dieses Playbook beschreibt die Nutzung des Context7 MCP-Servers zum Abrufen aktueller Paketdokumentationen für npm, Next.js und React.

## Grundlegende Befehle

### 1. Bibliotheks-IDs ermitteln
```javascript
// npm CLI
const npmId = await resolveLibraryId("npm");

// Next.js
const nextId = await resolveLibraryId("next.js");

// React
const reactId = await resolveLibraryId("react");
```

### 2. Dokumentation abrufen
```javascript
// npm Befehle abrufen
const npmCommands = await getLibraryDocs({
  context7CompatibleLibraryID: npmId,
  topic: "commands",
  tokens: 4000
});

// Next.js Routing
const nextRouting = await getLibraryDocs({
  context7CompatibleLibraryID: nextId,
  topic: "routing",
  tokens: 4000
});

// React Hooks
const reactHooks = await getLibraryDocs({
  context7CompatibleLibraryID: reactId,
  topic: "hooks",
  tokens: 4000
});
```

## Beispiele

### Beispiel 1: npm CLI
```javascript
// 1. ID ermitteln
const npmId = await resolveLibraryId("npm");

// 2. Dokumentation abrufen
const npmInstallDocs = await getLibraryDocs({
  context7CompatibleLibraryID: npmId,
  topic: "install",
  tokens: 4000
});
```

### Beispiel 2: Next.js
```javascript
const nextJsId = await resolveLibraryId("next.js");
const nextRoutingDocs = await getLibraryDocs({
  context7CompatibleLibraryID: nextJsId,
  topic: "routing",
  tokens: 4000
});
```

## Best Practices

1. **Präzise Paketnamen verwenden**
   - Nutzen Sie den offiziellen Paketnamen
   - Groß-/Kleinschreibung beachten

2. **Themenfokus**
   - Spezifische Themen angeben (z.B. "routing", "hooks")
   - Nicht mehr als 1-2 Themen pro Abruf

3. **Token-Limit**
   - Maximal 4000 Tokens pro Anfrage
   - Bei umfangreicher Dokumentation mehrere spezifische Anfragen stellen

## Fehlerbehebung

### Häufige Fehler

#### Bibliothek nicht gefunden
```
Error: Library not found
```
- Lösung: Überprüfen Sie die Schreibweise des Paketnamens
- Alternative Paketnamen ausprobieren

#### Ungültiges Thema
```
Error: Invalid topic
```
- Lösung: Verfügbare Themen mit `getAvailableTopics()` abrufen
- Allgemeineres Thema wählen

## Wartungs-Checkliste

- [ ] Monatliche Überprüfung der Dokumentationsquellen
- [ ] Aktualisierung der Beispielabfragen bei API-Änderungen
- [ ] Überprüfung der Token-Nutzung
- [ ] Dokumentation der Änderungen im Changelog

## Nützliche Links

- [Context7 MCP Server Dokumentation](#)
- [npm Dokumentation](https://docs.npmjs.com/)
- [Next.js Dokumentation](https://nextjs.org/docs)
- [React Dokumentation](https://reactjs.org/docs/getting-started.html)

---
Zuletzt aktualisiert: 2025-08-18
