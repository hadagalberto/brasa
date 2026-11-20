/**
 * Per-post Open Graph images, prerendered at build time:
 * /og/blog/<slug>.png — 1200×630, theme fonts and ember palette via
 * satori + resvg (see src/lib/og.ts). Referenced by each post's <meta og:image>.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { formatDate, getAuthor } from '../../../lib/posts';
import { renderBlogOg } from '../../../lib/og';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const post = posts.find((entry) => entry.id === params.slug);
  if (!post) return new Response('Post not found', { status: 404 });

  const author = await getAuthor(post.data.author);
  const png = await renderBlogOg({
    title: post.data.title,
    description: post.data.description,
    tagLabel: post.data.tags[0] ?? 'Notes',
    authorName: author.data.name,
    dateLabel: formatDate(post.data.pubDate),
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
