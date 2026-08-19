/**
 * Builds the export bundle. Pure functions returning file contents, so the same code
 * serves the studio's in-browser zip download and the Node CLI.
 */

import type { ComponentDef, Theme } from '../types.js';
import { CATEGORY_ORDER } from '../types.js';
import { buildCss } from '../css.js';
import { EXTENSIONS_CSS } from '../extensions/css.js';
import { DEMO_PAGE_HTML } from '../preview/demoPage.js';
import { GLOBAL_GROUPS } from '../tokens/globals.js';
import { globalValue } from '../theme.js';
import { buildDesignSystemMd, buildLlmsTxt } from './docs.js';

export interface ExportFile {
  path: string;
  content: string;
}

export interface ExportOptions {
  /** Stock Bulma CSS to include in the bundle, if the caller can supply it. */
  bulmaCss?: string;
}

/** Machine-readable token graph, for tooling that wants values rather than prose. */
function buildTokensJson(theme: Theme, components: ComponentDef[]): string {
  const globals: Record<string, unknown> = {};
  for (const g of GLOBAL_GROUPS) {
    const group: Record<string, unknown> = {};
    for (const c of g.controls) {
      const value = globalValue(theme, c.id);
      group[c.id] = {
        label: c.label,
        type: c.type,
        value,
        css: c.emit(value),
      };
    }
    globals[g.id] = { label: g.label, tokens: group };
  }

  const overrides: Record<string, unknown> = {};
  for (const [componentId, controls] of Object.entries(theme.components)) {
    const def = components.find((c) => c.id === componentId);
    if (!def) continue;
    const entries: Record<string, unknown> = {};
    for (const [controlId, value] of Object.entries(controls)) {
      const control = def.controls.find((c) => c.id === controlId);
      if (!control) continue;
      entries[controlId] = { label: control.label, value, css: control.emit(value) };
    }
    overrides[componentId] = { selector: def.selector, name: def.name, tokens: entries };
  }

  return `${JSON.stringify(
    {
      name: theme.name,
      version: theme.version,
      generator: 'design-forge',
      generatedAt: new Date().toISOString(),
      globals,
      componentOverrides: overrides,
      components: components.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        selector: c.selector,
        extension: Boolean(c.extension),
        classes: c.docs.classes.map((x) => x.name),
      })),
    },
    null,
    2,
  )}\n`;
}

/** A browsable page containing every component and variant, styled by the theme. */
function buildSnippetsHtml(theme: Theme, components: ComponentDef[], hasBulma: boolean): string {
  const bulmaHref = hasBulma
    ? './bulma.min.css'
    : 'https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css';

  const nav = CATEGORY_ORDER.map((cat) => {
    const items = components.filter((c) => c.category === cat);
    if (!items.length) return '';
    return `<p class="menu-label">${cat}</p><ul class="menu-list">${items
      .map((c) => `<li><a href="#${c.id}">${c.name}</a></li>`)
      .join('')}</ul>`;
  }).join('');

  const sections = CATEGORY_ORDER.map((cat) => {
    const items = components.filter((c) => c.category === cat);
    if (!items.length) return '';
    const blocks = items
      .map((c) => {
        const variants = c.variants
          .map(
            (v) => `
      <div class="df-variant">
        <p class="df-variant-label">${escapeHtml(v.label)}</p>
        <div class="df-demo">${v.html}</div>
        <details class="df-code"><summary>Markup</summary><pre><code>${escapeHtml(
          v.html.trim(),
        )}</code></pre></details>
      </div>`,
          )
          .join('');
        return `
  <article class="df-component" id="${c.id}">
    <h3 class="title is-4">${escapeHtml(c.name)}${
      c.extension ? ' <span class="tag is-link is-light">Extension</span>' : ''
    }</h3>
    <p class="subtitle is-6">${escapeHtml(c.description)}</p>
    <p class="df-selector"><code>${escapeHtml(c.selector.replace(/\n/g, ' '))}</code></p>
    ${variants}
  </article>`;
      })
      .join('');
    return `<section class="df-category"><h2 class="title is-3">${cat}</h2>${blocks}</section>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(theme.name)} — component reference</title>
<link rel="stylesheet" href="${bulmaHref}">
<link rel="stylesheet" href="./extensions.css">
<link rel="stylesheet" href="./theme.css">
<style>
  body { display: grid; grid-template-columns: 16rem 1fr; min-height: 100vh; }
  .df-sidebar { border-inline-end: 1px solid var(--bulma-border-weak); overflow-y: auto; padding: 1.5rem; position: sticky; top: 0; height: 100vh; }
  .df-main { padding: 2rem 2.5rem; max-width: 60rem; }
  .df-component { border-block-start: 1px solid var(--bulma-border-weak); margin-block-start: 2.5rem; padding-block-start: 2rem; }
  .df-selector { margin-block-end: 1.25rem; }
  .df-variant { margin-block-end: 1.5rem; }
  .df-variant-label { color: var(--bulma-text-weak); font-size: var(--bulma-size-7); text-transform: uppercase; letter-spacing: .05em; margin-block-end: .5rem; }
  .df-demo { border: 1px solid var(--bulma-border-weak); border-radius: var(--bulma-radius); padding: 1.5rem; }
  .df-code { margin-block-start: .5rem; }
  .df-code pre { max-height: 22rem; overflow: auto; }
  @media (max-width: 900px) { body { grid-template-columns: 1fr; } .df-sidebar { display: none; } }
</style>
</head>
<body>
<aside class="df-sidebar menu">
  <p class="title is-6">${escapeHtml(theme.name)}</p>
  ${nav}
</aside>
<main class="df-main">
  <h1 class="title is-2">Component reference</h1>
  <p class="subtitle">Every component, rendered with this theme. Copy the markup directly.</p>
  ${sections}
</main>
</body>
</html>
`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * A complete, realistic page in this theme. Ships alongside the docs because a worked
 * example of a whole page teaches layout and rhythm far faster than component snippets.
 */
function buildExampleHtml(theme: Theme, hasBulma: boolean): string {
  const bulmaHref = hasBulma
    ? './bulma.min.css'
    : 'https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(theme.name)} — example page</title>
<!--
  A complete page built with this design system. It uses only documented classes and
  contains no hardcoded colours, radii or font sizes, so it restyles entirely from
  theme.css. Use it as the pattern for new pages.
-->
<link rel="stylesheet" href="${bulmaHref}">
<link rel="stylesheet" href="./extensions.css">
<link rel="stylesheet" href="./theme.css">
</head>
<body>
${DEMO_PAGE_HTML.trim()}
</body>
</html>
`;
}

function buildReadme(theme: Theme, components: ComponentDef[], hasBulma: boolean): string {
  return `# ${theme.name}

A Bulma-based design system generated by [Design Forge](../). ${components.length} components.

## Install

Copy this folder into your project (for example \`public/design-system/\`) and load the
stylesheets **in this order**:

\`\`\`html
<link rel="stylesheet" href="/design-system/${hasBulma ? 'bulma.min.css' : 'bulma.min.css'}">
<link rel="stylesheet" href="/design-system/extensions.css">
<link rel="stylesheet" href="/design-system/theme.css">
\`\`\`
${
  hasBulma
    ? ''
    : `
Stock Bulma is not included in this bundle. Get it with \`npm install bulma\` (use
\`node_modules/bulma/css/bulma.min.css\`) or from a CDN:
\`https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css\`.
`
}
## Files

| File | Purpose |
| --- | --- |
| \`DESIGN_SYSTEM.md\` | **Give this to your LLM.** Rules, tokens, every component with markup. |
| \`llms.txt\` | Condensed version for tight context windows. |
| \`theme.css\` | The token overrides. The only file that changes when the design changes. |
| \`extensions.css\` | Components Bulma does not ship (toggle, tooltip, stepper, …). |
| \`snippets.html\` | Open in a browser to browse every component live. |
| \`tokens.json\` | Machine-readable token graph. |
| \`theme.json\` | Editable source. Re-import into the studio to keep designing. |

## Using it with an LLM

Point the model at \`DESIGN_SYSTEM.md\` and tell it to follow that document:

> Build the pages described below. Follow \`design-system/DESIGN_SYSTEM.md\` exactly:
> use only the documented classes, never hardcode colours or spacing, and do not add
> another CSS framework.

## Changing the design

Re-import \`theme.json\` into the studio, adjust, and export again. Do not hand-edit
\`theme.css\` — it is generated and will be overwritten.

## Dark mode

Set \`data-theme="dark"\` on \`<html>\`. With no attribute the system preference is used.
`;
}

export function buildBundle(
  theme: Theme,
  components: ComponentDef[],
  opts: ExportOptions = {},
): ExportFile[] {
  const hasBulma = Boolean(opts.bulmaCss);
  const files: ExportFile[] = [
    { path: 'theme.css', content: buildCss(theme, components, { dark: true, banner: true }) },
    { path: 'extensions.css', content: `${EXTENSIONS_CSS.trim()}\n` },
    { path: 'DESIGN_SYSTEM.md', content: buildDesignSystemMd(theme, components) },
    { path: 'llms.txt', content: buildLlmsTxt(theme, components) },
    { path: 'tokens.json', content: buildTokensJson(theme, components) },
    { path: 'theme.json', content: `${JSON.stringify(theme, null, 2)}\n` },
    { path: 'snippets.html', content: buildSnippetsHtml(theme, components, hasBulma) },
    { path: 'example.html', content: buildExampleHtml(theme, hasBulma) },
    { path: 'README.md', content: buildReadme(theme, components, hasBulma) },
  ];
  if (opts.bulmaCss) {
    files.push({ path: 'bulma.min.css', content: opts.bulmaCss });
  }
  return files;
}

export { buildDesignSystemMd, buildLlmsTxt };
