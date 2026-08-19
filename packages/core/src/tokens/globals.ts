/**
 * Global token registry — the controls shown in the studio's "Globals" panel.
 *
 * Each control owns its mapping to Bulma custom properties via `emit`. Adding a new
 * global means adding one entry here; the editor UI, live preview, exported CSS and
 * exported docs all pick it up automatically.
 */

import type { Decls, TokenGroup } from '../types.js';
import { hexToHsl, invertLightness, onSchemeLightness, round } from '../color.js';

/** Page background lightness in each scheme, used to derive readable text colours. */
export const LIGHT_SCHEME_L = 100;
export const DARK_SCHEME_L = 9;

/**
 * Emit the full set of properties for one Bulma colour.
 *
 * Bulma derives its 21-step ramp and its -light/-dark/-soft/-bold variants from h and s,
 * so those come free. The two values Bulma bakes in at compile time — `-invert-l` (text
 * on the colour) and `-on-scheme-l` (the colour as text on the page) — we compute, which
 * is what keeps arbitrary brand colours legible. See color.ts for the reasoning.
 */
export function emitColor(name: string, hex: string, schemeL: number): Decls {
  const { h, s, l } = hexToHsl(hex);
  const invertL = invertLightness(h, s, l);
  return {
    [`--bulma-${name}-h`]: `${round(h, 1)}deg`,
    [`--bulma-${name}-s`]: `${round(s, 1)}%`,
    [`--bulma-${name}-l`]: `${round(l, 1)}%`,
    [`--bulma-${name}-invert-l`]: `${invertL}%`,
    [`--bulma-${name}-on-scheme-l`]: `${onSchemeLightness(h, s, l, schemeL)}%`,
  };
}

const colorControl = (id: string, label: string, help: string, def: string) => ({
  id,
  label,
  help,
  type: 'color' as const,
  default: def,
  // The scheme-aware variant is applied in css.ts; this is the light-scheme emission.
  emit: (v: string): Decls => emitColor(id, v, LIGHT_SCHEME_L),
});

const len = (
  id: string,
  label: string,
  cssVar: string,
  def: string,
  opts: { min?: number; max?: number; step?: number; units?: string[]; help?: string } = {},
) => ({
  id,
  label,
  help: opts.help,
  type: 'length' as const,
  default: def,
  min: opts.min ?? 0,
  max: opts.max ?? 4,
  step: opts.step ?? 0.0625,
  units: opts.units ?? ['rem', 'em', 'px'],
  cssVar,
  emit: (v: string): Decls => ({ [cssVar]: v }),
});

const sel = (
  id: string,
  label: string,
  cssVar: string,
  def: string,
  options: { label: string; value: string }[],
  help?: string,
) => ({
  id,
  label,
  help,
  type: 'select' as const,
  default: def,
  options,
  cssVar,
  emit: (v: string): Decls => ({ [cssVar]: v }),
});

const num = (
  id: string,
  label: string,
  cssVar: string,
  def: string,
  opts: { min: number; max: number; step: number; suffix?: string; help?: string },
) => ({
  id,
  label,
  help: opts.help,
  type: 'number' as const,
  default: def,
  min: opts.min,
  max: opts.max,
  step: opts.step,
  cssVar,
  emit: (v: string): Decls => ({ [cssVar]: `${v}${opts.suffix ?? ''}` }),
});

const FONT_STACKS = [
  {
    label: 'System UI',
    value:
      'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Geometric (Poppins)', value: 'Poppins, Futura, system-ui, sans-serif' },
  { label: 'Humanist (Lato)', value: 'Lato, "Segoe UI", system-ui, sans-serif' },
  { label: 'Grotesk (Space Grotesk)', value: '"Space Grotesk", Inter, sans-serif' },
  { label: 'Serif (Georgia)', value: 'Georgia, Cambria, "Times New Roman", serif' },
  { label: 'Editorial (Playfair)', value: '"Playfair Display", Georgia, serif' },
  { label: 'Slab (Roboto Slab)', value: '"Roboto Slab", Rockwell, serif' },
  { label: 'Rounded (Nunito)', value: 'Nunito, "Segoe UI", system-ui, sans-serif' },
  { label: 'Monospace', value: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' },
];

const CODE_STACKS = [
  { label: 'System mono', value: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", ui-monospace, monospace' },
  { label: 'Fira Code', value: '"Fira Code", ui-monospace, monospace' },
  { label: 'IBM Plex Mono', value: '"IBM Plex Mono", ui-monospace, monospace' },
];

/**
 * Density presets fan out to every control-sizing variable at once.
 *
 * Buttons need their own entries: Bulma resets `.button { height: auto }`, so buttons
 * size from their padding rather than from `--bulma-control-height` like inputs do.
 * Setting only the control variables would shrink the inputs and leave the buttons tall.
 */
const DENSITY: Record<string, Decls> = {
  compact: {
    '--bulma-control-height': '2.15em',
    '--bulma-control-padding-vertical': 'calc(0.35em - 1px)',
    '--bulma-control-padding-horizontal': 'calc(0.6em - 1px)',
    '--bulma-block-spacing': '1rem',
  },
  normal: {
    '--bulma-control-height': '2.5em',
    '--bulma-control-padding-vertical': 'calc(0.5em - 1px)',
    '--bulma-control-padding-horizontal': 'calc(0.75em - 1px)',
    '--bulma-block-spacing': '1.5rem',
  },
  comfortable: {
    '--bulma-control-height': '2.9em',
    '--bulma-control-padding-vertical': 'calc(0.7em - 1px)',
    '--bulma-control-padding-horizontal': 'calc(1.05em - 1px)',
    '--bulma-block-spacing': '2rem',
  },
};

/** Buttons and tags re-declare their padding on their own selector, so density has to
 *  reach them there rather than through :root. */
const DENSITY_SCOPED: Record<string, Record<string, Decls>> = {
  compact: {
    '.button': {
      '--bulma-button-padding-vertical': 'calc(0.35em - 1px)',
      '--bulma-button-padding-horizontal': '0.7em',
    },
  },
  normal: {
    '.button': {
      '--bulma-button-padding-vertical': 'calc(0.5em - 1px)',
      '--bulma-button-padding-horizontal': '1em',
    },
  },
  comfortable: {
    '.button': {
      '--bulma-button-padding-vertical': 'calc(0.7em - 1px)',
      '--bulma-button-padding-horizontal': '1.3em',
    },
  },
};

export const GLOBAL_GROUPS: TokenGroup[] = [
  {
    id: 'brand',
    label: 'Brand colours',
    description:
      'Each colour generates a full 21-step ramp plus light/dark/soft/bold variants. Text colours are derived for contrast automatically.',
    controls: [
      colorControl('primary', 'Primary', 'Main brand colour: primary buttons, active states.', '#00d1b2'),
      colorControl('link', 'Secondary', 'Bulma calls this "link". Links, secondary actions, focus rings.', '#4250ff'),
    ],
  },
  {
    id: 'semantic',
    label: 'Semantic colours',
    description: 'Status and feedback. Keep these conventional — users read them by hue.',
    controls: [
      colorControl('info', 'Info', 'Neutral informational messages.', '#3e8ed0'),
      colorControl('success', 'Success', 'Confirmations and positive states.', '#48c78e'),
      colorControl('warning', 'Warning', 'Cautions needing attention.', '#ffe08a'),
      colorControl('danger', 'Danger', 'Errors and destructive actions.', '#f14668'),
    ],
  },
  {
    id: 'neutrals',
    label: 'Neutrals',
    description:
      'Every grey in the system is generated from one hue and saturation. A little saturation makes greys feel intentional rather than dead.',
    controls: [
      num('schemeHue', 'Neutral hue', '--bulma-scheme-h', '221', {
        min: 0,
        max: 360,
        step: 1,
        help: 'Hue that tints all greys. ~221 is cool/blue, ~35 is warm/paper.',
      }),
      num('schemeSat', 'Neutral saturation', '--bulma-scheme-s', '14', {
        min: 0,
        max: 60,
        step: 1,
        suffix: '%',
        help: '0% is pure grey. 10–20% reads as a considered neutral.',
      }),
    ],
  },
  {
    id: 'radius',
    label: 'Corner radius',
    description: 'The single strongest signal of personality: 0 reads technical, large reads friendly.',
    controls: [
      len('radiusSmall', 'Small', '--bulma-radius-small', '0.25rem', { max: 2 }),
      len('radius', 'Default', '--bulma-radius', '0.375rem', {
        max: 2,
        help: 'Used by buttons, inputs and most components unless overridden.',
      }),
      len('radiusMedium', 'Medium', '--bulma-radius-medium', '0.5rem', { max: 2 }),
      len('radiusLarge', 'Large', '--bulma-radius-large', '0.75rem', {
        max: 3,
        help: 'Cards, modals and other large surfaces.',
      }),
      len('radiusRounded', 'Pill', '--bulma-radius-rounded', '9999px', {
        max: 9999,
        step: 1,
        units: ['px'],
      }),
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    controls: [
      sel('familyPrimary', 'Body font', '--bulma-family-primary', FONT_STACKS[0].value, FONT_STACKS),
      sel(
        'familySecondary',
        'Heading font',
        '--bulma-family-secondary',
        FONT_STACKS[0].value,
        FONT_STACKS,
        'Set this differently from the body font to get a display/text pairing.',
      ),
      sel('familyCode', 'Code font', '--bulma-family-code', CODE_STACKS[0].value, CODE_STACKS),
      len('bodySize', 'Base size', '--bulma-body-font-size', '1em', {
        min: 0.75,
        max: 1.5,
        step: 0.0625,
        units: ['em', 'rem', 'px'],
      }),
      num('lineHeight', 'Line height', '--bulma-body-line-height', '1.5', {
        min: 1,
        max: 2.2,
        step: 0.05,
      }),
      {
        id: 'typeScale',
        label: 'Type scale ratio',
        help: 'Generates the seven heading sizes from one number. 1.2 is subtle, 1.333 is classic, 1.5 is dramatic.',
        type: 'ratio' as const,
        default: '1.25',
        min: 1.05,
        max: 1.6,
        step: 0.005,
        emit: (v: string): Decls => {
          const r = Number.parseFloat(v) || 1.25;
          // size-6 is the 1rem base; the rest step geometrically either side of it.
          const steps: Decls = {};
          const exps: Record<string, number> = {
            '1': 5,
            '2': 4,
            '3': 3,
            '4': 2,
            '5': 1,
            '6': 0,
            '7': -1,
          };
          for (const [n, e] of Object.entries(exps)) {
            steps[`--bulma-size-${n}`] = `${round(r ** e, 3)}rem`;
          }
          return steps;
        },
      },
      sel(
        'bodyWeight',
        'Body weight',
        '--bulma-body-weight',
        '400',
        [
          { label: 'Light (300)', value: '300' },
          { label: 'Normal (400)', value: '400' },
          { label: 'Medium (500)', value: '500' },
        ],
      ),
      sel(
        'headingWeight',
        'Heading weight',
        '--bulma-weight-bold',
        '700',
        [
          { label: 'Medium (500)', value: '500' },
          { label: 'Semibold (600)', value: '600' },
          { label: 'Bold (700)', value: '700' },
          { label: 'Extrabold (800)', value: '800' },
        ],
      ),
    ],
  },
  {
    id: 'density',
    label: 'Density & spacing',
    controls: [
      {
        id: 'density',
        label: 'Density',
        help: 'Resizes every control at once. Compact suits data-heavy tools; comfortable suits marketing pages.',
        type: 'select' as const,
        default: 'normal',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Normal', value: 'normal' },
          { label: 'Comfortable', value: 'comfortable' },
        ],
        emit: (v: string): Decls => DENSITY[v] ?? DENSITY.normal,
        emitScoped: (v: string) => DENSITY_SCOPED[v] ?? DENSITY_SCOPED.normal,
      },
      len('columnGap', 'Column gap', '--bulma-column-gap', '0.75rem', { max: 3 }),
    ],
  },
  {
    id: 'borders',
    label: 'Borders',
    controls: [
      len('borderWidth', 'Control border width', '--bulma-control-border-width', '1px', {
        min: 0,
        max: 6,
        step: 1,
        units: ['px'],
        help: 'Thicker borders plus zero radius gives a brutalist feel.',
      }),
    ],
  },
  {
    id: 'elevation',
    label: 'Elevation',
    controls: [
      num('shadowHue', 'Shadow hue', '--bulma-shadow-h', '221', { min: 0, max: 360, step: 1, suffix: 'deg' }),
      num('shadowSat', 'Shadow saturation', '--bulma-shadow-s', '14', { min: 0, max: 100, step: 1, suffix: '%' }),
      {
        id: 'shadowStrength',
        label: 'Shadow strength',
        help: '0 removes every shadow in the system — pair with visible borders for a flat look.',
        type: 'number' as const,
        default: '1',
        min: 0,
        max: 3,
        step: 0.05,
        emit: (v: string): Decls => {
          const m = Number.parseFloat(v);
          const k = Number.isFinite(m) ? m : 1;
          const a1 = round(0.1 * k, 4);
          const a2 = round(0.02 * k, 4);
          const c = (a: number) =>
            `hsla(var(--bulma-shadow-h), var(--bulma-shadow-s), var(--bulma-shadow-l), ${a})`;
          return {
            '--bulma-shadow': `0 0.5em 1em -0.125em ${c(a1)}, 0 0px 0 1px ${c(a2)}`,
          };
        },
      },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    controls: [
      num('duration', 'Transition duration', '--bulma-duration', '294', {
        min: 0,
        max: 800,
        step: 1,
        suffix: 'ms',
        help: 'Colour and background transitions.',
      }),
      num('speed', 'Interaction speed', '--bulma-speed', '86', {
        min: 0,
        max: 400,
        step: 1,
        suffix: 'ms',
        help: 'Fast feedback on hover and press.',
      }),
      sel('easing', 'Easing', '--bulma-easing', 'ease-out', [
        { label: 'Ease out', value: 'ease-out' },
        { label: 'Ease in out', value: 'ease-in-out' },
        { label: 'Linear', value: 'linear' },
        { label: 'Snappy', value: 'cubic-bezier(0.2, 0, 0, 1)' },
        { label: 'Springy', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      ]),
    ],
  },
  {
    id: 'interaction',
    label: 'Interaction',
    description: 'How much everything shifts on hover and press. Larger deltas feel more reactive.',
    controls: [
      num('hoverDelta', 'Hover shift', '--bulma-hover-background-l-delta', '-5', {
        min: -25,
        max: 25,
        step: 1,
        suffix: '%',
      }),
      num('activeDelta', 'Press shift', '--bulma-active-background-l-delta', '-10', {
        min: -30,
        max: 30,
        step: 1,
        suffix: '%',
      }),
    ],
  },
  {
    id: 'focus',
    label: 'Focus ring',
    description:
      'Keyboard accessibility depends on this being visible. Never set the width to 0.',
    controls: [
      len('focusWidth', 'Outline width', '--bulma-focus-width', '2px', {
        min: 0,
        max: 6,
        step: 1,
        units: ['px'],
      }),
      len('focusOffset', 'Outline offset', '--bulma-focus-offset', '1px', {
        min: 0,
        max: 8,
        step: 1,
        units: ['px'],
      }),
      sel('focusStyle', 'Outline style', '--bulma-focus-style', 'solid', [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
      ]),
      len('focusShadowSize', 'Focus glow size', '--bulma-focus-shadow-size', '0.1875em', {
        min: 0,
        max: 1,
        step: 0.0625,
        units: ['em', 'rem', 'px'],
      }),
      num('focusShadowAlpha', 'Focus glow opacity', '--bulma-focus-shadow-alpha', '0.25', {
        min: 0,
        max: 1,
        step: 0.05,
      }),
    ],
  },
];

/** Flat lookup by control id. */
export const GLOBAL_CONTROLS = new Map(
  GLOBAL_GROUPS.flatMap((g) => g.controls.map((c) => [c.id, c] as const)),
);

/** Ids of controls that are brand/semantic colours, which need per-scheme treatment. */
export const COLOR_CONTROL_IDS = GLOBAL_GROUPS.filter(
  (g) => g.id === 'brand' || g.id === 'semantic',
).flatMap((g) => g.controls.map((c) => c.id));
