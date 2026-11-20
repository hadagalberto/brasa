import { expect, test } from '@playwright/test';

/** Milestone 5: secondary pages, localized routing and interactive pricing. */

test.describe('pricing', () => {
  test('monthly/yearly toggle changes numbers without moving the cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pricing');

    const slots = page.locator('[data-price-slot]');
    // Starter is $0 in both periods, so assert against the first paid tier.
    const firstPrice = slots.nth(1);
    const monthly = await firstPrice.textContent();
    const before = await page.locator('.tier').evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { top: rect.top, height: rect.height };
      }),
    );

    await page.getByRole('button', { name: /Yearly/ }).click();

    await expect(firstPrice).not.toHaveText(monthly ?? '');
    await expect(page.getByRole('button', { name: /Yearly/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.locator('[data-billing-note]').first()).not.toBeEmpty();

    const after = await page.locator('.tier').evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { top: rect.top, height: rect.height };
      }),
    );
    expect(after).toEqual(before);
  });

  test('comparison table is semantic on desktop and stacked on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pricing');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Plan' })).toBeVisible();

    await page.setViewportSize({ width: 375, height: 720 });
    await expect(page.getByRole('table')).toBeHidden();
    await expect(page.getByRole('region', { name: 'Enterprise' })).toBeVisible();
  });

  test('four tiers and the FAQ are present', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('.tier')).toHaveCount(4);
    await expect(page.getByText('Before you pick a tier')).toBeVisible();
    await expect(page.locator('#faq details')).toHaveCount(6);
  });
});

test.describe('changelog, about and legal', () => {
  test('changelog renders an anchored release timeline', async ({ page }) => {
    await page.goto('/changelog');
    await expect(page.locator('ol > li')).toHaveCount(6);
    await expect(page.locator('#v2\\.4\\.0')).toBeVisible();
    await expect(page.locator('#v2\\.4\\.0').getByText('Added')).toBeVisible();
  });

  test('about tells the story and links onward', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('A deploy tool, then a theme')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hadagalberto Junior' })).toBeVisible();
  });

  for (const slug of ['privacy', 'terms']) {
    test(`${slug} legal page has real content and navigation`, async ({ page }) => {
      await page.goto(`/legal/${slug}`);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.locator('[data-pagefind-body] h2').count()).toBeGreaterThan(3);
      await expect(page.locator('main nav[aria-label="Legal"]')).toBeVisible();
    });
  }
});

test.describe('contact form', () => {
  test('blocks invalid submission with localized, associated errors', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /Send message/ }).click();

    await expect(page.locator('[data-error-for="name"]')).toHaveText(/Please enter your name/);
    await expect(page.locator('[data-error-for="email"]')).toHaveText(/valid email/);
    await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-name')).toBeFocused();
    await expect(page.locator('[data-contact-success]')).toBeHidden();
  });

  test('accepts a complete message and confirms success', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('#contact-name').fill('Marina Cole');
    await page.locator('#contact-email').fill('marina@example.com');
    await page.locator('#contact-topic').selectOption({ index: 1 });
    await page
      .locator('#contact-message')
      .fill('We would like to adopt the theme for our docs site.');
    await page.locator('input[name="consent"]').check();
    await page.getByRole('button', { name: /Send message/ }).click();

    await expect(page.locator('[data-contact-success]')).toBeVisible();
    await expect(page.locator('[data-success-title]')).toHaveText('Message sent.');
    await page.getByRole('button', { name: /Send another message/ }).click();
    await expect(page.locator('[data-contact-form]')).toBeVisible();
  });

  test('validates in Brazilian Portuguese too', async ({ page }) => {
    await page.goto('/pt-br/contact');
    await page.getByRole('button', { name: /Enviar mensagem/ }).click();
    await expect(page.locator('[data-error-for="email"]')).toHaveText(/e-mail válido/);
  });
});

test.describe('404', () => {
  test('offers search and navigation links', async ({ page }) => {
    const response = await page.goto('/a-page-that-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.locator('[data-search-open]').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Documentation/ }).first()).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: 'Pricing' })).toBeVisible();
  });
});

test.describe('internationalization', () => {
  test('emits reciprocal hreflang links and canonical URLs', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      /\/pricing\/?$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute(
      'href',
      /\/pt-br\/pricing\/?$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      /\/pricing\/?$/,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
  });

  test('locale switcher keeps the current page', async ({ page }) => {
    await page.goto('/blog/tags/performance');
    await page.locator('header a[hreflang="pt-BR"]:visible').click();
    await expect(page).toHaveURL(/\/pt-br\/blog\/tags\/performance\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

    await page.locator('header a[hreflang="en"]:visible').click();
    await expect(page).toHaveURL(/\/blog\/tags\/performance\/?$/);
  });

  test('Portuguese pages are naturally translated, not English with a prefix', async ({ page }) => {
    await page.goto('/pt-br/pricing');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('contas');
    await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
    await expect(page.getByText('Economize 20%')).toBeVisible();
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'pt_BR');
  });

  test('translated content collections are reachable in both locales', async ({ page }) => {
    await page.goto('/pt-br/docs/installation');
    await expect(page.locator('h1')).toContainText('Instalação');

    await page.goto('/pt-br/blog/deploy-previews-are-the-prs-missing-half');
    await expect(page.locator('h1')).toContainText(/prévia/i);
    await expect(page.getByText(/min de leitura/).first()).toBeVisible();
  });

  test('the localized 404 is on brand', async ({ page }) => {
    const response = await page.goto('/pt-br/pagina-inexistente');
    expect(response?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByText('apagou')).toBeVisible();
  });
});
