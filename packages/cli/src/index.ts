/**
 * `design-forge` — entry point.
 *
 * Commands:
 *   design-forge                      start the studio (default)
 *   design-forge export [--out dir]   headless: design-forge.json -> bundle
 *   design-forge init [--preset id]   write a starter design-forge.json
 *   design-forge presets              list the starting points
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyPreset, PRESETS } from '../../core/src/index.js';
import { detectProject } from './detect.js';
import { openBrowser } from './open.js';
import { createServer, exportBundle, listen, readTheme, writeTheme } from './server.js';

// Minimal ANSI so the banner reads well without a colour dependency.
const supportsColor = process.stdout.isTTY && process.env.NO_COLOR === undefined;
const c = (code: string) => (s: string) => (supportsColor ? `[${code}m${s}[0m` : s);
const bold = c('1');
const dim = c('2');
const cyan = c('36');
const green = c('32');

interface Args {
  command: string;
  out?: string;
  preset?: string;
  port?: number;
  open: boolean;
}

function parseArgs(argv: string[]): Args {
  const rest = argv.slice(2);
  const args: Args = { command: 'dev', open: true };

  if (rest[0] && !rest[0].startsWith('-')) args.command = rest.shift() as string;

  for (let i = 0; i < rest.length; i++) {
    const flag = rest[i];
    if (flag === '-o' || flag === '--out') args.out = rest[++i];
    else if (flag === '--preset') args.preset = rest[++i];
    else if (flag === '-p' || flag === '--port') args.port = Number.parseInt(rest[++i], 10);
    else if (flag === '--no-open') args.open = false;
    else if (flag === '-h' || flag === '--help') args.command = 'help';
    else if (flag === '-v' || flag === '--version') args.command = 'version';
  }
  return args;
}

function usage(): void {
  console.log(`
${bold('design-forge')} — design a Bulma-based system, hand it to an LLM

  ${bold('npx @kheob/design-forge')}          start the studio in this project
  ${bold('npx @kheob/design-forge export')}   write the bundle without opening the studio
  ${bold('npx @kheob/design-forge init')}     create a starter design-forge.json
  ${bold('npx @kheob/design-forge presets')}  list the starting points

${dim('Options')}
  -o, --out <dir>     override where the bundle is written
      --preset <id>   start from a preset (${PRESETS.map((p) => p.id).join(', ')})
  -p, --port <n>      port for the studio (default 5199)
      --no-open       don't open a browser
`);
}

const PKG_NAME = '@kheob/design-forge';

function pkgVersion(): string {
  // fileURLToPath, not URL.pathname — on Windows the latter yields "/C:/..." with a leading
  // slash, which never resolves and silently reports 0.0.0.
  const here = path.dirname(fileURLToPath(import.meta.url));
  // package.json sits two levels above dist/cli/index.js in the published layout.
  for (const rel of ['../../package.json', '../package.json']) {
    try {
      const json = JSON.parse(fs.readFileSync(path.resolve(here, rel), 'utf8'));
      if (json.name === PKG_NAME) return json.version as string;
    } catch {
      // Try the next candidate.
    }
  }
  return '0.0.0';
}

function commandDev(args: Args): void {
  const ctx = detectProject(process.cwd());
  const server = createServer(ctx);

  void listen(server, args.port ?? 5199).then((port) => {
    const url = `http://localhost:${port}`;
    console.log(`
  ${bold('Design Forge')}  ${dim('→')}  ${cyan(url)}
  project       ${dim('→')}  ${ctx.name} ${dim(`(${ctx.frameworkLabel})`)}
  theme         ${dim('→')}  design-forge.json ${dim(ctx.themeExists ? '' : '(new)')}
  export to     ${dim('→')}  ${ctx.outDir}/

  ${dim('Ctrl-C to stop')}
`);
    if (args.open) openBrowser(url);
  });

  const shutdown = () => {
    server.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

function commandExport(args: Args): void {
  const ctx = detectProject(process.cwd());

  if (!ctx.themeExists && !args.preset) {
    console.error(
      `No design-forge.json found in ${ctx.root}.\n` +
        `Run \`design-forge\` to create one, \`design-forge init\` to start from a preset,\n` +
        `or pass --preset <id> to export one directly.`,
    );
    process.exitCode = 1;
    return;
  }

  const theme = args.preset ? applyPreset(args.preset) : readTheme(ctx);
  const result = exportBundle(ctx, theme, args.out);

  console.log(
    `\n  ${green('Exported')} ${dim('→')} ${result.relativeOutDir}/  ${dim(
      `(${result.files.length} files, ${(result.bytes / 1024).toFixed(0)} kB)`,
    )}\n`,
  );
  console.log(`  ${dim('Add to')} ${result.snippet.file}:`);
  console.log(
    result.snippet.code
      .split('\n')
      .map((l) => `    ${l}`)
      .join('\n'),
  );
  console.log(`\n  ${dim('Point your LLM at')} ${result.docsPath}\n`);
}

function commandInit(args: Args): void {
  const ctx = detectProject(process.cwd());
  const presetId = args.preset ?? 'bulma';

  if (!PRESETS.some((p) => p.id === presetId)) {
    console.error(`Unknown preset: ${presetId}. Try: ${PRESETS.map((p) => p.id).join(', ')}`);
    process.exitCode = 1;
    return;
  }
  if (ctx.themeExists) {
    console.error(`design-forge.json already exists in ${ctx.root}. Delete it first, or edit it in the studio.`);
    process.exitCode = 1;
    return;
  }

  const theme = applyPreset(presetId, ctx.name);
  writeTheme(ctx, theme);
  console.log(`\n  ${green('Created')} design-forge.json ${dim(`(preset: ${presetId})`)}`);
  console.log(`  ${dim('Run')} npx @kheob/design-forge ${dim('to start designing.')}\n`);
}

function commandPresets(): void {
  console.log();
  for (const p of PRESETS) {
    console.log(`  ${bold(p.id.padEnd(11))} ${p.name}`);
    console.log(`  ${' '.repeat(11)} ${dim(p.description)}`);
  }
  console.log();
}

function main(): void {
  const args = parseArgs(process.argv);

  switch (args.command) {
    case 'dev':
      commandDev(args);
      break;
    case 'export':
      commandExport(args);
      break;
    case 'init':
      commandInit(args);
      break;
    case 'presets':
      commandPresets();
      break;
    case 'version':
      console.log(pkgVersion());
      break;
    case 'help':
      usage();
      break;
    default:
      console.error(`Unknown command: ${args.command}\n`);
      usage();
      process.exitCode = 1;
  }
}

main();
