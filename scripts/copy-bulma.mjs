/**
 * Copy Bulma's stylesheet next to the built studio.
 *
 * Bulma is a devDependency, not a runtime one. It is needed in three places at run time —
 * the preview iframe, the exported bundle, and the served static assets — and shipping one
 * copy inside dist/ satisfies all three without the published package depending on npm at
 * all. It also keeps 662 kB of CSS out of the JS bundle, which is over half its former size.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const source = require.resolve('bulma/css/bulma.min.css');
const outDir = path.resolve('dist/studio');
const target = path.join(outDir, 'bulma.min.css');

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(source, target);

const kb = (fs.statSync(target).size / 1024).toFixed(0);
console.log(`copied bulma.min.css -> dist/studio/bulma.min.css (${kb} kB)`);
