export const translations = {
  de: {
    // Header
    title: "Karussell Admin",
    subtitle: "Verwalten Sie Ihre Referenzbilder für das Karussell",
    addImages: "Bilder hinzufügen",
    
    // Stats
    totalImages: "Bilder gesamt",
    activeImages: "Aktive Bilder",
    storageUsed: "Speicher verwendet",
    availableSlots: "Verfügbare Plätze",
    
    // Tabs
    gallery: "Galerie",
    upload: "Upload",
    preview: "Vorschau",
    
    // Upload Zone
    uploadTitle: "Referenzbilder hochladen",
    uploadDescription: "Bilder hier hineinziehen oder klicken zum Auswählen",
    maxImages: "Maximal",
    images: "Bilder",
    supportedFormats: "Unterstützte Formate: JPEG, PNG, WebP",
    maxFileSize: "Maximale Dateigröße:",
    
    // Image Card
    active: "Aktiv",
    inactive: "Inaktiv",
    title_label: "Titel",
    description_label: "Beschreibung",
    altText: "Alt-Text",
    save: "Speichern",
    cancel: "Abbrechen",
    order: "Reihenfolge:",
    activate: "Aktivieren",
    deactivate: "Deaktivieren",
    
    // Gallery
    activeImagesTitle: "Aktive Bilder",
    inactiveImagesTitle: "Inaktive Bilder",
    visibleInCarousel: "Im Karussell sichtbar",
    hiddenFromCarousel: "Im Karussell versteckt",
    
    // Preview Modal
    dimensions: "Abmessungen:",
    fileSize: "Dateigröße:",
    uploadDate: "Upload-Datum:",
    status: "Status:",
    description: "Beschreibung:",
    
    // Empty State
    noImagesTitle: "Keine Bilder hochgeladen",
    noImagesDescription: "Beginnen Sie mit dem Aufbau Ihres Karussells, indem Sie Referenzbilder hochladen.",
    uploadImagesButton: "Bilder hochladen",
    
    // Preview Section
    carouselPreviewTitle: "Karussell-Vorschau",
    carouselPreviewDescription: "So werden Ihre aktiven Bilder im Karussell angezeigt",
    noActiveImagesPreview: "Keine aktiven Bilder für die Vorschau. Aktivieren Sie einige Bilder, um sie hier zu sehen.",
    
    // Alerts
    uploadSuccess: "Bilder erfolgreich hochgeladen!",
    errorLoading: "Fehler beim Laden der Dashboard-Daten. Bitte versuchen Sie es erneut.",
    retryButton: "Erneut versuchen",
    deleteConfirm: "Sind Sie sicher, dass Sie dieses Bild löschen möchten?",
    uploading: "Hochladen...",
    uploadingDescription: "Bitte warten...",
    dismiss: "Schließen",
    
    // Language
    language: "Sprache",
    german: "Deutsch",
    serbian: "Srpski"
  },
  sr: {
    // Header
    title: "Karusel Admin",
    subtitle: "Upravljajte vašim referentnim slikama za karusel",
    addImages: "Dodaj slike",
    
    // Stats
    totalImages: "Ukupno slika",
    activeImages: "Aktivne slike",
    storageUsed: "Iskorišćen prostor",
    availableSlots: "Dostupna mesta",
    
    // Tabs
    gallery: "Galerija",
    upload: "Otpremi",
    preview: "Pregled",
    
    // Upload Zone
    uploadTitle: "Otpremi referentne slike",
    uploadDescription: "Prevucite slike ovde ili kliknite da odaberete",
    maxImages: "Maksimalno",
    images: "slika",
    supportedFormats: "Podržani formati: JPEG, PNG, WebP",
    maxFileSize: "Maksimalna veličina fajla:",
    
    // Image Card
    active: "Aktivna",
    inactive: "Neaktivna",
    title_label: "Naslov",
    description_label: "Opis",
    altText: "Alt tekst",
    save: "Sačuvaj",
    cancel: "Otkaži",
    order: "Redosled:",
    activate: "Aktiviraj",
    deactivate: "Deaktiviraj",
    
    // Gallery
    activeImagesTitle: "Aktivne slike",
    inactiveImagesTitle: "Neaktivne slike",
    visibleInCarousel: "Vidljivo u karuselu",
    hiddenFromCarousel: "Skriveno iz karusela",
    
    // Preview Modal
    dimensions: "Dimenzije:",
    fileSize: "Veličina fajla:",
    uploadDate: "Datum otpremanja:",
    status: "Status:",
    description: "Opis:",
    
    // Empty State
    noImagesTitle: "Nema otpremljenih slika",
    noImagesDescription: "Počnite sa izgradnjom vašeg karusela otpremanjem referentnih slika.",
    uploadImagesButton: "Otpremi slike",
    
    // Preview Section
    carouselPreviewTitle: "Pregled karusela",
    carouselPreviewDescription: "Ovako će vaše aktivne slike biti prikazane u karuselu",
    noActiveImagesPreview: "Nema aktivnih slika za pregled. Aktivirajte neke slike da biste ih videli ovde.",
    
    // Alerts
    uploadSuccess: "Slike su uspešno otpremljene!",
    errorLoading: "Greška pri učitavanju podataka. Molimo pokušajte ponovo.",
    retryButton: "Pokušaj ponovo",
    deleteConfirm: "Da li ste sigurni da želite da obrišete ovu sliku?",
    uploading: "Otpremanje...",
    uploadingDescription: "Molimo sačekajte...",
    dismiss: "Zatvori",
    
    // Language
    language: "Jezik",
    german: "Nemački",
    serbian: "Srpski"
  }
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.de
