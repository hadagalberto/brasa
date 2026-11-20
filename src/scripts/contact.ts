/**
 * Contact form validation — accessible, inline, no framework. Error messages
 * come from the active locale dictionary via data attributes on the form.
 */

type FieldName = 'name' | 'email' | 'topic' | 'message' | 'consent';

interface Messages {
  name: string;
  email: string;
  topic: string;
  message: string;
  consent: string;
}

interface SuccessText {
  title: string;
  body: string;
  reset: string;
}

function parse<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function validate(field: FieldName, value: string, checked: boolean, errors: Messages): string {
  switch (field) {
    case 'name':
      return value.trim().length >= 2 ? '' : errors.name;
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : errors.email;
    case 'topic':
      return value ? '' : errors.topic;
    case 'message':
      return value.trim().length >= 20 ? '' : errors.message;
    case 'consent':
      return checked ? '' : errors.consent;
  }
}

function bindContact(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form || form.dataset.wired) return;
  form.dataset.wired = '1';

  const errors = parse<Messages>(form.dataset.errors, {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    topic: 'Please choose a topic.',
    message: 'Please write at least twenty characters.',
    consent: 'Please agree before sending.',
  });
  const success = parse<SuccessText>(form.dataset.success, {
    title: 'Message sent.',
    body: 'Thanks for writing.',
    reset: 'Send another message',
  });

  const fields: FieldName[] = ['name', 'email', 'topic', 'message', 'consent'];
  const summary = form.querySelector<HTMLElement>('[data-contact-summary]');
  const panel = document.querySelector<HTMLElement>('[data-contact-success]');

  const setError = (field: FieldName, message: string): void => {
    const messageEl = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    if (messageEl) messageEl.textContent = message;
    const input = form.elements.namedItem(field);
    if (
      input instanceof HTMLInputElement ||
      input instanceof HTMLTextAreaElement ||
      input instanceof HTMLSelectElement
    ) {
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
  };

  const check = (field: FieldName, announce = false): boolean => {
    const input = form.elements.namedItem(field);
    const value =
      input instanceof HTMLInputElement ||
      input instanceof HTMLTextAreaElement ||
      input instanceof HTMLSelectElement
        ? input.value
        : '';
    const checked = input instanceof HTMLInputElement ? input.checked : false;
    const message = validate(field, value, checked, errors);
    setError(field, message);
    if (announce && message && summary) summary.textContent = '';
    return message === '';
  };

  for (const field of fields) {
    const input = form.elements.namedItem(field);
    if (
      input instanceof HTMLInputElement ||
      input instanceof HTMLTextAreaElement ||
      input instanceof HTMLSelectElement
    ) {
      input.addEventListener('blur', () => check(field));
      input.addEventListener('input', () => {
        const messageEl = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
        if (messageEl?.textContent) check(field);
      });
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const results = fields.map((field) => ({ field, valid: check(field, true) }));
    const firstInvalid = results.find((result) => !result.valid);
    if (firstInvalid) {
      const input = form.elements.namedItem(firstInvalid.field);
      if (input instanceof HTMLElement) input.focus();
      if (summary) summary.textContent = errors[firstInvalid.field];
      return;
    }

    if (summary) summary.textContent = '';
    form.hidden = true;
    if (panel) {
      const title = panel.querySelector<HTMLElement>('[data-success-title]');
      const body = panel.querySelector<HTMLElement>('[data-success-body]');
      const resetLabel = panel.querySelector<HTMLElement>('[data-success-reset]');
      if (title) title.textContent = success.title;
      if (body) body.textContent = success.body;
      if (resetLabel) resetLabel.textContent = success.reset;
      panel.classList.remove('hidden');
      panel.scrollIntoView({ block: 'center', behavior: 'smooth' });
      panel.querySelector<HTMLElement>('[data-success-title]')?.focus();
    }
  });

  const reset = document.querySelector<HTMLButtonElement>('[data-contact-reset]');
  reset?.addEventListener('click', () => {
    form.reset();
    for (const field of fields) setError(field, '');
    form.hidden = false;
    panel?.classList.add('hidden');
    const first = form.elements.namedItem('name');
    if (first instanceof HTMLElement) first.focus();
  });
}

bindContact();
document.addEventListener('astro:page-load', bindContact);
