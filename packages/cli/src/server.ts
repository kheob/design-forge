/**
 * The local server.
 *
 * Deliberately `node:http` and nothing else. This package ships with zero runtime
 * dependencies so that `npx @kheob/design-forge` fetches one tarball and starts immediately; a
 * framework would buy routing sugar for six routes at the cost of an install tree on every
 * cold run.
 *
 * It does two jobs: serve the prebuilt studio, and give that studio access to the
 * filesystem — reading and writing the project's theme file, and writing the export bundle
 * straight into the project. That filesystem access is the whole reason the tool is local
 * rather than hosted.
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ALL_COMPONENTS,
  buildBundle,
  createTheme,
  normaliseTheme,
  type Theme,
} from '../../core/src/index.js';
import { detectProject, installSnippet, resolveOutDir, type ProjectContext } from './detect.js';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

/** Location of the built studio assets, resolved relative to this bundle. */
export function studioDir(): string {
  // dist/cli/index.js -> dist/studio
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '..', 'studio');
}

/**
 * Bulma ships as a static file next to the studio rather than as an npm dependency, so the
 * package stays dependency-free and the 662 kB never enters the JS bundle. The exporter takes
 * it as a parameter, so reading it here is all the wiring needed.
 */
export function readBulmaCss(): string | undefined {
  const file = path.join(studioDir(), 'bulma.min.css');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : undefined;
}

export function readTheme(ctx: ProjectContext): Theme {
  if (!fs.existsSync(ctx.themePath)) return createTheme(ctx.name);
  try {
    return normaliseTheme(JSON.parse(fs.readFileSync(ctx.themePath, 'utf8')));
  } catch {
    // A hand-edited theme that no longer parses shouldn't wedge the studio.
    return createTheme(ctx.name);
  }
}

export function writeTheme(ctx: ProjectContext, theme: Theme): void {
  fs.writeFileSync(ctx.themePath, `${JSON.stringify(theme, null, 2)}\n`, 'utf8');
}

/** Write the full bundle to disk and describe what happened. */
export function exportBundle(ctx: ProjectContext, theme: Theme, requestedOut?: string) {
  const outDir = resolveOutDir(ctx, requestedOut);
  const files = buildBundle(theme, ALL_COMPONENTS, { bulmaCss: readBulmaCss() });

  fs.mkdirSync(outDir, { recursive: true });
  for (const file of files) {
    fs.writeFileSync(path.join(outDir, file.path), file.content, 'utf8');
  }
  // The theme itself lives at the project root, not in the bundle, so the CLI and the studio
  // both find it in the same place on the next run.
  writeTheme(ctx, theme);

  const bytes = files.reduce((n, f) => n + Buffer.byteLength(f.content, 'utf8'), 0);
  return {
    outDir,
    relativeOutDir: path.relative(ctx.root, outDir).split(path.sep).join('/'),
    files: files.map((f) => f.path),
    bytes,
    snippet: installSnippet(ctx),
    docsPath: path
      .join(path.relative(ctx.root, outDir), 'DESIGN_SYSTEM.md')
      .split(path.sep)
      .join('/'),
  };
}

function sendJson(res: http.ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
  });
  res.end(payload);
}

async function readBody(req: http.IncomingMessage, limitBytes = 5_000_000): Promise<string> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    total += (chunk as Buffer).length;
    if (total > limitBytes) throw new Error('Request body too large');
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function serveStatic(res: http.ServerResponse, urlPath: string): void {
  const root = studioDir();
  const rel = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath).replace(/^\/+/, '');
  const file = path.resolve(root, rel);

  // Never serve outside the studio directory, whatever the URL claims.
  if (!file.startsWith(root + path.sep) && file !== path.join(root, 'index.html')) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    // Single-page app: unknown paths fall back to the shell.
    const shell = path.join(root, 'index.html');
    if (!fs.existsSync(shell)) {
      res.writeHead(500).end('Studio assets are missing. Run `npm run build`.');
      return;
    }
    const html = fs.readFileSync(shell);
    res.writeHead(200, { 'content-type': MIME['.html'], 'cache-control': 'no-store' }).end(html);
    return;
  }

  const ext = path.extname(file);
  // Hashed asset filenames are safe to cache hard; everything else must stay fresh.
  const immutable = /\/assets\//.test(urlPath);
  res.writeHead(200, {
    'content-type': MIME[ext] ?? 'application/octet-stream',
    'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-store',
  });
  fs.createReadStream(file).pipe(res);
}

/**
 * The API, as a standalone handler.
 *
 * Split out from the HTTP server so the Vite dev server can mount the exact same routes as
 * middleware (see the dev plugin in packages/studio/vite.config.ts). One implementation means
 * developing the studio exercises the code that actually ships, rather than a proxy or a stub
 * that can drift from it.
 *
 * Returns true when the request was handled.
 */
export async function handleApi(
  ctx: ProjectContext,
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<boolean> {
  const route = new URL(req.url ?? '/', 'http://localhost').pathname;
  if (!route.startsWith('/api/')) return false;

  try {
    if (route === '/api/context') {
      // Re-read on each call; the user may have created or deleted the theme underneath us.
      const fresh = detectProject(ctx.root);
      sendJson(res, 200, { ...fresh, snippet: installSnippet(fresh) });
      return true;
    }

    if (route === '/api/theme' && req.method === 'GET') {
      sendJson(res, 200, readTheme(ctx));
      return true;
    }

    if (route === '/api/theme' && req.method === 'PUT') {
      writeTheme(ctx, normaliseTheme(JSON.parse(await readBody(req))));
      sendJson(res, 200, { ok: true, path: ctx.themePath });
      return true;
    }

    if (route === '/api/export' && req.method === 'POST') {
      const body = JSON.parse(await readBody(req)) as { theme?: unknown; outDir?: string };
      sendJson(res, 200, exportBundle(ctx, normaliseTheme(body.theme), body.outDir));
      return true;
    }

    sendJson(res, 404, { error: `Unknown endpoint: ${route}` });
    return true;
  } catch (error) {
    sendJson(res, 400, { error: error instanceof Error ? error.message : String(error) });
    return true;
  }
}

export function createServer(ctx: ProjectContext): http.Server {
  return http.createServer(async (req, res) => {
    if (await handleApi(ctx, req, res)) return;
    try {
      serveStatic(res, new URL(req.url ?? '/', 'http://localhost').pathname);
    } catch (error) {
      sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
    }
  });
}

/** Bind to the first free port at or above `preferred`. */
export function listen(server: http.Server, preferred: number, attempts = 20): Promise<number> {
  return new Promise((resolve, reject) => {
    let port = preferred;
    let remaining = attempts;

    const tryPort = () => {
      server.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE' && remaining-- > 0) {
          port += 1;
          tryPort();
        } else {
          reject(err);
        }
      });
      server.listen(port, '127.0.0.1', () => resolve(port));
    };

    tryPort();
  });
}
