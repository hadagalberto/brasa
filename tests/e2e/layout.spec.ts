import { expect, test } from '@playwright/test';

import { expectNoHorizontalOverflow, routes, themes } from './helpers';

const viewports = [375, 768, 1440] as const;

test.describe('layout invariants (the visual contract)', () => {
  for (const route of routes) {
    for (const width of viewports) {
      test(`${route} at ${width}px has no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width, height: width === 375 ? 720 : 900 });
        await page.goto(route);
        await expectNoHorizontalOverflow(page);
      });
    }
  }

  for (const route of routes) {
    for (const theme of themes) {
      test(`${route} in ${theme} theme has no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(route);
        await page.evaluate((next) => {
          document.documentElement.dataset.theme = next;
        }, theme);
        await expectNoHorizontalOverflow(page);
      });
    }
  }

  test('self-hosted variable fonts are active', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate(() => ({
      display: document.fonts.check('16px "Fraunces Variable"'),
      displayItalic: document.fonts.check('italic 16px "Fraunces Variable"'),
      sans: document.fonts.check('16px "Geist Variable"'),
      mono: document.fonts.check('16px "Geist Mono Variable"'),
    }));
    expect(loaded).toEqual({ display: true, displayItalic: true, sans: true, mono: true });
  });

  test('the display fonts are preloaded', async ({ page }) => {
    await page.goto('/');
    const preloads = await page
      .locator('link[rel="preload"][as="font"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    expect(preloads.length).toBe(3);
    expect(preloads.every((href) => href.includes('.woff2'))).toBe(true);
    for (const href of preloads) {
      const response = await page.request.get(href);
      expect(response.status()).toBe(200);
    }
  });

  test('hero headline grows fluid with the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const large = await page.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.querySelector('h1') ?? document.body).fontSize),
    );

    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto('/');
    const small = await page.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.querySelector('h1') ?? document.body).fontSize),
    );

    expect(large).toBeGreaterThan(110);
    expect(small).toBeGreaterThan(40);
    expect(small).toBeLessThan(large);
  });

  test('hero uses the ember gradient on the italic display word', async ({ page }) => {
    await page.goto('/');
    const em = page.locator('h1 em');
    await expect(em).toBeVisible();
    const backgroundImage = await em.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(backgroundImage).toContain('linear-gradient');
    const clip = await em.evaluate((el) => getComputedStyle(el).backgroundClip);
    expect(clip).toBe('text');
  });

  test('the sticky header turns translucent after scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/styleguide');

    const before = await page.evaluate(() => {
      const header = document.querySelector('[data-header]');
      return {
        position: header ? getComputedStyle(header).position : null,
        scrolled: header?.hasAttribute('data-scrolled') ?? null,
        blur: header ? getComputedStyle(header, '::before').backdropFilter : null,
      };
    });
    expect(before.position).toBe('sticky');
    expect(before.scrolled).toBe(false);

    await page.evaluate(() => window.scrollTo(0, 240));
    await page.waitForTimeout(100);

    const after = await page.evaluate(() => {
      const header = document.querySelector('[data-header]');
      return {
        scrolled: header?.hasAttribute('data-scrolled') ?? null,
        blur: header ? getComputedStyle(header, '::before').backdropFilter : null,
      };
    });
    expect(after.scrolled).toBe(true);
    expect(String(after.blur)).toContain('blur');
  });

  test('spotlight cards track the cursor with custom properties', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/styleguide');
    const card = page.locator('[data-spotlight]').first();
    await card.waitFor();
    await card.scrollIntoViewIfNeeded();

    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move((box?.x ?? 0) + 20, (box?.y ?? 0) + 20);

    const vars = await card.evaluate((el) => ({
      x: el.style.getPropertyValue('--sp-x'),
      y: el.style.getPropertyValue('--sp-y'),
    }));
    expect(vars.x).toBe('20px');
    expect(vars.y).toBe('20px');
  });

  test('code blocks follow the site theme', async ({ page }) => {
    await page.goto('/styleguide');
    const code = page.locator('.expressive-code pre').first();
    await code.waitFor();

    const darkBg = await code.evaluate((el) => getComputedStyle(el).backgroundColor);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
    });
    const lightBg = await code.evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(darkBg).not.toBe(lightBg);
    expect(darkBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(lightBg).not.toBe('rgba(0, 0, 0, 0)');

    // Expressive Code ships a working copy button.
    const copy = page.locator('.expressive-code .copy button').first();
    await expect(copy).toBeAttached();
    await expect(copy).toHaveAttribute('title', 'Copy to clipboard');
  });

  test('the hue slider re-themes the live page', async ({ page }) => {
    await page.goto('/styleguide');
    const slider = page.locator('[data-hue-slider]');
    await slider.waitFor();

    await slider.evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        el.value = '130';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    const hue = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--accent-hue'),
    );
    expect(hue).toBe('130');

    const output = await page.locator('[data-hue-value]').textContent();
    expect(output?.trim()).toBe('130');

    // The semantic accent token re-derives from the new hue.
    const token = await page.locator('[data-token="--accent"]').first().textContent();
    expect(token).toContain('130');
  });

  test('keyboard focus shows the ember ring', async ({ page }) => {
    await page.goto('/');
    await page.mouse.click(8, 300); // focus the body, not an element
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');

    const ring = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active) return null;
      const style = getComputedStyle(active);
      return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
    });
    expect(ring?.outlineStyle).toBe('solid');
    expect(Number.parseFloat(ring?.outlineWidth ?? '0')).toBeGreaterThanOrEqual(2);
  });

  test('reduced motion disables scroll-reveal animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/styleguide');

    const reduced = await page.evaluate(() => {
      const el = document.querySelector('.reveal');
      return el ? getComputedStyle(el).animationName : null;
    });
    expect(reduced).toBe('none');

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/styleguide');
    const animated = await page.evaluate(() => {
      const el = document.querySelector('.reveal');
      return el ? getComputedStyle(el).animationName : null;
    });
    expect(animated).toContain('reveal');
  });

  test('the pointer glow reacts to the mouse on the home hero', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const glow = page.locator('[data-glow]').first();
    const box = await glow.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.move((box?.x ?? 0) + 300, (box?.y ?? 0) + 200);
    const vars = await glow.evaluate((el) => ({
      x: el.style.getPropertyValue('--gx'),
      y: el.style.getPropertyValue('--gy'),
    }));
    expect(Number.parseFloat(vars.x)).toBeGreaterThan(0);
    expect(Number.parseFloat(vars.y)).toBeGreaterThan(0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const glowAfter = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('[data-glow]');
      return el ? getComputedStyle(el).getPropertyValue('--gx') : '';
    });
    expect(glowAfter).toBe('');
  });

  test('the film grain overlay and custom scrollbar are active', async ({ page }) => {
    await page.goto('/');
    const grain = await page.evaluate(
      () => getComputedStyle(document.body, '::after').backgroundImage,
    );
    expect(grain).toContain('data:image/svg+xml');

    const scrollbar = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollbarWidth,
    );
    expect(scrollbar).toBe('thin');
  });

  test('sections use the fluid vertical rhythm', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/styleguide');
    const padding = await page.evaluate(() => {
      const section = document.querySelector<HTMLElement>('section.section-y');
      return section ? Number.parseFloat(getComputedStyle(section).paddingBlockStart) : 0;
    });
    expect(padding).toBeGreaterThanOrEqual(64);
    expect(padding).toBeLessThanOrEqual(120);
  });

  test('the mobile sheet styles are theme-scoped correctly in both themes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    for (const theme of themes) {
      await page.goto('/');
      await page.evaluate((next) => {
        document.documentElement.dataset.theme = next;
      }, theme);
      await page.locator('[data-menu-toggle]').first().click();
      await expect(page.locator('[data-menu] a').first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await page.keyboard.press('Escape');
    }
  });
});
