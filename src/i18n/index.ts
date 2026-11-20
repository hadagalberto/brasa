/**
 * Locale utilities. Astro's i18n routing generates English at `/…` and
 * Portuguese at `/pt-br/…`; these helpers keep paths, dictionaries and
 * alternate links in sync across every page.
 */
import { en, type Dictionary } from './en';
import { ptBr } from './pt-br';

export type Locale = 'en' | 'pt-br';

export const locales: Locale[] = ['en', 'pt-br'];

export const localeLang: Record<Locale, string> = {
  en: 'en',
  'pt-br': 'pt-BR',
};

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  'pt-br': ptBr,
};

/** Translate a string bundle for a locale. */
export function ui(locale: Locale | string | undefined): Dictionary {
  return locale === 'pt-br' ? ptBr : en;
}

/** Normalise Astro.currentLocale (undefined on default-locale routes). */
export function normalizeLocale(value: string | undefined): Locale {
  return value === 'pt-br' ? 'pt-br' : 'en';
}

/**
 * getStaticPaths entries shared by every localized page. `undefined` makes
 * Astro generate the default locale at the unprefixed root route.
 */
export function localeParams<T extends Record<string, string | number> = Record<string, never>>(
  rest?: (locale: Locale) => T,
): Array<{ params: { lang: string | undefined } & T; props?: { lang: Locale } }> {
  return locales.map((lang) => ({
    params: { lang: lang === 'en' ? undefined : lang, ...(rest?.(lang) ?? ({} as T)) },
    props: { lang },
  }));
}

/**
 * Build an internal path for a locale, including the configured base path.
 * `localizedPath('/blog', 'pt-br')` → `/pt-br/blog`.
 */
export function localizedPath(path: string, locale: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const full = `${base}${prefix}${clean}`;
  return full.length > 1 && full.endsWith('/') ? full.slice(0, -1) : full || '/';
}

/**
 * Swap the locale in an absolute pathname while keeping the current page.
 * `/pt-br/blog/tags/performance` → `/blog/tags/performance` for `en`.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let path = pathname;
  if (base && path.startsWith(base)) path = path.slice(base.length);
  path = path.replace(/^\/pt-br(?=\/|$)/, '');
  if (!path.startsWith('/')) path = `/${path}`;
  const full = `${base}${target === 'en' ? '' : `/${target}`}${path}`;
  const trimmed =
    full.endsWith('/') && full.length > (base || '/').length ? full.slice(0, -1) : full;
  return trimmed || '/';
}

/** Extract the page path without any locale prefix (for hreflang links). */
export function unlocalizedPath(pathname: string): string {
  return switchLocalePath(pathname, 'en');
}

export function ogLocale(locale: Locale): string {
  return locale === 'pt-br' ? 'pt_BR' : 'en_US';
}
