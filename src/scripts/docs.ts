/**
 * Docs island — mobile sidebar drawer. Native <dialog>.showModal() supplies
 * the focus trap, inert background and Escape handling; this module only wires
 * the triggers and restores focus on close.
 */

import './toc';

let opener: HTMLElement | null = null;

function drawer(): HTMLDialogElement | null {
  return document.querySelector<HTMLDialogElement>('[data-docs-drawer]');
}

function setTrigger(expanded: boolean): void {
  document.querySelectorAll<HTMLElement>('[data-docs-drawer-open]').forEach((trigger) => {
    trigger.setAttribute('aria-expanded', String(expanded));
  });
}

function openDrawer(trigger: HTMLElement): void {
  const element = drawer();
  if (!element || element.open) return;
  opener = trigger;
  element.showModal();
  setTrigger(true);
  element.querySelector<HTMLElement>('[data-docs-drawer-close]')?.focus();
}

function closeDrawer(): void {
  const element = drawer();
  if (!element?.open) return;
  element.close();
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const trigger = target.closest<HTMLElement>('[data-docs-drawer-open]');
  if (trigger) {
    openDrawer(trigger);
    return;
  }

  if (target.closest('[data-docs-drawer-close]')) {
    closeDrawer();
    return;
  }

  const element = drawer();
  if (!element?.open) return;

  // Following a doc link closes the drawer; focus moves with the navigation.
  if (target.closest('[data-docs-drawer] a')) {
    element.close();
    return;
  }

  // A click on the backdrop (the dialog element itself) closes it.
  if (target === element) closeDrawer();
});

document.addEventListener(
  'close',
  (event) => {
    if (
      !(event.target instanceof HTMLDialogElement) ||
      !event.target.matches('[data-docs-drawer]')
    ) {
      return;
    }
    setTrigger(false);
    if (opener?.isConnected) opener.focus();
    opener = null;
  },
  true,
);
