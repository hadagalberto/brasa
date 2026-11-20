/**
 * Shared feed generation. Both locales get an RSS 2.0 and a JSON Feed 1.1
 * endpoint built from the same sorted, filtered collection so the two formats
 * can never drift apart.
 */
import { brasa } from '../brasa.config';
import type { Locale } from '../i18n';
import { formatRssDate, getAuthor, getAuthors, getPosts, postHref } from './posts';

const FALLBACK_SITE = new URL('https://hadagalberto.github.io/brasa');

const COPY: Record<Locale, { title: string; description: string; language: string }> = {
  en: {
    title: `${brasa.site.name} — Notes from the forge`,
    description:
      'Essays on deploy previews, performance, accessibility and design systems, from the team building the Brasa theme.',
    language: 'en-us',
  },
  'pt-br': {
    title: `${brasa.site.name} — Notas da forja`,
    description:
      'Ensaios sobre prévias de deploy, performance, acessibilidade e design systems, da equipe que cria o tema Brasa.',
    language: 'pt-br',
  },
};

/** Escape the five XML-significant characters outside CDATA. */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function prefix(locale: Locale): string {
  return locale === 'en' ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}pt-br/`;
}

export async function rssXml(locale: Locale, site: URL | undefined): Promise<string> {
  const base = site ?? FALLBACK_SITE;
  const posts = await getPosts(locale);
  const copy = COPY[locale];
  const blogUrl = new URL(`${prefix(locale)}blog`, base).toString();
  const selfUrl = new URL(`${prefix(locale)}rss.xml`, base).toString();

  const items: string[] = [];
  for (const post of posts) {
    const author = await getAuthor(post.data.author, locale);
    const url = new URL(postHref(post), base).toString();
    items.push(
      [
        '    <item>',
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${formatRssDate(post.data.pubDate)}</pubDate>`,
        `      <description>${escapeXml(post.data.description)}</description>`,
        `      <author>${escapeXml(author.data.name)}</author>`,
        ...post.data.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n'),
    );
  }

  // Derive lastBuildDate from content, never `new Date()`: builds stay reproducible.
  const lastUpdate = posts.reduce(
    (latest, post) => Math.max(latest, (post.data.updatedDate ?? post.data.pubDate).valueOf()),
    0,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(copy.title)}</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>${escapeXml(copy.description)}</description>
    <language>${copy.language}</language>
    <lastBuildDate>${formatRssDate(new Date(lastUpdate))}</lastBuildDate>
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`;
}

export async function jsonFeed(locale: Locale, site: URL | undefined): Promise<object> {
  const base = site ?? FALLBACK_SITE;
  const posts = await getPosts(locale);
  const copy = COPY[locale];
  const authors = await getAuthors(locale);

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: copy.title,
    home_page_url: new URL(locale === 'en' ? '/' : '/pt-br/', base).toString(),
    feed_url: new URL(`${prefix(locale)}feed.json`, base).toString(),
    language: locale === 'en' ? 'en' : 'pt-BR',
    description: copy.description,
    authors: [{ name: brasa.site.author, url: brasa.site.github }],
    items: posts.map((post) => {
      const author = authors.find((entry) => entry.id.replace(/^pt-br\//, '') === post.data.author);
      const url = new URL(postHref(post), base).toString();
      return {
        id: url,
        url,
        title: post.data.title,
        summary: post.data.description,
        date_published: post.data.pubDate.toISOString(),
        ...(post.data.updatedDate ? { date_modified: post.data.updatedDate.toISOString() } : {}),
        tags: post.data.tags,
        ...(author
          ? {
              authors: [
                {
                  name: author.data.name,
                  ...(author.data.links[0] ? { url: author.data.links[0].href } : {}),
                },
              ],
            }
          : {}),
        language: locale === 'en' ? 'en' : 'pt-BR',
      };
    }),
  };
}
