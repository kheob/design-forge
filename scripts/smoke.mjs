/**
 * Smoke test against the packaged artifact.
 *
 * Typechecking and building prove the source compiles; they say nothing about whether the
 * thing a user installs actually runs. The bugs that have actually bitten here were all in
 * that gap — a version lookup that resolved fine in the repo and returned 0.0.0 from an
 * installed package, and Bulma being reachable in dev but not in the built layout.
 *
 * So this packs the real tarball, installs it into a throwaway project, and drives the CLI
 * the way a user would. It is the gate the release workflow runs before publishing.
 *
 * Cross-platform: no shell built-ins, no POSIX-only paths.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

let failures = 0;
const check = (label, condition, detail = '') => {
  if (condition) {
    console.log(`  PASS  ${label}`);
  } else {
    failures++;
    console.log(`  FAIL  ${label}${detail ? `\n        ${detail}` : ''}`);
  }
};

/** Run a real executable (node). No shell needed. */
const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

/**
 * Run npm. On Windows npm is a .cmd shim, and current Node refuses to spawn those without a
 * shell, so shell mode is required there — which in turn means arguments containing spaces
 * (a temp path under a user name with a space) have to be quoted by hand.
 */
const runNpm = (args, cwd) => {
  const useShell = process.platform === 'win32';
  const safe = useShell ? args.map((a) => (/[\s"&|<>^]/.test(a) ? `"${a}"` : a)) : args;
  return execFileSync(npm, safe, {
    cwd,
    encoding: 'utf8',
    shell: useShell,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
};

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'df-smoke-'));
const fixture = path.join(work, 'fixture');

try {
  console.log(`\nSmoke test — ${pkg.name}@${pkg.version}\n`);

  // 1. Pack the real tarball.
  const packed = runNpm(['pack', '--pack-destination', work], repoRoot).trim().split('\n').pop();
  const tarball = path.join(work, packed);
  check('npm pack produced a tarball', fs.existsSync(tarball), tarball);

  // 2. Install it into a project that looks like Next.js, so detection has something to find.
  fs.mkdirSync(path.join(fixture, 'app'), { recursive: true });
  fs.writeFileSync(
    path.join(fixture, 'package.json'),
    `${JSON.stringify({ name: 'smoke-fixture', version: '1.0.0', private: true }, null, 2)}\n`,
  );
  runNpm(['install', tarball, '--no-audit', '--no-fund', '--no-package-lock'], fixture);

  // Declare the framework after install so npm doesn't try to resolve a real Next.js.
  const fixturePkg = JSON.parse(fs.readFileSync(path.join(fixture, 'package.json'), 'utf8'));
  fixturePkg.dependencies = { ...fixturePkg.dependencies, next: '15.1.0' };
  fs.writeFileSync(path.join(fixture, 'package.json'), `${JSON.stringify(fixturePkg, null, 2)}\n`);

  // 3. Zero runtime dependencies is a design property worth protecting — a stray `npm install`
  //    of a convenience library would silently undo it.
  const installed = fs
    .readdirSync(path.join(fixture, 'node_modules'))
    .filter((n) => !n.startsWith('.'));
  const scoped = installed.filter((n) => n.startsWith('@'));
  const flat = installed.filter((n) => !n.startsWith('@'));
  check(
    'installs with no transitive dependencies',
    flat.length === 0 && scoped.length === 1,
    `found: ${installed.join(', ')}`,
  );

  // 4. Drive the CLI through the installed bin, not the repo source.
  const bin = path.join(fixture, 'node_modules', ...pkg.name.split('/'), 'bin', 'design-forge.js');
  check('bin is present at the published path', fs.existsSync(bin), bin);

  const version = run(process.execPath, [bin, '--version'], fixture).trim();
  check(
    `--version reports ${pkg.version}`,
    version === pkg.version,
    `got "${version}" (0.0.0 means the package.json lookup broke)`,
  );

  const help = run(process.execPath, [bin, '--help'], fixture);
  check('help names the scoped invocation', help.includes(`npx ${pkg.name}`));

  const presets = run(process.execPath, [bin, 'presets'], fixture);
  check('presets lists all six', ['bulma', 'corporate', 'playful', 'brutalist', 'soft', 'dense'].every((p) => presets.includes(p)));

  // 5. Export, and confirm detection put it where Next.js serves static files.
  const exported = run(process.execPath, [bin, 'export', '--preset', 'playful'], fixture);
  const outDir = path.join(fixture, 'public', 'design-system');
  check('export targets the detected static dir', fs.existsSync(outDir), exported.trim());
  check('export prints the framework-specific snippet', exported.includes('app/layout.tsx'));

  const expected = [
    'theme.css',
    'extensions.css',
    'bulma.min.css',
    'DESIGN_SYSTEM.md',
    'llms.txt',
    'tokens.json',
    'theme.json',
    'snippets.html',
    'example.html',
    'README.md',
  ];
  const written = fs.existsSync(outDir) ? fs.readdirSync(outDir) : [];
  const missing = expected.filter((f) => !written.includes(f));
  check('all bundle files written', missing.length === 0, `missing: ${missing.join(', ')}`);

  // 6. The theme must actually carry the preset's tokens, not Bulma's defaults.
  if (fs.existsSync(path.join(outDir, 'theme.css'))) {
    const css = fs.readFileSync(path.join(outDir, 'theme.css'), 'utf8');
    check('theme.css carries the preset (playful purple)', css.includes('--bulma-primary-h: 255.8deg'));
    check('theme.css derives contrast values', css.includes('--bulma-primary-invert-l'));
    check('theme.css emits a dark scheme block', css.includes('[data-theme="dark"]'));
  }

  // 7. Bulma must ship inside the package, or the preview and export both break offline.
  const bulma = path.join(fixture, 'node_modules', ...pkg.name.split('/'), 'dist', 'studio', 'bulma.min.css');
  check('bulma.min.css ships with the package', fs.existsSync(bulma));

  // The export degrades to a CDN link when Bulma can't be located, which once shipped a
  // silently incomplete bundle. Assert the self-contained form rather than the fallback.
  check('export bundles bulma rather than linking a CDN', written.includes('bulma.min.css'));
  if (fs.existsSync(path.join(outDir, 'snippets.html'))) {
    const html = fs.readFileSync(path.join(outDir, 'snippets.html'), 'utf8');
    check('snippets.html links bulma locally', html.includes('./bulma.min.css') && !html.includes('cdn.jsdelivr.net'));
  }

  // 8. The theme file lands at the project root so it can be committed.
  check('theme saved to project root', fs.existsSync(path.join(fixture, 'design-forge.json')));
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}

console.log(failures === 0 ? '\nAll checks passed.\n' : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
