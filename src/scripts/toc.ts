/**
 * Table-of-contents island — shared by blog posts and docs pages. All TOCs on
 * a page (mobile disclosure + desktop rail) follow one IntersectionObserver.
 */

let tocObserver: IntersectionObserver | null = null;

export function initToc(): void {
  tocObserver?.disconnect();
  tocObserver = null;

  const navs = [...document.querySelectorAll<HTMLElement>('[data-toc]')];
  if (navs.length === 0) return;

  const linkMaps = navs.map((nav) => {
    const links = new Map<string, HTMLAnchorElement>();
    nav.querySelectorAll<HTMLAnchorElement>('[data-toc-link]').forEach((link) => {
      links.set(link.dataset.tocLink ?? '', link);
    });
    return links;
  });

  const headings = [...(linkMaps[0]?.keys() ?? [])]
    .map((id) => document.getElementById(id))
    .filter((heading): heading is HTMLElement => heading !== null);
  if (headings.length === 0) return;

  const setActive = (id: string): void => {
    for (const links of linkMaps) {
      for (const [headingId, link] of links) {
        const active = headingId === id;
        link.setAttribute('aria-current', active ? 'true' : 'false');
        const item = link.closest('li');
        if (active) item?.setAttribute('data-active', '');
        else item?.removeAttribute('data-active');
      }
    }
  };

  let current = headings[0]?.id ?? '';
  setActive(current);

  const headerOffset = 96;
  const bandBottom = Math.max(0.3, 0.9 - headerOffset / window.innerHeight);
  tocObserver = new IntersectionObserver(
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

  headings.forEach((heading) => tocObserver?.observe(heading));
}

initToc();
document.addEventListener('astro:page-load', () => {
  initToc();
});
