import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` is deprecated in astro:content as of Astro 7; astro/zod is the stable path.
import { z } from 'astro/zod';

/**
 * Blog posts — MDX, one file per essay. The schema is the contract the
 * theme's blog pages build against: titles, authors, tags, dates and the
 * featured slot all flow from here into the index, feeds, tag and author
 * pages, and the per-post OG images.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z
    .object({
      title: z.string().min(1),
      /** One-two sentence summary: feeds, cards, meta description. */
      description: z.string().min(1),
      /** Author id — must exist in the authors collection. */
      author: z.string(),
      /** Display tags; slugs are derived for /blog/tags/… URLs. */
      tags: z.array(z.string().min(1)).min(1),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Rendered as the hero card on the blog index (first page only). */
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .strict(),
});

/**
 * Blog authors — JSON data entries. Avatars are deterministic initials
 * (see Avatar.astro), so no image assets are needed.
 */
const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z
    .object({
      name: z.string().min(1),
      /** Shown under the name, e.g. on cards and the author page. */
      role: z.string().min(1),
      bio: z.string().min(1),
      location: z.string().optional(),
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.url(),
            icon: z.enum(['github', 'x', 'discord', 'mail', 'rss']),
          }),
        )
        .default([]),
    })
    .strict(),
});

/**
 * Documentation — MDX pages that form one ordered manual. `group` drives the
 * sidebar sections and `order` the position inside each section; the build
 * derives prev/next navigation from the same sorted list.
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z
    .object({
      title: z.string().min(1),
      /** One-sentence summary used by cards, the docs index and search. */
      description: z.string().min(1),
      group: z.enum(['Getting started', 'Guides', 'Reference', 'Resources']),
      order: z.number().int().positive(),
      /** Shorter label for the sidebar when the title is long. */
      sidebarLabel: z.string().min(1).optional(),
      updated: z.coerce.date().optional(),
    })
    .strict(),
});

export const collections = { blog, authors, docs };
