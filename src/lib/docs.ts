/**
 * Docs domain helpers — one ordered manual per locale, shared by the sidebar,
 * the index, prev/next navigation, breadcrumbs, the search card list and OG
 * images.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './with-base';
import { localizedPath, ogLocale, type Locale } from '../i18n';

export type Doc = CollectionEntry<'docs'>;

/** Sidebar section order. Keep in sync with the docs Zod enum. */
export const DOC_GROUPS = ['Getting started', 'Guides', 'Reference', 'Resources'] as const;

export type DocGroup = (typeof DOC_GROUPS)[number];

/** Collection ids carry the locale folder; route slugs do not. */
export function docSlug(doc: Doc): string {
  return doc.id.replace(/^pt-br\//, '');
}

/** Stably sorted manual: section order, then author-assigned order, then title. */
export async function getDocs(locale: Locale = 'en'): Promise<Doc[]> {
  const docs = await getCollection('docs', ({ data }) => data.lang === locale);
  return docs.sort((a, b) => {
    const group = DOC_GROUPS.indexOf(a.data.group) - DOC_GROUPS.indexOf(b.data.group);
    return (
      group ||
      a.data.order - b.data.order ||
      a.data.title.localeCompare(b.data.title, ogLocale(locale))
    );
  });
}

export function docsHref(doc: Doc): string {
  return localizedPath(`/docs/${docSlug(doc)}`, doc.data.lang);
}

export interface DocGroupView {
  name: DocGroup;
  docs: Doc[];
}

export function groupDocs(docs: Doc[]): DocGroupView[] {
  return DOC_GROUPS.map((name) => ({
    name,
    docs: docs.filter((doc) => doc.data.group === name),
  })).filter((group) => group.docs.length > 0);
}

export function docsNeighbours(docs: Doc[], doc: Doc): { prev: Doc | null; next: Doc | null } {
  const index = docs.findIndex((entry) => entry.id === doc.id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? (docs[index - 1] ?? null) : null,
    next: index < docs.length - 1 ? (docs[index + 1] ?? null) : null,
  };
}

/** "edit this page" URL, derived from the repo configured in brasa.config.ts. */
export function editUrl(doc: Doc, repo: string, branch = 'main'): string {
  return `${repo.replace(/\/$/, '')}/edit/${branch}/src/content/docs/${doc.id}.mdx`;
}

export function ogImagePath(doc: Doc): string {
  return withBase(`og/docs/${docSlug(doc)}-${doc.data.lang}.png`);
}
