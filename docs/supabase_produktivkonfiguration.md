# Supabase-Produktivkonfiguration für Hajila Bau Webseite v0.4.8

## Übersicht
Diese Anleitung führt Sie durch die komplette Einrichtung der Supabase-Produktivumgebung für das Bildkarussell-System.

## 1. Storage Bucket Erstellen

### Schritt 1: Storage Bucket "carousel-gallery" anlegen
1. Öffnen Sie das Supabase Dashboard: https://app.supabase.com
2. Wählen Sie das Projekt "HajilaBau" (ID: csrsbihrqlejyrjndrkz)
3. Gehen Sie zu **Storage** → **Create new bucket**
4. Konfiguration:
   - **Name**: `carousel-gallery`
   - **Public bucket**: ✅ **Ja (aktivieren)**
   - **File size limit**: 50 MB (empfohlen für hochqualitative Bilder)
   - **MIME types**: `image/jpeg,image/png,image/webp`

### Schritt 2: Bucket-Berechtigungen prüfen
- Der Bucket sollte öffentlich lesbar sein (für Frontend-Zugriff)
- Upload/Delete sollte nur authentifizierte Benutzer verwenden können

## 2. Datenbank-Schema

### SQL-Migration ausführen
Führen Sie das folgende SQL-Script im **SQL Editor** aus:

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
    display_order INTEGER DEFAULT 0, -- Mapping zu "order" im Frontend
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
```

### Row Level Security (RLS) Policies

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
```

## 3. Authentifizierung konfigurieren

### Auth-Provider aktivieren
1. Gehen Sie zu **Authentication** → **Providers**
2. **Email**: ✅ Aktiviert (Standard)
3. **Google OAuth** (Optional):
   - Client ID und Secret konfigurieren
   - Redirect URL: `https://csrsbihrqlejyrjndrkz.supabase.co/auth/v1/callback`

### Admin-User erstellen
1. Gehen Sie zu **Authentication** → **Users**
2. **Create new user**:
   - **Email**: `admin@hajila-bau.de` (oder Ihre Admin-E-Mail)
   - **Password**: Sicheres Passwort generieren
   - **Email confirmed**: ✅ Ja
   - **Role**: authenticated

## 4. Environment-Variablen prüfen

Stellen Sie sicher, dass in Ihrer `.env.local` folgende Variablen korrekt gesetzt sind:

```env
# Supabase-Konfiguration (Produktiv)
NEXT_PUBLIC_SUPABASE_URL=https://csrsbihrqlejyrjndrkz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# Admin-Konfiguration
ADMIN_EMAIL=admin@hajila-bau.de
```

**WICHTIG**: Service Role Key nur serverseitig verwenden, niemals im Frontend!

## 5. Testen der Konfiguration

### Frontend-Tests
1. **Admin-Login testen**: http://localhost:3000/admin
2. **Bildupload testen**: Drag & Drop im Admin-Dashboard
3. **Bildanzeige testen**: Karussell auf der Hauptseite

### API-Tests
- `POST /api/admin/carousel/upload` - Bildupload
- `PUT /api/admin/carousel/update` - Metadaten-Update
- `DELETE /api/admin/carousel/delete` - Bildlöschung

### Datenbankabfragen testen
```sql
-- Aktive Bilder für Karussell abrufen
SELECT id, storage_path, title, alt_text, display_order 
FROM carousel_images_metadata 
WHERE is_active = true 
ORDER BY display_order ASC;

-- Alle Bilder für Admin-Dashboard abrufen
SELECT * FROM carousel_images_metadata 
ORDER BY uploaded_at DESC;
```

## 6. Storage-URLs prüfen

Testen Sie die URL-Struktur:
```
https://csrsbihrqlejyrjndrkz.supabase.co/storage/v1/object/public/carousel-gallery/{storage_path}
```

Beispiel:
```
https://csrsbihrqlejyrjndrkz.supabase.co/storage/v1/object/public/carousel-gallery/12345678-1234-1234-1234-123456789012.jpg
```

## 7. Performance-Optimierung

### Storage-Konfiguration
- **CDN**: Supabase Storage nutzt automatisch CDN
- **Bildkomprimierung**: Bereits im Upload-Code implementiert
- **Caching**: Headers für 1 Stunde gesetzt

### Datenbankoptimierung
- **Indizes**: Bereits für häufige Abfragen erstellt
- **Connection Pooling**: Supabase handled automatisch

## 8. Sicherheitsüberprüfung

### Checkliste
- ✅ RLS aktiviert und policies konfiguriert
- ✅ Service Role Key nur serverseitig verwendet
- ✅ Input-Validierung in API-Routen
- ✅ UUID-basierte Dateinamen (verhindert Path Traversal)
- ✅ MIME-Type-Validierung
- ✅ Dateigröße-Limits

### Monitoring
- Überwachen Sie **Database** → **API Logs**
- Überwachen Sie **Storage** → **Usage**

## 9. Backup-Strategie

Supabase bietet automatische Backups:
- **Point-in-Time Recovery**: 7 Tage (Free Plan) / 30 Tage (Pro Plan)
- **Database dumps**: Manuell über CLI möglich

## 10. Nächste Schritte nach Konfiguration

1. **Initialer Content-Upload**: Bilder für das Karussell hochladen
2. **SEO-Testing**: Sicherstellen dass Bilder korrekt im Frontend laden
3. **Performance-Tests**: Ladezeiten mit echten Bildern messen
4. **User Acceptance Tests**: Admin-Workflow testen

## Troubleshooting

### Häufige Probleme:
1. **"Bucket not found"**: Bucket-Name muss exakt `carousel-gallery` sein
2. **"Permission denied"**: RLS-Policies prüfen
3. **"Invalid JWT"**: API-Keys in Environment-Variablen prüfen
4. **"Network error"**: CORS-Einstellungen in Supabase prüfen

### Debug-Tipps:
- Supabase Dashboard → **API** → **Logs** für API-Errors
- Browser DevTools → **Network** für Frontend-Errors
- Console-Logs in Admin-Dashboard für Client-Errors

## Kontakt

Bei Problemen:
1. Supabase Dashboard Logs prüfen
2. GitHub Issues erstellen
3. Dokumentation in `memory-bank/` konsultieren

---

**Status**: Bereit für Produktivkonfiguration v0.4.8
**Letzte Aktualisierung**: 2025-07-20
**System**: Vollständig analysiert und dokumentiert
