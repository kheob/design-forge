/**
 * Builders for component control definitions.
 *
 * Every `cssVar` referenced through these helpers was verified against the compiled
 * bulma@1.0.4 stylesheet. Emitting a variable Bulma does not read would produce silently
 * dead CSS in the export, so the registry never invents names.
 */

import type { ControlDef, Decls } from '../types.js';

/** Length control (rem/em/px). */
export function len(
  id: string,
  label: string,
  cssVar: string,
  def: string,
  opts: {
    min?: number;
    max?: number;
    step?: number;
    units?: string[];
    help?: string;
    inheritsFrom?: string;
  } = {},
): ControlDef {
  return {
    id,
    label,
    help: opts.help,
    type: 'length',
    default: def,
    min: opts.min ?? 0,
    max: opts.max ?? 4,
    step: opts.step ?? 0.0625,
    units: opts.units ?? ['rem', 'em', 'px'],
    cssVar,
    inheritsFrom: opts.inheritsFrom,
    emit: (v) => ({ [cssVar]: v }),
  };
}

/** Colour control. Value may be a hex or a token reference like var(--bulma-primary). */
export function col(
  id: string,
  label: string,
  cssVar: string,
  def: string,
  opts: { help?: string; inheritsFrom?: string } = {},
): ControlDef {
  return {
    id,
    label,
    help: opts.help,
    type: 'color',
    default: def,
    cssVar,
    inheritsFrom: opts.inheritsFrom,
    emit: (v) => ({ [cssVar]: v }),
  };
}

export function sel(
  id: string,
  label: string,
  cssVar: string,
  def: string,
  options: { label: string; value: string }[],
  opts: { help?: string; inheritsFrom?: string } = {},
): ControlDef {
  return {
    id,
    label,
    help: opts.help,
    type: 'select',
    default: def,
    options,
    cssVar,
    inheritsFrom: opts.inheritsFrom,
    emit: (v) => ({ [cssVar]: v }),
  };
}

export function num(
  id: string,
  label: string,
  cssVar: string,
  def: string,
  opts: {
    min: number;
    max: number;
    step: number;
    suffix?: string;
    help?: string;
    inheritsFrom?: string;
  },
): ControlDef {
  return {
    id,
    label,
    help: opts.help,
    type: 'number',
    default: def,
    min: opts.min,
    max: opts.max,
    step: opts.step,
    cssVar,
    inheritsFrom: opts.inheritsFrom,
    emit: (v) => ({ [cssVar]: `${v}${opts.suffix ?? ''}` }),
  };
}

/** Free-text control for values with no better widget (shadows, shorthand). */
export function text(
  id: string,
  label: string,
  cssVar: string,
  def: string,
  opts: { help?: string } = {},
): ControlDef {
  return {
    id,
    label,
    help: opts.help,
    type: 'text',
    default: def,
    cssVar,
    emit: (v) => ({ [cssVar]: v }),
  };
}

/** A control that writes several variables at once from one value. */
export function combo(
  id: string,
  label: string,
  def: string,
  options: { label: string; value: string }[],
  map: Record<string, Decls>,
  opts: { help?: string } = {},
): ControlDef {
  return {
    id,
    label,
    help: opts.help,
    type: 'select',
    default: def,
    options,
    emit: (v) => map[v] ?? {},
  };
}

export const WEIGHTS = [
  { label: 'Light (300)', value: '300' },
  { label: 'Normal (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semibold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extrabold (800)', value: '800' },
];

export const BORDER_STYLES = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
  { label: 'None', value: 'none' },
];

export const ALIGNMENTS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Inherit', value: 'inherit' },
];

/** Shadow presets, offered wherever a component takes an elevation. */
export const SHADOWS = [
  { label: 'None', value: 'none' },
  { label: 'Subtle', value: '0 0.125em 0.25em -0.0625em hsla(var(--bulma-shadow-h), var(--bulma-shadow-s), var(--bulma-shadow-l), 0.08)' },
  { label: 'Default', value: 'var(--bulma-shadow)' },
  { label: 'Raised', value: '0 0.75em 1.5em -0.25em hsla(var(--bulma-shadow-h), var(--bulma-shadow-s), var(--bulma-shadow-l), 0.14), 0 0 0 1px hsla(var(--bulma-shadow-h), var(--bulma-shadow-s), var(--bulma-shadow-l), 0.02)' },
  { label: 'Floating', value: '0 1.5em 3em -0.5em hsla(var(--bulma-shadow-h), var(--bulma-shadow-s), var(--bulma-shadow-l), 0.2)' },
  { label: 'Hairline only', value: '0 0 0 1px hsla(var(--bulma-shadow-h), var(--bulma-shadow-s), var(--bulma-shadow-l), 0.12)' },
];

/** Radius controls almost always want to inherit a global; this wires that up. */
export const radiusControl = (
  cssVar: string,
  def = 'var(--bulma-radius)',
  inheritsFrom = 'radius',
  label = 'Corner radius',
): ControlDef =>
  len('radius', label, cssVar, def, {
    max: 3,
    inheritsFrom,
    help: 'Inherits the global radius until you change it here.',
  });
