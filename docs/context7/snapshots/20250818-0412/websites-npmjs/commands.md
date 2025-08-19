# npm-Befehle Referenz

## Grundlegende Befehle

### Pakete installieren
```bash
# Alle Abhängigkeiten installieren
npm install

# Bestimmtes Paket installieren
npm install <paketname>

# Als Entwicklungsabhängigkeit installieren
npm install --save-dev <paketname>

# Globale Installation
npm install -g <paketname>
```

### Skripte ausführen
```bash
# In package.json definierte Skripte ausführen
npm run <script-name>

# Startskript ausführen (kann ohne "run" aufgerufen werden)
npm start

# Testskript ausführen
npm test

# Benutzerdefinierte Skripte
npm run build
npm run dev
```

## Paketverwaltung

### Pakete aktualisieren
```bash
# Alle Pakete aktualisieren
npm update

# Bestimmtes Paket aktualisieren
npm update <paketname>

# Auf neueste Version prüfen
npm outdated
```

### Pakete entfernen
```bash
# Paket deinstallieren
npm uninstall <paketname>

# Globale Deinstallation
npm uninstall -g <paketname>
```

## Projektinitialisierung

### Neues Projekt erstellen
```bash
# Interaktive package.json Erstellung
npm init

# Standardwerte ohne Fragen
npm init -y

# npm 7+ Workspaces
mkdir my-project
cd my-project
npm init -w packages/a -y
npm init -w packages/b -y
```

## Abhängigkeiten verwalten

### Peer-Abhängigkeiten
```bash
# Peer-Abhängigkeiten installieren
npm install --peer

# Peer-Abhängigkeiten automatisch installieren (npm 7+)
npm install --legacy-peer-deps
```

### Optionale Abhängigkeiten
```bash
# Optionale Abhängigkeiten installieren
npm install --optional
```

## Veröffentlichung

### Paket veröffentlichen
```bash
# Login bei npm
npm login

# Paket veröffentlichen
npm publish

# Bestimmte Version veröffentlichen
npm version <update_type>  # major|minor|patch
npm publish

# Veröffentlichung zurückziehen
npm unpublish <package>@<version>
```

## Sicherheit

### Sicherheitsüberprüfung
```bash
# Bekannte Sicherheitslücken prüfen
npm audit

# Sicherheitslücken beheben
npm audit fix

# Kritische Sicherheitslücken erzwingen
npm audit fix --force
```

## Cache-Verwaltung

### Cache bereinigen
```bash
# Cache leeren
npm cache clean --force

# Cache-Überprüfung
npm cache verify
```

## Konfiguration

### npm-Konfiguration
```bash
# Konfiguration anzeigen
npm config list

# Globale Konfiguration anzeigen
npm config list -g

# Einstellung setzen
npm config set <key> <value>

# Einstellung löschen
npm config delete <key>
```

## Nützliche Befehle

### Ausführliche Ausgabe
```bash
# Debug-Ausgabe aktivieren
npm --loglevel verbose <befehl>
```

### Globale Pakete auflisten
```bash
# Global installierte Pakete anzeigen
npm list -g --depth=0
```

### Paketinformationen anzeigen
```bash
# Informationen zu einem Paket anzeigen
npm view <paketname>

# Verfügbare Versionen anzeigen
npm view <paketname> versions

# Letzte Version anzeigen
npm view <paketname> version
```

## Workspaces (npm 7+)

### Workspace-Befehle
```bash
# In allen Workspaces installieren
npm install -ws

# In einem bestimmten Workspace installieren
npm install -w <workspace-name>

# Skript in allen Workspaces ausführen
npm run test --workspaces
```

## Performance-Optimierung

### Paket-Sperrdatei
```bash
# Genauere Abhängigkeitsversionen mit package-lock.json
npm install --package-lock-only

# Prüfen auf veraltete Abhängigkeiten
npm outdated
```

## Fehlerbehebung

### Häufige Probleme
1. **Berechtigungsfehler**: Verwenden Sie `sudo` oder korrigieren Sie die npm-Berechtigungen
2. **Netzwerkprobleme**: Proxy-Einstellungen oder Registry-URL überprüfen
3. **Abhängigkeitskonflikte**: `npm ls <paketname>` zur Analyse verwenden

## Weitere Ressourcen
- [Offizielle npm-Dokumentation](https://docs.npmjs.com/)
- [npm-CLI-Referenz](https://docs.npmjs.com/cli/v8/commands)
- [Semantic Versioning (semver)](https://semver.org/)

---
_Diese Dokumentation wurde automatisch generiert._ /websites/npmjs – commands

_Füge hier die aus Context7 erhaltenen Inhalte ein._
