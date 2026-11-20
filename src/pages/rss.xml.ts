/** RSS 2.0 endpoint (English) — generated from the shared feed builder. */
import type { APIRoute } from 'astro';
import { rssXml } from '../lib/feeds';

export const GET: APIRoute = async ({ site }) =>
  new Response(await rssXml('en', site), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
