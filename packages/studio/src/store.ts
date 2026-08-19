import { create } from 'zustand';
import {
  ALL_COMPONENTS,
  applyPreset,
  createTheme,
  normaliseTheme,
  resetAllForComponent,
  resetComponent,
  resetGlobal,
  setComponent,
  setGlobal,
  type Theme,
} from '@design-forge/core';
import { connect, fetchTheme, isConnected, saveTheme } from './api';

const STORAGE_KEY = 'design-forge:theme';
const HISTORY_LIMIT = 60;
const AUTOSAVE_MS = 400;

export type PanelMode = 'globals' | 'components';
export type Scheme = 'light' | 'dark';
/** Gallery shows components in isolation; page shows a realistic composed layout. */
export type View = 'gallery' | 'page';

interface StudioState {
  theme: Theme;
  past: Theme[];
  future: Theme[];
  mode: PanelMode;
  scheme: Scheme;
  view: View;
  selectedComponentId: string | null;
  search: string;
  /** False until the theme has been loaded from the server (or fallback). */
  ready: boolean;

  hydrate: () => Promise<void>;
  setMode: (m: PanelMode) => void;
  setScheme: (s: Scheme) => void;
  setView: (v: View) => void;
  selectComponent: (id: string | null) => void;
  setSearch: (q: string) => void;

  updateGlobal: (controlId: string, value: string) => void;
  clearGlobal: (controlId: string) => void;
  updateComponent: (componentId: string, controlId: string, value: string) => void;
  clearComponent: (componentId: string, controlId: string) => void;
  clearComponentAll: (componentId: string) => void;

  rename: (name: string) => void;
  loadPreset: (presetId: string) => void;
  importTheme: (raw: unknown) => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
}

/**
 * Persistence.
 *
 * With the CLI running, the theme is a real file in the user's project — committable, and
 * readable by `design-forge export` in CI. Writes are debounced because a slider drag emits
 * a value per frame and each one is a disk write.
 *
 * Without the CLI (built assets served on their own), it falls back to localStorage so the
 * studio still works, just without the project integration.
 */
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function persist(theme: Theme): void {
  if (isConnected()) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => void saveTheme(theme), AUTOSAVE_MS);
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // Quota or private mode; the in-memory theme still works.
  }
}

function loadLocal(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normaliseTheme(JSON.parse(raw));
  } catch {
    // Corrupt storage should never block startup.
  }
  return createTheme('My design system');
}

export const useStudio = create<StudioState>((set, get) => {
  /** Every mutation goes through here so undo/redo and persistence are never forgotten. */
  const commit = (next: Theme) => {
    const { theme, past } = get();
    persist(next);
    set({
      theme: next,
      past: [...past, theme].slice(-HISTORY_LIMIT),
      future: [],
    });
  };

  return {
    theme: createTheme('My design system'),
    past: [],
    future: [],
    mode: 'globals',
    scheme: 'light',
    view: 'gallery',
    selectedComponentId: null,
    search: '',
    ready: false,

    hydrate: async () => {
      const ctx = await connect();
      const remote = ctx ? await fetchTheme() : null;
      set({ theme: remote ?? (ctx ? createTheme(ctx.name) : loadLocal()), ready: true });
    },

    setMode: (mode) => set({ mode }),
    setScheme: (scheme) => set({ scheme }),
    setView: (view) => set({ view }),
    selectComponent: (selectedComponentId) =>
      set({ selectedComponentId, mode: selectedComponentId ? 'components' : get().mode }),
    setSearch: (search) => set({ search }),

    updateGlobal: (controlId, value) => commit(setGlobal(get().theme, controlId, value)),
    clearGlobal: (controlId) => commit(resetGlobal(get().theme, controlId)),
    updateComponent: (componentId, controlId, value) =>
      commit(setComponent(get().theme, componentId, controlId, value)),
    clearComponent: (componentId, controlId) =>
      commit(resetComponent(get().theme, componentId, controlId)),
    clearComponentAll: (componentId) => commit(resetAllForComponent(get().theme, componentId)),

    rename: (name) => commit({ ...get().theme, name }),
    loadPreset: (presetId) => commit(applyPreset(presetId)),
    importTheme: (raw) => commit(normaliseTheme(raw)),
    reset: () => commit(createTheme('My design system')),

    undo: () => {
      const { past, future, theme } = get();
      if (!past.length) return;
      const previous = past[past.length - 1];
      persist(previous);
      set({
        theme: previous,
        past: past.slice(0, -1),
        future: [theme, ...future].slice(0, HISTORY_LIMIT),
      });
    },
    redo: () => {
      const { past, future, theme } = get();
      if (!future.length) return;
      const next = future[0];
      persist(next);
      set({ theme: next, past: [...past, theme].slice(-HISTORY_LIMIT), future: future.slice(1) });
    },
  };
});

export const componentById = (id: string | null) =>
  id ? (ALL_COMPONENTS.find((c) => c.id === id) ?? null) : null;
