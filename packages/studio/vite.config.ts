import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, URL } from 'node:url';
import { detectProject } from '../cli/src/detect.js';
import { handleApi } from '../cli/src/server.js';

/**
 * Mount the CLI's API into the Vite dev server.
 *
 * The alternative — proxying to a second process — means `npm run dev` exercises different
 * plumbing from `npx @kheob/design-forge`, and the two drift. Mounting the real handler as
 * middleware keeps one implementation for both.
 *
 * Bulma is served from node_modules here; in a built package it sits next to the studio
 * assets. Either way the studio just fetches ./bulma.min.css and doesn't care which.
 */
function designForgeDevServer(): Plugin {
  const require = createRequire(import.meta.url);
  const bulmaPath = require.resolve('bulma/css/bulma.min.css');

  return {
    name: 'design-forge-dev-server',
    apply: 'serve',
    configureServer(server) {
      // INIT_CWD, not process.cwd(). npm runs Vite with its cwd set to packages/studio, so
      // process.cwd() made the tool detect the *studio package* as the user's project and
      // write the theme and the export bundle into the repo. INIT_CWD is the directory the
      // npm command was actually invoked from, which is what someone running `npm run dev`
      // means by "here".
      const ctx = detectProject(process.env.INIT_CWD ?? process.cwd());

      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] === '/bulma.min.css') {
          res.writeHead(200, { 'content-type': 'text/css; charset=utf-8' });
          createReadStream(bulmaPath).pipe(res);
          return;
        }
        void handleApi(ctx, req, res).then((handled) => {
          if (!handled) next();
        });
      });

      server.httpServer?.once('listening', () => {
        server.config.logger.info(
          `  design-forge  project: ${ctx.name} (${ctx.frameworkLabel})  exports to ${ctx.outDir}/`,
        );
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), designForgeDevServer()],
  // Relative base so the built studio works from whatever path the CLI serves it at.
  base: './',
  resolve: {
    alias: {
      '@design-forge/core': fileURLToPath(new URL('../core/src/index.ts', import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL('../../dist/studio', import.meta.url)),
    emptyOutDir: true,
  },
  server: { port: 5199 },
});
