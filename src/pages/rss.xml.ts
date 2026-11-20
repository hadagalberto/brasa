/**
 * RSS 2.0 — prerendered at build time from the blog collection.
 * Hand-built XML: ~40 lines, no dependency, no CDATA surprises.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { brasa } from '../brasa.config';
import { formatRssDate, getAuthor, getPosts, postHref } from '../lib/posts';

/** Escape the five XML-significant characters outside CDATA. */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const site = Astro.site ?? new URL('https://example.com');
const posts = await getPosts();

const channelUrl = new URL('/', site).toString();
const blogUrl = new URL(`${import.meta.env.BASE_URL}blog`, site).toString();
const selfUrl = new URL(`${import.meta.env.BASE_URL}rss.xml`, site).toString();

const items: string[] = [];
for (const post of posts) {
  const author = await getAuthor(post.data.author);
  const url = new URL(postHref(post), site).toString();
  items.push(
    [
      '    <item>',
      `      <title>${escapeXml(post.data.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${formatRssDate(post.data.pubDate)}</pubDate>`,
      `      <description>${escapeXml(post.data.description)}</description>`,
      `      <author>${escapeXml(author.data.name)}</author>`,
      ...post.data.tags.map(
        (tag) => `      <category>${escapeXml(tag)}</category>`,
      ),
      '    </item>',
    ].join('\n'),
  );
}

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${brasa.site.name} — Notes from the forge`)}</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>${escapeXml(
      'Essays on deploy previews, performance, accessibility and design systems, from the team building the Brasa theme.',
    )}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRssDate(new Date())}</lastBuildDate>
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`;

export const GET: APIRoute = () =>
  new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
