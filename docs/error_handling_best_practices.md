# Error Handling — Best Practices

- Provide consistent API error response format: { error: { code, message, details? } }
- Add global React Error Boundary for rendering-time exceptions
- Centralize logging (console -> sentry/seq) and add metrics for failures
- Fail fast on critical infra errors, but surface user-friendly messages

Minimal-Checklist:
1. API error format defined
2. Global ErrorBoundary added
3. Logging/telemetry configured
