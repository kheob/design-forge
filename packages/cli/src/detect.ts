/**
 * Work out what project the tool was launched inside.
 *
 * The point of detection is that the export lands somewhere useful without the user having
 * to know where their framework serves static files from, and that the printed snippet uses
 * the paths that project actually resolves. Deliberately shallow: a handful of common cases
 * and an honest fallback, rather than a framework zoo that rots.
 */

import fs from 'node:fs';
import path from 'node:path';

export type Framework =
  | 'next-app'
  | 'next-pages'
  | 'vite'
  | 'astro'
  | 'sveltekit'
  | 'remix'
  | 'nuxt'
  | 'unknown';

export interface ProjectContext {
  /** Directory the bundle is written under, absolute. */
  root: string;
  /** Human name for the header, from package.json or the directory name. */
  name: string;
  framework: Framework;
  /** Display label, e.g. "Next.js (app router)". */
  frameworkLabel: string;
  /** Export destination, relative to root, e.g. "public/design-system". */
  outDir: string;
  /** Path to the theme file, absolute. */
  themePath: string;
  themeExists: boolean;
  /** Where the served files will be reachable from, e.g. "/design-system". */
  publicPath: string;
}

const LABELS: Record<Framework, string> = {
  'next-app': 'Next.js (app router)',
  'next-pages': 'Next.js (pages router)',
  vite: 'Vite',
  astro: 'Astro',
  sveltekit: 'SvelteKit',
  remix: 'Remix',
  nuxt: 'Nuxt',
  unknown: 'no framework detected',
};

/** Walk up from `start` looking for a package.json, stopping at the filesystem root. */
function findProjectRoot(start: string): { root: string; pkg: Record<string, unknown> | null } {
  let dir = path.resolve(start);
  for (;;) {
    const candidate = path.join(dir, 'package.json');
    if (fs.existsSync(candidate)) {
      try {
        return { root: dir, pkg: JSON.parse(fs.readFileSync(candidate, 'utf8')) };
      } catch {
        // A malformed package.json shouldn't stop the tool from running.
        return { root: dir, pkg: null };
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return { root: path.resolve(start), pkg: null };
    dir = parent;
  }
}

function detectFramework(root: string, pkg: Record<string, unknown> | null): Framework {
  const deps = {
    ...((pkg?.dependencies as Record<string, string>) ?? {}),
    ...((pkg?.devDependencies as Record<string, string>) ?? {}),
  };
  const has = (name: string) => Object.hasOwn(deps, name);
  const dirExists = (p: string) => fs.existsSync(path.join(root, p));

  if (has('next')) {
    // Both routers can coexist during a migration; app/ wins because that is where new work goes.
    if (dirExists('app') || dirExists('src/app')) return 'next-app';
    return 'next-pages';
  }
  if (has('@sveltejs/kit')) return 'sveltekit';
  if (has('astro')) return 'astro';
  if (has('nuxt')) return 'nuxt';
  if (has('@remix-run/react') || has('@remix-run/node')) return 'remix';
  if (has('vite')) return 'vite';
  return 'unknown';
}

/** Static-asset directory each framework serves from, relative to the project root. */
function staticDirFor(framework: Framework): string {
  switch (framework) {
    case 'sveltekit':
      return 'static';
    case 'nuxt':
      return 'public';
    case 'next-app':
    case 'next-pages':
    case 'vite':
    case 'astro':
    case 'remix':
      return 'public';
    default:
      // No convention to rely on — keep it beside the user rather than guessing.
      return '.';
  }
}

export function detectProject(cwd: string): ProjectContext {
  const { root, pkg } = findProjectRoot(cwd);
  const framework = detectFramework(root, pkg);
  const staticDir = staticDirFor(framework);
  const outDir = staticDir === '.' ? 'design-system' : path.posix.join(staticDir, 'design-system');
  const themePath = path.join(root, 'design-forge.json');

  return {
    root,
    name: (typeof pkg?.name === 'string' ? pkg.name : null) ?? path.basename(root),
    framework,
    frameworkLabel: LABELS[framework],
    outDir,
    themePath,
    themeExists: fs.existsSync(themePath),
    publicPath: staticDir === '.' ? './design-system' : '/design-system',
  };
}

/**
 * The lines the user has to add to wire the stylesheets up. Generated from the detected
 * framework so the paths are real rather than illustrative — this is the last mile between
 * "files written" and "it actually renders".
 */
export function installSnippet(ctx: ProjectContext): { file: string; code: string } {
  const p = ctx.publicPath;
  const links = [
    `<link rel="stylesheet" href="${p}/bulma.min.css">`,
    `<link rel="stylesheet" href="${p}/extensions.css">`,
    `<link rel="stylesheet" href="${p}/theme.css">`,
  ].join('\n');

  switch (ctx.framework) {
    case 'next-app':
      return {
        file: 'app/layout.tsx',
        code: [
          `import "${ctx.outDir.replace(/^public/, '@/public')}/bulma.min.css";`,
          `import "${ctx.outDir.replace(/^public/, '@/public')}/extensions.css";`,
          `import "${ctx.outDir.replace(/^public/, '@/public')}/theme.css";`,
        ].join('\n'),
      };
    case 'next-pages':
      return { file: 'pages/_document.tsx', code: `<Head>\n${indent(links)}\n</Head>` };
    case 'sveltekit':
      return { file: 'src/app.html', code: `<head>\n${indent(links)}\n</head>` };
    case 'astro':
      return { file: 'src/layouts/Layout.astro', code: `<head>\n${indent(links)}\n</head>` };
    case 'nuxt':
      return { file: 'nuxt.config.ts', code: `app: { head: { link: [\n  { rel: "stylesheet", href: "${p}/bulma.min.css" },\n  { rel: "stylesheet", href: "${p}/extensions.css" },\n  { rel: "stylesheet", href: "${p}/theme.css" },\n] } }` };
    case 'remix':
      return { file: 'app/root.tsx', code: `export const links = () => [\n  { rel: "stylesheet", href: "${p}/bulma.min.css" },\n  { rel: "stylesheet", href: "${p}/extensions.css" },\n  { rel: "stylesheet", href: "${p}/theme.css" },\n];` };
    case 'vite':
      return { file: 'index.html', code: `<head>\n${indent(links)}\n</head>` };
    default:
      return { file: 'your HTML <head>', code: links };
  }
}

const indent = (s: string) => s.split('\n').map((l) => `  ${l}`).join('\n');

/**
 * Resolve a user-supplied output directory against the project root and refuse anything that
 * escapes it. The server writes files on request from a browser page, so the destination is
 * treated as untrusted even though the page is local.
 */
export function resolveOutDir(ctx: ProjectContext, requested?: string): string {
  const target = path.resolve(ctx.root, requested ?? ctx.outDir);
  const rel = path.relative(ctx.root, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Refusing to write outside the project: ${target}`);
  }
  return target;
}
