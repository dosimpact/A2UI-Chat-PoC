import { expect, test } from '@playwright/test';

test('smoke boot + viewer render placeholder', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'React Consumer Lane' })).toBeVisible();
  await expect(page.getByTestId('viewer-surface')).toHaveText('Viewer placeholder surface');
  await expect(page.getByTestId('status')).toHaveText('Status: idle');
});

test('action round-trip mock flow + renderer', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('chat-input').fill('hello lane');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByTestId('status')).toHaveText('Status: loading');
  await expect(page.getByRole('heading', { name: 'A2UI Surface' })).toBeVisible();
  await expect(page.getByText('Echo surface: hello lane')).toBeVisible();
  await expect(page.getByTestId('status')).toHaveText('Status: idle');

  await page.getByRole('button', { name: 'Refresh' }).click();
  await expect(page.getByText(/Action surface:/)).toBeVisible();
});

test('failure/fallback state visibility', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('chat-input').fill('please fail this');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByTestId('status')).toHaveText('Status: error');
  await expect(page.getByTestId('viewer-surface')).toHaveText('Unable to render surface');
  await expect(page.getByTestId('fallback-message')).toHaveText(
    'Fallback state active: mock flow failed'
  );
});
