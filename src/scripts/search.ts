/**
 * Search island — Pagefind's static index behind a custom dialog.
 *
 * The index is fetched lazily on first open, so the initial page never pays
 * for it. The dialog is native (<dialog>.showModal()), which provides the
 * focus trap; this module adds shortcuts, debounced queries, live status and
 * arrow-key navigation through the results.
 */

interface PagefindData {
  url: string;
  excerpt: string;
  title?: string;
  meta?: Record<string, string>;
}

interface PagefindResult {
  id: string;
  data: () => Promise<PagefindData>;
}

interface PagefindApi {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
}

const MAX_RESULTS = 8;
const DEBOUNCE_MS = 140;

let indexPromise: Promise<PagefindApi> | null = null;
let debounce: number | undefined;
let requestId = 0;
let searchOpener: HTMLElement | null = null;

function getDialog(): HTMLDialogElement | null {
  return document.querySelector<HTMLDialogElement>('[data-search-dialog]');
}

function getInput(): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>('[data-search-input]');
}

function getResults(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-search-results]');
}

function getStatus(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-search-status]');
}

function loadIndex(): Promise<PagefindApi> {
  if (!indexPromise) {
    const base = getDialog()?.dataset.searchBase ?? '/';
    // The file is emitted into dist at build time, not bundled by Vite.
    indexPromise = import(/* @vite-ignore */ `${base}pagefind/pagefind.js`).then(
      (module) => (module.default ?? module) as PagefindApi,
    );
  }
  return indexPromise;
}

function setStatus(text: string): void {
  const element = getStatus();
  if (element) element.textContent = text;
}

function clearCursor(): void {
  getResults()
    ?.querySelectorAll<HTMLElement>('[data-cursor]')
    .forEach((element) => element.removeAttribute('data-cursor'));
}

/** Title without the site suffix; docs/blog pages carry one in <title>. */
function cleanTitle(value: string | undefined, url: string): string {
  if (value) return value.replace(/\s+·\s+Brasa$/, '').trim();
  const fromPath = url.split('/').filter(Boolean).pop() ?? 'Page';
  return fromPath.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pathLabel(url: string): string {
  try {
    const path = new URL(url, window.location.origin).pathname.replace(/\/$/, '');
    return path === '' ? 'Home' : path.replace(/^\//, '');
  } catch {
    return 'Page';
  }
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function showIntro(): void {
  const container = getResults();
  if (!container) return;
  container.replaceChildren();
  setStatus('Start typing to search the whole site.');

  const empty = element('div', 'search-empty');
  empty.append(
    element('p', undefined, 'Find a guide, a component or a field in the config.'),
    element('span', undefined, 'Try a topic — or jump straight to a popular page.'),
  );
  const chips = element('div', 'search-suggestions');
  const suggestions = [
    { label: 'Installation', href: `${getDialog()?.dataset.searchBase ?? '/'}docs/installation` },
    { label: 'Design tokens', href: `${getDialog()?.dataset.searchBase ?? '/'}docs/design-tokens` },
    { label: 'Components', href: `${getDialog()?.dataset.searchBase ?? '/'}docs/components` },
    { label: 'Deployment', href: `${getDialog()?.dataset.searchBase ?? '/'}docs/deployment` },
  ];
  for (const suggestion of suggestions) {
    const chip = element('a', 'search-chip', suggestion.label);
    chip.href = suggestion.href;
    chips.append(chip);
  }
  empty.append(chips);
  container.append(empty);
}

function showNoResults(query: string): void {
  const container = getResults();
  if (!container) return;
  container.replaceChildren();
  const empty = element('div', 'search-empty');
  empty.append(
    element('p', undefined, `Nothing matched “${query}”.`),
    element('span', undefined, 'Try a shorter term, or browse the documentation.'),
  );
  const chips = element('div', 'search-suggestions');
  const docs = element('a', 'search-chip', 'Browse all docs');
  docs.href = `${getDialog()?.dataset.searchBase ?? '/'}docs`;
  chips.append(docs);
  empty.append(chips);
  container.append(empty);
}

function render(data: PagefindData[]): void {
  const container = getResults();
  if (!container) return;
  container.replaceChildren();

  for (const item of data) {
    const link = element('a', 'search-result');
    link.href = item.url;
    link.setAttribute('data-search-result', '');

    const top = element('span', 'search-result-top');
    top.append(
      element('span', 'search-result-title', cleanTitle(item.title ?? item.meta?.title, item.url)),
      element('span', 'search-result-path', pathLabel(item.url)),
    );
    const excerpt = element('span', 'search-result-excerpt');
    // Pagefind escapes source content and only adds <mark> highlights.
    excerpt.innerHTML = item.excerpt;
    link.append(top, excerpt);
    container.append(link);
  }
}

async function runSearch(query: string, id: number): Promise<void> {
  if (query.trim().length < 2) {
    showIntro();
    return;
  }
  setStatus(`Searching for “${query}”…`);
  try {
    const pagefind = await loadIndex();
    const found = await pagefind.search(query);
    if (id !== requestId || !getDialog()?.open) return;

    const data = await Promise.all(
      found.results.slice(0, MAX_RESULTS).map((result) => result.data()),
    );
    if (id !== requestId || !getDialog()?.open) return;

    if (data.length === 0) {
      setStatus(`No results for “${query}”`);
      showNoResults(query);
      return;
    }
    setStatus(`${data.length} result${data.length === 1 ? '' : 's'} for “${query}”`);
    render(data);
  } catch {
    if (id !== requestId) return;
    setStatus('Search index unavailable');
    const container = getResults();
    if (container) {
      container.replaceChildren();
      const empty = element('div', 'search-empty');
      empty.append(
        element('p', undefined, 'Search is built with the site.'),
        element('span', undefined, 'Run npm run build to generate the Pagefind index.'),
      );
      container.append(empty);
    }
  }
}

function openSearch(trigger?: HTMLElement): void {
  const element = getDialog();
  if (!element || element.open) return;
  if (trigger?.closest('[data-menu]')) {
    document.querySelector<HTMLElement>('[data-menu-toggle]')?.click();
  }
  searchOpener = trigger ?? null;
  element.showModal();
  document.querySelectorAll<HTMLElement>('[data-search-open]').forEach((button) => {
    button.setAttribute('aria-expanded', 'true');
  });
  const field = getInput();
  if (field) {
    field.value = '';
    field.focus();
  }
  showIntro();
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const trigger = target.closest<HTMLElement>('[data-search-open]');
  if (trigger) {
    openSearch(trigger);
    return;
  }
  if (target.closest('[data-search-close]')) {
    getDialog()?.close();
    return;
  }
  const element = getDialog();
  if (!element?.open) return;
  // Clicking a result closes the dialog; the link handles navigation.
  if (target.closest('[data-search-result], .search-chip')) element.close();
  else if (target === element) element.close();
});

document.addEventListener('input', (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.matches('[data-search-input]')) {
    return;
  }
  window.clearTimeout(debounce);
  const query = event.target.value;
  const id = ++requestId;
  clearCursor();
  debounce = window.setTimeout(() => {
    void runSearch(query, id);
  }, DEBOUNCE_MS);
});

document.addEventListener('keydown', (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  const editable =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target?.isContentEditable === true;

  // Shortcuts work everywhere except while typing (except Ctrl/⌘+K).
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch(target ?? undefined);
    return;
  }
  if (event.key === '/' && !editable && !event.altKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    openSearch(target ?? undefined);
    return;
  }

  const element = getDialog();
  if (!element?.open) return;

  if (event.key === 'Escape') {
    element.close();
    return;
  }

  const links = [
    ...element.querySelectorAll<HTMLAnchorElement>('[data-search-result], .search-chip'),
  ];
  const active = document.activeElement;

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (links.length === 0) return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const current = links.indexOf(active as HTMLAnchorElement);
    const next =
      current === -1
        ? direction === 1
          ? 0
          : links.length - 1
        : (current + direction + links.length) % links.length;
    links[next]?.focus();
    for (const link of links) link.removeAttribute('data-cursor');
    links[next]?.setAttribute('data-cursor', '');
    return;
  }

  if (event.key === 'Enter' && (active === getInput() || active === element)) {
    const first = links[0];
    if (first) {
      event.preventDefault();
      first.click();
    }
    return;
  }

  // Native showModal() already traps Tab; this keeps the cycle explicit and
  // predictable when focus comes from a browser extension or the address bar.
  if (event.key === 'Tab') {
    const focusables = [
      getInput(),
      ...element.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled])',
      ),
    ].filter((node): node is HTMLElement => node instanceof HTMLElement);
    const unique = [...new Set(focusables)];
    if (unique.length === 0) return;
    const first = unique[0];
    const last = unique[unique.length - 1];
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    } else if (active === element || active === document.body) {
      event.preventDefault();
      first?.focus();
    }
  }
});

document.addEventListener(
  'close',
  (event) => {
    if (
      !(event.target instanceof HTMLDialogElement) ||
      !event.target.matches('[data-search-dialog]')
    ) {
      return;
    }
    window.clearTimeout(debounce);
    requestId += 1;
    document.querySelectorAll<HTMLElement>('[data-search-open]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });
    if (searchOpener?.isConnected) searchOpener.focus();
    searchOpener = null;
  },
  true,
);
