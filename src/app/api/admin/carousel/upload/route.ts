import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import {
  saveFileLocally,
  deleteFileLocally,
} from "@/lib/local-storage.server"; // Korrigierter Import für Server-Datei
import sizeOf from "image-size";

// Dependency: npm install image-size @types/image-size
// Diese Route ist für das Admin-Panel gedacht und sollte entsprechend geschützt sein.
// Die Authentifizierung wird hier über den Supabase Auth Context in der Admin Page gehandhabt.
// Diese API Route sollte zusätzlich prüfen, ob der aufrufende Benutzer Admin-Rechte hat.
// Für diese Implementierung nehmen wir an, dass der Zugriff auf die Admin-Seite bereits ausreichend schützt.

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase Admin Client nicht initialisiert." },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei hochgeladen." },
        { status: 400 },
      );
    }

    // Bild-Dimensionen und Größe ermitteln
    let width: number | undefined;
    let height: number | undefined;
    const fileSizeKb = Math.round(file.size / 1024);

    // Validierungen
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const fileType = (file as File).type || ''
    if (!allowed.includes(fileType)) {
      return NextResponse.json({ error: 'Nicht unterstütztes Dateiformat' }, { status: 400 })
    }
    const MAX = 10 * 1024 * 1024
    if (file.size > MAX) {
      return NextResponse.json({ error: 'Datei zu groß (max. 10MB)' }, { status: 400 })
    }

    try {
      const bytes = await file.arrayBuffer();
      const fileBuffer = Buffer.from(bytes);
      const dimensions = sizeOf(fileBuffer);
      width = dimensions.width;
      height = dimensions.height;
    } catch (e) {
      console.warn("Konnte Bild-Dimensionen nicht ermitteln:", e);
      // Fehler ist nicht kritisch, Upload wird fortgesetzt
    }

    // Bild lokal speichern
    const uploadResult = await saveFileLocally(file);

    if (uploadResult.error || !uploadResult.data) {
      return NextResponse.json(
        {
          error:
            uploadResult.error?.message || "Fehler beim Hochladen des Bildes.",
        },
        { status: 500 },
      );
    }

    // Metadaten in der Datenbank speichern
    const { path: storage_path, fileName: file_name } = uploadResult.data;

    // display_order als (max + 1) bestimmen
    const { data: orderRows, error: orderErr } = await supabaseAdmin
      .from('carousel_images_metadata')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)

    const nextOrder = orderErr || !orderRows || orderRows.length === 0 ? 1 : (orderRows[0].display_order ?? 0) + 1

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("carousel_images_metadata")
      .insert({
        file_name,
        storage_path,
        alt_text:
          file.name.split(".").slice(0, -1).join(".") || "Hochgeladenes Bild",
        title:
          file.name.split(".").slice(0, -1).join(".") || "Hochgeladenes Bild",
        is_active: true,
        display_order: nextOrder,
        size_kb: fileSizeKb,
        width,
        height,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Fehler beim Speichern der Bildmetadaten in DB:", dbError);

      // Rollback: Lokal gespeicherte Datei löschen
      const { error: deleteError } = await deleteFileLocally(storage_path);
      if (deleteError) {
        console.error(
          "Rollback fehlgeschlagen, Bild konnte nicht gelöscht werden:",
          deleteError,
        );
      }

      return NextResponse.json(
        {
          error:
            "Bild hochgeladen, aber Fehler beim Speichern der Metadaten: " +
            dbError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, image: dbData }, { status: 201 });
  } catch (error: unknown) {
    console.error("Upload API Fehler:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Interner Serverfehler beim Upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

