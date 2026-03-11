# Next.js E2E Consumer Lane

Minimal Next.js consumer app with Playwright E2E coverage for hydration, route transitions with state persistence, API action round-trip, and fallback/error boundary behavior.

## Scripts

- `npm run dev` - start Next.js dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run test:e2e` - run Playwright E2E tests

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm run test:e2e
```

## Covered Scenarios

- hydration stability on first load
- route transition with surface state persistence policy
- action round-trip via `/api/agent` mock route
- fallback state + error boundary rendering
