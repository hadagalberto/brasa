/**
 * Blog island — share-link copying plus the shared TOC observer. Only loaded
 * on blog posts; a few hundred bytes gzipped. Delegated events attach once.
 */
import './toc';

/* ------------------------------ Share links -------------------------------- */

const SHARE_RESET_MS = 2200;

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const button = target?.closest<HTMLElement>('[data-share-copy]');
  if (!button) return;

  // Prefer the canonical URL; fall back to the address bar.
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const url = canonical?.href ?? document.location.href;

  void navigator.clipboard
    .writeText(url)
    .then(() => {
      button.dataset.state = 'copied';
      const feedback = button.querySelector('[data-share-feedback]');
      if (feedback) feedback.textContent = 'Link copied to clipboard';
      window.setTimeout(() => {
        delete button.dataset.state;
        if (feedback) feedback.textContent = '';
      }, SHARE_RESET_MS);
    })
    .catch(() => {
      /* Clipboard unavailable (insecure context / denied) — stay silent. */
    });
});
