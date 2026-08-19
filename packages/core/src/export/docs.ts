/**
 * DESIGN_SYSTEM.md and llms.txt generation.
 *
 * This is the real product. Everything else in the export is machinery; this file is what
 * an LLM actually reads before writing a line of markup. It is generated from the same
 * registry that drives the editor, so the documentation cannot drift from the CSS.
 *
 * The document is written as instructions to an implementer, not as a feature tour: the
 * rules section matters more than the component list, because uncontrolled ad-hoc styling
 * is what makes generated UI look incoherent.
 */

import type { ComponentDef, Theme } from '../types.js';
import { CATEGORY_ORDER } from '../types.js';
import { GLOBAL_GROUPS } from '../tokens/globals.js';
import { globalValue } from '../theme.js';
import { assess } from '../color.js';

const COLOUR_IDS = ['primary', 'link', 'info', 'success', 'warning', 'danger'];

function resolvedGlobals(theme: Theme): { group: string; rows: [string, string, string][] }[] {
  return GLOBAL_GROUPS.map((g) => ({
    group: g.label,
    rows: g.controls.map(
      (c) => [c.label, globalValue(theme, c.id), c.cssVar ?? cssVarsFor(c.id, theme)] as [string, string, string],
    ),
  }));
}

/** For controls that emit several variables, show the emitted names. */
function cssVarsFor(controlId: string, theme: Theme): string {
  const control = GLOBAL_GROUPS.flatMap((g) => g.controls).find((c) => c.id === controlId);
  if (!control) return '';
  const keys = Object.keys(control.emit(globalValue(theme, controlId)));
  if (keys.length <= 2) return keys.join(', ');
  return `${keys[0]} … (${keys.length} vars)`;
}

function componentSection(c: ComponentDef): string {
  const lines: string[] = [];
  lines.push(`#### ${c.name}`);
  lines.push('');
  lines.push(c.description);
  lines.push('');
  if (c.docs.usage) {
    lines.push(`**When to use.** ${c.docs.usage}`);
    lines.push('');
  }
  if (c.docs.classes.length) {
    lines.push('| Class | Meaning |');
    lines.push('| --- | --- |');
    for (const cl of c.docs.classes) {
      lines.push(`| \`${cl.name}\` | ${cl.description} |`);
    }
    lines.push('');
  }
  const primary = c.variants[0];
  if (primary) {
    lines.push('```html');
    lines.push(primary.html.trim());
    lines.push('```');
    lines.push('');
  }
  if (c.docs.dos.length) {
    lines.push('**Do**');
    for (const d of c.docs.dos) lines.push(`- ${d}`);
    lines.push('');
  }
  if (c.docs.donts.length) {
    lines.push('**Do not**');
    for (const d of c.docs.donts) lines.push(`- ${d}`);
    lines.push('');
  }
  return lines.join('\n');
}

export function buildDesignSystemMd(theme: Theme, components: ComponentDef[]): string {
  const out: string[] = [];
  const extensionCount = components.filter((c) => c.extension).length;

  out.push(`# ${theme.name}`);
  out.push('');
  out.push(
    theme.description ??
      'A Bulma-based design system generated with Design Forge. Follow this document exactly when building UI for this project.',
  );
  out.push('');

  // --- Rules first. This is the section that keeps generated UI coherent. -------------
  out.push('## Rules');
  out.push('');
  out.push('These are not suggestions. Following them is what keeps the UI consistent.');
  out.push('');
  out.push('1. **Use the classes in this document.** Every visual need below is already covered by a component. Do not invent class names.');
  out.push('2. **Never hardcode a colour, radius, font size or spacing value.** No hex codes, no `px` paddings, no inline `style` attributes for appearance. If you need a value, use a token: `var(--bulma-primary)`, `var(--bulma-radius)`, `var(--bulma-size-5)`.');
  out.push('3. **Do not add another CSS framework or utility library.** No Tailwind, no Bootstrap. They will fight this system.');
  out.push('4. **Express colour through modifier classes**, not custom CSS: `is-primary`, `is-danger`, `has-text-weak`, `has-background-primary-light`.');
  out.push('5. **Use spacing helpers for layout gaps**: `mt-3`, `mb-5`, `px-4`, `py-2` (scale is 0–6). Use `.grid`/`.columns` for structure.');
  out.push('6. **Keep semantics correct.** `<button>` for actions, `<a>` for navigation, real `<label>`s, one `<h1>` per page.');
  out.push('7. **If something genuinely is not covered here**, compose it from existing components rather than writing new CSS. If you must write CSS, use the tokens listed in this document.');
  out.push('');

  // --- Install ------------------------------------------------------------------------
  out.push('## Install');
  out.push('');
  out.push('Load the three stylesheets in this exact order. Order matters: `theme.css` overrides tokens defined by the first two.');
  out.push('');
  out.push('```html');
  out.push('<link rel="stylesheet" href="/design-system/bulma.min.css">');
  out.push('<link rel="stylesheet" href="/design-system/extensions.css">');
  out.push('<link rel="stylesheet" href="/design-system/theme.css">');
  out.push('```');
  out.push('');
  out.push('`bulma.min.css` is stock Bulma 1.x. `extensions.css` adds the components Bulma does not ship. `theme.css` is this theme\'s tokens — it is the only file you regenerate when the design changes.');
  out.push('');
  out.push('Dark mode is built in. Set `data-theme="dark"` on `<html>` to switch; omit it to follow the system setting.');
  out.push('');

  // --- Tokens -------------------------------------------------------------------------
  out.push('## Design tokens');
  out.push('');
  out.push('Current resolved values. Reference these as CSS custom properties; never copy the literal values into your code.');
  out.push('');
  for (const { group, rows } of resolvedGlobals(theme)) {
    out.push(`### ${group}`);
    out.push('');
    out.push('| Token | Value | CSS variable |');
    out.push('| --- | --- | --- |');
    for (const [label, value, vars] of rows) {
      out.push(`| ${label} | \`${value}\` | \`${vars}\` |`);
    }
    out.push('');
  }

  // --- Colour system ------------------------------------------------------------------
  out.push('## Using colour');
  out.push('');
  out.push('Each brand colour generates a full set of derived values automatically. For a colour `X` (one of `primary`, `link`, `info`, `success`, `warning`, `danger`):');
  out.push('');
  out.push('| Variable | Use for |');
  out.push('| --- | --- |');
  out.push('| `--bulma-X` | The colour itself: filled backgrounds. |');
  out.push('| `--bulma-X-invert` | Text placed **on** that background. Always pair these two. |');
  out.push('| `--bulma-X-on-scheme` | The colour used **as text** on the page background. Contrast-corrected. |');
  out.push('| `--bulma-X-light` / `--bulma-X-dark` | Tinted and shaded variants for subtle fills. |');
  out.push('| `--bulma-X-soft` / `--bulma-X-bold` | Scheme-aware low- and high-emphasis variants. |');
  out.push('| `--bulma-X-00` … `--bulma-X-100` | The full 21-step lightness ramp. |');
  out.push('');
  out.push('**Never put brand-coloured text directly on the page background using `--bulma-X`** — use `--bulma-X-on-scheme`, which is adjusted to stay readable. In practice, prefer the helper classes `has-text-primary`, `has-background-primary`, `has-text-primary-invert`, which pick the right one for you.');
  out.push('');
  out.push('### Contrast check');
  out.push('');
  out.push('| Colour | Value | Text on it | Ratio | WCAG |');
  out.push('| --- | --- | --- | --- | --- |');
  for (const id of COLOUR_IDS) {
    const hex = globalValue(theme, id);
    if (!hex.startsWith('#')) continue;
    const a = assess(hex);
    const flag = a.level === 'Fail' ? ' ⚠️' : '';
    out.push(
      `| ${id} | \`${hex}\` | \`--bulma-${id}-invert\` | ${a.ratio}:1 | ${a.level}${flag} |`,
    );
  }
  out.push('');

  // --- Layout -------------------------------------------------------------------------
  out.push('## Page structure');
  out.push('');
  out.push('The standard skeleton for a page in this system:');
  out.push('');
  out.push('```html');
  out.push(`<nav class="navbar">…</nav>

<section class="section">
  <div class="container">
    <h1 class="title is-2">Page title</h1>
    <p class="subtitle">Supporting line.</p>

    <div class="grid">
      <div class="cell"><div class="card">…</div></div>
      <div class="cell"><div class="card">…</div></div>
    </div>
  </div>
</section>

<footer class="footer">…</footer>`);
  out.push('```');
  out.push('');
  out.push('Use `.grid` (auto-reflowing) for card lists and `.columns` when you need exact ratios such as a 8/4 content-and-sidebar split.');
  out.push('');

  // --- Components ---------------------------------------------------------------------
  out.push('## Components');
  out.push('');
  out.push(
    `${components.length} components. ${extensionCount} of them (marked **Extension**) come from \`extensions.css\` rather than stock Bulma, but are used exactly the same way.`,
  );
  out.push('');
  for (const category of CATEGORY_ORDER) {
    const items = components.filter((c) => c.category === category);
    if (!items.length) continue;
    out.push(`### ${category}`);
    out.push('');
    for (const c of items) {
      out.push(componentSection(c).replace(`#### ${c.name}\n`, `#### ${c.name}${c.extension ? ' — Extension' : ''}\n`));
    }
  }

  // --- Helpers ------------------------------------------------------------------------
  out.push('## Helper classes');
  out.push('');
  out.push('| Group | Classes |');
  out.push('| --- | --- |');
  out.push('| Text colour | `has-text-primary`, `has-text-danger`, `has-text-weak`, `has-text-strong`, `has-text-current` |');
  out.push('| Background | `has-background-primary`, `has-background-primary-light`, `has-background-scheme-main-bis` |');
  out.push('| Typography | `is-size-1` … `is-size-7`, `has-text-weight-light/normal/medium/semibold/bold`, `is-uppercase`, `is-italic` |');
  out.push('| Alignment | `has-text-left/centered/right/justified` |');
  out.push('| Spacing | `m-0`…`m-6`, `mt/mr/mb/ml/mx/my-*`, `p-*` with the same pattern |');
  out.push('| Flex | `is-flex`, `is-align-items-center`, `is-justify-content-space-between`, `is-flex-direction-column` |');
  out.push('| Visibility | `is-hidden`, `is-hidden-mobile`, `is-hidden-tablet-only`, `is-sr-only` |');
  out.push('| Other | `is-clipped`, `is-clearfix`, `is-relative`, `is-radiusless`, `is-shadowless`, `is-skeleton` |');
  out.push('');
  out.push('Breakpoints: `mobile` (<769px), `tablet` (≥769px), `desktop` (≥1024px), `widescreen` (≥1216px), `fullhd` (≥1408px).');
  out.push('');

  // --- Worked example -----------------------------------------------------------------
  out.push('## Worked example');
  out.push('');
  out.push('A settings page using only this system:');
  out.push('');
  out.push('```html');
  out.push(`<section class="section">
  <div class="container is-max-desktop">
    <nav class="level">
      <div class="level-left"><h1 class="title is-3">Settings</h1></div>
      <div class="level-right"><button class="button is-primary">Save changes</button></div>
    </nav>

    <div class="tabs"><ul>
      <li class="is-active"><a>Profile</a></li><li><a>Billing</a></li>
    </ul></div>

    <div class="box">
      <div class="field">
        <label class="label" for="name">Display name</label>
        <div class="control"><input class="input" id="name" type="text" value="Ada Lovelace"></div>
        <p class="help">Shown to everyone in your workspace.</p>
      </div>

      <div class="field">
        <label class="toggle">
          <input type="checkbox" checked><span class="toggle-track"></span>
          <span>Email me about product updates</span>
        </label>
      </div>
    </div>

    <article class="message is-warning">
      <div class="message-body">Changing your email will sign you out of all devices.</div>
    </article>
  </div>
</section>`);
  out.push('```');
  out.push('');

  out.push('---');
  out.push('');
  out.push(
    `Generated by Design Forge from \`theme.json\`. To change the design, edit the theme in the studio and re-export — do not hand-edit \`theme.css\`.`,
  );
  out.push('');

  return out.join('\n');
}

/** A compressed index for pasting into a tight context window. */
export function buildLlmsTxt(theme: Theme, components: ComponentDef[]): string {
  const out: string[] = [];
  out.push(`# ${theme.name} — quick reference`);
  out.push('');
  out.push('Bulma 1.x based design system. Load bulma.min.css, then extensions.css, then theme.css.');
  out.push('');
  out.push('RULES: use only the classes below; never hardcode colours/radii/sizes; no inline styles for');
  out.push('appearance; no other CSS framework; colour via is-* modifiers; spacing via m-*/p-* (0-6).');
  out.push('');
  out.push('TOKENS');
  for (const g of GLOBAL_GROUPS) {
    const vals = g.controls.map((c) => `${c.id}=${globalValue(theme, c.id)}`).join(' ');
    out.push(`  ${g.label}: ${vals}`);
  }
  out.push('');
  out.push('COLOURS: primary link info success warning danger');
  out.push('  --bulma-X (fill) --bulma-X-invert (text on fill) --bulma-X-on-scheme (text on page)');
  out.push('  --bulma-X-light --bulma-X-dark --bulma-X-soft --bulma-X-bold --bulma-X-00..100');
  out.push('');
  out.push('COMPONENTS');
  for (const category of CATEGORY_ORDER) {
    const items = components.filter((c) => c.category === category);
    if (!items.length) continue;
    out.push(`  [${category}]`);
    for (const c of items) {
      const mods = c.docs.classes.map((x) => x.name).join(' ');
      out.push(`    ${c.selector.replace(/\n/g, ' ')} — ${c.name}${c.extension ? ' (ext)' : ''}: ${mods}`);
    }
  }
  out.push('');
  out.push('HELPERS: has-text-*, has-background-*, is-size-1..7, has-text-weight-*, has-text-centered,');
  out.push('  m-*/p-* (t r b l x y, 0-6), is-flex, is-align-items-center, is-hidden-*, is-sr-only.');
  out.push('BREAKPOINTS: mobile<769, tablet>=769, desktop>=1024, widescreen>=1216, fullhd>=1408.');
  out.push('DARK MODE: <html data-theme="dark">.');
  out.push('');
  return out.join('\n');
}
