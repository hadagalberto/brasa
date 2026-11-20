import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

for (const file of ['fraunces-latin-wght-normal.woff2', 'fraunces-latin-wght-italic.woff2']) {
  const buf = await readFile(
    join(process.cwd(), 'node_modules', '@fontsource-variable', 'fraunces', 'files', file),
  );
  console.log(file, 'raw size', buf.length, 'raw magic', buf.subarray(0, 4).toString('ascii'));
  const out = await wawoff2.decompress(buf);
  console.log('  -> out size', out.length, 'magic', Buffer.from(out.subarray(0, 4)).toString('ascii'));
}
