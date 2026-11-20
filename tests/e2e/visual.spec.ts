import { test } from '@playwright/test';

import { routes, themes } from './helpers';

/**
 * Captures reference screenshots for every page type at 375 and 1440 widths
 * in both themes, saved to docs/screenshots/ (used by the README).
 */
test.describe('reference screenshots', () => {
  for (const route of routes) {
    for (const [width, height] of [
      [375, 720],
      [1440, 900],
    ] as const) {
      for (const theme of themes) {
        test(`${route} — ${width}px — ${theme}`, async ({ page }) => {
          await page.setViewportSize({ width, height });
          await page.goto(route);
          await page.evaluate((next) => {
            document.documentElement.dataset.theme = next;
          }, theme);
          await page.evaluate(() => document.fonts.ready);
          // Let scroll-reveal animations finish so content is fully visible.
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(300);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(300);

          const name = route === '/' ? 'home' : route.replace('/', '').replace(/\//g, '-');
          await page.screenshot({
            fullPage: true,
            path: `docs/screenshots/${name}-${width}-${theme}.png`,
          });
        });
      }
    }
  }

  test('404 — 1440px — dark', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/definitely-a-broken-url');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: 'docs/screenshots/404-1440-dark.png' });
  });
});
