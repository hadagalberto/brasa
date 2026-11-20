/**
 * Shared Playwright harness.
 *
 * Every test in this directory navigates with root-relative paths (`/docs`,
 * `/rss.xml`, …). Playwright resolves those against the *origin* of `baseURL`,
 * discarding any path in it — which is why the old suite stayed green while
 * the production site was broken under `/brasa/`.
 *
 * This fixture prefixes every `page.goto()`, `page.request.*()` and
 * `request.*()` call with the configured deploy base path, so the exact same
 * suite runs unmodified against both `/` and `/brasa`. `sitePath()` is exported
 * for the few assertions that must compare an `href` attribute literally.
 */
import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test';

export type BasePath = string;

function normalizeBase(value: string | undefined): BasePath {
  if (!value || value === '/') return '';
  const trimmed = value.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '';
}

/** Base path selected by the running Playwright project / environment. */
export const BASE_PATH: BasePath = normalizeBase(
  process.env.PAGES_BASE_PATH ?? process.env.BASE_PATH ?? '/',
);

/**
 * Prefix a site-relative path with the deploy base path. Hand-derived rule:
 * absolute URLs, fragments, already-prefixed paths and query-only strings are
 * left untouched; everything else becomes `<base>/<path>`.
 */
export function sitePath(path: string): string {
  if (!BASE_PATH) return path;
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith('//')) return path;
  if (path.startsWith('#') || path.startsWith('?')) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path.startsWith('/') ? '' : '/'}${path}`;
}

function wrapGet(context: APIRequestContext): void {
  const original = context.get.bind(context);
  const wrapped = ((url: string | URL, options?: Parameters<APIRequestContext['get']>[1]) =>
    original(
      sitePath(typeof url === 'string' ? url : url.toString()),
      options,
    )) as typeof context.get;
  Object.defineProperty(context, 'get', { configurable: true, value: wrapped });
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const selected = normalizeBase(
      (testInfo.project.metadata as { basePath?: string } | undefined)?.basePath ?? BASE_PATH,
    );
    const prefix = (url: string | URL): string | URL =>
      typeof url === 'string' && selected
        ? (() => {
            if (/^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('//')) return url;
            if (url.startsWith('#') || url.startsWith('?')) return url;
            if (url === selected || url.startsWith(`${selected}/`)) return url;
            return `${selected}${url.startsWith('/') ? '' : '/'}${url}`;
          })()
        : url;

    const originalGoto = page.goto.bind(page);
    Object.defineProperty(page, 'goto', {
      configurable: true,
      value: ((url: string, options?: Parameters<Page['goto']>[1]) =>
        originalGoto(prefix(url) as string, options)) as typeof page.goto,
    });
    wrapGet(page.request);
    await use(page);
  },

  request: async ({ request }, use) => {
    wrapGet(request);
    await use(request);
  },
});

export { expect };
