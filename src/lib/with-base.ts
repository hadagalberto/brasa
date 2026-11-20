/**
 * The single base-path joiner for the whole theme.
 *
 * Astro leaves `import.meta.env.BASE_URL` exactly as configured: `/brasa` for
 * a project page, `/` for a custom domain. Concatenating it with a path used
 * to produce `/brasaog.png` and `/brasarss.xml`. This helper inserts exactly
 * one slash, is idempotent for already-prefixed paths, and leaves external /
 * protocol-relative URLs and fragments untouched.
 *
 * The `base` argument exists so the same logic can be tested with an
 * explicit base and reused by the browser search island (which reads the
 * base from a data attribute).
 */
const ENV_BASE: string = (() => {
  try {
    const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env;
    return env?.BASE_URL ?? '/';
  } catch {
    // Plain Node (unit tests importing this module directly).
    return '/';
  }
})();

export function withBase(path: string, base: string = ENV_BASE): string {
  const normalizedBase = base && base !== '/' ? `/${base.replace(/^\/+|\/+$/g, '')}` : '';
  const value = String(path ?? '');

  // Absolute, protocol-relative and fragment/query-only values are not paths.
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//')) return value;

  if (normalizedBase && (value === normalizedBase || value.startsWith(`${normalizedBase}/`))) {
    return value;
  }

  return `${normalizedBase}/${value.replace(/^\/+/, '')}`;
}
