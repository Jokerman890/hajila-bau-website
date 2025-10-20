# Accessibility & Navigation Update – 2025-02-15

## Überblick
- Ergänzung eines globalen Skip-Links für schnellere Tastaturnavigation.
- Verbesserte Desktop-Navigation mit fokussierbaren Dropdowns und korrekten ARIA-Attributen.
- Entfernung redundanter Typdefinitionen für klareren Code.

## Details
### Skip-Link
- Globale CSS-Hilfsklasse `.skip-link` erstellt, um den Link außerhalb des Sichtbereichs zu verstecken und bei Tastaturfokus sichtbar zu machen.
- Skip-Link in `src/app/layout.tsx` eingebunden, der direkt zum Hauptinhalt `#main-content` führt.

### Navigation
- Desktop-Navigation nutzt jetzt Fokus- und Mausereignisse, um Dropdowns zu öffnen und zu schließen.
- `aria-expanded`, `aria-controls` und Rollenattribute (`role="menu"`, `role="menuitem"`) verbessern Screenreader-Unterstützung.
- Escape-Taste schließt offene Dropdowns und gibt den Fokus zurück auf den Trigger.

### Codequalität
- Doppelte Schnittstellendefinition `CarouselImageFileEntry` entfernt, um TypeScript-Warnungen zu vermeiden.

## Nächste Schritte
- Optional: Automatisierte Accessibility-Checks (z. B. mit Axe) in den CI-Workflow integrieren.
