/**
 * Brasa behaviors — one tiny vanilla module for the whole site.
 *
 * Everything here is event delegation on `document` plus an `astro:page-load`
 * hook, so it survives View Transitions without re-binding. Total size stays
 * well under 3 KB gzipped.
 */

import type { TransitionBeforeSwapEvent } from 'astro:transitions/client';

const THEME_KEY = 'brasa:theme';
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

type Theme = 'dark' | 'light';

let header: HTMLElement | null = null;
let scrollTicking = false;

/* ---------------------------------- Theme --------------------------------- */

function currentTheme(): Theme {
  return root.dataset.theme === 'light' ? 'light' : 'dark';
}

function setTheme(next: Theme, persist = true): void {
  root.dataset.theme = next;
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable (private mode) — theme still applies per page */
    }
  }
  syncThemeColor();
}

function syncThemeColor(): void {
  const meta = document.querySelector('meta[name="theme-color"]');
  const color = getComputedStyle(root).getPropertyValue('--theme-color').trim();
  if (meta && color) meta.setAttribute('content', color);
}

/* ---------------------------------- Menu ---------------------------------- */

function menuOpen(): boolean {
  return root.hasAttribute('data-menu-open');
}

function sheet(): HTMLElement | null {
  return document.querySelector('[data-menu]');
}

function menuTriggers(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[data-menu-toggle]')];
}

function openMenu(): void {
  root.setAttribute('data-menu-open', '');
  menuTriggers().forEach((button) => button.setAttribute('aria-expanded', 'true'));
  const first = sheet()?.querySelector<HTMLElement>('a[href], button:not([disabled])');
  first?.focus();
}

function closeMenu(refocusTrigger = true): void {
  if (!menuOpen()) return;
  root.removeAttribute('data-menu-open');
  menuTriggers().forEach((button) => button.setAttribute('aria-expanded', 'false'));
  if (refocusTrigger) menuTriggers()[0]?.focus();
}

/* ------------------------------- Delegated events ------------------------- */

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const menuTrigger = target.closest<HTMLElement>('[data-menu-toggle]');
  if (menuTrigger) {
    if (menuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
    return;
  }

  // Follow sheet links normally, but close the sheet without moving focus.
  if (menuOpen() && target.closest('[data-menu] a')) {
    closeMenu(false);
    return;
  }

  const themeTrigger = target.closest<HTMLElement>('[data-theme-toggle]');
  if (themeTrigger) {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }
});

document.addEventListener('keydown', (event) => {
  if (!menuOpen()) return;

  if (event.key === 'Escape') {
    closeMenu();
    return;
  }

  if (event.key === 'Tab') {
    const container = sheet();
    if (!container) return;
    const focusables = [
      ...container.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ];
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (active === null || !container.contains(active)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

/* --------------------------------- Scroll --------------------------------- */

window.addEventListener(
  'scroll',
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollTicking = false;
      header?.toggleAttribute('data-scrolled', window.scrollY > 8);
    });
  },
  { passive: true },
);

/* ------------------------------ View transitions -------------------------- */

// Carry the theme attribute into the incoming document (prevents a flash).
document.addEventListener('astro:before-swap', (event) => {
  const { newDocument } = event as TransitionBeforeSwapEvent;
  newDocument.documentElement.dataset.theme = currentTheme();
});

document.addEventListener('astro:page-load', () => {
  header = document.querySelector<HTMLElement>('[data-header]');
  header?.toggleAttribute('data-scrolled', window.scrollY > 8);
  syncThemeColor();
  initGlow();
  initSpotlight();
  initCountUp();
});

/* --------------------------------- Glow ----------------------------------- */

/** Pointer-reactive ember glow: --gx/--gy on [data-glow] elements. */
function initGlow(): void {
  if (reducedMotion.matches) return;
  document.querySelectorAll<HTMLElement>('[data-glow]').forEach((zone) => {
    zone.addEventListener(
      'pointermove',
      (event) => {
        const rect = zone.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        zone.style.setProperty('--gx', x.toFixed(3));
        zone.style.setProperty('--gy', y.toFixed(3));
      },
      { passive: true },
    );
  });
}

/* ------------------------------- Spotlight -------------------------------- */

/** Cursor spotlight: --sp-x/--sp-y on spotlight cards. */
function initSpotlight(): void {
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
    card.addEventListener(
      'pointermove',
      (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--sp-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--sp-y', `${event.clientY - rect.top}px`);
      },
      { passive: true },
    );
  });
}

/* --------------------------------- CountUp --------------------------------- */

const COUNTUP_DURATION = 1400;

/** Count-up metrics: animate once, only when visible, only when motion is OK. */
function initCountUp(): void {
  if (reducedMotion.matches) return;

  document.querySelectorAll<HTMLElement>('[data-countup]').forEach((element) => {
    if (element.dataset.wired) return;
    element.dataset.wired = '1';

    const target = Number(element.dataset.value ?? '0');
    const decimals = Number(element.dataset.decimals ?? '0');
    const prefix = element.dataset.prefix ?? '';
    const suffix = element.dataset.suffix ?? '';
    const render = (value: number): void => {
      element.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number): void => {
          const progress = Math.min((now - start) / COUNTUP_DURATION, 1);
          const eased = 1 - (1 - progress) ** 3;
          render(target * eased);
          if (progress < 1) requestAnimationFrame(step);
          else render(target);
        };

        element.dataset.started = '1';
        render(0);
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
  });
}

/* ---------------------------------- Copy ----------------------------------- */

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const trigger = target?.closest<HTMLElement>('[data-copy]');
  if (!trigger) return;

  const source = document.getElementById(trigger.dataset.copy ?? '');
  const text = source?.textContent?.trim();
  if (!text) return;

  void navigator.clipboard
    .writeText(text)
    .then(() => {
      trigger.dataset.state = 'copied';
      const feedback = trigger.querySelector('[data-copy-feedback]');
      if (feedback) feedback.textContent = trigger.dataset.copiedLabel ?? 'Copied to clipboard';
      window.setTimeout(() => {
        delete trigger.dataset.state;
        if (feedback) feedback.textContent = '';
      }, 2200);
    })
    .catch(() => {
      /* Clipboard unavailable (insecure context / denied) — stay silent. */
    });
});
