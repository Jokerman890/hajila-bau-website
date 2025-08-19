# Testing — Best Practices (Kurz)

Ziel: Zuverlässige Tests auf mehreren Ebenen.

- Unit Tests: Jest + ts-jest; Mocken von externen APIs.
- Integration Tests: Testen der API-Routen (Supertest), Datenbank-Mocks.
- E2E: Playwright/Chromium für kritische Benutzerflüsse.
- Coverage-Gate: Mindestens 80% für kritische Module.
- CI: Tests in PR-Pipeline, neben lint und build.

Minimal-Checklist:

1. Setup: jest, ts-jest, @testing-library/react
2. 5 Unit Tests für Kernfunktionen
3. 2 Integration Tests für API-Routen
4. 1 E2E-Flow in Playwright (Upload → List → Delete)
