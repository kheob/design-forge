import type { ComponentDef } from '../types.js';
import { BORDER_STYLES, SHADOWS, col, len, num, radiusControl, sel, WEIGHTS } from './helpers.js';

export const FORM: ComponentDef[] = [
  {
    id: 'input',
    name: 'Text input',
    category: 'Form',
    // Bulma shares one set of --bulma-input-* variables across these three controls, so
    // theming them together is what keeps a form visually consistent.
    selector: '.input,\n.textarea,\n.select select',
    description: 'Single-line inputs, textareas and selects share these tokens.',
    controls: [
      radiusControl('--bulma-input-radius'),
      len('height', 'Height', '--bulma-input-height', 'var(--bulma-control-height)', {
        min: 1.5,
        max: 4,
        units: ['em', 'rem', 'px'],
        inheritsFrom: 'density',
      }),
      len('borderWidth', 'Border width', '--bulma-input-border-width', '1px', {
        min: 0,
        max: 6,
        step: 1,
        units: ['px'],
        inheritsFrom: 'borderWidth',
      }),
      sel('borderStyle', 'Border style', '--bulma-input-border-style', 'solid', BORDER_STYLES),
      col('borderColor', 'Border colour', '--bulma-input-border-color', 'var(--bulma-border)'),
      sel('shadow', 'Shadow', '--bulma-input-shadow', 'inset 0 0.0625em 0.125em hsla(var(--bulma-scheme-h), var(--bulma-scheme-s), var(--bulma-scheme-invert-l), 0.05)', [
        { label: 'None', value: 'none' },
        { label: 'Inset (default)', value: 'inset 0 0.0625em 0.125em hsla(var(--bulma-scheme-h), var(--bulma-scheme-s), var(--bulma-scheme-invert-l), 0.05)' },
        ...SHADOWS.slice(1),
      ]),
      len('focusShadowSize', 'Focus glow size', '--bulma-input-focus-shadow-size', '0 0 0 0.125em', {
        units: ['em'],
        max: 1,
        help: 'Box-shadow spread shown on focus.',
      }),
      num('focusShadowAlpha', 'Focus glow opacity', '--bulma-input-focus-shadow-alpha', '0.25', {
        min: 0,
        max: 1,
        step: 0.05,
        inheritsFrom: 'focusShadowAlpha',
      }),
      col('placeholder', 'Placeholder colour', '--bulma-input-placeholder-color', 'hsla(var(--bulma-text-h), var(--bulma-text-s), var(--bulma-text-weak-l), 0.5)'),
      num('hoverBorder', 'Hover border shift', '--bulma-input-hover-border-l-delta', '-5', {
        min: -25,
        max: 25,
        step: 1,
        suffix: '%',
      }),
      col('disabledBg', 'Disabled background', '--bulma-input-disabled-background-color', 'var(--bulma-background)'),
    ],
    variants: [
      {
        label: 'States',
        html: `<div class="field"><div class="control"><input class="input" type="text" placeholder="Default input"></div></div>
<div class="field"><div class="control"><input class="input is-focused" type="text" value="Focused"></div></div>
<div class="field"><div class="control"><input class="input is-danger" type="text" value="Invalid value"></div></div>
<div class="field"><div class="control"><input class="input" type="text" placeholder="Disabled" disabled></div></div>`,
      },
      {
        label: 'With icons',
        html: `<div class="field">
  <div class="control has-icons-left has-icons-right">
    <input class="input is-success" type="email" value="ada@example.com">
    <span class="icon is-small is-left"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg></span>
    <span class="icon is-small is-right"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></span>
  </div>
</div>`,
      },
      {
        label: 'Sizes',
        html: `<input class="input is-small" type="text" placeholder="Small">
<input class="input" type="text" placeholder="Normal">
<input class="input is-medium" type="text" placeholder="Medium">
<input class="input is-large" type="text" placeholder="Large">`,
      },
    ],
    docs: {
      usage: 'Always wrap in .field > .control so spacing and icon slots work.',
      classes: [
        { name: 'is-small / is-medium / is-large', description: 'Size modifiers.' },
        { name: 'is-danger / is-success / is-warning', description: 'Validation states.' },
        { name: 'is-rounded', description: 'Pill-shaped input.' },
        { name: 'has-icons-left / has-icons-right', description: 'On .control, reserves icon space.' },
      ],
      dos: [
        'Pair every input with a <label class="label"> tied by for/id.',
        'Use is-danger together with a .help.is-danger message explaining the error.',
      ],
      donts: ['Do not use placeholder text as the only label.'],
    },
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Form',
    selector: '.textarea',
    description: 'Multi-line input. Inherits every token from Text input, plus its own sizing.',
    controls: [
      len('padding', 'Padding', '--bulma-textarea-padding', 'var(--bulma-control-padding-horizontal)', {
        max: 3,
        units: ['em', 'rem', 'px'],
      }),
      len('minHeight', 'Minimum height', '--bulma-textarea-min-height', '8em', {
        max: 24,
        units: ['em', 'rem', 'px'],
      }),
      len('maxHeight', 'Maximum height', '--bulma-textarea-max-height', '40em', {
        max: 80,
        units: ['em', 'rem', 'px'],
      }),
    ],
    variants: [
      {
        label: 'Default',
        html: '<div class="field"><div class="control"><textarea class="textarea" placeholder="Tell us what happened"></textarea></div></div>',
      },
      {
        label: 'Fixed rows',
        html: '<textarea class="textarea has-fixed-size" rows="3" placeholder="Cannot be resized"></textarea>',
      },
    ],
    docs: {
      usage: 'Set rows to hint the expected length of the answer.',
      classes: [
        { name: 'has-fixed-size', description: 'Disables user resizing.' },
        { name: 'is-small / is-medium / is-large', description: 'Size modifiers.' },
      ],
      dos: ['Give long-form fields a generous min-height so they invite detail.'],
      donts: ['Do not use a textarea for single-line data such as a name.'],
    },
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Form',
    selector: '.select',
    description: 'A styled wrapper around the native select element.',
    controls: [
      col('arrow', 'Arrow colour', '--bulma-input-arrow', 'var(--bulma-link)'),
    ],
    variants: [
      {
        label: 'Default',
        html: `<div class="select"><select><option>Every day</option><option>Weekly</option><option>Never</option></select></div>`,
      },
      {
        label: 'Variants',
        html: `<div class="select is-primary"><select><option>Primary</option></select></div>
<div class="select is-rounded"><select><option>Rounded</option></select></div>
<div class="select is-multiple"><select multiple size="3"><option>One</option><option>Two</option><option>Three</option></select></div>`,
      },
    ],
    docs: {
      usage: 'The .select div supplies the arrow; the native <select> stays inside it.',
      classes: [
        { name: 'is-multiple', description: 'Multi-select list box.' },
        { name: 'is-loading', description: 'Replaces the arrow with a spinner.' },
        { name: 'is-fullwidth', description: 'Fills the container.' },
      ],
      dos: ['Keep native selects for short lists; they are the most accessible option.'],
      donts: ['Do not use a select for more than about 12 options; use a Combobox.'],
    },
  },
  {
    id: 'checkbox',
    name: 'Checkbox & radio',
    category: 'Form',
    selector: '.checkbox, .radio',
    description:
      'Native controls. Design Forge tints them with accent-color so they follow the brand.',
    controls: [],
    variants: [
      {
        label: 'Checkboxes',
        html: `<label class="checkbox"><input type="checkbox" checked> Email me about product updates</label>
<br><label class="checkbox"><input type="checkbox"> Share anonymous usage data</label>
<br><label class="checkbox" disabled><input type="checkbox" disabled> Unavailable on your plan</label>`,
      },
      {
        label: 'Radios',
        html: `<div class="control">
  <label class="radio"><input type="radio" name="plan" checked> Monthly</label>
  <label class="radio"><input type="radio" name="plan"> Annual</label>
</div>`,
      },
    ],
    docs: {
      usage: 'Put the input inside the label so the whole label is clickable.',
      classes: [
        { name: 'checkbox / radio', description: 'Applied to the wrapping <label>.' },
        { name: 'control', description: 'Groups radios in a row.' },
      ],
      dos: ['Give every radio in a group the same name attribute.'],
      donts: ['Do not use a radio group of one; use a checkbox.'],
    },
  },
  {
    id: 'file',
    name: 'File upload',
    category: 'Form',
    selector: '.file',
    description: 'A styled file picker with an optional selected-filename slot.',
    controls: [
      radiusControl('--bulma-file-radius'),
      col('nameBorderColor', 'Filename border colour', '--bulma-file-name-border-color', 'var(--bulma-border)'),
      len('nameBorderWidth', 'Filename border width', '--bulma-file-name-border-width', '1px', {
        min: 0,
        max: 4,
        step: 1,
        units: ['px'],
      }),
      len('nameMaxWidth', 'Filename max width', '--bulma-file-name-max-width', '16em', {
        max: 40,
        units: ['em', 'rem'],
      }),
      num('hoverShift', 'Hover shift', '--bulma-file-hover-background-l-delta', '-5', {
        min: -25,
        max: 25,
        step: 1,
        suffix: '%',
      }),
    ],
    variants: [
      {
        label: 'With filename',
        html: `<div class="file has-name is-primary">
  <label class="file-label">
    <input class="file-input" type="file">
    <span class="file-cta">
      <span class="file-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg></span>
      <span class="file-label">Choose a file</span>
    </span>
    <span class="file-name">quarterly-report.pdf</span>
  </label>
</div>`,
      },
      {
        label: 'Boxed',
        html: `<div class="file is-boxed is-info">
  <label class="file-label">
    <input class="file-input" type="file">
    <span class="file-cta">
      <span class="file-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg></span>
      <span class="file-label">Drop a file here</span>
    </span>
  </label>
</div>`,
      },
    ],
    docs: {
      usage: 'The real <input type="file"> stays in the DOM but is visually hidden.',
      classes: [
        { name: 'has-name', description: 'Shows the selected filename.' },
        { name: 'is-boxed', description: 'Taller drop-target style.' },
        { name: 'is-fullwidth / is-right / is-centered', description: 'Layout modifiers.' },
      ],
      dos: ['Update .file-name from JavaScript when a file is chosen.'],
      donts: ['Do not remove the native input; it is what makes the control accessible.'],
    },
  },
  {
    id: 'field',
    name: 'Field, label & help',
    category: 'Form',
    selector: '.label, .help',
    description: 'The wrapper, label and helper text that make up one form row.',
    controls: [
      col('labelColor', 'Label colour', '--bulma-label-color', 'var(--bulma-text-strong)'),
      sel('labelWeight', 'Label weight', '--bulma-label-weight', '600', WEIGHTS),
      len('labelSpacing', 'Label spacing', '--bulma-label-spacing', '0.5em', {
        max: 2,
        units: ['em', 'rem'],
      }),
      len('helpSize', 'Help text size', '--bulma-help-size', '0.75rem', {
        min: 0.5,
        max: 1.5,
      }),
    ],
    variants: [
      {
        label: 'Complete field',
        html: `<div class="field">
  <label class="label" for="df-email">Work email</label>
  <div class="control has-icons-left">
    <input class="input" id="df-email" type="email" placeholder="you@company.com">
    <span class="icon is-small is-left"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg></span>
  </div>
  <p class="help">We only use this for account recovery.</p>
</div>`,
      },
      {
        label: 'Error state',
        html: `<div class="field">
  <label class="label" for="df-pw">Password</label>
  <div class="control"><input class="input is-danger" id="df-pw" type="password" value="short"></div>
  <p class="help is-danger">Must be at least 12 characters.</p>
</div>`,
      },
      {
        label: 'Grouped & addons',
        html: `<div class="field has-addons">
  <div class="control is-expanded"><input class="input" type="text" placeholder="Search orders"></div>
  <div class="control"><button class="button is-primary">Search</button></div>
</div>
<div class="field is-grouped">
  <div class="control"><button class="button is-primary">Save</button></div>
  <div class="control"><button class="button is-ghost">Cancel</button></div>
</div>`,
      },
      {
        label: 'Horizontal',
        html: `<div class="field is-horizontal">
  <div class="field-label is-normal"><label class="label">Company</label></div>
  <div class="field-body"><div class="field"><div class="control"><input class="input" type="text" placeholder="Acme Corp"></div></div></div>
</div>`,
      },
    ],
    docs: {
      usage:
        'One .field per question. .control wraps the input itself and provides icon and loading slots.',
      classes: [
        { name: 'field', description: 'One form row, with bottom margin.' },
        { name: 'has-addons', description: 'Joins controls into a single unit.' },
        { name: 'is-grouped', description: 'Spaces controls side by side.' },
        { name: 'is-horizontal', description: 'Puts the label beside the control.' },
        { name: 'is-expanded', description: 'On .control, takes remaining width.' },
        { name: 'help is-danger', description: 'Validation message under a field.' },
      ],
      dos: [
        'Connect label and input with for and id on every field.',
        'Put validation messages in .help so they sit in the same place every time.',
      ],
      donts: ['Do not skip .control; icons and loading states depend on it.'],
    },
  },
];
