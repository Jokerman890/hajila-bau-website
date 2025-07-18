# Tech Context - Hajila Bau Webseite

## Verwendete Technologien

- **Frontend:** Next.js, React, TypeScript, Shadcn UI (vermutlich für UI-Komponenten)
- **Backend:** Supabase (PostgreSQL-Datenbank, Supabase Storage, Supabase Auth)
- **Entwicklungsumgebung:** Node.js (Version 22.14.0), VS Code, Git
- **Build-Tools:** npm (oder Yarn/pnpm, basierend auf `package.json` und `package-lock.json`)
- **Linting/Formatting:** ESLint, Prettier (konfiguriert in `.prettierrc`)
- **Testing:** Jest (konfiguriert in `jest.config.js` und `jest.setup.js`)

## Entwicklungseinrichtung

- Projekt wird lokal mit Node.js ausgeführt.
- Supabase-Verbindung wird über Umgebungsvariablen (`.env.local`) konfiguriert.
- MCP-Server sind über `cline_mcp_settings.json` konfiguriert.

## Technische Einschränkungen

- **Verzeichnisbeschränkungen:** Keine Möglichkeit, in Unterverzeichnisse zu wechseln (`cd`), was die Handhabung von Submodulen erschwert.
- **MCP-Autorisierung:** Anhaltende Probleme mit der Supabase-MCP-Server-Autorisierung, die Datenbankoperationen blockieren.

## Abhängigkeiten

- Projekt nutzt diverse npm-Pakete, die in `package.json` und `package-lock.json` aufgeführt sind.
- Spezifische Abhängigkeiten wie `buffer` wurden hinzugefügt und Webpack-Konfigurationen angepasst.

## Werkzeugnutzungsmuster

- **Cline Tools:** `read_file`, `write_to_file`, `execute_command`, `ask_followup_question`, `web_fetch`, `use_mcp_tool`.
- **Git:** Wird für Versionskontrolle verwendet, mit Einschränkungen bei Submodulen.
- **Supabase CLI/MCP:** Wird für Datenbankinteraktionen benötigt, aber durch Autorisierungsprobleme blockiert.
