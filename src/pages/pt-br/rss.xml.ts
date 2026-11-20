/** RSS 2.0 endpoint (Português do Brasil). */
import type { APIRoute } from 'astro';
import { rssXml } from '../../lib/feeds';

export const GET: APIRoute = async ({ site }) =>
  new Response(await rssXml('pt-br', site), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
