import type { Page } from '@playwright/test';

export const routes = ['/', '/styleguide'] as const;
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
