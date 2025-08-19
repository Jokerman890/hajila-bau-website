# npm Installationsanleitung

## Voraussetzungen

### Node.js Installation
npm wird mit Node.js geliefert. Sie können beides zusammen installieren:

#### Windows & macOS
1. Besuchen Sie die offizielle [Node.js-Website](https://nodejs.org/)
2. Laden Sie die LTS-Version (empfohlen) herunter
3. Führen Sie das Installationsprogramm aus und folgen Sie den Anweisungen

#### Linux (Ubuntu/Debian)
```bash
# NodeSource-Repository hinzufügen
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Node.js und npm installieren
sudo apt-get install -y nodejs
```

#### Über Paketmanager
- **macOS (Homebrew)**: `brew install node`
- **Windows (Chocolatey)**: `choco install nodejs`
- **Linux (Snap)**: `sudo snap install node --classic`

## Installation überprüfen

### Versionen anzeigen
```bash
# Node.js Version anzeigen
node --version

# npm Version anzeigen
npm --version
```

### Hilfe anzeigen
```bash
# Allgemeine Hilfe
npm help

# Hilfe zu einem bestimmten Befehl
npm <befehl> --help
```

## Installation aktualisieren

### npm aktualisieren
```bash
# npm auf die neueste Version aktualisieren
npm install -g npm@latest

# Bestimmte Version installieren
npm install -g npm@<version>
```

### Node.js aktualisieren
- **Windows/macOS**: Neues Installationspaket von [nodejs.org](https://nodejs.org/) herunterladen
- **Linux**: Paketmanager verwenden
  ```bash
  # Für Ubuntu/Debian
  sudo apt update
  sudo apt upgrade nodejs
  ```

## Fehlerbehebung

### Häufige Probleme

#### Berechtigungsfehler
```bash
# Berechtigungen korrigieren (Linux/macOS)
sudo chown -R $USER:$USER /usr/local/lib/node_modules

# Alternativ: npm-Konfiguration ändern
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

#### Proxy-Einstellungen
```bash
# Proxy konfigurieren
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Proxy entfernen
npm config delete proxy
npm config delete https-proxy
```

## Alternative Installationen

### nvm (Node Version Manager)
Ermöglicht die Verwaltung mehrerer Node.js-Versionen:

#### Installation
```bash
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows
# https://github.com/coreybutler/nvm-windows/releases
```

#### Verwendung
```bash
# Node.js-Version installieren
nvm install --lts

# Version wechseln
nvm use 16.14.0

# Installierte Versionen anzeigen
nvm ls
```

### Volta
JavaScript Tool Manager:
```bash
# Installation
curl https://get.volta.sh | bash

# Node.js installieren
volta install node

# Projekt-spezifische Node-Version
volta pin node@16
```

## Deinstallation

### Windows
1. Systemsteuerung → Programme → Node.js deinstallieren
2. Folgende Ordner manuell löschen:
   - `C:\Program Files\nodejs`
   - `C:\Users\<benutzer>\AppData\Roaming\npm`

### macOS/Linux
```bash
# Node.js und npm deinstallieren
sudo rm -rf /usr/local/{lib/node,lib/node_modules,bin/node,npm,share/man} ~/.npm

# Bei Installation mit nvm
rm -rf ~/.nvm
```

## Weitere Ressourcen
- [Offizielle npm-Dokumentation](https://docs.npmjs.com/)
- [Node.js Downloads](https://nodejs.org/)
- [nvm GitHub Repository](https://github.com/nvm-sh/nvm)

---
_Diese Dokumentation wurde automatisch generiert._ /websites/npmjs – install

_Füge hier die aus Context7 erhaltenen Inhalte ein._
