-- Supabase Setup für Bilderkarussell

-- 1. Erstellen Sie einen PUBLIC Storage Bucket namens "carousel_gallery" über das Supabase Dashboard.
--    - Gehen Sie zu Storage -> Create new bucket
--    - Name: carousel_gallery
--    - Public bucket: Ja (aktivieren)

-- 2. Erstellen der Metadaten-Tabelle für Karussellbilder
CREATE TABLE IF NOT EXISTS public.carousel_images_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE, -- z.B. public/mein-bild.jpg oder direkt mein-bild.jpg wenn im Root des Buckets
    public_url TEXT GENERATED ALWAYS AS (
        concat(
            'https://csrsbihrqlejyrjndrkz.supabase.co/storage/v1/object/public/carousel_gallery/', -- Ersetzen Sie YOUR_PROJECT_REF mit Ihrer Supabase Projekt Referenz
            storage_path
        )
    ) STORED,
    alt_text TEXT NOT NULL,
    title TEXT,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    size_kb INTEGER,
    width INTEGER,
    height INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL -- Optional: wer hat es hochgeladen
);

-- Kommentar zur Tabelle
COMMENT ON TABLE public.carousel_images_metadata IS 'Metadaten für die Bilder im Hauptseiten-Karussell, gespeichert in Supabase Storage (Bucket: carousel_gallery).';
COMMENT ON COLUMN public.carousel_images_metadata.public_url IS 'Automatisch generierte öffentliche URL zum Bild im Storage. Stellen Sie sicher, dass Projekt-REF und Bucket-Name korrekt sind.';

-- Indizes für häufige Abfragen
CREATE INDEX IF NOT EXISTS idx_carousel_images_order ON public.carousel_images_metadata ("order");
CREATE INDEX IF NOT EXISTS idx_carousel_images_is_active ON public.carousel_images_metadata (is_active);

-- 3. Row Level Security (RLS) Policies für carousel_images_metadata

-- Zuerst RLS für die Tabelle aktivieren
ALTER TABLE public.carousel_images_metadata ENABLE ROW LEVEL SECURITY;

-- Policy: Öffentliches Lesen für alle (anon und authenticated)
CREATE POLICY "Allow public read access to carousel images metadata"
ON public.carousel_images_metadata
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Admins (oder authentifizierte Benutzer) können Bilder einfügen
-- WICHTIG: Passen Sie diese Policy an Ihre Admin-Rollenverwaltung an.
-- Für den Anfang erlauben wir allen authentifizierten Benutzern das Einfügen.
-- In einer Produktionsumgebung sollten Sie dies auf spezifische Admin-Benutzer einschränken.
CREATE POLICY "Allow authenticated users to insert carousel images metadata"
ON public.carousel_images_metadata
FOR INSERT
TO authenticated
WITH CHECK (true); -- Hier könnte eine Prüfung auf eine Admin-Rolle erfolgen, z.B. auth.uid() IN (SELECT admin_id FROM admins)

-- Policy: Admins (oder authentifizierte Benutzer) können Bilder aktualisieren
CREATE POLICY "Allow authenticated users to update carousel images metadata"
ON public.carousel_images_metadata
FOR UPDATE
TO authenticated
USING (true) -- Wer darf aktualisieren?
WITH CHECK (true); -- Welche Bedingungen müssen für die neuen Daten gelten?

-- Policy: Admins (oder authentifizierte Benutzer) können Bilder löschen
CREATE POLICY "Allow authenticated users to delete carousel images metadata"
ON public.carousel_images_metadata
FOR DELETE
TO authenticated
USING (true);

-- Hinweis: Die Storage-Bucket-Berechtigungen (für carousel_gallery) sind separat.
-- Da der Bucket "public" ist, kann jeder lesen.
-- Schreiboperationen (Upload, Delete) auf den Storage Bucket selbst sollten
-- über serverseitige Funktionen mit dem Service Role Key oder spezifische Storage RLS Policies (falls komplexer benötigt) gehandhabt werden.
-- Für dieses Setup verlassen wir uns darauf, dass die API-Routen für Upload/Delete
-- die Berechtigungen serverseitig prüfen (z.B. ist der Benutzer ein Admin).

-- Beispiel für eine restriktivere INSERT Policy, falls Sie eine Admin-Tabelle haben:
-- Angenommen, Sie haben eine Tabelle `user_profiles` mit einer Spalte `is_admin BOOLEAN`:
/*
CREATE POLICY "Allow admin users to insert carousel images metadata"
ON public.carousel_images_metadata
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.user_id = auth.uid() AND up.is_admin = TRUE
  )
);
-- Ähnliche Policies für UPDATE und DELETE.
*/

-- Stellen Sie sicher, dass die Funktion uuid_generate_v4() verfügbar ist.
-- Falls nicht, aktivieren Sie die Erweiterung pgcrypto:
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions"; -- Führen Sie dies als Superuser aus, falls noch nicht geschehen.

SELECT 'Supabase Carousel Setup Skript abgeschlossen. Bitte überprüfen Sie die Hinweise und führen Sie die Schritte im Supabase Dashboard / SQL Editor aus.';
