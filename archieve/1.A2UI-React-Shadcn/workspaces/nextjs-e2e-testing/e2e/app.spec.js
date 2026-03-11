const { test, expect } = require('@playwright/test');

test('hydration stability', async ({ page }) => {
  const hydrationIssues = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration/i.test(message.text())) {
      hydrationIssues.push(message.text());
    }
  });

  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Next.js Consumer Lane', level: 1 })
  ).toBeVisible();
  await expect(page.getByTestId('viewer-surface')).toHaveText('Viewer placeholder surface');
  await expect(page.getByTestId('hydration-status')).toHaveText('hydrated');
  expect(hydrationIssues).toEqual([]);
});

test('route transition + surface state persistence policy', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('chat-input').fill('persist this value');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByText('Echo surface: persist this value')).toBeVisible();

  await page.getByRole('link', { name: 'Details' }).click();

  await expect(page).toHaveURL(/\/details$/);
  await expect(page.getByTestId('details-viewer')).toHaveText('Echo surface: persist this value');
  await expect(page.getByTestId('details-policy')).toContainText('persists');

  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('viewer-surface')).toHaveText('Echo surface: persist this value');
});

test('action round-trip via API route mock', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('chat-input').fill('round trip');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByTestId('status')).toHaveText('Status: loading');
  await expect(page.getByText('Echo surface: round trip')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
  await page.getByRole('button', { name: 'Refresh' }).click();
  await expect(page.getByText(/Action surface:/)).toBeVisible();
  await expect(page.getByTestId('status')).toHaveText('Status: idle');
});

test('fallback + error boundary behavior', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('chat-input').fill('please fail here');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByTestId('status')).toHaveText('Status: error');
  await expect(page.getByTestId('viewer-surface')).toHaveText('Unable to render surface');
  await expect(page.getByTestId('fallback-message')).toHaveText('Fallback active: mock api failure');

  await page.goto('/crash?mode=throw');
  await expect(page.getByTestId('error-boundary-message')).toContainText(
    'Error boundary fallback: intentional crash for boundary verification'
  );
});
