# Deployment — Best Practices

Ziel: Eindeutige, reproduzierbare Deployments.

- Wähle Ziel: Vercel (SSR) oder GitHub Pages (static). Kein Dual-Mode ohne klaren Grund.
- CI: build -> test -> publish; separate jobs für preview und production.
- Environment Promotion: dev -> staging -> production mit konfigurierbaren Variablen.
- Healthchecks und Rollback: kurzzeitige Rollback-Schritte dokumentieren.

Minimal-Checklist:
1. CI Job für preview builds
2. Production build job mit secrets aus sicherem Store
3. Rollback-Dokumentation
