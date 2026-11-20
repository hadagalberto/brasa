import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 720 } });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('opens as a full-screen sheet and moves focus inside', async ({ page }) => {
  const trigger = page.locator('[data-menu-toggle]').first();
  await trigger.click();

  await expect(page.locator('html')).toHaveAttribute('data-menu-open', '');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const sheet = page.locator('[data-menu]');
  await expect(sheet).toBeVisible();

  const focusInside = await page.evaluate(() => {
    const container = document.querySelector('[data-menu]');
    return container instanceof HTMLElement && container.contains(document.activeElement);
  });
  expect(focusInside).toBe(true);
});

test('traps Tab focus within the sheet and wraps at the edges', async ({ page }) => {
  await page.locator('[data-menu-toggle]').first().click();
  await page.locator('[data-menu] a').first().waitFor();

  const sheet = page.locator('[data-menu]');
  for (let i = 0; i < 20; i += 1) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
      const container = document.querySelector('[data-menu]');
      return container instanceof HTMLElement && container.contains(document.activeElement);
    });
    expect(inside, `Tab press ${i} should stay inside the sheet`).toBe(true);
  }

  // Shift+Tab from the first focusable wraps to the last.
  const first = sheet.locator('a[href], button').first();
  await first.focus();
  await page.keyboard.press('Shift+Tab');
  const active = await page.evaluate(() => {
    const container = document.querySelector('[data-menu]');
    const focusables = container?.querySelectorAll('a[href], button:not([disabled])');
    return focusables && focusables.length > 0
      ? document.activeElement === focusables[focusables.length - 1]
      : false;
  });
  expect(active).toBe(true);
});

test('Escape closes the sheet and returns focus to the trigger', async ({ page }) => {
  const trigger = page.locator('[data-menu-toggle]').first();
  await trigger.click();
  await page.locator('[data-menu] a').first().waitFor();

  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveAttribute('data-menu-open', '');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(
    await page.evaluate(
      () => document.activeElement === document.querySelector('[data-menu-toggle]'),
    ),
  ).toBe(true);
});

test('locks page scroll while open', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.locator('[data-menu-toggle]').first().click();
  await page.locator('[data-menu] a').first().waitFor();

  const overflow = await page.evaluate(() => getComputedStyle(document.documentElement).overflow);
  expect(overflow).toBe('hidden');
});

test('following a sheet link closes the sheet and navigates', async ({ page }) => {
  await page.locator('[data-menu-toggle]').first().click();
  await page.locator('[data-menu] a', { hasText: 'Styleguide' }).click();

  await expect(page.locator('html')).not.toHaveAttribute('data-menu-open', '');
  await expect(page.locator('h1')).toContainText('Every token');
});

test('the sheet is hidden on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('[data-menu-toggle]').first()).toBeHidden();
});
