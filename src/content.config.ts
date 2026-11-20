import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` is deprecated in astro:content as of Astro 7; astro/zod is the stable path.
import { z } from 'astro/zod';

const locale = z.enum(['en', 'pt-br']).default('en');

/**
 * Blog posts — MDX, one file per essay per locale. The schema is the contract
 * the blog pages build against: titles, authors, tags, dates and the featured
 * slot all flow from here into the index, feeds, tag and author pages, and the
 * per-post OG images.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      author: z.string(),
      tags: z.array(z.string().min(1)).min(1),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      lang: locale,
    })
    .strict(),
});

/**
 * Blog authors — JSON data entries, one per locale. Avatars are deterministic
 * initials (see Avatar.astro), so no image assets are needed.
 */
const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z
    .object({
      name: z.string().min(1),
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
      lang: locale,
    })
    .strict(),
});

/**
 * Documentation — MDX pages that form one ordered manual per locale. `group`
 * drives the sidebar sections and `order` the position inside each section.
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      group: z.enum(['Getting started', 'Guides', 'Reference', 'Resources']),
      order: z.number().int().positive(),
      sidebarLabel: z.string().min(1).optional(),
      updated: z.coerce.date().optional(),
      lang: locale,
    })
    .strict(),
});

/**
 * Changelog — dated releases rendered as a timeline. Each release has its own
 * localized entry so titles, summaries and change groups read naturally.
 */
const changelog = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/changelog' }),
  schema: z
    .object({
      version: z.string().min(1),
      date: z.coerce.date(),
      title: z.string().min(1),
      summary: z.string().min(1),
      groups: z
        .array(
          z.object({
            title: z.string().min(1),
            items: z.array(z.string().min(1)).min(1),
          }),
        )
        .min(1),
      lang: locale,
    })
    .strict(),
});

export const collections = { blog, authors, docs, changelog };
