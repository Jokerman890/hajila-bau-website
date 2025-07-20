# SUPABASE MANUELLER SETUP - Hajila Bau Webseite v0.4.8

## 🚀 SOFORTIGER SETUP-GUIDE

### SCHRITT 1: Supabase Dashboard öffnen
1. Öffnen Sie: https://app.supabase.com/project/csrsbihrqlejyrjndrkz
2. Loggen Sie sich mit Ihrem Supabase-Account ein

### SCHRITT 2: Storage Bucket erstellen
1. **Gehen Sie zu**: Storage → Buckets
2. **Klicken Sie**: "Create bucket"
3. **Bucket Name**: `carousel-gallery` (EXAKT so schreiben!)
4. **Public bucket**: ✅ **JA** (WICHTIG: Häkchen setzen!)
5. **File size limit**: 50 MB
6. **Allowed MIME types**: `image/jpeg,image/png,image/webp`
7. **Klicken Sie**: "Create bucket"

### SCHRITT 3: Datenbank-Schema erstellen
1. **Gehen Sie zu**: SQL Editor
2. **Neues Query erstellen**
3. **Kopieren Sie das folgende SQL** und führen Sie es aus:

```sql
-- Hajila Bau Carousel System - Produktivkonfiguration v0.4.8

-- Erstellen der Metadaten-Tabelle für Karussellbilder
CREATE TABLE IF NOT EXISTS public.carousel_images_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    alt_text TEXT NOT NULL,
    title TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    size_kb INTEGER,
    width INTEGER,
    height INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Kommentare
COMMENT ON TABLE public.carousel_images_metadata IS 'Metadaten für Bildkarussell - Hajila Bau Webseite v0.4.8';
COMMENT ON COLUMN public.carousel_images_metadata.storage_path IS 'Pfad im carousel-gallery Bucket';
COMMENT ON COLUMN public.carousel_images_metadata.display_order IS 'Anzeigereihenfolge im Karussell (niedriger = früher)';

-- Performance-Indizes
CREATE INDEX IF NOT EXISTS idx_carousel_images_order ON public.carousel_images_metadata (display_order);
CREATE INDEX IF NOT EXISTS idx_carousel_images_is_active ON public.carousel_images_metadata (is_active);
CREATE INDEX IF NOT EXISTS idx_carousel_images_uploaded_at ON public.carousel_images_metadata (uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_carousel_images_active_order ON public.carousel_images_metadata (is_active, display_order) WHERE is_active = true;

SELECT 'Carousel metadata table created successfully!' as result;
```

### SCHRITT 4: RLS-Policies aktivieren
**Führen Sie diese SQL-Statements aus** (im selben SQL Editor):

```sql
-- RLS für carousel_images_metadata aktivieren
ALTER TABLE public.carousel_images_metadata ENABLE ROW LEVEL SECURITY;

-- Policy 1: Öffentliches Lesen für Frontend-Karussell
CREATE POLICY "Allow public read access to active carousel images"
ON public.carousel_images_metadata
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Policy 2: Admin-Benutzer können alle Bilder lesen (für Admin-Dashboard)
CREATE POLICY "Allow authenticated admin read access to all carousel images"
ON public.carousel_images_metadata
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Nur authentifizierte Benutzer können Bilder einfügen
CREATE POLICY "Allow authenticated users to insert carousel images"
ON public.carousel_images_metadata
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 4: Nur authentifizierte Benutzer können Bilder aktualisieren
CREATE POLICY "Allow authenticated users to update carousel images"
ON public.carousel_images_metadata
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 5: Nur authentifizierte Benutzer können Bilder löschen
CREATE POLICY "Allow authenticated users to delete carousel images"
ON public.carousel_images_metadata
FOR DELETE
TO authenticated
USING (true);

SELECT 'RLS Policies created successfully!' as result;
```

### SCHRITT 5: Admin-User erstellen
1. **Gehen Sie zu**: Authentication → Users
2. **Klicken Sie**: "Create new user"
3. **Email**: `admin@hajila-bau.de` (oder Ihre bevorzugte Admin-E-Mail)
4. **Password**: Generieren Sie ein sicheres Passwort (speichern Sie es!)
5. **Email confirmed**: ✅ **JA** (Häkchen setzen)
6. **Role**: authenticated (sollte automatisch gesetzt werden)
7. **Klicken Sie**: "Create user"

### SCHRITT 6: Environment-Variablen prüfen
**Öffnen Sie**: Settings → API

Ihre Werte sollten sein:
```env
NEXT_PUBLIC_SUPABASE_URL=https://csrsbihrqlejyrjndrkz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Ihr anon key aus dem Dashboard]
SUPABASE_SERVICE_ROLE_KEY=[Ihr service_role key aus dem Dashboard]
```

**WICHTIG**: Service Role Key NUR serverseitig verwenden!

## ✅ SOFORTIGER FUNKTIONSTEST

### Terminal öffnen und testen:
```bash
cd c:/Users/joker/dev/Beta1/hajila-bau-website
npm run dev
```

### Browser-Tests:
1. **Admin-Login**: http://localhost:3000/admin
   - E-Mail: admin@hajila-bau.de
   - Passwort: [Das von Ihnen generierte]

2. **Bildupload testen**:
   - Drag & Drop ein Testbild ins Admin-Dashboard
   - Upload sollte erfolgreich sein

3. **Karussell testen**: http://localhost:3000
   - Bilder sollten im Karussell angezeigt werden

## 🔧 PROBLEMBEHANDLUNG

### Häufige Fehler:

**"Bucket not found"**:
- Bucket-Name muss EXAKT `carousel-gallery` sein
- Bucket muss public sein

**"Permission denied"**:
- RLS-Policies überprüfen
- Admin-User korrekt erstellt?

**"Network error"**:
- Environment-Variablen prüfen
- Supabase-URL und Keys korrekt?

**"Upload failed"**:
- Service Role Key in .env.local gesetzt?
- Storage-Bucket Berechtigungen prüfen

### Debug-SQL-Queries:
```sql
-- Tabelle überprüfen
SELECT * FROM carousel_images_metadata LIMIT 5;

-- Active Images zählen
SELECT COUNT(*) FROM carousel_images_metadata WHERE is_active = true;

-- RLS-Policies überprüfen
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'carousel_images_metadata';
```

## 🎯 ERFOLG BESTÄTIGEN

Nach erfolgreichem Setup sollten Sie sehen:
- ✅ Storage Bucket "carousel-gallery" existiert
- ✅ Tabelle "carousel_images_metadata" existiert
- ✅ RLS-Policies sind aktiv
- ✅ Admin-User kann sich einloggen
- ✅ Bildupload funktioniert
- ✅ Karussell zeigt Bilder an

## 📞 SUPPORT

Bei Problemen:
1. Supabase Dashboard → API Logs prüfen
2. Browser DevTools → Network Tab überprüfen
3. Terminal-Output auf Fehler checken

---

**SETUP-STATUS**: Bereit für manuelle Konfiguration
**VERSION**: v0.4.8
**PROJEKT-ID**: csrsbihrqlejyrjndrkz
**REGION**: eu-central-1
