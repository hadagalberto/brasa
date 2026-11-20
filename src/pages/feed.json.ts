/** JSON Feed 1.1 endpoint (English) — generated from the shared feed builder. */
import type { APIRoute } from 'astro';
import { brasa } from '../brasa.config';
import { jsonFeed } from '../lib/feeds';

export const GET: APIRoute = async ({ site }) => {
  if (!brasa.features.blog) return new Response(null, { status: 404 });
  return new Response(JSON.stringify(await jsonFeed('en', site), null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
