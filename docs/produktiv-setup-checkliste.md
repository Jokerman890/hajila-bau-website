# Produktivkonfiguration Checkliste - Hajila Bau Webseite v0.4.8

## Status: Bereit für Produktiveinrichtung ✅

### Vorbereitungen abgeschlossen:
- ✅ System vollständig analysiert
- ✅ Bildkarussell-Implementierung dokumentiert
- ✅ API-Routen getestet
- ✅ Frontend-Dashboard funktioniert
- ✅ Storage-Integration vorbereitet
- ✅ SQL-Schema bereitgestellt
- ✅ Sicherheitsrichtlinien definiert

## Konfigurationsschritte

### 1. Supabase Storage konfigurieren
```bash
□ Supabase Dashboard öffnen: https://app.supabase.com
□ Projekt "HajilaBau" auswählen (csrsbihrqlejyrjndrkz)
□ Storage → Create bucket: "carousel-gallery"
□ Public bucket aktivieren
□ MIME-Types setzen: image/jpeg,image/png,image/webp
□ File size limit: 50MB
```

### 2. Datenbank-Schema einrichten
```bash
□ SQL Editor öffnen
□ SQL aus docs/supabase_produktivkonfiguration.md kopieren
□ CREATE TABLE carousel_images_metadata ausführen
□ Indizes erstellen
□ RLS-Policies aktivieren
□ Schema-Erstellung bestätigen
```

### 3. Authentifizierung einrichten
```bash
□ Authentication → Providers prüfen
□ Email-Provider aktiviert bestätigen
□ Admin-User erstellen: admin@hajila-bau.de
□ Passwort generieren und sicher speichern
□ Email confirmed aktivieren
□ Test-Login durchführen
```

### 4. Environment-Variablen aktualisieren
```bash
□ .env.local prüfen/erstellen:
  □ NEXT_PUBLIC_SUPABASE_URL gesetzt
  □ NEXT_PUBLIC_SUPABASE_ANON_KEY gesetzt  
  □ SUPABASE_SERVICE_ROLE_KEY gesetzt
  □ Admin-E-Mail konfiguriert
```

### 5. System-Tests durchführen
```bash
□ npm run dev starten
□ http://localhost:3000/admin öffnen
□ Admin-Login testen
□ Bildupload testen (Drag & Drop)
□ Bildanzeige im Karussell prüfen
□ API-Routen testen:
  □ POST /api/admin/carousel/upload
  □ PUT /api/admin/carousel/update  
  □ DELETE /api/admin/carousel/delete
```

### 6. Frontend-Integration testen
```bash
□ Hauptseite öffnen: http://localhost:3000
□ Bildkarussell-Funktionalität prüfen
□ Touch/Swipe-Navigation testen
□ Responsive Design prüfen
□ SEO-Metadaten validieren
```

### 7. Performance-Optimierung
```bash
□ Bildgrößen und -qualität optimieren
□ CDN-Caching prüfen
□ Ladezeiten messen
□ Database-Performance monitoren
□ Storage-Usage überwachen
```

### 8. Sicherheit validieren
```bash
□ RLS-Policies funktionieren
□ Unauthentifizierte können nicht uploaden
□ Service-Key nicht im Frontend exposed
□ CORS-Einstellungen korrekt
□ Input-Validierung funktioniert
```

## Erweiterte Konfiguration (Optional)

### Google OAuth einrichten
```bash
□ Google Cloud Console: OAuth-Client erstellen
□ Client-ID und Secret in Supabase eintragen
□ Redirect-URL konfigurieren
□ Google-Login testen
```

### Performance-Monitoring
```bash
□ Supabase Logs-Monitoring aktivieren
□ Error-Tracking einrichten
□ Performance-Metrics definieren
□ Alerting konfigurieren
```

### Backup-Strategie
```bash
□ Automatische Backups bestätigen
□ Point-in-Time Recovery konfigurieren
□ Disaster-Recovery-Plan erstellen
□ Backup-Tests durchführen
```

## Post-Setup Aufgaben

### Content-Management
```bash
□ Initiale Referenzbilder hochladen
□ Bildmetadaten konfigurieren (Titel, Alt-Text)
□ Anzeigereihenfolge optimieren
□ SEO-Optimierung durchführen
```

### Team-Schulung
```bash
□ Admin-Dashboard-Bedienung dokumentieren
□ Upload-Workflow erklären
□ Backup/Restore-Prozess schulen
□ Troubleshooting-Guide bereitstellen
```

### Deployment vorbereiten
```bash
□ GitHub Pages Build testen
□ Statische vs. Server-Deployment entscheiden
□ CI/CD-Pipeline konfigurieren
□ Domain-Konfiguration planen
```

## Troubleshooting-Referenz

### Häufige Issues:
1. **Bucket nicht gefunden**: Bucket-Name exakt "carousel-gallery"
2. **Upload-Fehler**: Service-Role-Key prüfen
3. **Authentifizierung**: Admin-User-Status bestätigen
4. **Bildanzeige**: Public bucket aktiviert?
5. **API-Fehler**: RLS-Policies überprüfen

### Debug-Commands:
```sql
-- Tabelle überprüfen
SELECT * FROM carousel_images_metadata LIMIT 5;

-- Active Images zählen
SELECT COUNT(*) FROM carousel_images_metadata WHERE is_active = true;

-- Letzte Uploads
SELECT file_name, uploaded_at FROM carousel_images_metadata ORDER BY uploaded_at DESC LIMIT 10;
```

## Kontakte & Support

- **Entwickler**: System vollständig dokumentiert in memory-bank/
- **Supabase Support**: https://supabase.com/support
- **GitHub Issues**: Repository für technische Probleme

---

**Erstellt**: 2025-07-20 02:55 UTC
**Version**: v0.4.8
**Status**: Produktionsbereit - Supabase-Konfiguration erforderlich
**System**: Vollständig analysiert und dokumentiert
