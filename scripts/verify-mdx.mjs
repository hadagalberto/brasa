/**
 * MDX frontmatter guard.
 *
 * Astro parses YAML frontmatter at build time, but a misplaced `import` line
 * next to the closing `---` produces a confusing failure deep in the build.
 * This check fails early with the exact file and line, and runs on Windows and
 * Linux identically (see .gitattributes for LF enforcement).
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = join(process.cwd(), 'src', 'content');
const FIELD = /^[A-Za-z_][\w-]*\s*:/;
const CONTINUATION = /^\s+(?:-\s+|\S)/;
const problems = [];
let count = 0;

async function* mdxFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* mdxFiles(path);
    else if (entry.name.endsWith('.mdx')) yield path;
  }
}

for await (const file of mdxFiles(root)) {
  count += 1;
  const name = relative(process.cwd(), file).replaceAll('\\', '/');
  const lines = (await readFile(file, 'utf8')).replace(/^\uFEFF/, '').split(/\r?\n/);

  if (lines[0]?.trim() !== '---') {
    problems.push(`${name}:1 — missing opening frontmatter delimiter '---'`);
    continue;
  }

  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closing === -1) {
    problems.push(`${name}:1 — missing closing frontmatter delimiter '---'`);
    continue;
  }

  for (let index = 1; index < closing; index += 1) {
    const line = lines[index];
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    if (FIELD.test(line) || CONTINUATION.test(line)) continue;
    problems.push(
      `${name}:${index + 1} — invalid frontmatter line (imports belong AFTER the closing '---' at line ${closing + 1}): ${line.trim()}`,
    );
  }
}

if (problems.length > 0) {
  console.error(`MDX frontmatter check failed (${problems.length} problem(s)):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`MDX frontmatter valid in ${count} file(s).`);
