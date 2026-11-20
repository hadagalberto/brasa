/**
 * Blog domain helpers — sorting, reading time, pagination slices, tag and
 * author indexes, related-post scoring and prev/next neighbours. Every blog
 * page (index, pagination, tags, authors, post, feeds, OG images) derives
 * from these so the rules live in exactly one place.
 */

import { getCollection, render, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Author = CollectionEntry<'authors'>;

/** Published posts, newest first. Drafts never render anywhere. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id),
  );
}

export async function getAuthor(id: string): Promise<Author> {
  const authors = await getCollection('authors');
  const author = authors.find((entry) => entry.id === id);
  if (!author) throw new Error(`Unknown author id: "${id}"`);
  return author;
}

/* ------------------------------ Reading time ------------------------------ */

const WORDS_PER_MINUTE = 200;

/** Strips MDX/component syntax so only readable words count. */
function readableWords(markdown: string): number {
  const text = markdown
    // Import statements and exported frontmatter code.
    .replace(/^---[\s\S]*?---/g, '')
    .replace(/^import[\s\S]*?from\s+['"].*?['"];?$/gm, '')
    // Component tags (<Callout …>…</Callout>) keep their inner text.
    .replace(/<\/?[A-Z][\w.]*[^>]*>/g, ' ')
    // Code fences are skipped, not skimmed.
    .replace(/```[\s\S]*?```/g, ' ');
  const words = text.match(/[\p{L}\p{N}'’-]+/gu) ?? [];
  return words.length;
}

/** Rounded-up reading time in minutes. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.ceil(readableWords(body) / WORDS_PER_MINUTE));
}

export function readingTimeLabel(body: string): string {
  const minutes = readingMinutes(body);
  return `${minutes} min read`;
}

/* -------------------------------- Formatting ------------------------------- */

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

/** "March 4, 2025" — dates are UTC-only, so the site never shifts. */
export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}

/** RFC 822 date for RSS items. */
export function formatRssDate(date: Date): string {
  return date.toUTCString().replace('GMT', '+0000');
}

/* --------------------------------- Tags ----------------------------------- */

export interface TagInfo {
  /** Original display label, e.g. "Deploy previews". */
  label: string;
  /** URL slug, e.g. "deploy-previews". */
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

export function tagSlug(label: string): string {
  return slugify(label);
}

export function tagHref(label: string): string {
  return `${import.meta.env.BASE_URL}blog/tags/${tagSlug(label)}`;
}

/** All tags with counts, most used first, then alphabetical. */
export function collectTags(posts: Post[]): TagInfo[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, slug: slugify(label), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/* ------------------------------- Pagination -------------------------------- */

export const PAGE_SIZE = 6;

export interface PageSlice {
  /** Post list for the page (featured excluded everywhere). */
  posts: Post[];
  page: number;
  totalPages: number;
  /** null on the first page. */
  prevHref: string | null;
  /** null on the last page. */
  nextHref: string | null;
}

export function paginate(
  posts: Post[],
  page: number,
  basePath = `${import.meta.env.BASE_URL}blog`,
): PageSlice {
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

/** The featured post, newest if several claim the slot. */
export function pickFeatured(posts: Post[]): Post | undefined {
  return posts.find((post) => post.data.featured);
}

/**
 * Up to `limit` posts sharing the most tags with `post` (never itself).
 * Ties break by publication date so the list is stable across builds.
 */
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

/** Chronological neighbours of a post within the sorted list. */
export function neighbours(posts: Post[], post: Post): { prev: Post | null; next: Post | null } {
  const index = posts.findIndex((entry) => entry.id === post.id);
  if (index === -1) return { prev: null, next: null };
  return {
    // prev = older, next = newer (the list is newest-first).
    prev: index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
    next: index > 0 ? (posts[index - 1] ?? null) : null,
  };
}

/* --------------------------------- Feeds ----------------------------------- */

export function postHref(post: Post): string {
  return `${import.meta.env.BASE_URL}blog/${post.id}`;
}

export function authorHref(id: string): string {
  return `${import.meta.env.BASE_URL}blog/authors/${id}`;
}

export { render };
