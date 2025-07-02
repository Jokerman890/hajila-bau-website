# Rules - Hajila Bau Webseite

## Regel 1: Versionsaktualisierung und GitHub-Commit
Bei jeder Aufgabe, die Änderungen am Code oder an der Webseite mit sich bringt, müssen folgende Schritte durchgeführt werden, bevor die Aufgabe als abgeschlossen betrachtet wird:

1. **Versionsaktualisierung**: Die Versionsnummer in der Datei `version-info.tsx` muss aktualisiert werden, um die Änderungen nachzuverfolgen. Die Versionsnummer soll im Format `MAJOR.MINOR.PATCH` erhöht werden, abhängig von der Art der Änderung (z.B. PATCH für kleinere Fehlerbehebungen, MINOR für neue Funktionen, MAJOR für umfassende Änderungen).
2. **GitHub-Commit**: Alle Änderungen müssen in einem GitHub-Commit dokumentiert werden. Die Commit-Nachricht soll klar und präzise sein und die Art der Änderungen beschreiben (z.B. "Fix Linter errors in premium-website.tsx" oder "Update version to 1.0.1 after bugfix").

Diese Regel stellt sicher, dass alle Änderungen nachvollziehbar sind und die Versionskontrolle sowie die Dokumentation stets aktuell bleiben.

---

## Regel 2: Next.js & TypeScript Best Practices
- Für interne Navigation immer `<Link />` aus `next/link` statt `<a>` verwenden.
- Alle Bilder mit `<Image />` aus `next/image` und sinnvollem `alt`-Attribut einbinden.
- Keine unbenutzten Variablen oder Imports im Code lassen.
- Keine `any`-Typen verwenden, sondern immer möglichst spezifische Typen.
- Leere Interfaces vermeiden, stattdessen `object` oder `unknown` nutzen.
- Bei Komponenten, die mit `memo` oder als anonyme Funktion exportiert werden, immer `displayName` setzen.
- Für Variablen, die nicht neu zugewiesen werden, immer `const` statt `let` verwenden.
- Alle Linter- und TypeScript-Fehler vor jedem Commit beheben.
- Vor jedem Deployment: `npm run build` und Linter ausführen, bis keine Fehler mehr auftreten.

---

## Regel 3: Barrierefreiheit & SEO
- Alle interaktiven Elemente (Buttons, Links) müssen zugänglich und mit ARIA-Labels oder sinnvollen Texten versehen sein.
- Bilder und Grafiken immer mit beschreibenden `alt`-Attributen versehen.
- Überschriftenstruktur (`h1`, `h2`, ...) logisch und semantisch korrekt aufbauen.

---

## Regel 4: Dokumentation & Nachvollziehbarkeit
- Jede größere Änderung oder neue Komponente muss im Projekt dokumentiert werden (README oder eigene Doku-Datei).
- Bei komplexen Komponenten oder Workflows kurze Kommentare im Code hinterlassen.
