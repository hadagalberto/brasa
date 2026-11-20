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
          // Full-page screenshots freeze the viewport, which would leave
          // offscreen scroll-reveal elements at opacity 0. Pin every reveal to
          // its final state with `data-capture`; reduced motion is belt-and-
          // braces and gives the same visible result for real users.
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.goto(route);
          await page.evaluate((next) => {
            document.documentElement.dataset.theme = next;
            document.documentElement.setAttribute('data-capture', '');
          }, theme);
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(150);

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
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/definitely-a-broken-url');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-capture', '');
      return document.fonts.ready;
    });
    await page.screenshot({ path: 'docs/screenshots/404-1440-dark.png' });
  });
});
