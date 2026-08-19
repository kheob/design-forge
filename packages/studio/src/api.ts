/**
 * Talking to the local CLI server.
 *
 * The studio normally runs behind `npx design-forge`, which gives it filesystem access: the
 * theme is a real file in the user's project and Export writes the bundle straight in. But
 * the built assets are just static files, so someone can serve them without the CLI. Rather
 * than error in that case, the studio probes once at boot and degrades to browser-local
 * behaviour — localStorage for the theme, and a theme.json download instead of a bundle.
 *
 * Every caller goes through `isConnected()` rather than re-probing, so the mode is decided
 * once and never flickers mid-session.
 */

import type { Theme } from '@design-forge/core';

export interface ProjectContext {
  root: string;
  name: string;
  framework: string;
  frameworkLabel: string;
  outDir: string;
  themePath: string;
  themeExists: boolean;
  publicPath: string;
  snippet: { file: string; code: string };
}

export interface ExportResult {
  outDir: string;
  relativeOutDir: string;
  files: string[];
  bytes: number;
  snippet: { file: string; code: string };
  docsPath: string;
}

let context: ProjectContext | null = null;
let connected = false;

/** Probe the server once. Safe to call before anything else; never throws. */
export async function connect(): Promise<ProjectContext | null> {
  try {
    const res = await fetch('./api/context');
    if (!res.ok) throw new Error(String(res.status));
    context = (await res.json()) as ProjectContext;
    connected = true;
    return context;
  } catch {
    connected = false;
    return null;
  }
}

export const isConnected = (): boolean => connected;
export const getContext = (): ProjectContext | null => context;

export async function fetchTheme(): Promise<Theme | null> {
  if (!connected) return null;
  try {
    const res = await fetch('./api/theme');
    if (!res.ok) return null;
    return (await res.json()) as Theme;
  } catch {
    return null;
  }
}

export async function saveTheme(theme: Theme): Promise<void> {
  if (!connected) return;
  try {
    await fetch('./api/theme', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(theme),
    });
  } catch {
    // An autosave that fails shouldn't interrupt editing; the next one will retry.
  }
}

export async function exportBundle(theme: Theme): Promise<ExportResult> {
  const res = await fetch('./api/export', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ theme }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? 'Export failed');
  return body as ExportResult;
}

/** Standalone fallback: hand back the theme file so the CLI can build from it later. */
export function downloadTheme(theme: Theme): void {
  const blob = new Blob([`${JSON.stringify(theme, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'design-forge.json';
  a.click();
  URL.revokeObjectURL(url);
}
