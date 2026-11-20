/**
 * Per-page Open Graph images for the docs manual, prerendered at build time.
 * Localized files use a `-pt-br` suffix so both manuals get their own card.
 */
import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

import { docSlug } from '../../../lib/docs';
import { renderDocsOg } from '../../../lib/og';
import { ui } from '../../../i18n';
import { brasa } from '../../../brasa.config';

const assetSlug = (doc: CollectionEntry<'docs'>): string =>
  `${docSlug(doc)}${doc.data.lang === 'pt-br' ? '-pt-br' : ''}`;

export async function getStaticPaths() {
  if (!brasa.features.docs) return [];
  const docs = await getCollection('docs');
  return docs.map((doc) => ({ params: { slug: assetSlug(doc) } }));
}

export const GET: APIRoute = async ({ params }) => {
  const docs = await getCollection('docs');
  const doc = docs.find((entry) => assetSlug(entry) === params.slug);
  if (!doc) return new Response('Doc not found', { status: 404 });

  const png = await renderDocsOg({
    title: doc.data.title,
    description: doc.data.description,
    groupLabel: doc.data.group,
    sectionLabel: ui(doc.data.lang).docs.title,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
