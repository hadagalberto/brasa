/**
 * Per-page Open Graph images for the docs manual: /og/docs/<id>.png,
 * prerendered at build time with the theme fonts and ember palette.
 */
import type { APIRoute } from 'astro';

import { getDocs } from '../../../lib/docs';
import { renderDocsOg } from '../../../lib/og';

export async function getStaticPaths() {
  const docs = await getDocs();
  return docs.map((doc) => ({ params: { slug: doc.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const docs = await getDocs();
  const doc = docs.find((entry) => entry.id === params.slug);
  if (!doc) return new Response('Doc not found', { status: 404 });

  const png = await renderDocsOg({
    title: doc.data.title,
    description: doc.data.description,
    groupLabel: doc.data.group,
    sectionLabel: 'Documentation',
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
