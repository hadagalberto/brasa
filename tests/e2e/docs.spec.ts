import { expect, test } from '@playwright/test';

/** Docs manual: sidebar, TOC, breadcrumbs, prev/next, edit link and MDX components. */

test.describe('docs manual', () => {
  test('the docs index lists every section and page', async ({ page }) => {
    await page.goto('/docs');

    await expect(page.locator('h1')).toContainText('Make it');
    await expect(page.locator('section[aria-labelledby^="group-"]')).toHaveCount(4);
    // 11 manual pages, each linked once in its group plus the "start here" cards.
    const groupLinks = page.locator('section[aria-labelledby^="group-"] ul a');
    expect(await groupLinks.count()).toBeGreaterThanOrEqual(11);

    for (const name of ['installation', 'components', 'faq']) {
      const link = page.locator(`a[href="/docs/${name}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test('the article shell has grouped, collapsible nav with a current page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/docs/installation');

    const sidebar = page.locator('nav[aria-label="Documentation"]').first();
    await expect(sidebar).toBeVisible();
    await expect(sidebar.locator('details[data-doc-group]')).toHaveCount(4);
    await expect(sidebar.locator('a[aria-current="page"]')).toContainText('Installation');

    const group = sidebar.locator('details[data-doc-group]').first();
    await expect(group).toHaveAttribute('open', '');
    await group.locator('summary').click();
    await expect(group).not.toHaveAttribute('open');
  });

  test('breadcrumbs, edit link and prev/next navigation are correct', async ({ page }) => {
    await page.goto('/docs/installation');

    const crumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(crumbs).toContainText('Home');
    await expect(crumbs).toContainText('Docs');
    await expect(crumbs.locator('[aria-current="page"]')).toContainText('Installation');

    await expect(
      page.locator('a[href*="/edit/main/src/content/docs/installation.mdx"]'),
    ).toBeVisible();

    const nav = page.locator('nav[aria-label="Documentation pages"]');
    // The first page has no previous entry, so only the "next" card renders.
    await expect(nav.locator('a')).toHaveCount(1);
    await expect(nav.locator('a')).toContainText('Configuration');
  });

  test('the table of contents marks the current section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/docs/configuration');

    const toc = page.locator('aside[aria-label="On this page"] [data-toc]');
    await expect(toc).toBeVisible();
    expect(await toc.locator('a[data-toc-link]').count()).toBeGreaterThan(3);
    await expect(
      page.locator('aside[aria-label="On this page"] li[data-active]').first(),
    ).toBeVisible();

    await page.locator('aside[aria-label="On this page"] a[data-toc-link]').nth(2).click();
    await expect(page).toHaveURL(/#/);
  });

  test('the mobile docs drawer traps focus and restores it on close', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto('/docs/installation');

    const trigger = page.locator('[data-docs-drawer-open]');
    await trigger.click();
    const drawer = page.locator('dialog[data-docs-drawer]');
    await expect(drawer).toHaveAttribute('open', '');
    await expect(drawer.locator('nav[aria-label="Documentation"]')).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await expect(drawer.locator('[data-docs-drawer-close]')).toBeFocused();
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const dialog = document.querySelector('dialog[data-docs-drawer]');
        return dialog?.contains(document.activeElement) ?? false;
      });
      expect(inside, `focus left the drawer after ${index + 1} tabs`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(drawer).not.toHaveAttribute('open');
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('following a link in the drawer closes it', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto('/docs/installation');
    await page.locator('[data-docs-drawer-open]').click();

    const link = page.locator('dialog[data-docs-drawer] a[href="/docs/configuration"]');
    await link.click();
    await expect(page).toHaveURL(/\/docs\/configuration\/?$/);
    await expect(page.locator('dialog[data-docs-drawer]')).not.toHaveAttribute('open');
  });
});

test.describe('MDX component examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/mdx-components');
  });

  test('all four callout variants render', async ({ page }) => {
    for (const tone of ['callout-note', 'callout-tip', 'callout-warning', 'callout-danger']) {
      await expect(page.locator(`.${tone}`).first()).toBeVisible();
    }
  });

  test('tabs switch panels and respond to arrow keys', async ({ page }) => {
    const tabs = page.locator('[data-tabs]').first();
    const buttons = tabs.locator('[role="tab"]');
    await expect(buttons).toHaveCount(2);
    await expect(buttons.first()).toHaveAttribute('aria-selected', 'true');

    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.locator('[role="tabpanel"]').nth(1)).toBeVisible();
    await expect(tabs.locator('[role="tabpanel"]').first()).toBeHidden();

    await buttons.nth(1).press('ArrowLeft');
    await expect(buttons.first()).toBeFocused();
    await expect(buttons.first()).toHaveAttribute('aria-selected', 'true');
  });

  test('steps, file tree, cards and accordion render live', async ({ page }) => {
    await expect(page.locator('ol.steps > li').first()).toBeVisible();
    await expect(page.locator('ul.filetree').first()).toBeVisible();
    await expect(page.locator('ul.cards a').first()).toBeVisible();

    const items = page.locator('.faq-item');
    expect(await items.count()).toBeGreaterThanOrEqual(3);
    await expect(items.first().locator('.faq-body')).toBeHidden();
    await items.first().locator('summary').click();
    await expect(items.first()).toHaveAttribute('open', '');
    await expect(items.first().locator('.faq-body')).toBeVisible();
  });
});
