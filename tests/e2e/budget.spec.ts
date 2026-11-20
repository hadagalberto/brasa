import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

import { routes } from './helpers';

const BUDGET_BYTES = 20 * 1024;

test.describe('JavaScript budget', () => {
  for (const route of routes) {
    test(`${route} ships less than 20 KB of gzipped JavaScript`, async ({ page }) => {
      await page.goto(route);

      const scripts = await page.evaluate(() => {
        const inline: string[] = [];
        document.querySelectorAll('script:not([type="application/ld+json"])').forEach((el) => {
          const src = el.getAttribute('src');
          if (src) {
            inline.push(`__src__:${src}`);
          } else {
            inline.push(el.textContent ?? '');
          }
        });
        return inline;
      });

      const external: string[] = [];
      const inlineText: string[] = [];
      for (const script of scripts) {
        if (script.startsWith('__src__:')) {
          const src = script.slice('__src__:'.length);
          const response = await page.request.get(src);
          expect(response.status(), `script ${src}`).toBe(200);
          external.push(await response.text());
        } else {
          inlineText.push(script);
        }
      }

      const total = [...inlineText, ...external].reduce(
        (sum, code) => sum + gzipSync(Buffer.from(code, 'utf8')).length,
        0,
      );

      expect(total, `gzipped JS on ${route}`).toBeLessThan(BUDGET_BYTES);
    });
  }
});
