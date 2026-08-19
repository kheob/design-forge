/**
 * Design Forge — core type model.
 *
 * The registry (token groups + component definitions) is CODE: it holds `emit`
 * functions and is never serialised. A `Theme` is DATA: a sparse map of the values the
 * user actually changed. That split is what lets one registry drive the editor UI, the
 * live preview, the exported CSS and the exported documentation without them drifting.
 */

export type ControlType =
  | 'color'
  | 'length'
  | 'number'
  | 'select'
  | 'text'
  | 'font'
  | 'ratio';

/** A CSS declaration block: custom-property name -> value. */
export type Decls = Record<string, string>;

export interface ControlDef {
  id: string;
  label: string;
  /** Short explanation shown under the control. */
  help?: string;
  type: ControlType;
  /** The value used when the user has not changed anything. */
  default: string;
  /** Numeric controls. */
  min?: number;
  max?: number;
  step?: number;
  /** Allowed units for length controls; the first is the default. */
  units?: string[];
  /** Options for select / font controls. */
  options?: { label: string; value: string }[];
  /**
   * Turn a value into CSS custom properties. One control may emit several — a colour
   * emits h/s/l, a type-scale ratio emits seven size steps.
   */
  emit: (value: string) => Decls;
  /**
   * Declarations that must land on a selector other than `:root`.
   *
   * Necessary because Bulma re-declares some variables on the component itself — e.g.
   * `.button { --bulma-button-padding-vertical: 0.5em }`. A `:root` value can never win
   * against that, so a global control that needs to reach such a variable has to emit
   * into the component's own selector. Returns selector -> declarations.
   */
  emitScoped?: (value: string) => Record<string, Decls>;
  /**
   * Component controls only: the id of the global token this falls back to when it has
   * not been overridden. Drives the "inherit vs override" affordance in the editor.
   */
  inheritsFrom?: string;
  /** Component controls only: the underlying Bulma variable, surfaced in UI and docs. */
  cssVar?: string;
}

export interface TokenGroup {
  id: string;
  label: string;
  description?: string;
  controls: ControlDef[];
}

export interface Variant {
  label: string;
  html: string;
  description?: string;
}

export interface ComponentDocs {
  classes: { name: string; description: string }[];
  usage?: string;
  dos: string[];
  donts: string[];
}

export type ComponentCategory =
  | 'Elements'
  | 'Form'
  | 'Components'
  | 'Layout'
  | 'Grid'
  | 'Extensions';

export interface ComponentDef {
  id: string;
  name: string;
  category: ComponentCategory;
  /** Selector that scoped overrides are written to, e.g. ".button". */
  selector: string;
  description: string;
  controls: ControlDef[];
  variants: Variant[];
  docs: ComponentDocs;
  /** True for components we add on top of Bulma (shipped in extensions.css). */
  extension?: boolean;
}

export const CATEGORY_ORDER: ComponentCategory[] = [
  'Elements',
  'Form',
  'Components',
  'Layout',
  'Grid',
  'Extensions',
];

/** The serialisable document. Sparse by design: an absent key means "use the default". */
export interface Theme {
  name: string;
  version: string;
  description?: string;
  /** globalControlId -> value */
  globals: Record<string, string>;
  /** componentId -> (controlId -> value) */
  components: Record<string, Record<string, string>>;
  /** Global values that apply only under the dark scheme. */
  darkGlobals: Record<string, string>;
}
