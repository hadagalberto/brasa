/** RSS 2.0 endpoint (English) — generated from the shared feed builder. */
import type { APIRoute } from 'astro';
import { brasa } from '../brasa.config';
import { rssXml } from '../lib/feeds';

export const GET: APIRoute = async ({ site }) => {
  // No feed when the blog is disabled — the endpoint must not be published.
  if (!brasa.features.blog) return new Response(null, { status: 404 });
  return new Response(await rssXml('en', site), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
