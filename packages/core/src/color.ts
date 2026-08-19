/**
 * Colour maths.
 *
 * Why this file carries more weight than you would expect:
 *
 * Bulma bakes its contrast decisions at SASS compile time. In the shipped stylesheet
 * `--bulma-primary-invert-l` is a *static* reference to `--bulma-primary-05-l` (6%),
 * chosen because Bulma's stock turquoise is light. It does NOT react to a runtime change
 * of `--bulma-primary-l`. So naive runtime theming breaks badly: pick a dark navy primary
 * and you get near-black text on a near-black button.
 *
 * Design Forge therefore recomputes the contrast-dependent lightness values itself —
 * `-invert-l` (text ON the colour) and `-on-scheme-l` (the colour used AS text on the
 * page background) — using real WCAG relative luminance. This is what makes arbitrary
 * brand colours safe.
 */

export interface Hsl {
  h: number;
  s: number;
  l: number;
}
export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** WCAG 2.1 minimum contrast for normal-size body text. */
export const AA_NORMAL = 4.5;
/** WCAG 2.1 minimum for large text (>=18.66px bold or >=24px). */
export const AA_LARGE = 3;
export const AAA_NORMAL = 7;

export function hexToRgb(hex: string): Rgb {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = Number.parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(n)) return { r: 0, g: 0, b: 0 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: round(h, 2), s: round(s * 100, 2), l: round(l * 100, 2) };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let rgb: [number, number, number];
  if (hp < 1) rgb = [c, x, 0];
  else if (hp < 2) rgb = [x, c, 0];
  else if (hp < 3) rgb = [0, c, x];
  else if (hp < 4) rgb = [0, x, c];
  else if (hp < 5) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  const m = ln - c / 2;
  return {
    r: (rgb[0] + m) * 255,
    g: (rgb[1] + m) * 255,
    b: (rgb[2] + m) * 255,
  };
}

export const hexToHsl = (hex: string): Hsl => rgbToHsl(hexToRgb(hex));
export const hslToHex = (hsl: Hsl): string => rgbToHex(hslToRgb(hsl));

/** WCAG relative luminance. */
export function luminance({ r, g, b }: Rgb): number {
  const ch = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** WCAG contrast ratio between two colours, 1..21. */
export function contrast(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return round((hi + 0.05) / (lo + 0.05), 2);
}

export const contrastHex = (a: string, b: string): number =>
  contrast(hexToRgb(a), hexToRgb(b));

const lumOfHsl = (h: number, s: number, l: number) => luminance(hslToRgb({ h, s, l }));

function ratioOf(l1: number, l2: number): number {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Lightness for text placed ON this colour (Bulma's `-invert-l`).
 *
 * Tries a near-white and a near-black tint of the same hue and returns whichever wins on
 * contrast. Keeping the hue (rather than using pure #fff/#000) preserves Bulma's tinted
 * look while staying legible.
 */
export function invertLightness(h: number, s: number, l: number): number {
  const base = lumOfHsl(h, s, l);
  // Desaturate the extremes a little: fully saturated near-white reads as a pastel wash.
  const lightS = Math.min(s, 20);
  const darkS = Math.min(s, 30);
  const light = ratioOf(base, lumOfHsl(h, lightS, 98));
  const dark = ratioOf(base, lumOfHsl(h, darkS, 6));
  return light >= dark ? 98 : 6;
}

/**
 * Lightness for this colour used AS text on the page background (Bulma's
 * `-on-scheme-l`). Walks away from the background until it clears the target ratio, so a
 * bright brand yellow becomes a readable dark gold when used as link text.
 */
export function onSchemeLightness(
  h: number,
  s: number,
  l: number,
  schemeL: number,
  target = AA_NORMAL,
): number {
  const bg = lumOfHsl(h, Math.min(s, 20), schemeL);
  const darkBg = schemeL < 50;
  // Search from the base lightness away from the background.
  const step = darkBg ? 1 : -1;
  for (let cand = l; cand >= 0 && cand <= 100; cand += step) {
    if (ratioOf(lumOfHsl(h, s, cand), bg) >= target) return round(cand, 2);
  }
  return darkBg ? 100 : 0;
}

export type ContrastLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail';

export function levelFor(ratio: number): ContrastLevel {
  if (ratio >= AAA_NORMAL) return 'AAA';
  if (ratio >= AA_NORMAL) return 'AA';
  if (ratio >= AA_LARGE) return 'AA Large';
  return 'Fail';
}

export interface ColorAssessment {
  hex: string;
  hsl: Hsl;
  /** Lightness Design Forge will use for text on this colour. */
  invertL: number;
  /** Contrast achieved between the colour and that text. */
  ratio: number;
  level: ContrastLevel;
  /** Lightness for the colour used as text on the light page background. */
  onSchemeL: number;
  onSchemeRatio: number;
}

/** Full contrast report for one brand colour, used by the studio's inline warnings. */
export function assess(hex: string, schemeL = 100): ColorAssessment {
  const hsl = hexToHsl(hex);
  const invertL = invertLightness(hsl.h, hsl.s, hsl.l);
  const invertS = invertL > 50 ? Math.min(hsl.s, 20) : Math.min(hsl.s, 30);
  const ratio = round(
    ratioOf(lumOfHsl(hsl.h, hsl.s, hsl.l), lumOfHsl(hsl.h, invertS, invertL)),
    2,
  );
  const onSchemeL = onSchemeLightness(hsl.h, hsl.s, hsl.l, schemeL);
  const onSchemeRatio = round(
    ratioOf(lumOfHsl(hsl.h, hsl.s, onSchemeL), lumOfHsl(hsl.h, Math.min(hsl.s, 20), schemeL)),
    2,
  );
  return {
    hex,
    hsl,
    invertL,
    ratio,
    level: levelFor(ratio),
    onSchemeL,
    onSchemeRatio,
  };
}

export function round(n: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

export function isHex(v: string): boolean {
  return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());
}
