# State Management — Best Practices

- Keep state minimal in components; lift state up when needed.
- For app-wide state consider Zustand (small) or Redux Toolkit (robust).
- Keep side-effects outside components (use hooks like useEffect/useMutation).
- Centralize auth/session handling in `src/lib/auth` and expose small hooks.

Minimal-Checklist:
1. Decision: Zustand vs Redux
2. Implement auth/session store
3. Migrate image upload state to central store
