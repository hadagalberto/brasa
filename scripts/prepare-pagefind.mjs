/**
 * Prepare the built HTML for Pagefind.
 *
 * Pagefind indexes the text content of every element inside a
 * `data-pagefind-body`. Prose is useful; source code is not — a search for
 * "tokens" should never surface a fragment of a CSS block or a JSX prop
 * table. Expressive Code renders its blocks at build time, so there is no
 * Astro source element to annotate. This small post-build pass marks every
 * code surface with `data-pagefind-ignore` before `pagefind --site dist`
 * runs. It only adds an attribute; it never rewrites content.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../dist/', import.meta.url));

/** Recursively collect every built .html file (POSIX-style relative paths). */
async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

/** Add the attribute once, preserving the rest of the opening tag verbatim. */
function ignore(tag) {
  return tag.replace(/^<([a-z][\w-]*)\b/i, (match, name) =>
    /\bdata-pagefind-ignore\b/.test(tag) ? match : `<${name} data-pagefind-ignore`,
  );
}

const IGNORED = [
  // Expressive Code wrappers (fenced blocks and MDX source examples).
  /<div\b[^>]*\bclass="expressive-code"[^>]*>/g,
  // Defensive: any remaining block or inline code rendered by other tools.
  /<pre\b[^>]*>/g,
  /<code\b[^>]*>/g,
];

let changed = 0;
for (const file of await htmlFiles(ROOT)) {
  const before = await readFile(file, 'utf8');
  let after = before;
  for (const pattern of IGNORED) after = after.replace(pattern, ignore);
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed += 1;
  }
}

console.log(`Pagefind preparation: ignored code in ${changed} HTML file(s).`);
console.log(`Output: ${relative(process.cwd(), ROOT) || 'dist'}`);
