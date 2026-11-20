import { expect, sitePath, test } from './base';

/**
 * The blog is a product surface of its own: curation, archives, taxonomies,
 * long-form reading furniture, feeds and build-time social cards. These tests
 * exercise the built site through the same routes a reader uses.
 */

const FEATURED = '/blog/deploy-previews-are-the-prs-missing-half';
const FEATURED_NAME = 'post-deploy-previews-are-the-prs-missing-half';

test.describe('blog index and archives', () => {
  test('featured essay leads, six fresh essays follow, pagination has two honest pages', async ({
    page,
  }) => {
    await page.goto('/blog');

    const featured = page.locator('[aria-label="Featured essay"] .post-card');
    await expect(featured).toHaveCount(1);
    await expect(featured.locator('.post-card-link')).toContainText(
      "Deploy previews are the pull request's missing half",
    );
    await expect(featured.getByText('Featured', { exact: true })).toBeVisible();

    const latest = page.locator('[aria-label="Latest essays"] .post-card');
    await expect(latest).toHaveCount(6);
    // Cards in a grid row must share their height, or the archive looks ragged.
    const heights = await latest.evaluateAll((cards) =>
      cards.map((card) => Math.round(card.getBoundingClientRect().height)),
    );
    expect(new Set(heights.slice(0, 3)).size, `row heights: ${heights}`).toBe(1);

    const pagination = page.locator('nav[aria-label="Pagination"]');
    await expect(pagination.locator('[aria-current="page"]')).toContainText('1');
    await pagination.locator('a[rel="next"]').click();

    await expect(page).toHaveURL(/\/blog\/page\/2\/?$/);
    await expect(page.locator('h1')).toContainText('page 2 of 2');
    await expect(page.locator('[aria-label="Essays, page 2"] .post-card')).toHaveCount(3);
    await expect(page.locator('nav[aria-label="Pagination"] [aria-current="page"]')).toContainText(
      '2',
    );
  });

  test('topics page lists every tag with a working count', async ({ page }) => {
    await page.goto('/blog/tags');
    const pills = page.locator('[aria-label="All topics"] a');
    await expect(pills).toHaveCount(5);
    await expect(pills.filter({ hasText: 'Deploy previews' })).toContainText('3');
    await expect(pills.filter({ hasText: 'Accessibility' })).toContainText('2');

    await pills.filter({ hasText: 'Performance' }).click();
    await expect(page).toHaveURL(/\/blog\/tags\/performance\/?$/);
    await expect(page.locator('h1')).toHaveText('Performance');
    await expect(page.locator('[aria-label="Essays tagged Performance"] .post-card')).toHaveCount(
      3,
    );
  });

  test('author page collects only that author’s essays', async ({ page }) => {
    await page.goto('/blog/authors/hadjunior');
    await expect(page.locator('h1')).toHaveText('Hadagalberto Junior');
    await expect(
      page.locator('[aria-label="Essays by Hadagalberto Junior"] .post-card'),
    ).toHaveCount(4);
    await expect(
      page.locator(`a[href="${sitePath('/blog/authors/hadjunior')}"]`).first(),
    ).toBeVisible();
  });
});

test.describe('reading an essay', () => {
  test('header, reading time, TOC, related posts, prev/next and share row are all present', async ({
    page,
  }) => {
    await page.goto(FEATURED);

    await expect(page.locator('h1')).toContainText('Deploy previews are');
    await expect(page.locator('.post-hero')).toContainText('4 min read');
    await expect(page.locator('.post-hero time')).toHaveAttribute(
      'datetime',
      '2026-11-02T00:00:00.000Z',
    );

    const tocLinks = page.locator('aside [data-toc-link]');
    await expect(tocLinks).toHaveCount(4);
    await expect(tocLinks.first()).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('details.toc-details [data-toc-link]')).toHaveCount(4);

    await expect(page.locator('section[aria-labelledby="related-heading"] .post-card')).toHaveCount(
      2,
    );
    const nav = page.locator('nav[aria-label="Post navigation"]');
    await expect(nav.locator('a[rel="prev"]')).toContainText('Six seconds to a URL');
    // Regression: tag pills used to be anchors nested inside the whole-card
    // anchor, which the HTML parser hoisted out and broke the layout.
    await expect(nav.locator('a a')).toHaveCount(0);
    await expect(nav.getByText('Performance', { exact: true })).toHaveCount(1);

    await expect(page.locator('[data-share-copy]').first()).toBeVisible();
    await expect(page.locator('a[aria-label="Share on X (Twitter)"]').first()).toBeVisible();
    await expect(page.locator('a[aria-label="Share on LinkedIn"]').first()).toBeVisible();
  });

  test('the sticky TOC highlights the section being read', async ({ page }) => {
    await page.goto(FEATURED);
    const link = page.locator('aside [data-toc-link="what-a-preview-actually-changes"]');
    await expect(link).toHaveAttribute('aria-current', 'false');

    await page
      .locator('#what-a-preview-actually-changes')
      .evaluate((heading) => heading.scrollIntoView({ block: 'center' }));
    await expect(link).toHaveAttribute('aria-current', 'true');
    await expect(link.locator('xpath=ancestor::li')).toHaveAttribute('data-active', '');
  });

  test('copy-link button confirms and copies the canonical URL', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(FEATURED);

    await page.locator('[data-share-copy]').first().click();
    await expect(page.locator('[data-share-feedback]').first()).toHaveText(
      'Link copied to clipboard',
    );
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(copied).toBe(canonical);
  });

  test('every MDX component is used by at least one post', async ({ page }) => {
    const components: Array<[string, string]> = [
      ['/blog/deploy-previews-are-the-prs-missing-half', 'ol.steps'],
      ['/blog/deploy-previews-are-the-prs-missing-half', '[data-tabs]'],
      ['/blog/feeds-are-still-worth-shipping', '.faq-item'],
      ['/blog/six-seconds-to-a-url', '[data-code-tabs]'],
      ['/blog/six-seconds-to-a-url', '.filetree'],
      ['/blog/the-great-staging-exodus', 'figure blockquote'],
      ['/blog/zero-javascript-is-a-feature', 'span:has-text("Total under 5 KB")'],
      ['/blog/a-view-transition-is-a-promise', '.callout'],
    ];
    for (const [route, selector] of components) {
      await page.goto(route);
      await expect(page.locator(selector).first(), `${selector} on ${route}`).toBeVisible();
    }
  });

  test('card title and post header share one view-transition name', async ({ page }) => {
    await page.goto('/blog');
    const card = page
      .locator('[aria-label="Featured essay"] [data-astro-transition-scope]')
      .first();
    const cardName = await card.evaluate((el) => getComputedStyle(el).viewTransitionName);
    expect(cardName).toBe(FEATURED_NAME);

    await page.locator('[aria-label="Featured essay"] .post-card-link').click();
    await expect(page).toHaveURL(new RegExp(`${FEATURED}/?$`));
    const heroName = await page
      .locator('.post-hero')
      .evaluate((el) => getComputedStyle(el).viewTransitionName);
    expect(heroName).toBe(cardName);
    await expect(page.locator('h1')).toContainText('Deploy previews are');
  });
});

test.describe('feeds and social cards', () => {
  test('RSS 2.0 is well-formed, complete and deterministic', async ({ page, request }) => {
    const response = await request.get('/rss.xml');
    expect(response.status()).toBe(200);
    // astro preview serves the built file by extension; production CDNs use
    // the endpoint's explicit MIME. Both are correct for a static RSS file.
    expect(['application/rss+xml', 'text/xml', 'application/xml']).toContain(
      response.headers()['content-type']?.split(';')[0],
    );
    const xml = await response.text();
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<atom:link href=');

    const parsed = await page.evaluate((source) => {
      const doc = new DOMParser().parseFromString(source, 'application/xml');
      return {
        error: doc.querySelector('parsererror')?.textContent ?? null,
        title: doc.querySelector('channel > title')?.textContent ?? '',
        items: [...doc.querySelectorAll('item')].map((item) => ({
          title: item.querySelector('title')?.textContent ?? '',
          link: item.querySelector('link')?.textContent ?? '',
          guid: item.querySelector('guid')?.textContent ?? '',
          pubDate: item.querySelector('pubDate')?.textContent ?? '',
          description: item.querySelector('description')?.textContent ?? '',
          categories: item.querySelectorAll('category').length,
          author: item.querySelector('author')?.textContent ?? '',
        })),
      };
    }, xml);

    expect(parsed.error).toBeNull();
    expect(parsed.title).toContain('Brasa');
    expect(parsed.items).toHaveLength(10);
    for (const item of parsed.items) {
      expect(item.title.length).toBeGreaterThan(8);
      expect(item.link).toMatch(/^https:\/\/.+\/blog\//);
      expect(item.guid).toBe(item.link);
      expect(Number.isNaN(Date.parse(item.pubDate))).toBe(false);
      expect(item.description.length).toBeGreaterThan(30);
      expect(item.categories).toBeGreaterThanOrEqual(1);
      expect(item.author.length).toBeGreaterThan(2);
    }
    const second = await request.get('/rss.xml');
    expect(await second.text()).toBe(xml);
  });

  test('JSON Feed 1.1 mirrors the posts and their metadata', async ({ request }) => {
    const response = await request.get('/feed.json');
    expect(response.status()).toBe(200);
    expect(['application/feed+json', 'application/json']).toContain(
      response.headers()['content-type']?.split(';')[0],
    );

    const feed = await response.json();
    expect(feed.version).toBe('https://jsonfeed.org/version/1.1');
    expect(feed.title).toContain('Brasa');
    expect(feed.home_page_url).toMatch(/^https:\/\//);
    expect(feed.feed_url).toMatch(/\/feed\.json$/);
    expect(feed.items).toHaveLength(10);
    for (const item of feed.items) {
      expect(item.id).toBe(item.url);
      expect(item.url).toMatch(/\/blog\//);
      expect(item.title.length).toBeGreaterThan(8);
      expect(item.summary.length).toBeGreaterThan(30);
      expect(Number.isNaN(Date.parse(item.date_published))).toBe(false);
      expect(item.tags.length).toBeGreaterThanOrEqual(1);
      expect(item.authors[0].name).toBeTruthy();
    }
    const updated = feed.items.find((item: { id: string }) =>
      item.id.includes('a-view-transition-is-a-promise'),
    );
    expect(updated.date_modified).toBe('2026-10-01T00:00:00.000Z');
  });

  test('each post has its own 1200×630 OG card referenced in its head', async ({
    page,
    request,
  }) => {
    await page.goto(FEATURED);
    const imagePath = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(imagePath).toMatch(/\/og\/blog\/deploy-previews-are-the-prs-missing-half\.png$/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      imagePath ?? '',
    );

    // The meta tag uses the absolute canonical URL; the preview server only
    // knows the local path.
    const localImagePath = new URL(imagePath ?? '').pathname;
    const response = await request.get(localImagePath);
    expect(response.status()).toBe(200);
    const bytes = await response.body();
    expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');

    const dimensions = await page.evaluate(async (src) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(image, 0, 0);
      // Sample the headline band: it must not be a blank, monochrome canvas.
      const pixels = ctx.getImageData(80, 196, 900, 200).data;
      let bright = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        bright = Math.max(bright, pixels[i] + pixels[i + 1] + pixels[i + 2]);
      }
      return { width: image.naturalWidth, height: image.naturalHeight, bright };
    }, localImagePath);
    expect(dimensions).not.toBeNull();
    expect(dimensions?.width).toBe(1200);
    expect(dimensions?.height).toBe(630);
    expect(dimensions?.bright ?? 0).toBeGreaterThan(300);
  });
});
