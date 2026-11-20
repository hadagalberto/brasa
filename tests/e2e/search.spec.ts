import { expect, test } from './base';

/** Pagefind search dialog: shortcuts, lazy index, keyboard navigation and focus. */

const dialogSelector = 'dialog[data-search-dialog]';

test.describe('search dialog', () => {
  test('Ctrl+K opens the dialog and focuses the input', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.keyboard.press('Control+k');
    const dialog = page.locator(dialogSelector);
    await expect(dialog).toHaveAttribute('open', '');
    await expect(dialog.locator('[data-search-input]')).toBeFocused();
    await expect(dialog).toContainText('Find a guide');
    await expect(page.locator('[data-search-open]').first()).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  test('the slash shortcut opens search outside form fields', async ({ page }) => {
    await page.goto('/docs/installation');
    await page.keyboard.press('/');
    await expect(page.locator(dialogSelector)).toHaveAttribute('open', '');

    await page.keyboard.press('Escape');
    await expect(page.locator(dialogSelector)).not.toHaveAttribute('open');

    await page.keyboard.press('/');
    await expect(page.locator(dialogSelector)).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
  });

  test('the header button opens search and Escape restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const trigger = page.locator('header [data-search-open]').first();
    await trigger.click();

    const dialog = page.locator(dialogSelector);
    await expect(dialog).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open');
    await expect(trigger).toBeFocused();
  });

  test('typing returns real Pagefind results with highlighted excerpts', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.keyboard.press('Control+k');

    const input = page.locator(`${dialogSelector} [data-search-input]`);
    await input.fill('installation');
    const results = page.locator(`${dialogSelector} [data-search-result]`);
    await expect(results.first()).toBeVisible({ timeout: 15_000 });
    expect(await results.count()).toBeGreaterThan(0);
    await expect(page.locator(`${dialogSelector} [data-search-status]`)).toContainText('result');

    const firstHref = await results.first().getAttribute('href');
    expect(firstHref).toMatch(/docs\/installation/);
    // Pagefind emits <mark> highlights around matched terms.
    expect(await results.first().locator('mark').count()).toBeGreaterThan(0);
  });

  test('excerpts contain prose, not raw code, and link to anchored sections', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await page.locator(`${dialogSelector} [data-search-input]`).fill('tokens');

    const results = page.locator(`${dialogSelector} [data-search-result]`);
    await expect(results.first()).toBeVisible({ timeout: 15_000 });
    expect(await results.count()).toBeGreaterThan(0);

    const excerpts = await page
      .locator(`${dialogSelector} .search-result-excerpt`)
      .allTextContents();
    expect(excerpts.length).toBeGreaterThan(0);
    for (const excerpt of excerpts) {
      expect(excerpt).not.toContain('{');
      expect(excerpt).not.toContain('=>');
      expect(excerpt).not.toContain('href:');
      expect(excerpt).not.toContain('@theme');
    }

    // Pagefind computes sub-results from IDs on headings; surface them so a
    // reader jumps straight to the matching section.
    const sections = page.locator(`${dialogSelector} .search-result-section`);
    expect(await sections.count()).toBeGreaterThan(0);
    const href = await sections.first().getAttribute('href');
    expect(href).toContain('#');
  });

  test('arrow keys and Enter navigate results', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await page.locator(`${dialogSelector} [data-search-input]`).fill('design tokens');
    const results = page.locator(`${dialogSelector} [data-search-result]`);
    await expect(results.first()).toBeVisible({ timeout: 15_000 });

    await page.keyboard.press('ArrowDown');
    await expect(results.first()).toBeFocused();
    await expect(results.first()).toHaveAttribute('data-cursor', '');
    await page.keyboard.press('ArrowDown');
    await expect(results.nth(1)).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(results.first()).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/docs\/design-tokens\/?$/);
  });

  test('Tab stays inside the dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.keyboard.press('Control+k');
    const dialog = page.locator(dialogSelector);

    const chips = dialog.locator('.search-chip');
    await expect(chips.first()).toBeVisible();
    await chips.last().focus();
    await page.keyboard.press('Tab');
    await expect(dialog.locator('[data-search-input]')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    const inside = await page.evaluate(() => {
      const element = document.querySelector('dialog[data-search-dialog]');
      return element?.contains(document.activeElement) ?? false;
    });
    expect(inside).toBe(true);
  });

  test('an unknown query produces a useful empty state', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await page.locator(`${dialogSelector} [data-search-input]`).fill('zzxqwvvjkk');
    await expect(page.locator(`${dialogSelector} [data-search-status]`)).toContainText(
      'No results',
      { timeout: 15_000 },
    );
    await expect(page.locator(`${dialogSelector} .search-empty`)).toBeVisible();
  });

  test('the static Pagefind index is served', async ({ page }) => {
    await page.goto('/');
    const response = await page.request.get('/pagefind/pagefind.js');
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('pagefind');
  });

  test('search from the mobile sheet closes the menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto('/');
    await page.locator('[data-menu-toggle]').first().click();
    await expect(page.locator('[data-menu]')).toBeVisible();

    await page.locator('[data-menu] [data-search-open]').click();
    await expect(page.locator('[data-menu]')).toBeHidden();
    await expect(page.locator(dialogSelector)).toHaveAttribute('open', '');
  });
});
