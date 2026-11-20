/**
 * JSON Feed 1.1 — prerendered at build time from the blog collection.
 * Spec: https://jsonfeed.org/version/1.1
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { brasa } from '../brasa.config';
import { getPosts, postHref } from '../lib/posts';

/** The build always has a site URL (set in astro.config.ts); keep a safe fallback. */
const FALLBACK_SITE = new URL('https://hadagalberto.github.io/brasa');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? FALLBACK_SITE;
  const posts = await getPosts();
  const authors = await getCollection('authors');

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${brasa.site.name} — Notes from the forge`,
    home_page_url: new URL('/', base).toString(),
    feed_url: new URL(`${import.meta.env.BASE_URL}feed.json`, base).toString(),
    language: 'en',
    description:
      'Essays on deploy previews, performance, accessibility and design systems, from the team building the Brasa theme.',
    authors: [
      {
        name: brasa.site.author,
        url: brasa.site.github,
      },
    ],
    items: posts.map((post) => {
      const author = authors.find((entry) => entry.id === post.data.author);
      const url = new URL(postHref(post), base).toString();
      return {
        id: url,
        url,
        title: post.data.title,
        summary: post.data.description,
        date_published: post.data.pubDate.toISOString(),
        ...(post.data.updatedDate
          ? { date_modified: post.data.updatedDate.toISOString() }
          : {}),
        tags: post.data.tags,
        ...(author
          ? {
              authors: [
                {
                  name: author.data.name,
                  ...(author.data.links[0] ? { url: author.data.links[0].href } : {}),
                },
              ],
            }
          : {}),
        language: 'en',
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
