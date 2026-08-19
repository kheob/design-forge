/**
 * Theme document helpers.
 *
 * A Theme stores only what the user changed. Everything else resolves from the registry
 * defaults at read time, which keeps exported files small and makes it obvious in the
 * editor which values are deliberate choices rather than leftovers.
 */

import type { ComponentDef, Theme } from './types.js';
import { GLOBAL_CONTROLS } from './tokens/globals.js';

export const THEME_VERSION = '1';

export function createTheme(name = 'Untitled theme'): Theme {
  return {
    name,
    version: THEME_VERSION,
    globals: {},
    components: {},
    darkGlobals: {},
  };
}

/** Resolved value of a global control: the user's value, else the registry default. */
export function globalValue(theme: Theme, controlId: string): string {
  const v = theme.globals[controlId];
  if (v !== undefined) return v;
  return GLOBAL_CONTROLS.get(controlId)?.default ?? '';
}

export function isGlobalOverridden(theme: Theme, controlId: string): boolean {
  return theme.globals[controlId] !== undefined;
}

/** A component control is "inheriting" until the user explicitly sets it. */
export function componentValue(
  theme: Theme,
  componentId: string,
  controlId: string,
): string | undefined {
  return theme.components[componentId]?.[controlId];
}

export function isComponentOverridden(
  theme: Theme,
  componentId: string,
  controlId: string,
): boolean {
  return componentValue(theme, componentId, controlId) !== undefined;
}

/**
 * What a component control shows when it is NOT overridden: the inherited global value if
 * it declares one, otherwise the component's own registry default (Bulma's value).
 */
export function inheritedValue(
  theme: Theme,
  component: ComponentDef,
  controlId: string,
): string {
  const control = component.controls.find((c) => c.id === controlId);
  if (!control) return '';
  if (control.inheritsFrom) return globalValue(theme, control.inheritsFrom);
  return control.default;
}

export function setGlobal(theme: Theme, controlId: string, value: string): Theme {
  return { ...theme, globals: { ...theme.globals, [controlId]: value } };
}

export function resetGlobal(theme: Theme, controlId: string): Theme {
  const globals = { ...theme.globals };
  delete globals[controlId];
  return { ...theme, globals };
}

export function setComponent(
  theme: Theme,
  componentId: string,
  controlId: string,
  value: string,
): Theme {
  return {
    ...theme,
    components: {
      ...theme.components,
      [componentId]: { ...theme.components[componentId], [controlId]: value },
    },
  };
}

export function resetComponent(
  theme: Theme,
  componentId: string,
  controlId: string,
): Theme {
  const forComponent = { ...theme.components[componentId] };
  delete forComponent[controlId];
  const components = { ...theme.components };
  if (Object.keys(forComponent).length === 0) delete components[componentId];
  else components[componentId] = forComponent;
  return { ...theme, components };
}

export function resetAllForComponent(theme: Theme, componentId: string): Theme {
  const components = { ...theme.components };
  delete components[componentId];
  return { ...theme, components };
}

export function countOverrides(theme: Theme): { globals: number; components: number } {
  return {
    globals: Object.keys(theme.globals).length,
    components: Object.values(theme.components).reduce(
      (n, m) => n + Object.keys(m).length,
      0,
    ),
  };
}

/** Accepts a parsed theme.json, filling in anything missing so old files keep loading. */
export function normaliseTheme(input: unknown): Theme {
  const t = (input ?? {}) as Partial<Theme>;
  return {
    name: typeof t.name === 'string' ? t.name : 'Imported theme',
    version: typeof t.version === 'string' ? t.version : THEME_VERSION,
    description: typeof t.description === 'string' ? t.description : undefined,
    globals: isRecord(t.globals) ? t.globals : {},
    components: isRecord(t.components) ? (t.components as Theme['components']) : {},
    darkGlobals: isRecord(t.darkGlobals) ? t.darkGlobals : {},
  };
}

function isRecord(v: unknown): v is Record<string, never> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
