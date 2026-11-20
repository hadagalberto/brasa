/** JSON Feed 1.1 endpoint (Português do Brasil). */
import type { APIRoute } from 'astro';
import { jsonFeed } from '../../lib/feeds';

export const GET: APIRoute = async ({ site }) =>
  new Response(JSON.stringify(await jsonFeed('pt-br', site), null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
