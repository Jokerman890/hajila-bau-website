# Aktiver Kontext (Version 0.4.4, Stand 2025-08-17)
- Archon-Projekt für Docs & Assets Management aufgesetzt
- MCP-Server für Archon und Context7 (npm-Doku) in Cursor-Settings konfiguriert
- Automatisierungs-Tooling für Assets und Reporting implementiert
- Admin-Dashboard-Authentifizierung (Supabase) repariert und getestet

# Aktueller Arbeitsfokus
Das Projektmanagement und die operative Wartung wurden durch die Einführung von Archon, Automatisierungsskripten und einem funktionsfähigen Admin-Dashboard auf eine neue Stufe gehoben. Der Fokus liegt nun auf der Nutzung dieser Tools zur Verbesserung der Dokumentations- und Asset-Qualität.

## Kürzliche Änderungen
- **Archon-Integration:** Projekt "Hajila Bau Website – Docs & Assets" (ID: 23b83c74-9052-4969-b04a-f1a872394d65) erstellt. PRP, Guides, Checklisten und operative Tasks angelegt.
- **MCP-Konfiguration:** Cursor-Settings (`cline_mcp_settings.json`) um Archon-Remote und Context7 (für npm-Doku) erweitert.
- **Assets-Scanner:** Skript `scripts/assets-scan.js` implementiert, das Duplikate, verwaiste Dateien und große Bilder findet. Reports werden unter `docs/assets/` generiert.
- **Status-Report:** Skript `scripts/status-report.js` aggregiert KPIs aus dem Assets-Scan und erstellt Monatsberichte (`docs/status/`).
- **CI-Workflow:** GitHub Actions (`.github/workflows/maintenance.yml`) für monatliche, automatische Ausführung von Assets-Scan und Status-Report eingerichtet.
- **Context7 Docs-Diff:** Gerüst (`scripts/context7-docs-diff.js`) zur Erstellung von Snapshots und Diffs von Paket-Dokumentation angelegt.
- **Admin-Dashboard Auth-Fix:** In `src/hooks/useAdminImages.ts` wurde der Supabase Access Token als Bearer-Token in alle API-Anfragen integriert.
- **LoginForm-Erweiterung:** `src/components/LoginForm.tsx` wurde um eine Registrierungsfunktion für neue Test-User erweitert.
- **Browser-Test:** Admin-Dashboard wurde erfolgreich mit einem neu registrierten Test-User aufgerufen; die Bilder-Verwaltung ist nach dem Auth-Fix voll funktionsfähig.

## Nächste Schritte
- Die in Archon angelegten Tasks abarbeiten, insbesondere die Finalisierung der Guides und die Umsetzung der Automatisierungs-Skripte.
- Die `inbox` des Context7-Diff-Workflows mit aktuellen Doku-Snippets befüllen und `npm run docs:diff` ausführen.
- Das Status-Dashboard (`docs/status/dashboard-README.md`) mit Charts und Tabellen implementieren.

## Aktive Entscheidungen und Überlegungen
- Das Projektmanagement läuft ab sofort primär über das Archon-Projekt.
- Die monatlichen Wartungsaufgaben (Assets-Cleanup, Doku-Refresh) sind durch CI teilautomatisiert und werden durch die generierten Reports transparent.
- Die Authentifizierung für das Admin-Dashboard ist nun robust und sichergestellt.
