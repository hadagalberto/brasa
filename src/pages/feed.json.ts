/** JSON Feed 1.1 endpoint (English) — generated from the shared feed builder. */
import type { APIRoute } from 'astro';
import { jsonFeed } from '../lib/feeds';

export const GET: APIRoute = async ({ site }) =>
  new Response(JSON.stringify(await jsonFeed('en', site), null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
