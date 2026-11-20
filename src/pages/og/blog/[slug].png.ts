/**
 * Per-post Open Graph images, prerendered at build time. English posts live at
 * /og/blog/<slug>.png and Portuguese ones at /og/blog/<slug>-pt-br.png.
 */
import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

import { formatDate, getAuthor, postSlug } from '../../../lib/posts';
import { renderBlogOg } from '../../../lib/og';
import { brasa } from '../../../brasa.config';

const assetSlug = (post: CollectionEntry<'blog'>): string =>
  `${postSlug(post)}${post.data.lang === 'pt-br' ? '-pt-br' : ''}`;

export async function getStaticPaths() {
  if (!brasa.features.blog) return [];
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: assetSlug(post) } }));
}

export const GET: APIRoute = async ({ params }) => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const post = posts.find((entry) => assetSlug(entry) === params.slug);
  if (!post) return new Response('Post not found', { status: 404 });

  const author = await getAuthor(post.data.author, post.data.lang);
  const png = await renderBlogOg({
    title: post.data.title,
    description: post.data.description,
    tagLabel: post.data.tags[0] ?? 'Notes',
    authorName: author.data.name,
    dateLabel: formatDate(post.data.pubDate, post.data.lang),
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
