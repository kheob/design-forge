/**
 * Starting points.
 *
 * The premise of the tool is that you begin from a decent base rather than a blank page,
 * so these are complete opinions rather than colour swaps: each one moves radius, density,
 * type, elevation and motion together into a coherent look.
 */

import type { Theme } from '../types.js';
import { THEME_VERSION } from '../theme.js';

export interface Preset {
  id: string;
  name: string;
  description: string;
  globals: Record<string, string>;
  components?: Theme['components'];
}

const SYSTEM = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export const PRESETS: Preset[] = [
  {
    id: 'bulma',
    name: 'Bulma default',
    description: 'Stock Bulma. The unmodified baseline.',
    globals: {},
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Restrained blues, tight radius, subtle shadows. Reads trustworthy.',
    globals: {
      primary: '#1f5fd6',
      link: '#0b3f96',
      info: '#3178c6',
      success: '#2e9e6b',
      warning: '#c98a1b',
      danger: '#c4373f',
      schemeHue: '215',
      schemeSat: '16',
      radiusSmall: '0.125rem',
      radius: '0.25rem',
      radiusMedium: '0.3125rem',
      radiusLarge: '0.375rem',
      familyPrimary: SYSTEM,
      familySecondary: SYSTEM,
      typeScale: '1.2',
      headingWeight: '600',
      density: 'normal',
      shadowStrength: '0.7',
      duration: '200',
      easing: 'ease-out',
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Rounded, saturated and springy. Consumer apps and onboarding.',
    globals: {
      primary: '#7c4dff',
      link: '#ff4d94',
      info: '#00b8d9',
      success: '#22c55e',
      warning: '#fbbf24',
      danger: '#ef4444',
      schemeHue: '265',
      schemeSat: '22',
      radiusSmall: '0.5rem',
      radius: '0.875rem',
      radiusMedium: '1.125rem',
      radiusLarge: '1.5rem',
      familyPrimary: 'Nunito, "Segoe UI", system-ui, sans-serif',
      familySecondary: 'Poppins, Futura, system-ui, sans-serif',
      typeScale: '1.333',
      headingWeight: '800',
      density: 'comfortable',
      shadowStrength: '1.6',
      duration: '320',
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      hoverDelta: '-8',
    },
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Zero radius, heavy borders, no shadows. High contrast and unapologetic.',
    globals: {
      primary: '#000000',
      link: '#0000ee',
      info: '#0066ff',
      success: '#00994d',
      warning: '#ffcc00',
      danger: '#ee0000',
      schemeHue: '0',
      schemeSat: '0',
      radiusSmall: '0px',
      radius: '0px',
      radiusMedium: '0px',
      radiusLarge: '0px',
      radiusRounded: '0px',
      familyPrimary: '"Space Grotesk", Inter, sans-serif',
      familySecondary: '"Space Grotesk", Inter, sans-serif',
      typeScale: '1.4',
      headingWeight: '800',
      density: 'normal',
      borderWidth: '2px',
      shadowStrength: '0',
      duration: '0',
      speed: '0',
      focusWidth: '3px',
      focusOffset: '2px',
    },
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Warm neutrals, generous spacing, gentle elevation. Calm and editorial.',
    globals: {
      primary: '#4f8a6d',
      link: '#8a5a3c',
      info: '#5b7c99',
      success: '#5c9169',
      warning: '#c99a4e',
      danger: '#b5544f',
      schemeHue: '35',
      schemeSat: '20',
      radiusSmall: '0.375rem',
      radius: '0.625rem',
      radiusMedium: '0.875rem',
      radiusLarge: '1.25rem',
      familyPrimary: 'Lato, "Segoe UI", system-ui, sans-serif',
      familySecondary: '"Playfair Display", Georgia, serif',
      typeScale: '1.333',
      lineHeight: '1.65',
      headingWeight: '600',
      density: 'comfortable',
      shadowStrength: '0.8',
      shadowHue: '30',
      shadowSat: '25',
      duration: '350',
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
    },
  },
  {
    id: 'dense',
    name: 'Dense / data',
    description: 'Compact controls, small type, hairline borders. Dashboards and admin tools.',
    globals: {
      primary: '#2563eb',
      link: '#1d4ed8',
      info: '#0891b2',
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      schemeHue: '220',
      schemeSat: '12',
      radiusSmall: '0.125rem',
      radius: '0.25rem',
      radiusMedium: '0.3125rem',
      radiusLarge: '0.375rem',
      familyPrimary: 'Inter, system-ui, sans-serif',
      familySecondary: 'Inter, system-ui, sans-serif',
      bodySize: '0.875em',
      typeScale: '1.15',
      lineHeight: '1.4',
      headingWeight: '600',
      density: 'compact',
      columnGap: '0.5rem',
      shadowStrength: '0.5',
      duration: '120',
      speed: '60',
    },
    components: {
      table: { cellPadding: '0.35em 0.6em' },
      button: { weight: '500' },
    },
  },
];

export function applyPreset(presetId: string, name?: string): Theme {
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  return {
    name: name ?? preset.name,
    version: THEME_VERSION,
    description: preset.description,
    globals: { ...preset.globals },
    components: structuredClone(preset.components ?? {}),
    darkGlobals: {},
  };
}
