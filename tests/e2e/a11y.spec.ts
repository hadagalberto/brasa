import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './base';

import { routes, setTheme, themes } from './helpers';

const allRoutes = [...routes, '/definitely-a-broken-url'] as const;

test.describe('axe accessibility audit', () => {
  for (const route of allRoutes) {
    for (const theme of themes) {
      test(`${route} — ${theme} theme has zero axe violations`, async ({ page }) => {
        // Audit the settled page. Entrance animations fade content in on load;
        // under reduced motion every animation is disabled by design, so axe
        // always samples fully-opaque, final-state colors instead of racing a
        // mid-fade frame. The reduced-motion rendering itself is covered by
        // the dedicated animation specs.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(route);
        await setTheme(page, theme);
        // Give the theme transition (if any) and fonts a beat to settle.
        await page.evaluate(() => document.fonts.ready);

        const results = await new AxeBuilder({ page })
          .include('body')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        const summary = results.violations
          .map((violation) => {
            const targets = violation.nodes
              .map((node) => node.target.join(' '))
              .slice(0, 6)
              .join(', ');
            return `${violation.id}: ${violation.nodes.length} nodes [${targets}]`;
          })
          .join('; ');
        expect(results.violations, `axe violations on ${route} (${theme}): ${summary}`).toEqual([]);
      });
    }
  }
});

test('skip link is the first tab stop and jumps to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const focused = await page.evaluate(() => ({
    href:
      document.activeElement instanceof HTMLAnchorElement
        ? document.activeElement.getAttribute('href')
        : null,
    text: document.activeElement?.textContent,
  }));
  expect(focused.href).toBe('#main');
  expect(focused.text).toContain('Skip to content');

  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('theme toggle icon reflects the opposite theme', async ({ page }) => {
  await page.goto('/');
  const initial = await page.evaluate(() => document.documentElement.dataset.theme);

  const visibleIcon = initial === 'dark' ? '.theme-icon-sun' : '.theme-icon-moon';
  const hiddenIcon = initial === 'dark' ? '.theme-icon-moon' : '.theme-icon-sun';
  await expect(page.locator(visibleIcon)).toBeVisible();
  await expect(page.locator(hiddenIcon)).toBeHidden();

  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator(hiddenIcon)).toBeVisible();
  await expect(page.locator(visibleIcon)).toBeHidden();
});
