import type { Page } from '@playwright/test';

/** One route of each page type: home, styleguide, blog index, post, tag,
 *  tags index, author and paginated archive. Shared by the SEO, a11y,
 *  budget, link-crawl and screenshot specs. */
export const routes = [
  '/',
  '/pricing',
  '/changelog',
  '/about',
  '/contact',
  '/legal/privacy',
  '/legal/terms',
  '/styleguide',
  '/docs',
  '/docs/installation',
  '/docs/components',
  '/blog',
  '/blog/deploy-previews-are-the-prs-missing-half',
  '/blog/tags',
  '/blog/tags/performance',
  '/blog/authors/hadjunior',
  '/blog/page/2',
  '/pt-br/',
  '/pt-br/pricing',
  '/pt-br/changelog',
  '/pt-br/about',
  '/pt-br/contact',
  '/pt-br/legal/privacy',
  '/pt-br/docs',
  '/pt-br/docs/installation',
  '/pt-br/blog',
  '/pt-br/blog/deploy-previews-are-the-prs-missing-half',
] as const;
export const themes = ['dark', 'light'] as const;
export type Theme = (typeof themes)[number];

/** Flip the theme with the real toggle button (exercises the island JS). */
export async function toggleTheme(page: Page): Promise<void> {
  await page.locator('[data-theme-toggle]').click();
}

/** Set the theme directly on <html> without touching storage. */
export async function setTheme(page: Page, theme: Theme): Promise<void> {
  await page.evaluate((next) => {
    document.documentElement.dataset.theme = next;
  }, theme);
}

/** Assert no horizontal overflow at the current viewport, listing culprits. */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const el = document.scrollingElement ?? document.documentElement;
    const culprits: string[] = [];
    if (el.scrollWidth > el.clientWidth + 1) {
      const width = el.clientWidth;
      document.querySelectorAll<HTMLElement>('body *').forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width > 0 && (rect.right > width + 1 || rect.left < -1)) {
          culprits.push(
            `<${node.tagName.toLowerCase()} class="${node.className}"> ` +
              `left=${Math.round(rect.left)} right=${Math.round(rect.right)}`,
          );
          if (culprits.length >= 12) return;
        }
      });
    }
    return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, culprits };
  });
  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    throw new Error(
      `Horizontal overflow: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}\n` +
        overflow.culprits.join('\n'),
    );
  }
}
