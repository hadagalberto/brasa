/** RSS 2.0 endpoint (Português do Brasil). */
import type { APIRoute } from 'astro';
import { brasa } from '../../brasa.config';
import { rssXml } from '../../lib/feeds';

export const GET: APIRoute = async ({ site }) => {
  if (!brasa.features.blog) return new Response(null, { status: 404 });
  return new Response(await rssXml('pt-br', site), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
