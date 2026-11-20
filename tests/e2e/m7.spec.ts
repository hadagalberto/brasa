import { expect, test } from './base';

/** Milestone 7: documentation, feeds, metadata and index hygiene. */
test.describe('final polish', () => {
  test('both locales publish RSS and JSON feeds', async ({ page }) => {
    for (const path of ['/rss.xml', '/feed.json', '/pt-br/rss.xml', '/pt-br/feed.json']) {
      const response = await page.request.get(path);
      expect(response.status(), path).toBe(200);
      const body = await response.text();
      expect(body.length, path).toBeGreaterThan(200);
    }

    const ptRss = await (await page.request.get('/pt-br/rss.xml')).text();
    expect(ptRss).toContain('<language>pt-br</language>');
    expect(ptRss).toContain('Notas da forja');
    expect(ptRss).toContain('/pt-br/blog/');

    const ptJson = await (await page.request.get('/pt-br/feed.json')).json();
    expect(ptJson.language).toBe('pt-BR');
    expect(ptJson.items.length).toBeGreaterThan(0);
    expect(ptJson.items[0].url).toContain('/pt-br/blog/');

    const enJson = await (await page.request.get('/feed.json')).json();
    expect(enJson.language).toBe('en');
  });

  test('every page carries standalone Organization JSON-LD', async ({ page }) => {
    await page.goto('/');
    const nodes = await page.locator('script[type="application/ld+json"]').allTextContents();
    const graphs = nodes.map((node) => JSON.parse(node) as { '@type'?: string });
    expect(graphs.some((node) => node['@type'] === 'Organization')).toBe(true);
    expect(graphs.some((node) => node['@type'] === 'WebSite')).toBe(true);
  });

  test('code and file trees are excluded from the Pagefind source', async ({ page }) => {
    const response = await page.request.get('/docs/design-tokens/');
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html).toContain('data-pagefind-ignore class="expressive-code"');
    expect(html).toMatch(/<code[^>]*data-pagefind-ignore/);
    // A single indexed prose region per page: the <main> landmark.
    expect(html.match(/data-pagefind-body/g)?.length).toBe(1);
  });

  test('no analytics are loaded by default', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toContain('googletagmanager');
    expect(html).not.toContain('plausible.io');
    expect(html).not.toContain('umami');
  });
});
