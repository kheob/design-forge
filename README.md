# Design Forge

[![npm](https://img.shields.io/npm/v/@kheob/design-forge)](https://www.npmjs.com/package/@kheob/design-forge) [![CI](https://github.com/kheob/design-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/kheob/design-forge/actions/workflows/ci.yml)

Decide what your app should look like **before** you ask an LLM to build it.

```bash
cd my-app
npx @kheob/design-forge
```

Tune the design in your browser, hit Export, and the whole system lands in your project as
plain CSS plus a document your coding agent can follow. No account, no API key, no build step.

---

## The loop

1. **`npx @kheob/design-forge`** in your project. It detects your framework and opens the studio.
2. **Design.** Start from a preset, then tune colours, radius, typography, density, elevation,
   motion — globally, or per component. A live preview shows all 53 components and a realistic
   page as you go.
3. **Export.** Files are written straight into your project (`public/design-system/` for most
   frameworks), and you get the exact lines to paste plus the path to hand your agent:

> Follow `public/design-system/DESIGN_SYSTEM.md` exactly: use only the documented classes,
> never hardcode colours or spacing, and do not add another CSS framework.

Your theme is saved as `design-forge.json` in your project root. Commit it — the CLI can
regenerate the bundle from it in CI, and re-running the studio picks up where you left off.

## What you get

| File | Purpose |
| --- | --- |
| `DESIGN_SYSTEM.md` | **The deliverable.** Rules, tokens, all 53 components with markup and do/don't guidance. |
| `llms.txt` | Condensed index for tight context windows. |
| `theme.css` | Your token overrides — the only file that changes when the design changes. |
| `extensions.css` | The 15 components Bulma doesn't ship. |
| `bulma.min.css` | Stock Bulma, so the bundle works offline. |
| `example.html` | A complete realistic page in your theme. |
| `snippets.html` | Browse every component live. |
| `tokens.json` | Machine-readable token graph. |

## Components

All 33 of [Bulma's](https://bulma.io), plus 15 it doesn't ship — toggle, tooltip, accordion,
avatar, stepper, toast, drawer, badge, rating, timeline, segmented control, stat tile, empty
state, combobox, progress ring. The extensions are built on Bulma's own tokens, so they theme
identically and inherit dark mode for free.

## Commands

```bash
npx @kheob/design-forge                      # start the studio
npx @kheob/design-forge export               # rebuild the bundle from design-forge.json
npx @kheob/design-forge init --preset soft   # start from a preset without opening the studio
npx @kheob/design-forge presets              # bulma · corporate · playful · brutalist · soft · dense
```

Options: `--out <dir>`, `--port <n>`, `--no-open`.

Requires Node 20+. The package has **no runtime dependencies**.

---

## How it works

Three ideas do most of the work.

**The registry is the single source of truth.** One definition per component drives the editor
controls, the live preview, the exported snippets *and* the exported documentation — so the
docs your LLM reads cannot drift from the CSS that ships.

**Contrast is computed, not inherited.** Bulma bakes its contrast decisions at SASS compile
time: `--bulma-primary-invert-l` is a static reference chosen for Bulma's stock turquoise, and
it does *not* react when you change the colour at runtime. Pick a dark navy primary and stock
Bulma gives you near-black text on a near-black button. Design Forge recomputes `-invert-l` and
`-on-scheme-l` from real WCAG luminance, per scheme, so any brand colour stays legible. Across a
40,000-colour sweep, 97.5% clear AA and none fail outright.

**The preview is an iframe.** The theme restyles `.button` and `.card` — the same classes the
editor would use — so isolation is mandatory. It also means the preview loads the exact three
stylesheets, in the exact order, that the export produces.

## Development

```bash
git clone https://github.com/kheob/design-forge.git
cd design-forge && npm install
npm run dev        # studio with HMR, API mounted into the Vite dev server
npm run build      # dist/studio + dist/cli — what gets published
npm run typecheck
```

```
packages/
  core/     framework-agnostic engine — registry, theming, exporter. No React.
  studio/   Vite + React 19 editor.
  cli/      node:http server, project detection, commands.
```

`npm run smoke` packs the real tarball, installs it into a throwaway project and drives the
CLI from there. Typechecking proves the source compiles; this proves the thing people
actually install runs.

## Releasing

`main` is what's released. Merge a PR and it ships — the workflow bumps the version,
publishes to npm, tags the commit and opens a GitHub release. Don't run `npm version`
yourself; the workflow owns the version number.

Bump size comes from the merge commit message, defaulting to patch so nothing special is
needed for an ordinary change:

| Commit message | Bump |
| --- | --- |
| anything | patch |
| `feat: …` | minor |
| `feat!: …` or `BREAKING CHANGE` in the body | major |
| contains `[skip release]` | none — nothing publishes |

Use `[skip release]` for docs and CI-only merges, or the version will churn on cosmetic
changes.

Authentication is [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers): the
workflow exchanges a short-lived OIDC token for publish rights, so **no npm token is stored
anywhere**. Provenance attestations are generated automatically.

**One-time npm setup** — package **Settings → Trusted Publisher**, GitHub Actions, org
`kheob`, repository `design-forge`, workflow `release.yml`.

**Branch protection.** The workflow pushes its version-bump commit directly to `main`. If
you protect the branch, give `github-actions[bot]` a bypass, or the release fails at the
push step — deliberately before publishing, so npm never gets ahead of the repo.

`npm run dev` mounts the CLI's real API handler as Vite middleware rather than proxying to a
second process, so developing the studio exercises the code that actually ships.

MIT.
