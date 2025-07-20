# Admin-User-Erstellung - Hajila Bau Webseite v0.4.8

## 🔐 ADMIN-USER SETUP-GUIDE

### Schritt 1: Supabase Dashboard öffnen
1. Navigieren Sie zu: https://app.supabase.com/project/csrsbihrqlejyrjndrkz
2. Loggen Sie sich mit Ihrem Supabase-Account ein

### Schritt 2: Authentication-Sektion öffnen
1. **Sidebar**: Klicken Sie auf **"Authentication"**
2. **Tab**: Klicken Sie auf **"Users"**

### Schritt 3: Neuen Admin-User erstellen
1. **Button klicken**: "Create new user" (grüner Button oben rechts)
2. **Formular ausfüllen**:
   ```
   Email: admin@hajila-bau.de
   Password: [Generieren Sie ein sicheres Passwort - siehe unten]
   Email confirmed: ✅ JA (WICHTIG: Häkchen setzen!)
   Role: authenticated (wird automatisch gesetzt)
   ```

### Schritt 4: Sicheres Passwort generieren
**Option A - Online Generator**:
- Nutzen Sie: https://passwordsgenerator.net/
- Einstellungen: 16 Zeichen, Groß/Klein, Zahlen, Symbole
- Beispiel: `K9!mX7#vN2$pQ5wR`

**Option B - Manuell**:
- Mindestens 12 Zeichen
- Groß- und Kleinbuchstaben
- Zahlen und Sonderzeichen
- Beispiel: `HajilaBau2025!Admin`

### Schritt 5: Admin-User bestätigen
1. **Email confirmed**: ✅ **UNBEDINGT aktivieren**
   - Ohne diese Einstellung kann sich der Admin nicht anmelden!
2. **Button klicken**: "Create user"

### Schritt 6: User-Erstellung bestätigen
Nach erfolgreichem Erstellen sehen Sie:
- ✅ User in der Liste
- ✅ Email-Adresse angezeigt
- ✅ Status: "confirmed"
- ✅ Role: "authenticated"

## 🔧 ADVANCED ADMIN-KONFIGURATION

### Admin-Role-System (Optional - Erweitert)
Wenn Sie später ein differenziertes Admin-System benötigen:

```sql
-- Erweiterte Admin-Tabelle erstellen (OPTIONAL)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    admin_level INTEGER DEFAULT 1, -- 1=Basic Admin, 2=Super Admin
    permissions JSONB DEFAULT '{"carousel": true, "users": false}',
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPZ,
    is_active BOOLEAN DEFAULT true
);

-- Aktuellen Admin hinzufügen
INSERT INTO public.admin_users (user_id, email, admin_level, permissions)
SELECT 
    id, 
    email,
    1,
    '{"carousel": true, "users": false}'
FROM auth.users 
WHERE email = 'admin@hajila-bau.de';
```

### Erweiterte RLS-Policies für Admin-System
```sql
-- Super-restriktive Policy nur für Admin-Tabelle
CREATE POLICY "Only admin users can manage carousel"
ON public.carousel_images_metadata
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid() 
        AND is_active = true
        AND permissions->>'carousel' = 'true'
    )
);
```

## ✅ FUNKTIONSTEST

### Schritt 1: Login testen
1. **Terminal öffnen**: 
   ```bash
   cd c:/Users/joker/dev/Beta1/hajila-bau-website
   npm run dev
   ```

2. **Browser öffnen**: http://localhost:3000/admin

3. **Login-Daten eingeben**:
   - Email: admin@hajila-bau.de
   - Password: [Ihr generiertes Passwort]

### Schritt 2: Admin-Funktionen testen
Nach erfolgreichem Login sollten Sie sehen:
- ✅ Admin-Dashboard lädt
- ✅ 3 Tabs verfügbar (Gallery, Upload, Preview)
- ✅ "Upload Zone" ist sichtbar
- ✅ Drag & Drop funktioniert
- ✅ Keine Fehler in Browser-Console

## 🚨 TROUBLESHOOTING

### Häufige Probleme:

**"Invalid login credentials"**:
- Email korrekt eingegeben? (admin@hajila-bau.de)
- Passwort korrekt kopiert?
- **Email confirmed** aktiviert? ← HÄUFIGSTER FEHLER

**"User not found"**:
- User wirklich erstellt?
- Supabase Dashboard → Authentication → Users prüfen
- Email-Adresse exakt überprüfen

**"Access denied" nach Login**:
- User hat "authenticated" Role?
- RLS-Policies korrekt erstellt?
- Environment-Variablen korrekt?

**Dashboard lädt nicht**:
- npm run dev läuft?
- Browser-Console auf Fehler prüfen
- Network-Tab auf API-Fehler checken

### Debug-Commands:
```sql
-- Admin-User überprüfen
SELECT id, email, email_confirmed, role, created_at
FROM auth.users
WHERE email = 'admin@hajila-bau.de';

-- User-Metadaten anzeigen
SELECT id, email, raw_user_meta_data, raw_app_meta_data
FROM auth.users
WHERE email = 'admin@hajila-bau.de';

-- Session-Status prüfen (im Browser-DevTools-Console)
console.log(await supabase.auth.getSession());
```

## 🔒 SICHERHEITS-CHECKLISTE

### Nach Admin-Erstellung prüfen:
- ✅ Passwort ist stark und sicher gespeichert
- ✅ Email ist bestätigt
- ✅ Nur notwendige Personen haben Admin-Zugang
- ✅ Environment-Variablen sind sicher
- ✅ Service-Role-Key nicht im Frontend
- ✅ RLS-Policies sind aktiv

### Langfristige Sicherheit:
- [ ] Passwort regelmäßig ändern (alle 6 Monate)
- [ ] Admin-Aktivitäten überwachen
- [ ] Backup der Supabase-Konfiguration
- [ ] Zwei-Faktor-Authentifizierung einrichten (später)

## 📞 SUPPORT

### Bei Login-Problemen:
1. **Supabase Dashboard prüfen**: Authentication → Users
2. **Browser-DevTools**: Console-Fehler überprüfen
3. **Network-Tab**: API-Request-Fehler analysieren
4. **Environment**: `.env.local`-Dateien validieren

### Kontakt:
- **Entwickler**: Dokumentation in memory-bank/
- **Supabase Support**: https://supabase.com/support

---

**ADMIN-EMAIL**: admin@hajila-bau.de  
**PROJEKT-ID**: csrsbihrqlejyrjndrkz  
**REGION**: eu-central-1  
**STATUS**: Bereit für Admin-User-Erstellung  
**VERSION**: v0.4.8
