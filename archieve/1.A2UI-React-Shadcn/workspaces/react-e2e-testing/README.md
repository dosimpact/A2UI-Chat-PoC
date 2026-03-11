# React E2E Consumer Lane

Minimal React consumer app with Playwright E2E coverage for smoke, action round-trip, and failure fallback states.

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview build output
- `npm run test:e2e` - run Playwright E2E tests

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm run test:e2e
```

## Covered Scenarios

- smoke boot + viewer placeholder render
- action round-trip mock flow (`runMockAction`)
- failure/fallback state visibility when mock flow throws
