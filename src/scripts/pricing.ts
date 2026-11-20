/**
 * Pricing period toggle. Only text inside a fixed-height slot changes, so the
 * cards never reflow — the CLS budget is part of the design, not an afterthought.
 */

function apply(period: 'monthly' | 'yearly'): void {
  const toggle = document.querySelector<HTMLElement>('[data-billing-toggle]');
  if (!toggle) return;

  for (const button of toggle.querySelectorAll<HTMLButtonElement>('[data-billing]')) {
    const active = button.dataset.billing === period;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('is-active', active);
  }

  for (const slot of document.querySelectorAll<HTMLElement>('[data-price-slot]')) {
    const next = period === 'yearly' ? slot.dataset.yearly : slot.dataset.monthly;
    if (next !== undefined) slot.textContent = next;
  }

  for (const note of document.querySelectorAll<HTMLElement>('[data-billing-note]')) {
    note.textContent = period === 'yearly' ? (toggle.dataset.yearlyNote ?? '') : '';
  }
}

function bindPricing(): void {
  const toggle = document.querySelector<HTMLElement>('[data-billing-toggle]');
  if (!toggle || toggle.dataset.wired) return;
  toggle.dataset.wired = '1';
  for (const button of toggle.querySelectorAll<HTMLButtonElement>('[data-billing]')) {
    button.addEventListener('click', () => {
      apply(button.dataset.billing === 'yearly' ? 'yearly' : 'monthly');
    });
  }
}

bindPricing();
document.addEventListener('astro:page-load', bindPricing);
