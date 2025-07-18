# System Patterns - Hajila Bau Webseite

## Systemarchitektur

Die Anwendung ist eine Next.js-Anwendung, die auf React basiert. Sie nutzt Supabase als Backend für Datenbank und Speicher. Die Architektur folgt einem typischen Frontend-Backend-Muster, bei dem das Frontend über APIs und SDKs mit Supabase kommuniziert.

## Wichtige technische Entscheidungen

- **Framework:** Next.js für SSR/SSG und API-Routen.
- **UI-Bibliothek:** Verwendung von Shadcn UI Komponenten (impliziert durch `components.json` und UI-Dateien).
- **State Management:** Wahrscheinlich React Context oder Zustandverwaltungsbibliotheken, falls komplexer.
- **Datenbank:** Supabase für relationale Daten und Dateispeicher.
- **Authentifizierung:** Supabase Auth für Benutzerverwaltung.

## Design Patterns in Verwendung

- **Komponentenbasierte Architektur:** UI-Elemente sind in wiederverwendbare React-Komponenten aufgeteilt.
- **Container/Presentational Components:** Trennung von Logik und Darstellung (impliziert durch die Struktur).
- **API-Abstraktion:** Verwendung von Supabase-Client-Bibliotheken zur Interaktion mit dem Backend.

## Komponentenbeziehungen

- Die `AuthProvider` verwaltet den Supabase-Client und den Authentifizierungsstatus.
- UI-Komponenten interagieren mit Backend-Services über Hooks oder direkte API-Aufrufe.
- Die Speicherbank (Memory Bank) dient als zentrales Repository für Projektkontext und wird von Cline genutzt.

## Kritische Implementierungswege

- **Supabase-Integration:** Korrekte Konfiguration und Authentifizierung des Supabase-Clients (aktuell mit Problemen).
- **Datenfluss:** Sicherstellung, dass Daten korrekt zwischen Frontend und Backend fließen.
- **Fehlerbehandlung:** Robuste Handhabung von API-Fehlern und unerwarteten Daten (z.B. `null.from`, `Cannot read properties of null`).
