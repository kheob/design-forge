import { defineConfig } from 'tsup';

/**
 * Bundle the CLI and the core engine into one file.
 *
 * `noExternal` inlines @design-forge/core rather than publishing it separately: one package,
 * one version, and nothing to resolve at install time. Combined with Bulma shipping as a
 * static asset, the published package has no runtime dependencies at all — which is what
 * makes `npx @kheob/design-forge` start immediately on a cold run.
 */
export default defineConfig({
  entry: { index: 'packages/cli/src/index.ts' },
  outDir: 'dist/cli',
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  noExternal: [/@design-forge\/.*/],
  clean: true,
  splitting: false,
  sourcemap: false,
  // Nothing consumes this as a library, so type declarations would be dead weight.
  dts: false,
});
