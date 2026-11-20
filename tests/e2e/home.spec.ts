import { expect, test } from '@playwright/test';

/**
 * Home-page behavior: the product mock, code tabs, count-up metrics,
 * testimonial marquee, FAQ accordion, the copy chip and in-page anchors.
 * Visual/layout contracts for every route (overflow, axe, theme, screenshots)
 * live in the sibling spec files and cover the home page too.
 */

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test.describe('hero', () => {
  test('renders the product dashboard mock and the SVG wordmark cloud', async ({ page }) => {
    await page.goto('/');

    // The deploy dashboard is real HTML/CSS, decorative by design.
    const mock = page.locator('.mock-window');
    await expect(mock).toBeVisible();
    await expect(page.locator('[aria-hidden="true"]:has(.mock-window)')).toHaveCount(1);

    // Six fictional company wordmarks, each drawn as SVG typography.
    const marks = page.locator('ul[aria-hidden="true"] li');
    await expect(marks).toHaveCount(6);
    await expect(page.locator('ul[aria-hidden="true"] svg text').first()).toBeVisible();
  });

  test('in-page anchors all resolve to real sections', async ({ page }) => {
    await page.goto('/');

    const missing = await page.evaluate(() => {
      const broken: string[] = [];
      document.querySelectorAll<HTMLAnchorElement>('main a[href^="#"]').forEach((link) => {
        const id = link.getAttribute('href')?.slice(1);
        if (id && !document.getElementById(id)) broken.push(link.href);
      });
      return broken;
    });
    expect(missing).toEqual([]);
  });
});

test.describe('code tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#code');
    await page.locator('[data-code-tabs]').waitFor();
  });

  test('switch panels on click and keep ARIA state honest', async ({ page }) => {
    const cli = page.locator('[role="tabpanel"][data-panel="cli"]');
    const config = page.locator('[role="tabpanel"][data-panel="config"]');
    const api = page.locator('[role="tabpanel"][data-panel="api"]');

    await expect(cli).toBeVisible();
    await expect(config).toBeHidden();
    await expect(api).toBeHidden();

    await page.locator('[role="tab"][data-tab="api"]').click();
    await expect(api).toBeVisible();
    await expect(cli).toBeHidden();
    await expect(config).toBeHidden();
    await expect(page.locator('[role="tab"][data-tab="api"]')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('[role="tab"][data-tab="cli"]')).toHaveAttribute(
      'aria-selected',
      'false',
    );

    // The visible panel is Expressive Code, not an empty frame.
    await expect(api.locator('.expressive-code pre')).toBeVisible();
  });

  test('follow the roving-tabindex keyboard pattern', async ({ page }) => {
    const cliTab = page.locator('[role="tab"][data-tab="cli"]');
    await cliTab.focus();
    await expect(cliTab).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[role="tab"][data-tab="config"]')).toBeFocused();
    await expect(page.locator('[role="tabpanel"][data-panel="config"]')).toBeVisible();

    await page.keyboard.press('End');
    await expect(page.locator('[role="tab"][data-tab="api"]')).toBeFocused();

    await page.keyboard.press('Home');
    await expect(cliTab).toBeFocused();
    await expect(page.locator('[role="tabpanel"][data-panel="cli"]')).toBeVisible();
  });
});

test.describe('count-up metrics', () => {
  test('count from zero when scrolled into view', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');

    const first = page.locator('[data-countup]').first();
    await first.scrollIntoViewIfNeeded();
    await first.evaluate((el) => {
      void new Promise<void>((resolve) => {
        const check = () => {
          if (el instanceof HTMLElement && el.dataset.started === '1') resolve();
          else requestAnimationFrame(check);
        };
        check();
      });
    });

    // The count-up just began: the number is on its way up, not parked at 41.
    const midAnimation = await first.textContent();
    expect(midAnimation).not.toBe('41k+');

    await expect(first).toHaveText('41k+', { timeout: 4000 });
    await expect(page.locator('[data-countup]').nth(3)).toHaveText('132');
  });

  test('stay static under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const first = page.locator('[data-countup]').first();
    await first.scrollIntoViewIfNeeded();

    await expect(first).toHaveText('41k+');
    await expect(first).not.toHaveAttribute('data-started');
  });
});

test.describe('testimonial marquee', () => {
  test('scrolls by default and pauses on hover and focus', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');

    const track = page.locator('.marquee-track');
    await track.waitFor();

    const running = await track.evaluate((el) => getComputedStyle(el).animationPlayState);
    expect(running).toBe('running');

    const region = page.locator('.marquee-region');
    await region.hover();
    const hovered = await track.evaluate((el) => getComputedStyle(el).animationPlayState);
    expect(hovered).toBe('paused');

    await region.focus();
    const focused = await track.evaluate((el) => getComputedStyle(el).animationPlayState);
    expect(focused).toBe('paused');

    // The duplicated half is hidden from assistive tech.
    const groups = page.locator('.marquee-group');
    await expect(groups).toHaveCount(2);
    await expect(groups.nth(1)).toHaveAttribute('aria-hidden', 'true');
  });

  test('stops entirely and becomes scrollable under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const track = page.locator('.marquee-track');
    await track.waitFor();

    const animation = await track.evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe('none');

    const scrollable = await page
      .locator('.marquee-region')
      .evaluate((el) => getComputedStyle(el).overflowX);
    expect(scrollable).toBe('auto');
  });
});

test.describe('FAQ accordion', () => {
  test('opens and closes natively, by mouse and keyboard', async ({ page }) => {
    await page.goto('/#faq');
    const first = page.locator('details').first();

    await expect(first).not.toHaveAttribute('open');
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open');
    await expect(first.locator('.faq-body')).toBeVisible();

    await first.locator('summary').click();
    await expect(first).not.toHaveAttribute('open');

    await first.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('open');
  });

  test('exposes every answer in the DOM for search and copy', async ({ page }) => {
    await page.goto('/#faq');
    await expect(page.locator('details .faq-body p')).toHaveCount(5);
  });
});

test.describe('copy chip', () => {
  test('copies the install command and confirms it', async ({ page }) => {
    await page.goto('/#get-started');

    const button = page.locator('[data-copy="install-command"]');
    await button.click();

    await expect(button).toHaveAttribute('data-state', 'copied');
    await expect(button.locator('[data-copy-feedback]')).toHaveText('Copied to clipboard');

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('npm create astro@latest -- --template hadagalberto/brasa');
    expect(clipboard).not.toContain('$');
  });
});
