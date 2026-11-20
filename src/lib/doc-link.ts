/** Base-path-aware link to a docs page, safe to use inside MDX expressions. */
export function docLink(slug: string): string {
  return `${import.meta.env.BASE_URL}docs/${slug}`;
}
