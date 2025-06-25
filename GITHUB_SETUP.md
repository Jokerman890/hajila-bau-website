# GitHub Repository Setup - Hajila Bau Website

## 🚀 Anleitung zum Hochladen auf GitHub

Da die GitHub CLI Authentifizierung noch nicht vollständig abgeschlossen ist, folgen Sie diesen Schritten, um das Repository manuell auf GitHub zu erstellen:

### Schritt 1: Repository auf GitHub erstellen

1. Gehen Sie zu [github.com](https://github.com)
2. Klicken Sie auf das **"+"** Symbol oben rechts
3. Wählen Sie **"New repository"**
4. Füllen Sie die Felder aus:
   - **Repository name:** `hajila-bau-website`
   - **Description:** `Moderne Webseite für Hajila Bau GmbH - Hochbau & Klinkerarbeiten in Osnabrück`
   - **Visibility:** Public ✅
   - **Initialize repository:** NICHT ankreuzen (da wir bereits ein lokales Repository haben)
5. Klicken Sie auf **"Create repository"**

### Schritt 2: Remote Origin hinzufügen

Nach der Repository-Erstellung auf GitHub, führen Sie diese Befehle in Ihrem Terminal aus:

```bash
# Remote Origin hinzufügen (ersetzen Sie [IHR-USERNAME] mit Ihrem GitHub Benutzernamen)
git remote add origin https://github.com/[IHR-USERNAME]/hajila-bau-website.git

# Branch auf main umbenennen (falls nötig)
git branch -M main

# Code auf GitHub hochladen
git push -u origin main
```

### Schritt 3: Verifizierung

Nach dem Push sollten Sie Folgendes auf GitHub sehen:
- ✅ README.md mit vollständiger Projektdokumentation
- ✅ Alle Projektdateien (HTML, TypeScript, Package.json, etc.)
- ✅ .gitignore Datei
- ✅ Commit-Historie

## 📋 Was bereits vorbereitet ist

✅ **Git Repository initialisiert**  
✅ **Alle Dateien committed**  
✅ **README.md mit vollständiger Dokumentation**  
✅ **Professionelle .gitignore Datei**  
✅ **E-Mail-Adresse auf info@hajila-bau.de aktualisiert**

## 🔧 Nächste Schritte nach GitHub Upload

1. **GitHub Pages aktivieren** (für kostenlose Hosting):
   - Gehen Sie zu Repository Settings
   - Scrollen Sie zu "Pages"
   - Wählen Sie "Deploy from a branch"
   - Branch: main, Folder: / (root)

2. **Domain konfigurieren** (optional):
   - Custom domain in GitHub Pages Settings hinzufügen
   - DNS Records bei Ihrem Domain-Provider konfigurieren

3. **Continuous Deployment** (optional):
   - GitHub Actions für automatische Builds einrichten
   - Bei Code-Änderungen automatisch deployen

## 📞 Support

Bei Fragen zur GitHub-Einrichtung können Sie sich gerne melden!

---

**Hajila Bau GmbH** - Moderne Webentwicklung für moderne Bauunternehmen
