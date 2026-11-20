/** Base-path-aware link to a docs page, safe to use inside MDX expressions. */
import { localizedPath, type Locale } from '../i18n';

export function docLink(slug: string, lang: Locale = 'en'): string {
  return localizedPath(`/docs/${slug}`, lang);
}
