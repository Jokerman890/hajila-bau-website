## Architektur — Best Practices (Kurz)

Ziel: Klarheit, Wartbarkeit und eindeutige Verantwortlichkeiten.

- Entscheide dich für eine Deployment-Strategie (SSR vs static) und dokumentiere sie im Repo.
- Trenne Concerns: UI, API, Storage, Auth, Jobs.
- Verwende eine klare Data-Layer-Abstraktion (Repository-Pattern) statt punktueller FS-Aufrufe.
- Konfigurationswerte zentralisieren (env-schema, .env.example, runtime config).
- Dokumentiere Migrationspfade (Storage → Supabase oder Filesystem), inkl. Rollback-Strategie.
- Automatisiere Prüfungen (lint, typecheck, security-scan) in CI.

Minimal-Checklist:

1. Deployment-Ziel entschieden und dokumentiert.
2. Data-Layer-API existiert und ist getestet.
3. Secrets & envs sauber beschrieben und template vorhanden.
4. Migrationsplan für Storage vorhanden.
