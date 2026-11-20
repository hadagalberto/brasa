import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

export type Release = CollectionEntry<'changelog'>;

/** Releases for one locale, newest first. */
export async function getReleases(locale: Locale = 'en'): Promise<Release[]> {
  const entries = await getCollection('changelog', ({ data }) => data.lang === locale);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
