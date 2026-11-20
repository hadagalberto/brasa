import { expect, test } from '@playwright/test';

import { toggleTheme } from './helpers';

test('applies the stored theme before first paint (no flash)', async ({ page }) => {
  // Toggle once, then reload: the inline head script must reapply immediately.
  await page.goto('/');
  const initial = await page.evaluate(() => document.documentElement.dataset.theme);
  await toggleTheme(page);
  const flipped = initial === 'dark' ? 'light' : 'dark';
  await expect(page.locator('html')).toHaveAttribute('data-theme', flipped);

  await page.reload({ waitUntil: 'domcontentloaded' });
  const applied = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(applied).toBe(flipped);
});

test('falls back to the system preference on first visit', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  await context.close();
});

test('defaults to dark when the system prefers dark', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  await context.close();
});

test('the toggle persists and survives client-side navigation', async ({ page }) => {
  await page.goto('/');
  const initial = await page.evaluate(() => document.documentElement.dataset.theme);

  await toggleTheme(page);
  const flipped = initial === 'dark' ? 'light' : 'dark';
  await expect(page.locator('html')).toHaveAttribute('data-theme', flipped);

  // Soft navigation via the header nav (View Transitions keep the theme).
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Docs' }).click();
  await expect(page.locator('h1')).toContainText('yours');
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(flipped);

  const stored = await page.evaluate(() => localStorage.getItem('brasa:theme'));
  expect(stored).toBe(flipped);
});

test('the theme-color meta stays in sync with the active theme', async ({ page }) => {
  await page.goto('/');
  const initial = await page.evaluate(() => document.documentElement.dataset.theme);
  const meta = page.locator('meta[name="theme-color"]');

  await expect(meta).toHaveAttribute('content', initial === 'dark' ? '#120c09' : '#fcf8f1');
  await toggleTheme(page);
  await expect(meta).toHaveAttribute('content', initial === 'dark' ? '#fcf8f1' : '#120c09');
});
