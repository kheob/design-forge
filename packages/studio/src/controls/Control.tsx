import { useEffect, useState } from 'react';
import { assess, isHex, type ControlDef } from '@design-forge/core';

/**
 * One editable token.
 *
 * The central idea: a control is either *inheriting* (showing where its value comes from,
 * dimmed) or *overridden* (showing a reset affordance). Making that state visible is what
 * lets someone reason about a cascading system without reading the CSS.
 */

export interface ControlProps {
  control: ControlDef;
  /** The value in force, whether inherited or explicitly set. */
  value: string;
  /** True when the user has explicitly set this. */
  overridden: boolean;
  /** Human-readable description of where an inherited value comes from. */
  inheritedFrom?: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

/** Splits "1.25rem" into [1.25, "rem"]. Leaves calc()/var() expressions alone. */
function splitLength(v: string): { n: number; unit: string } | null {
  const m = /^(-?[\d.]+)([a-z%]*)$/i.exec(v.trim());
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  if (!Number.isFinite(n)) return null;
  return { n, unit: m[2] || '' };
}

export function Control({
  control,
  value,
  overridden,
  inheritedFrom,
  onChange,
  onReset,
}: ControlProps) {
  return (
    <div className={`df-control${overridden ? ' is-overridden' : ''}`}>
      <div className="df-control-head">
        <label className="df-control-label" htmlFor={`ctl-${control.id}`}>
          {control.label}
        </label>
        {overridden ? (
          <button type="button" className="df-reset" onClick={onReset} title="Reset to inherited value">
            ⟲ reset
          </button>
        ) : inheritedFrom ? (
          <span className="df-inherit" title={`Inherited from ${inheritedFrom}`}>
            inherits {inheritedFrom}
          </span>
        ) : null}
      </div>
      <ControlInput control={control} value={value} onChange={onChange} />
      {control.help ? <p className="df-help">{control.help}</p> : null}
      {control.cssVar ? <code className="df-var">{control.cssVar}</code> : null}
    </div>
  );
}

function ControlInput({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: string;
  onChange: (v: string) => void;
}) {
  switch (control.type) {
    case 'color':
      return <ColorInput control={control} value={value} onChange={onChange} />;
    case 'select':
    case 'font':
      return (
        <select
          id={`ctl-${control.id}`}
          className="df-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {!control.options?.some((o) => o.value === value) && (
            <option value={value}>{value || '(custom)'}</option>
          )}
          {control.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case 'number':
    case 'ratio':
      return <NumberInput control={control} value={value} onChange={onChange} />;
    case 'length':
      return <LengthInput control={control} value={value} onChange={onChange} />;
    default:
      return (
        <input
          id={`ctl-${control.id}`}
          className="df-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

function NumberInput({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: string;
  onChange: (v: string) => void;
}) {
  // Values may carry a suffix the emitter adds (deg, %); edit the bare number.
  const bare = value.replace(/[^\d.-]/g, '');
  const n = Number.parseFloat(bare);
  const min = control.min ?? 0;
  const max = control.max ?? 100;
  return (
    <div className="df-row">
      <input
        type="range"
        className="df-range"
        min={min}
        max={max}
        step={control.step ?? 1}
        value={Number.isFinite(n) ? n : min}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        id={`ctl-${control.id}`}
        className="df-input df-input-num"
        type="number"
        min={min}
        max={max}
        step={control.step ?? 1}
        value={Number.isFinite(n) ? n : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function LengthInput({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const parsed = splitLength(value);
  const units = control.units ?? ['rem', 'em', 'px'];

  // Shorthand ("0.5em 1em") and expressions (calc(), var()) get a plain text field:
  // a slider cannot represent them, and silently rewriting them would lose information.
  if (!parsed) {
    return (
      <input
        id={`ctl-${control.id}`}
        className="df-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    );
  }

  const unit = parsed.unit || units[0];
  const setNum = (n: string) => onChange(`${n}${unit}`);
  return (
    <div className="df-row">
      <input
        type="range"
        className="df-range"
        min={control.min ?? 0}
        max={control.max ?? 4}
        step={control.step ?? 0.0625}
        value={parsed.n}
        onChange={(e) => setNum(e.target.value)}
      />
      <input
        id={`ctl-${control.id}`}
        className="df-input df-input-num"
        type="number"
        min={control.min ?? 0}
        max={control.max ?? 4}
        step={control.step ?? 0.0625}
        value={parsed.n}
        onChange={(e) => setNum(e.target.value)}
      />
      <select
        className="df-input df-input-unit"
        value={unit}
        onChange={(e) => onChange(`${parsed.n}${e.target.value}`)}
        aria-label="Unit"
      >
        {units.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Token references a component colour can point at, instead of a raw hex. */
const TOKEN_SWATCHES = [
  'var(--bulma-primary)',
  'var(--bulma-link)',
  'var(--bulma-info)',
  'var(--bulma-success)',
  'var(--bulma-warning)',
  'var(--bulma-danger)',
  'var(--bulma-text)',
  'var(--bulma-text-strong)',
  'var(--bulma-text-weak)',
  'var(--bulma-border)',
  'var(--bulma-border-weak)',
  'var(--bulma-background)',
  'var(--bulma-scheme-main)',
  'var(--bulma-scheme-main-bis)',
  'transparent',
];

function ColorInput({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  const hex = isHex(value) ? (value.startsWith('#') ? value : `#${value}`) : null;
  const report = hex ? assess(hex) : null;
  const showTokens = !control.id.match(/^(primary|link|info|success|warning|danger)$/);

  return (
    <div className="df-color">
      <div className="df-row">
        <input
          type="color"
          className="df-swatch"
          value={hex ?? '#000000'}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${control.label} colour picker`}
          // A var() reference has no hex to show; the text field remains the source of truth.
          disabled={!hex && !showTokens}
        />
        <input
          id={`ctl-${control.id}`}
          className="df-input"
          type="text"
          value={draft}
          spellCheck={false}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onChange(draft)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onChange(draft);
          }}
        />
      </div>

      {showTokens ? (
        <select
          className="df-input df-token-select"
          value={TOKEN_SWATCHES.includes(value) ? value : ''}
          onChange={(e) => e.target.value && onChange(e.target.value)}
        >
          <option value="">Use a token…</option>
          {TOKEN_SWATCHES.map((t) => (
            <option key={t} value={t}>
              {t.replace('var(--bulma-', '').replace(')', '')}
            </option>
          ))}
        </select>
      ) : null}

      {report ? <ColorReport report={report} /> : null}
    </div>
  );
}

/**
 * Two separate facts, because they fail independently:
 *
 *  - Contrast of text placed ON the colour. Because the invert is derived rather than
 *    baked, this clears AA for ~97.5% of the colour space; the exceptions are muted
 *    mid-tones (around L 35-45% at moderate saturation) which land in AA-Large.
 *  - Drift. A colour cannot always be used as text at its own lightness — a pale yellow
 *    has to darken by ~48 points to stay readable on a light background. Nothing is
 *    broken when that happens, but "my brand yellow renders as olive text" surprises
 *    people, so it is worth saying out loud.
 */
function ColorReport({ report }: { report: ReturnType<typeof assess> }) {
  const { ratio, level, hsl, onSchemeL } = report;
  const tone = level === 'Fail' ? 'is-fail' : level === 'AA Large' ? 'is-warn' : 'is-pass';
  const drift = Math.round(hsl.l - onSchemeL);

  return (
    <>
      <p className={`df-contrast ${tone}`}>
        <strong>{ratio}:1</strong> {level}
        {level === 'Fail' ? (
          <span> — no text will be readable on this fill. Choose a darker or lighter colour.</span>
        ) : level === 'AA Large' ? (
          <span> — text on this fill is only safe at large sizes. Nudge the lightness away from the mid-range.</span>
        ) : (
          <span> for text on this colour</span>
        )}
      </p>
      {Math.abs(drift) >= 12 ? (
        <p className="df-contrast is-note">
          As <em>text</em> this darkens by {Math.abs(drift)} points to stay readable
          {drift < 0 ? ' (lightens)' : ''}. Fills use your exact colour; <code>has-text-*</code>{' '}
          will look deeper.
        </p>
      ) : null}
    </>
  );
}
