import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

import { setTheme, themes } from './helpers';

/**
 * Milestone 6 quality regressions.
 *
 * The maintainer reported two visual bugs that the earlier suite missed:
 *   1. The sticky header had no background after a programmatic scroll.
 *   2. Full-page screenshots froze scroll-reveal elements at opacity 0.
 * Both are covered here with assertions on the *rendered* result, not just on
 * the state attributes that previously gave a false green.
 */

test.describe('sticky header glass (review finding 1)', () => {
  const headerState = () =>
    ({
      scrolled: document.querySelector('[data-header]')?.hasAttribute('data-scrolled') ?? null,
      opacity: Number(
        getComputedStyle(document.querySelector('[data-header]')!, '::before').opacity,
      ),
      background: getComputedStyle(document.querySelector('[data-header]')!, '::before')
        .backgroundColor,
      backdrop: getComputedStyle(document.querySelector('[data-header]')!, '::before')
        .backdropFilter,
    }) as const;

  for (const theme of themes) {
    test(`programmatic scroll paints the translucent backdrop in ${theme} theme`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');
      await setTheme(page, theme);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

      const top = await page.evaluate(headerState);
      expect(top.scrolled).toBe(false);
      expect(top.opacity).toBe(0);

      // Exactly the maintainer's reproduction: scrollTo(0, 1500).
      await page.evaluate(() => window.scrollTo(0, 1500));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(1500);
      await expect.poll(() => page.evaluate(headerState).then((state) => state.opacity)).toBe(1);

      const scrolled = await page.evaluate(headerState);
      expect(scrolled.scrolled).toBe(true);
      expect(scrolled.background, 'header backdrop must not be transparent').not.toMatch(
        /^rgba\(0, 0, 0, 0\)$|^transparent$/,
      );
      expect(scrolled.backdrop).toContain('blur');
    });
  }

  test('restored scroll position on load paints the backdrop too', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#faq');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(8);
    await expect.poll(() => page.evaluate(headerState).then((state) => state.opacity)).toBe(1);
  });

  test('the compiled stylesheet contains the [data-scrolled] opacity rule', async ({ request }) => {
    // Guards against the CSS-compilation regression that caused the bug: a
    // `//` line comment used to swallow this rule entirely.
    const html = await (await request.get('/')).text();
    const cssHref = html.match(/href="([^"]+\.css)"/)?.[1];
    expect(cssHref).toBeTruthy();
    const css = await (await request.get(cssHref!)).text();
    expect(css).toMatch(/\[data-scrolled\][^{]*::?before\{opacity:1\}/);
  });
});

test.describe('reveal visibility (review finding 2)', () => {
  test('reduced motion leaves no reveal element hidden', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>('.reveal')].filter(
          (el) => Number(getComputedStyle(el).opacity) < 1,
        ).length,
    );
    expect(hidden, 'reveals hidden from reduced-motion users').toBe(0);
  });

  test('data-capture pins every reveal to its final state without reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.evaluate(() => document.documentElement.setAttribute('data-capture', ''));
    await page.waitForTimeout(50);

    const reveals = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.reveal')].map((el) => ({
        opacity: getComputedStyle(el).opacity,
        animation: getComputedStyle(el).animationName,
      })),
    );
    expect(reveals.length).toBeGreaterThan(0);
    expect(reveals.every((reveal) => reveal.opacity === '1')).toBe(true);
    expect(reveals.every((reveal) => reveal.animation === 'none')).toBe(true);
  });

  test('a full-page capture with reveals disabled has no opacity-0 content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/docs/installation');
    await page.evaluate(() => document.documentElement.setAttribute('data-capture', ''));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(50);

    const invisible = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('main *')]
        .filter((el) => {
          const hasText = [...el.childNodes].some(
            (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim(),
          );
          if (!hasText) return false;
          const style = getComputedStyle(el);
          return style.visibility === 'hidden' || Number(style.opacity) < 0.99;
        })
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}`)
        .slice(0, 10),
    );
    expect(invisible, 'content hidden in capture mode').toEqual([]);
  });

  test('the reveal animation is guarded by @supports and prefers-reduced-motion', () => {
    // A browser without animation-timeline support skips the whole @supports
    // block, so no `opacity: 0` keyframe ever applies and content stays visible.
    const css = readFileSync('src/styles/global.css', 'utf8');
    expect(css).toMatch(
      /@supports \(animation-timeline: view\(\)\)\s*\{\s*@media \(prefers-reduced-motion: no-preference\)\s*\{\s*animation: reveal-up/,
    );
    expect(css).toMatch(/html\[data-capture\][\s\S]*?\.reveal[\s\S]*?animation: none !important/);
  });
});

test.describe('Cumulative Layout Shift', () => {
  const routes = [
    '/',
    '/pricing',
    '/docs/installation',
    '/blog/deploy-previews-are-the-prs-missing-half',
  ];

  for (const route of routes) {
    test(`${route} stays under CLS 0.02 across a full scroll`, async ({ page }) => {
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value: number };
            if (!shift.hadRecentInput) {
              (window as unknown as { __cls: number }).__cls += shift.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });

      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.75;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
      });
      await page.waitForTimeout(400);

      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls, `cumulative layout shift on ${route}`).toBeLessThan(0.02);
    });
  }
});
