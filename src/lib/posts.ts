/**
 * Blog domain helpers — sorting, reading time, pagination slices, tag and
 * author indexes, related-post scoring and prev/next neighbours. Every blog
 * page (index, pagination, tags, authors, post, feeds, OG images) derives
 * from these so the rules live in exactly one place.
 */

import { getCollection, render, type CollectionEntry } from 'astro:content';
import { localizedPath, type Locale } from '../i18n';

export type Post = CollectionEntry<'blog'>;
export type Author = CollectionEntry<'authors'>;

/** Collection ids carry the locale folder; route slugs do not. */
export function postSlug(post: Post): string {
  return post.id.replace(/^pt-br\//, '');
}

export function authorId(author: Author): string {
  return author.id.replace(/^pt-br\//, '');
}

/** Published posts for one locale, newest first. Drafts never render. */
export async function getPosts(locale: Locale = 'en'): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.lang === locale);
  return posts.sort(
    (a, b) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || postSlug(a).localeCompare(postSlug(b)),
  );
}

export async function getAuthors(locale: Locale = 'en'): Promise<Author[]> {
  return getCollection('authors', ({ data }) => data.lang === locale);
}

export async function getAuthor(id: string, locale: Locale = 'en'): Promise<Author> {
  const authors = await getAuthors(locale);
  const author = authors.find((entry) => authorId(entry) === id);
  if (!author) throw new Error(`Unknown author id: "${id}" for locale "${locale}"`);
  return author;
}

/* ------------------------------ Reading time ------------------------------ */

const WORDS_PER_MINUTE = 200;

/** Strips MDX/component syntax so only readable words count. */
function readableWords(markdown: string): number {
  const text = markdown
    .replace(/^---[\s\S]*?---/g, '')
    .replace(/^import[\s\S]*?from\s+['"].*?['"];?$/gm, '')
    .replace(/<\/?[A-Z][\w.]*[^>]*>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ');
  const words = text.match(/[\p{L}\p{N}'’-]+/gu) ?? [];
  return words.length;
}

export function readingMinutes(body: string): number {
  return Math.max(1, Math.ceil(readableWords(body) / WORDS_PER_MINUTE));
}

export function readingTimeLabel(body: string, locale: Locale = 'en'): string {
  const minutes = readingMinutes(body);
  return locale === 'pt-br' ? `${minutes} min de leitura` : `${minutes} min read`;
}

/* -------------------------------- Formatting ------------------------------- */

const DATE_FORMATS: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }),
  'pt-br': new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }),
};

/** "March 4, 2025" / "4 de março de 2025" — UTC-only, so the site never shifts. */
export function formatDate(date: Date, locale: Locale = 'en'): string {
  return DATE_FORMATS[locale].format(date);
}

export function formatRssDate(date: Date): string {
  return date.toUTCString().replace('GMT', '+0000');
}

/* --------------------------------- Tags ----------------------------------- */

export interface TagInfo {
  label: string;
  slug: string;
  count: number;
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Synonyms across locales share one canonical URL slug. */
const TAG_SLUGS: Record<string, string> = {
  acessibilidade: 'accessibility',
  'previews-de-deploy': 'deploy-previews',
  'previews-de-implantacao': 'deploy-previews',
  'cultura-de-engenharia': 'engineering-culture',
};

export function tagSlug(label: string): string {
  const key = slugify(label);
  return TAG_SLUGS[key] ?? key;
}

export function tagHref(label: string, locale: Locale = 'en'): string {
  return localizedPath(`/blog/tags/${tagSlug(label)}`, locale);
}

export function collectTags(posts: Post[]): TagInfo[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const post of posts) {
    for (const label of post.data.tags) {
      const slug = tagSlug(label);
      const entry = counts.get(slug);
      counts.set(slug, { label: entry?.label ?? label, count: (entry?.count ?? 0) + 1 });
    }
  }
  return [...counts.entries()]
    .map(([slug, { label, count }]) => ({ label, slug, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/* ------------------------------- Pagination -------------------------------- */

export const PAGE_SIZE = 6;

export interface PageSlice {
  posts: Post[];
  page: number;
  totalPages: number;
  prevHref: string | null;
  nextHref: string | null;
}

export function paginate(posts: Post[], page: number, basePath: string): PageSlice {
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  return {
    posts: posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    page,
    totalPages,
    prevHref: page > 1 ? (page === 2 ? basePath : `${basePath}/page/${page - 1}`) : null,
    nextHref: page < totalPages ? `${basePath}/page/${page + 1}` : null,
  };
}

export function pageHref(basePath: string, page: number): string {
  return page === 1 ? `${basePath}/` : `${basePath}/page/${page}`;
}

/* ----------------------------- Post relations ------------------------------ */

export function pickFeatured(posts: Post[]): Post | undefined {
  return posts.find((post) => post.data.featured);
}

export function relatedPosts(all: Post[], post: Post, limit = 2): Post[] {
  return all
    .filter((other) => other.id !== post.id)
    .map((other) => {
      const shared = other.data.tags.filter((tag) => post.data.tags.includes(tag)).length;
      return { other, shared };
    })
    .filter(({ shared }) => shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared || b.other.data.pubDate.valueOf() - a.other.data.pubDate.valueOf(),
    )
    .slice(0, limit)
    .map(({ other }) => other);
}

export function neighbours(posts: Post[], post: Post): { prev: Post | null; next: Post | null } {
  const index = posts.findIndex((entry) => entry.id === post.id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
    next: index > 0 ? (posts[index - 1] ?? null) : null,
  };
}

/* --------------------------------- Feeds ----------------------------------- */

export function postHref(post: Post): string {
  return localizedPath(`/blog/${postSlug(post)}`, post.data.lang);
}

export function authorHref(id: string, locale: Locale = 'en'): string {
  return localizedPath(`/blog/authors/${id}`, locale);
}

export { render };
