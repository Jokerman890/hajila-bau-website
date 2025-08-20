## Archon / MCP — Dokumentation & Follow-ups

Zweck: Kurzleitfaden und Aufgabenliste, damit die erzeugte Doku, der Dashboard-Generator und CI-Fixes nicht verloren gehen und in Archon/PR-Workflow nachverfolgbar sind.

- PR: `#36` — docs: add best-practice docs + dashboard generator

## Archon / MCP — Dokumentation & Follow-ups

Zweck: Kurzleitfaden und Aufgabenliste, damit die erzeugte Doku, der Dashboard-Generator und CI-Fixes nicht verloren gehen und in Archon/PR-Workflow nachverfolgbar sind.

- PR: `#36` — docs: add best-practice docs + dashboard generator

Aufgaben (Checkliste)

1. Dokumentation pflegen (Owner: @Jokerman890)
   - Welche Doku: `docs/status/dashboard-README.md`, `docs/*_best_practices.md`.
   - Wann: bei jedem Release oder monatlich nach Dashboard-Run.
   - Erfolgskriterium: README enthält Erklärungen zur Quelle der KPIs und zur Ausführungsanleitung des Generators.

2. Archon/MCP-Eintrag aktualisieren
   - Füge die `scripts/generate-dashboard.cjs` als Archon-Tool-Eintrag in der Projektübersicht hinzu.
   - Gib Startkommando und Beispieldaten an (z.B. `npm run generate:dashboard`).

3. CI/PR-Watch (Owner: DevOps)
   - Beobachte PR-Checks: Jest (ubuntu/windows/node18/20) und Vercel-Deployment.
   - Wenn Tests fehlschlagen: Sammle Logs, öffne gezielten Fix-PR mit reproduzierbarem Test-Case.
   - Security-Comment: `.github/workflows/pr-checks.yml` braucht ein `permissions:`-Block (z. B. `permissions: read` minimal).

4. Lint/Typescript-Follow-up (Owner: Frontend-Team)
   - Re-enable `parserOptions.project` und strengere `@typescript-eslint`-Regeln schrittweise.
   - Erstelle eine Liste der verbleibenden type-aware Fehler und priorisiere nach Kritikalität.

5. Dashboard-Betrieb
   - Run-Intervall: Manuell / monatlich (oder CI-scheduled job, wenn benötigt).
   - Ausgabe prüfen: `docs/status/images/*.svg` und `docs/status/dashboard-README.md` werden committed.
   - Verantwortlich für Daten-Qualität: Data-Owner (benennen) — verifiziere Datenquellen und CSV-Schema.

6. Review & Merge
   - Setze Reviewer für PR #36 (Frontend, Docs, DevOps).
   - Nach grünem CI: Merge und evtl. Release-Notiz: "Add status dashboard and best-practice docs".

Kurz-Anleitungen

-- Lokaler Generator (Beispiel):

  1. node v18+ benutzen
  2. `npm ci`
  3. `npm run generate:dashboard`
  4. Output prüfen: `docs/status/dashboard-README.md`, `docs/status/images/`

CI/Status-Update (aktuell)

- Vercel Build schlug fehl wegen ERESOLVE (peer dependency conflict zwischen `@typescript-eslint`-Versionen).
- Aktion: `package.json` angepasst (downgrade `@typescript-eslint/eslint-plugin` zu v6) und `package-lock.json` lokal neu generiert. Änderungen wurden in Branch `feature/supabase-auth` gepusht (Commit 8123fd0).
- Folge: Lokale Tests laufen grün; nun Vercel-Deploy prüfen (neues Deploy oder `.npmrc`-Workaround).

CI-Fix: Workflow-Status

- Hinweis: Die Workflow-Datei `.github/workflows/pr-checks.yml` enthält bereits einen `permissions:` Block (contents: read, actions: read). Kein PR für `permissions` nötig.


Nächste Schritte (empfohlen)

1. Logs prüfen: Ich kann die vollständigen GitHub Actions-Logs und Vercel-Logs sammeln und analysieren, um verbleibende CI-Fehler exakt zu lokalisieren.
2. Workflow-Fix: Ich kann einen PR öffnen, der nur den `permissions`-Block ergänzt (klein, schnell, höchstwahrscheinlich sicher).
3. Optional: Kurzfristiger Vercel-Workaround: `.npmrc` mit `legacy-peer-deps=true` committen, falls sofortiges Redeploy nötig ist.

Wenn du möchtest, führe ich sofort Option 1 (Logs holen & analysieren) und Option 2 (permissions-PR öffnen) aus.
