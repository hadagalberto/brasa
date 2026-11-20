/**
 * Milestone 8 regressions — independent-review findings.
 *
 * Every expected value below is derived by hand from SPEC.md, brasa.config.ts,
 * the i18n dictionaries, or plain reasoning about URL joining. None is read
 * back from the library under test (no snapshots, no self-generated oracles).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { expect, sitePath, test } from './base';
import { routes } from './helpers';
import { withBase } from '../../src/lib/with-base';

/** Deploy base path selected by the running project (`''` for the root build). */
function currentBase(): string {
  const value = test.info().project.metadata?.basePath as string | undefined;
  return value ? value.replace(/\/$/, '') : '';
}

test.describe('review finding 1 — one base-path joiner', () => {
  test('withBase joins correctly with or without a trailing slash', () => {
    // Hand-derived: joining must insert exactly one slash, never `/brasafoo`.
    // The last two rows prove it is idempotent and leaves external URLs alone.
    expect(withBase('rss.xml', '/brasa')).toBe('/brasa/rss.xml');
    expect(withBase('/rss.xml', '/brasa/')).toBe('/brasa/rss.xml');
    expect(withBase('og.png', '/')).toBe('/og.png');
    expect(withBase('/', '/brasa/')).toBe('/brasa/');
    expect(withBase('/brasa/rss.xml', '/brasa')).toBe('/brasa/rss.xml');
    expect(withBase('https://example.com/x', '/brasa')).toBe('https://example.com/x');
  });

  test('no source file concatenates BASE_URL into a path', () => {
    // Hand-derived: raw `${BASE_URL}foo` produced `/brasafoo` on the live site.
    const files = [
      'src/layouts/BaseLayout.astro',
      'src/components/SEO.astro',
      'src/components/Footer.astro',
      'src/components/Header.astro',
      'src/components/SearchDialog.astro',
      'src/scripts/search.ts',
      'src/lib/docs.ts',
      'src/lib/feeds.ts',
      'src/i18n/index.ts',
      ...readdirSync('src/pages/[...lang]', { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((dir) =>
          readdirSync(join('src/pages/[...lang]', dir.name))
            .filter((name) => name.endsWith('.astro'))
            .map((name) => join('src/pages/[...lang]', dir.name, name)),
        ),
    ];
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      expect(source.match(/\$\{import\.meta\.env\.BASE_URL\}/g) ?? [], file).toEqual([]);
    }
  });
});

test.describe('review finding 2 — base-path e2e and crawler', () => {
  test('CI builds and crawls the /brasa base path', () => {
    const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
    const config = readFileSync('playwright.basepath.config.ts', 'utf8');
    // Hand-derived: a base-path job and a project must exist and agree on /brasa.
    expect(ci).toMatch(/base-path:/);
    expect(ci).toContain('playwright.basepath.config.ts');
    expect(config).toContain("const BASE_PATH = '/brasa'");
    expect(config).toContain("name: 'basepath'");
  });

  test('every rendered URL, feed, OG image and pagefind asset is under the base and resolves', async ({
    page,
    request,
  }) => {
    const base = currentBase();
    // Hand-derived from GitHub Pages project-site layout: all internal URLs
    // live under the deploy base, and every one of these is fetched by a real
    // browser/crawler on the live site.
    for (const route of ['/', '/docs/installation', '/blog', '/pt-br/']) {
      await page.goto(route);
      const urls = await page.evaluate(() => {
        const found: string[] = [];
        const push = (value: string | null): void => {
          if (value && !value.startsWith('data:')) found.push(value);
        };
        document.querySelectorAll<HTMLLinkElement>('link[href]').forEach((el) => push(el.href));
        document.querySelectorAll<HTMLScriptElement>('script[src]').forEach((el) => push(el.src));
        document.querySelectorAll<HTMLImageElement>('img[src]').forEach((el) => push(el.src));
        document
          .querySelectorAll<HTMLMetaElement>('meta[property="og:image"],meta[name="twitter:image"]')
          .forEach((el) => push(el.content));
        document
          .querySelectorAll<HTMLLinkElement>('link[rel="canonical"],link[rel="alternate"]')
          .forEach((el) => push(el.href));
        return found;
      });

      const internal = urls.filter((url) => {
        const parsed = new URL(url);
        return parsed.host === new URL(page.url()).host;
      });
      expect(internal.length, `internal URLs on ${route}`).toBeGreaterThan(3);
      for (const url of internal) {
        const pathname = new URL(url).pathname;
        expect(pathname.startsWith(`${base}/`), `${url} on ${route}`).toBe(true);
        expect((await request.get(url)).status(), `${url} on ${route}`).toBe(200);
      }

      // Pagefind is dynamically imported, so it never appears in the initial
      // HTML — the crawler must ask for it explicitly.
      const pagefind = sitePath('/pagefind/pagefind.js');
      expect((await request.get(pagefind)).status(), `pagefind on ${route}`).toBe(200);
    }
  });

  test('link crawler checks fragment anchors too', async ({ page }) => {
    // Hand-derived: a fragment is an internal link; its id must exist on the
    // target page or the anchor is dead. `/pt-br/docs/components` used to link
    // to `#foundations` while the heading is `#fundamentos`.
    for (const route of [...routes, '/pt-br/docs/components']) {
      await page.goto(route);
      const broken = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
          .map((anchor) => anchor.getAttribute('href') ?? '')
          .filter((href) => href.length > 1 && !document.getElementById(href.slice(1))),
      );
      expect(broken, `dead fragments on ${route}`).toEqual([]);
    }
  });
});

test.describe('review findings 3 and 10 — Logo', () => {
  test('gradient ids are unique across every Logo instance on a page', async ({ page }) => {
    await page.goto('/');
    const ids = await page.evaluate(() =>
      [...document.querySelectorAll('[id^="ember-mark-"]')].map((el) => el.id),
    );
    // Hand-derived: header (desktop + sheet) and footer each render a Logo,
    // so at least two instances share one document and must not collide.
    expect(ids.length).toBeGreaterThanOrEqual(2);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('the logo home label is localized on pt-BR pages', async ({ page }) => {
    await page.goto('/pt-br/');
    await expect(page.locator('header a[aria-label]').first()).toHaveAttribute(
      'aria-label',
      'Brasa — início',
    );
  });
});

test.describe('review finding 4 — the Foundations anchor', () => {
  test('the pt-BR components card links to the real heading', async ({ page }) => {
    await page.goto('/pt-br/docs/components');
    // Hand-derived: the heading rendered by this MDX file is "Fundamentos",
    // whose GitHub slug is `fundamentos` (not the English `foundations`).
    // The card (not the hidden TOC entry) is the link that was broken.
    await expect(page.getByRole('link', { name: 'Referência abaixo' })).toHaveAttribute(
      'href',
      '#fundamentos',
    );
    await expect(page.locator('#fundamentos')).toHaveCount(1);
    expect(await page.locator('a[href="#foundations"]').count()).toBe(0);
  });
});

test.describe('review finding 5 — config drives nav and footer', () => {
  test('the header and footer render brasa.nav / brasa.footer, localized', async ({ page }) => {
    await page.goto('/');
    const navHrefs = await page
      .locator('header nav[aria-label="Main"] a')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
    // Hand-derived from brasa.nav: every configured entry appears, in order.
    for (const href of ['/', '/pricing', '/changelog', '/docs', '/blog', '/styleguide']) {
      expect(navHrefs, `nav missing ${href}`).toContain(sitePath(href));
    }
    // Hand-derived from brasa.footer.columns: the "Stack" column is configured
    // but was invisible while the dictionary owned the footer.
    await expect(page.locator('footer').getByRole('heading', { name: 'Stack' })).toBeVisible();
    await expect(page.locator('footer')).toContainText('Built with Astro, warm by design.');

    await page.goto('/pt-br/');
    const ptNav = await page.locator('header nav[aria-label="Principal"] a').allTextContents();
    // Hand-derived from the localized labels in brasa.nav.
    expect(ptNav.join(' ')).toContain('Início');
    expect(ptNav.join(' ')).toContain('Documentação');
  });
});

test.describe('review finding 6 — fonts config is wired', () => {
  test('configured font families reach the rendered page', async ({ page }) => {
    await page.goto('/');
    const style = await page.locator('html').getAttribute('style');
    // Hand-derived from brasa.config.ts fonts: { display, sans, mono }.
    expect(style).toContain('Fraunces Variable');
    expect(style).toContain('Geist Variable');
    expect(style).toContain('Geist Mono Variable');
  });
});

test.describe('review findings 7 — feature toggles', () => {
  test('disabled blog/docs features gate their routes and feeds', () => {
    // Hand-derived: only a guard in each generator can stop Astro emitting
    // those routes/feeds; hiding the links alone still publishes the files.
    const collect = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = join(dir, entry.name);
        return entry.isDirectory()
          ? collect(full)
          : full.endsWith('.astro') || full.endsWith('.ts')
            ? [full]
            : [];
      });
    const files = collect('src/pages').filter((file) =>
      /[\\/](blog|docs)[\\/]|rss\.xml|feed\.json/.test(file),
    );
    expect(files.length).toBeGreaterThan(4);
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      const feature = /[\\/]docs[\\/]/.test(file) ? 'docs' : 'blog';
      expect(source, `${file} must gate on features.${feature}`).toContain(
        `brasa.features.${feature}`,
      );
    }
  });
});

test.describe('review finding 8 — SEO URL consistency', () => {
  test('canonical, hreflang and x-default share one trailing-slash convention', async ({
    page,
  }) => {
    for (const route of ['/', '/docs/installation', '/pt-br/']) {
      await page.goto(route);
      const urls = await page.evaluate(() => ({
        canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? '',
        alternates: [
          ...document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]'),
        ].map((el) => el.href),
      }));
      const all = [urls.canonical, ...urls.alternates];
      // Hand-derived: one convention everywhere. Trailing slash is the Astro
      // default for directory routes, so all of them must end with '/'.
      expect(all.length, `alternates on ${route}`).toBeGreaterThan(2);
      for (const url of all) {
        expect(url.endsWith('/'), `${url} on ${route}`).toBe(true);
      }
    }
  });
});

test.describe('review findings 9 — search close label', () => {
  test('close button announces "close search", not "close menu"', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-search-close]')).toHaveAttribute('aria-label', 'Close search');
    await page.goto('/pt-br/');
    await expect(page.locator('[data-search-close]')).toHaveAttribute('aria-label', 'Fechar busca');
  });
});

test.describe('review finding 11 — debug junk', () => {
  test('tmp/ is ignored and no debug scripts are tracked', () => {
    // Hand-derived: debug generators must never enter version control.
    expect(readFileSync('.gitignore', 'utf8')).toMatch(/^tmp\/$/m);
    const tracked = execFileSync('git', ['ls-files', 'tmp/'], { encoding: 'utf8' });
    expect(tracked.trim()).toBe('');
  });
});
