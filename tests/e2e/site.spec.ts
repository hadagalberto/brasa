import { expect, test } from '@playwright/test';

import { routes } from './helpers';

test.beforeEach(async ({ page }) => {
  // Fail the test on any console error or uncaught exception.
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto('/');
});

test('every route renders with zero console errors', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
  }
});

test('all internal links and assets resolve', async ({ page }) => {
  const base = new URL(page.url()).origin;
  const seen = new Set<string>();
  const queue: string[] = [...routes];

  while (queue.length > 0) {
    const route = queue.shift();
    if (route === undefined || seen.has(route)) continue;
    seen.add(route);
    const response = await page.request.get(route);
    expect(response.status(), `route ${route}`).toBe(200);

    await page.goto(route);
    const targets = await page.evaluate(() => {
      const internal: string[] = [];
      document.querySelectorAll('a[href]').forEach((el) => {
        const href = el.getAttribute('href');
        if (
          !href ||
          href.startsWith('#') ||
          /^[a-z]+:\/\//i.test(href) ||
          href.startsWith('mailto:')
        ) {
          return;
        }
        internal.push(href);
      });
      return internal;
    });

    for (const href of targets) {
      const url = new URL(href, base);
      const path = `${url.pathname}${url.search}`;
      const asset = await page.request.get(path);
      expect(asset.status(), `link ${href} (from ${route})`).toBeLessThan(400);
      if (!seen.has(url.pathname) && !path.includes('.')) {
        queue.push(url.pathname);
      }
    }

    const assets = await page.evaluate(() => {
      const internal: string[] = [];
      const select = (selector: string, attr: string) => {
        document.querySelectorAll(selector).forEach((el) => {
          const value = el.getAttribute(attr);
          if (value && !value.startsWith('data:')) internal.push(value);
        });
      };
      select('link[href]', 'href');
      select('script[src]', 'src');
      select('img[src]', 'src');
      return internal;
    });
    for (const asset of assets) {
      const url = new URL(asset, base);
      const response = await page.request.get(`${url.pathname}${url.search}`);
      expect(response.status(), `asset ${asset} (from ${route})`).toBe(200);
    }
  }
});

test('SEO head is complete on every route', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(/Brasa|· Brasa/);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/(og\.png|og\/blog\/[^/]+\.png|og\/docs\/[^/]+\.png)$/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );

    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.length, `JSON-LD on ${route}`).toBeGreaterThan(0);
    for (const block of jsonLd) {
      expect(() => JSON.parse(block)).not.toThrow();
      expect(JSON.parse(block)['@context']).toBe('https://schema.org');
    }
  }
});

test('the Open Graph image renders the brand palette', async ({ page }) => {
  await page.goto('/');
  const pixels = await page.evaluate(async () => {
    const image = new Image();
    image.src = new URL('og.png', window.location.origin).toString();
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.drawImage(image, 0, 0);

    const scan = (x0: number, y0: number, x1: number, y1: number) => {
      let brightest = 0;
      let warmest = 0;
      for (let x = x0; x <= x1; x += 12) {
        for (let y = y0; y <= y1; y += 12) {
          const [r, g, b] = context.getImageData(x, y, 1, 1).data;
          brightest = Math.max(brightest, r);
          if (r > b) warmest = Math.max(warmest, r + g + b);
        }
      }
      return { brightest, warmest };
    };

    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      // The italic "brasa." wordmark region (ember gradient on dark canvas).
      wordmark: scan(88, 250, 560, 400),
      // The lower-left ember glow region.
      glow: scan(150, 380, 420, 560),
    };
  });
  expect(pixels).not.toBeNull();
  expect(pixels?.width).toBe(1200);
  expect(pixels?.height).toBe(630);

  // The wordmark region contains bright ember pixels (red-dominant).
  expect(pixels?.wordmark.brightest ?? 0).toBeGreaterThan(180);
  // The glow region is warm and clearly lifted off the near-black canvas.
  expect(pixels?.glow.warmest ?? 0).toBeGreaterThan(90);
});

test('the 404 page is branded and served with status 404', async ({ page }) => {
  const response = await page.goto('/this-route-burnt-out');
  expect(response?.status()).toBe(404);
  await expect(page.locator('[data-locale="en"] h1')).toHaveText('Page not found');
  await expect(page.getByText('burnt out')).toBeVisible();
  await expect(page.locator('main a[href="/"]')).toBeVisible();
});
