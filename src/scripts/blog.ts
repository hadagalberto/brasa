/**
 * Blog island — table-of-contents highlighting and share-link copying.
 * Only loaded on blog pages; a few hundred bytes gzipped. Delegated events
 * attach once; the TOC observer re-initialises on `astro:page-load` so it
 * survives View Transitions.
 */

/** Active-section tracking for the sticky TOC. */
function initToc(): void {
  const nav = document.querySelector<HTMLElement>('[data-toc]');
  if (!nav) return;

  const links = new Map<string, HTMLAnchorElement>();
  nav.querySelectorAll<HTMLAnchorElement>('[data-toc-link]').forEach((link) => {
    links.set(link.dataset.tocLink ?? '', link);
  });

  const headings = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((heading): heading is HTMLElement => heading !== null);
  if (headings.length === 0) return;

  const setActive = (id: string): void => {
    for (const [headingId, link] of links) {
      const active = headingId === id;
      link.setAttribute('aria-current', active ? 'true' : 'false');
      const item = link.closest('li');
      if (active) item?.setAttribute('data-active', '');
      else item?.removeAttribute('data-active');
    }
  };

  // The first heading is active from the start (top of the article).
  let current = headings[0]?.id ?? '';
  setActive(current);

  // A thin band just below the sticky header: whichever heading occupies
  // it is "where the reader is". Scrolling up re-triggers the heading above.
  const headerOffset = 96;
  const bandBottom = Math.max(0.3, 0.9 - headerOffset / window.innerHeight);
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) current = entry.target.id;
      }
      setActive(current);
    },
    {
      rootMargin: `-${headerOffset}px 0px -${Math.round((1 - bandBottom) * 100)}% 0px`,
      threshold: 0,
    },
  );

  headings.forEach((heading) => observer.observe(heading));
}

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

/* -------------------------------- Lifecycle -------------------------------- */

document.addEventListener('astro:page-load', () => {
  initToc();
});
