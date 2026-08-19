import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ALL_COMPONENTS,
  CATEGORY_ORDER,
  DEMO_PAGE_HTML,
  EXTENSIONS_CSS,
  buildPreviewCss,
  type ComponentDef,
} from '@design-forge/core';
import { useStudio, componentById } from '../store';

/**
 * The preview runs inside an iframe. Two reasons, both load-bearing:
 *
 *   1. Isolation. The theme restyles `.button`, `.card` and so on — the same class names
 *      Bulma uses. Rendering it in the same document would restyle the studio's own UI.
 *   2. Fidelity. The iframe loads bulma.css, extensions.css and the generated theme.css in
 *      exactly the order and form the export uses, so the preview is the shipped artefact
 *      rather than an approximation of it.
 *
 * The document is written once; afterwards only the <style id="df-theme"> text and the
 * body markup are swapped. Re-writing srcDoc on every keystroke would reload the frame and
 * throw away scroll position, which makes sliders unusable.
 */

const SHELL = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style id="df-bulma"></style>
<style id="df-extensions"></style>
<style id="df-theme"></style>
<style id="df-canvas">
  html { background: var(--bulma-scheme-main); }
  body { padding: 2rem; }
  body:has(.df-page) { padding: 0; }
  .df-group { margin-block-end: 3.5rem; }
  .df-group > h2 {
    color: var(--bulma-text-weak);
    font-size: var(--bulma-size-7);
    font-weight: var(--bulma-weight-semibold);
    letter-spacing: .08em;
    margin-block-end: 1rem;
    text-transform: uppercase;
  }
  .df-item { margin-block-end: 2.5rem; }
  .df-item > h3 {
    color: var(--bulma-text-strong);
    font-family: var(--bulma-family-secondary);
    font-size: var(--bulma-size-5);
    font-weight: var(--bulma-weight-bold);
    margin-block-end: .25rem;
  }
  .df-item > .df-desc { color: var(--bulma-text-weak); margin-block-end: .875rem; }
  .df-variant { margin-block-end: 1rem; }
  .df-variant > .df-vlabel {
    color: var(--bulma-text-weak);
    font-size: var(--bulma-size-7);
    margin-block-end: .375rem;
  }
  .df-surface {
    border: 1px solid var(--bulma-border-weak);
    border-radius: var(--bulma-radius);
    padding: 1.5rem;
  }
  .df-badge {
    background: var(--bulma-link-light);
    border-radius: var(--bulma-radius-small);
    color: var(--bulma-link-dark);
    font-size: .625rem;
    font-weight: 700;
    letter-spacing: .06em;
    margin-inline-start: .5rem;
    padding: .15em .45em;
    text-transform: uppercase;
    vertical-align: middle;
  }
</style>
</head>
<body><div id="df-root"></div></body>
</html>`;

function variantsHtml(c: ComponentDef, showAll: boolean): string {
  const list = showAll ? c.variants : c.variants.slice(0, 1);
  return list
    .map(
      (v) => `<div class="df-variant">
        <div class="df-vlabel">${escapeHtml(v.label)}</div>
        <div class="df-surface">${v.html}</div>
      </div>`,
    )
    .join('');
}

function itemHtml(c: ComponentDef, showAll: boolean): string {
  return `<div class="df-item" id="c-${c.id}">
    <h3>${escapeHtml(c.name)}${c.extension ? '<span class="df-badge">ext</span>' : ''}</h3>
    <div class="df-desc">${escapeHtml(c.description)}</div>
    ${variantsHtml(c, showAll)}
  </div>`;
}

function galleryHtml(components: ComponentDef[]): string {
  return CATEGORY_ORDER.map((cat) => {
    const items = components.filter((c) => c.category === cat);
    if (!items.length) return '';
    return `<section class="df-group"><h2>${cat}</h2>${items
      .map((c) => itemHtml(c, false))
      .join('')}</section>`;
  }).join('');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Bulma is fetched rather than imported.
 *
 * The preview needs the stylesheet as a *string* to inject into the iframe, and importing it
 * with `?raw` inlined 662 kB into the JS bundle — over half its total size. Serving it as a
 * static file next to the studio and fetching it once keeps the bundle small, lets the browser
 * cache it, and means the published package can ship Bulma without depending on npm.
 */
let bulmaPromise: Promise<string> | undefined;
const loadBulma = (): Promise<string> => {
  bulmaPromise ??= fetch('./bulma.min.css').then((r) => {
    if (!r.ok) throw new Error(`Could not load bulma.min.css (${r.status})`);
    return r.text();
  });
  return bulmaPromise;
};

export function Canvas() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const theme = useStudio((s) => s.theme);
  const scheme = useStudio((s) => s.scheme);
  const selectedId = useStudio((s) => s.selectedComponentId);
  const search = useStudio((s) => s.search);
  const mode = useStudio((s) => s.mode);
  const view = useStudio((s) => s.view);

  const themeCss = useMemo(() => buildPreviewCss(theme, ALL_COMPONENTS), [theme]);

  const bodyHtml = useMemo(() => {
    // The page view deliberately ignores selection and search: it exists to judge the
    // theme as a whole, which only works on an unfiltered, realistic layout.
    if (view === 'page') return `<div class="df-page">${DEMO_PAGE_HTML}</div>`;

    const selected = componentById(selectedId);
    if (selected) return itemHtml(selected, true);

    const q = search.trim().toLowerCase();
    const pool =
      mode === 'components' && q
        ? ALL_COMPONENTS.filter(
            (c) => c.name.toLowerCase().includes(q) || c.id.includes(q) || c.category.toLowerCase().includes(q),
          )
        : ALL_COMPONENTS;

    if (!pool.length) {
      return '<div class="df-item"><h3>No components match that search</h3></div>';
    }
    return galleryHtml(pool);
  }, [selectedId, search, mode, view]);

  /** One-time document write. */
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    readyRef.current = false;
    const onLoad = async () => {
      const doc = frame.contentDocument;
      if (!doc) return;
      const set = (id: string, css: string) => {
        const el = doc.getElementById(id);
        if (el) el.textContent = css;
      };

      let bulma: string;
      try {
        bulma = await loadBulma();
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : String(err));
        return;
      }
      // The frame can be torn down while the fetch is in flight (StrictMode double-mount).
      if (frame.contentDocument !== doc) return;

      set('df-bulma', bulma);
      set('df-extensions', EXTENSIONS_CSS);
      readyRef.current = true;
      // Push current state now that the frame exists.
      set('df-theme', themeCss);
      const root = doc.getElementById('df-root');
      if (root) root.innerHTML = bodyHtml;
      doc.documentElement.setAttribute('data-theme', scheme);
    };
    // Named so the cleanup removes the same reference it added.
    const handleLoad = () => void onLoad();
    frame.addEventListener('load', handleLoad);
    frame.srcdoc = SHELL;
    return () => frame.removeEventListener('load', handleLoad);
    // Intentionally runs once: the shell never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Apply the theme, then re-parse the preview markup.
   *
   * The re-parse is not redundant. Chromium fails to invalidate `background-color` and
   * friends on elements that already exist when an inherited custom property changes
   * through an indirection — Bulma's `.button.is-primary { --bulma-button-h:
   * var(--bulma-primary-h) }` feeding `.button { background-color: hsl(var(--bulma-button-h)…) }`
   * is exactly that shape. `getComputedStyle` reports the new `--bulma-button-h` while the
   * resolved colour stays stale, and neither forcing reflow nor replacing the <style> node
   * clears it; only freshly parsed nodes resolve correctly.
   *
   * Reassigning innerHTML rebuilds the subtree and costs ~3ms for the full gallery, which
   * is cheap enough to do on every slider tick.
   */
  useEffect(() => {
    if (!readyRef.current) return;
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    const styleEl = doc.getElementById('df-theme');
    if (styleEl) styleEl.textContent = themeCss;

    const root = doc.getElementById('df-root');
    if (root) {
      const scroll = doc.documentElement.scrollTop;
      root.innerHTML = bodyHtml;
      doc.documentElement.scrollTop = scroll;
    }
  }, [themeCss, bodyHtml]);

  useEffect(() => {
    if (!readyRef.current) return;
    frameRef.current?.contentDocument?.documentElement.setAttribute('data-theme', scheme);
  }, [scheme]);

  return (
    <>
      {loadError ? (
        <div className="df-canvas-error" role="alert">
          <strong>Could not load Bulma.</strong>
          <p>{loadError}</p>
          <p>
            The studio expects <code>bulma.min.css</code> to be served alongside it. If you are
            running from source, use <code>npm run dev</code>; if you built the assets yourself,
            run <code>npm run build</code> so the stylesheet is copied into <code>dist/studio</code>.
          </p>
        </div>
      ) : null}
      <iframe ref={frameRef} className="df-canvas" title="Component preview" />
    </>
  );
}
