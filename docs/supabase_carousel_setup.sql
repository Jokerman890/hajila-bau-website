-- Erstelle die Tabelle 'carousel_images' für Metadaten der Carousel-Bilder
CREATE TABLE public.carousel_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path TEXT UNIQUE NOT NULL,
    public_url TEXT NOT NULL,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    width INTEGER NOT NULL,
    HEIGHT INTEGER NOT NULL,
    size INTEGER NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_index INTEGER DEFAULT 0
);

-- Optional: Fügen Sie eine RLS-Richtlinie hinzu, wenn Sie den Zugriff einschränken möchten
-- Beispiel: Nur authentifizierte Benutzer können Bilder sehen (falls der Bucket privat ist)
-- oder nur Admin-Benutzer können CRUD-Operationen durchführen.
-- Da der Bucket öffentlich ist, ist eine SELECT-RLS-Richtlinie hier nicht unbedingt notwendig,
-- aber für INSERT/UPDATE/DELETE ist sie kritisch.

-- RLS-Richtlinie für INSERT (nur Admins)
CREATE POLICY "Enable insert for authenticated users only" ON public.carousel_images
FOR INSERT WITH CHECK (auth.role() = 'authenticated'); -- Oder 'service_role' für Admin-Uploads

-- RLS-Richtlinie für SELECT (alle können lesen, da Bilder öffentlich sind)
CREATE POLICY "Enable read access for all users" ON public.carousel_images
FOR SELECT USING (TRUE);

-- RLS-Richtlinie für UPDATE (nur Admins)
CREATE POLICY "Enable update for authenticated users only" ON public.carousel_images
FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS-Richtlinie für DELETE (nur Admins)
CREATE POLICY "Enable delete for authenticated users only" ON public.carousel_images
FOR DELETE USING (auth.role() = 'authenticated');

-- Stellen Sie sicher, dass RLS auf der Tabelle aktiviert ist
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;

-- Fügen Sie einen Index für 'order_index' hinzu, um die Sortierung zu beschleunigen
CREATE INDEX ON public.carousel_images (order_index);

-- Fügen Sie einen Index für 'uploaded_at' hinzu, um die Sortierung nach Upload-Datum zu beschleunigen
CREATE INDEX ON public.carousel_images (uploaded_at DESC);
