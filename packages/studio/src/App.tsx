import { useEffect, useRef, useState } from 'react';
import { PRESETS, countOverrides } from '@design-forge/core';
import { GlobalsPanel } from './panels/GlobalsPanel';
import { ComponentsPanel } from './panels/ComponentsPanel';
import { Canvas } from './preview/Canvas';
import { ExportPanel } from './ExportPanel';
import { useStudio } from './store';
import { downloadTheme, exportBundle, getContext, isConnected, type ExportResult } from './api';

export default function App() {
  const theme = useStudio((s) => s.theme);
  const ready = useStudio((s) => s.ready);
  const hydrate = useStudio((s) => s.hydrate);
  const mode = useStudio((s) => s.mode);
  const setMode = useStudio((s) => s.setMode);
  const scheme = useStudio((s) => s.scheme);
  const setScheme = useStudio((s) => s.setScheme);
  const view = useStudio((s) => s.view);
  const setView = useStudio((s) => s.setView);
  const undo = useStudio((s) => s.undo);
  const redo = useStudio((s) => s.redo);
  const canUndo = useStudio((s) => s.past.length > 0);
  const canRedo = useStudio((s) => s.future.length > 0);
  const loadPreset = useStudio((s) => s.loadPreset);
  const importTheme = useStudio((s) => s.importTheme);
  const rename = useStudio((s) => s.rename);
  const selectComponent = useStudio((s) => s.selectComponent);

  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [exported, setExported] = useState<ExportResult | null>(null);
  const [exporting, setExporting] = useState(false);
  const counts = countOverrides(theme);
  const ctx = getContext();

  // Load the theme from the project file (or localStorage when running standalone).
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 3200);
    return () => clearTimeout(t);
  }, [status]);

  /**
   * Export writes into the user's project rather than downloading a zip — the reason the
   * tool runs locally. Without the CLI there is no filesystem, so it hands back the theme
   * file instead and points at the command that can build from it.
   */
  const runExport = async () => {
    if (!isConnected()) {
      downloadTheme(theme);
      setStatus('Saved design-forge.json — run `npx @kheob/design-forge export` to build the bundle');
      return;
    }
    setExporting(true);
    try {
      setExported(await exportBundle(theme));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const onImport = async (file: File) => {
    try {
      importTheme(JSON.parse(await file.text()));
      setStatus('Theme imported');
    } catch {
      setStatus('That file is not a valid design-forge.json');
    }
  };

  if (!ready) {
    return (
      <div className="df-boot">
        <span className="df-logo" aria-hidden="true" />
        <p>Loading your theme…</p>
      </div>
    );
  }

  return (
    <div className="df-app">
      <header className="df-header">
        <div className="df-brand">
          <span className="df-logo" aria-hidden="true" />
          <span>Design Forge</span>
        </div>

        <input
          className="df-name"
          value={theme.name}
          onChange={(e) => rename(e.target.value)}
          aria-label="Theme name"
        />

        <select
          className="df-input df-preset"
          value=""
          onChange={(e) => {
            if (!e.target.value) return;
            loadPreset(e.target.value);
            selectComponent(null);
            setStatus(`Loaded preset: ${PRESETS.find((p) => p.id === e.target.value)?.name}`);
          }}
          aria-label="Load a preset"
        >
          <option value="">Start from a preset…</option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id} title={p.description}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="df-spacer" />

        {ctx ? (
          <span className="df-project" title={`${ctx.root}\nExports to ${ctx.outDir}/`}>
            {ctx.name} <span className="df-project-fw">{ctx.frameworkLabel}</span>
          </span>
        ) : (
          <span className="df-project df-standalone" title="Run `npx @kheob/design-forge` in your project to save and export to disk">
            standalone
          </span>
        )}

        <span className="df-counts" title="Global tokens changed · component overrides">
          {counts.globals} globals · {counts.components} overrides
        </span>

        <div className="df-btn-group">
          <button type="button" className="df-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            Undo
          </button>
          <button type="button" className="df-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
            Redo
          </button>
        </div>

        <div className="df-btn-group" role="group" aria-label="Preview content">
          <button
            type="button"
            className={`df-btn${view === 'gallery' ? ' is-active' : ''}`}
            onClick={() => setView('gallery')}
            title="Every component in isolation"
          >
            Gallery
          </button>
          <button
            type="button"
            className={`df-btn${view === 'page' ? ' is-active' : ''}`}
            onClick={() => setView('page')}
            title="A realistic page — the best way to judge the theme as a whole"
          >
            Page
          </button>
        </div>

        <div className="df-btn-group" role="group" aria-label="Preview scheme">
          <button
            type="button"
            className={`df-btn${scheme === 'light' ? ' is-active' : ''}`}
            onClick={() => setScheme('light')}
          >
            Light
          </button>
          <button
            type="button"
            className={`df-btn${scheme === 'dark' ? ' is-active' : ''}`}
            onClick={() => setScheme('dark')}
          >
            Dark
          </button>
        </div>

        <button type="button" className="df-btn" onClick={() => fileRef.current?.click()}>
          Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onImport(f);
            e.target.value = '';
          }}
        />

        <button
          type="button"
          className="df-btn is-primary"
          onClick={() => void runExport()}
          disabled={exporting}
        >
          {exporting ? 'Exporting…' : 'Export'}
        </button>
      </header>

      <div className="df-body">
        <aside className="df-sidebar">
          <div className="df-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'globals'}
              className={`df-tab${mode === 'globals' ? ' is-active' : ''}`}
              onClick={() => {
                setMode('globals');
                selectComponent(null);
              }}
            >
              Globals
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'components'}
              className={`df-tab${mode === 'components' ? ' is-active' : ''}`}
              onClick={() => setMode('components')}
            >
              Components
            </button>
          </div>
          <div className="df-sidebar-scroll">
            {mode === 'globals' ? <GlobalsPanel /> : <ComponentsPanel />}
          </div>
        </aside>

        <main className="df-main">
          <Canvas />
        </main>
      </div>

      {exported ? <ExportPanel result={exported} onClose={() => setExported(null)} /> : null}
      {status ? (
        <div className="df-status" role="status">
          {status}
        </div>
      ) : null}
    </div>
  );
}
