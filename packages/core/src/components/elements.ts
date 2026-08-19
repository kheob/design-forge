import type { ComponentDef } from '../types.js';
import {
  ALIGNMENTS,
  BORDER_STYLES,
  SHADOWS,
  col,
  len,
  num,
  radiusControl,
  sel,
  text,
  WEIGHTS,
} from './helpers.js';

export const ELEMENTS: ComponentDef[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'Elements',
    selector: '.button',
    description:
      'The primary action element. Colour modifiers map to the brand and semantic palette.',
    controls: [
      // Buttons share Bulma's control variables with inputs and pagination. Scoping them
      // to .button overrides them for buttons only, because custom properties resolve
      // per element rather than globally.
      len('radius', 'Corner radius', '--bulma-control-radius', 'var(--bulma-radius)', {
        max: 3,
        inheritsFrom: 'radius',
        help: 'Set to the pill value for fully rounded buttons.',
      }),
      len('padV', 'Padding (vertical)', '--bulma-button-padding-vertical', 'calc(0.5em - 1px)', {
        max: 2,
        units: ['em', 'rem', 'px'],
      }),
      len('padH', 'Padding (horizontal)', '--bulma-button-padding-horizontal', '1em', {
        max: 4,
        units: ['em', 'rem', 'px'],
      }),
      len('height', 'Height', '--bulma-control-height', '2.5em', {
        min: 1.5,
        max: 4,
        units: ['em', 'rem', 'px'],
        inheritsFrom: 'density',
      }),
      sel('weight', 'Font weight', '--bulma-button-weight', '600', WEIGHTS),
      len('borderWidth', 'Border width', '--bulma-button-border-width', '1px', {
        min: 0,
        max: 6,
        step: 1,
        units: ['px'],
        inheritsFrom: 'borderWidth',
      }),
      sel('borderStyle', 'Border style', '--bulma-button-border-style', 'solid', BORDER_STYLES),
      len('focusRing', 'Focus ring size', '--bulma-button-focus-box-shadow-size', '0 0 0 0.125em', {
        units: ['em'],
        max: 1,
        help: 'Written as a box-shadow spread.',
      }),
      num('disabledOpacity', 'Disabled opacity', '--bulma-button-disabled-opacity', '0.5', {
        min: 0.1,
        max: 1,
        step: 0.05,
      }),
      num('hoverShift', 'Hover shift', '--bulma-button-hover-background-l-delta', '-5', {
        min: -25,
        max: 25,
        step: 1,
        suffix: '%',
        inheritsFrom: 'hoverDelta',
      }),
      num('activeShift', 'Press shift', '--bulma-button-active-background-l-delta', '-10', {
        min: -30,
        max: 30,
        step: 1,
        suffix: '%',
        inheritsFrom: 'activeDelta',
      }),
    ],
    variants: [
      {
        label: 'Colours',
        html: `<div class="buttons">
  <button class="button">Default</button>
  <button class="button is-primary">Primary</button>
  <button class="button is-link">Secondary</button>
  <button class="button is-info">Info</button>
  <button class="button is-success">Success</button>
  <button class="button is-warning">Warning</button>
  <button class="button is-danger">Danger</button>
</div>`,
      },
      {
        label: 'Styles',
        html: `<div class="buttons">
  <button class="button is-primary">Solid</button>
  <button class="button is-primary is-light">Light</button>
  <button class="button is-primary is-outlined">Outlined</button>
  <button class="button is-primary is-inverted">Inverted</button>
  <button class="button is-ghost">Ghost</button>
  <button class="button is-primary is-rounded">Rounded</button>
</div>`,
      },
      {
        label: 'Sizes',
        html: `<div class="buttons are-normal">
  <button class="button is-primary is-small">Small</button>
  <button class="button is-primary">Normal</button>
  <button class="button is-primary is-medium">Medium</button>
  <button class="button is-primary is-large">Large</button>
</div>`,
      },
      {
        label: 'States',
        html: `<div class="buttons">
  <button class="button is-primary is-loading">Loading</button>
  <button class="button is-primary" disabled>Disabled</button>
  <button class="button is-primary is-focused">Focused</button>
  <button class="button is-primary is-active">Active</button>
  <button class="button is-static">Static</button>
</div>`,
      },
      {
        label: 'With icons',
        html: `<div class="buttons">
  <button class="button is-primary">
    <span class="icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span>
    <span>Add item</span>
  </button>
  <button class="button">
    <span>Continue</span>
    <span class="icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
  </button>
</div>`,
      },
    ],
    docs: {
      usage:
        'Use exactly one is-primary button per view for the main action. Everything else is default, is-light or is-ghost.',
      classes: [
        { name: 'is-primary / is-link / is-info / is-success / is-warning / is-danger', description: 'Colour modifiers.' },
        { name: 'is-light / is-outlined / is-inverted / is-ghost', description: 'Visual weight variants.' },
        { name: 'is-small / is-medium / is-large', description: 'Size modifiers.' },
        { name: 'is-rounded', description: 'Pill shape.' },
        { name: 'is-loading', description: 'Shows a spinner and hides the label.' },
        { name: 'is-fullwidth', description: 'Fills the container width.' },
        { name: 'buttons', description: 'Wrapper that spaces a group of buttons.' },
      ],
      dos: [
        'Wrap groups of buttons in a .buttons container for consistent spacing.',
        'Use a <button> for actions and an <a class="button"> only for navigation.',
        'Pair is-loading with the disabled attribute while a request is in flight.',
      ],
      donts: [
        'Do not put more than one is-primary button in the same decision.',
        'Do not use is-danger for anything other than destructive actions.',
        'Do not set inline colours; use the modifier classes so themes apply.',
      ],
    },
  },
  {
    id: 'box',
    name: 'Box',
    category: 'Elements',
    selector: '.box',
    description: 'A plain white surface with padding and a shadow. The simplest container.',
    controls: [
      radiusControl('--bulma-box-radius', 'var(--bulma-radius-large)', 'radiusLarge'),
      len('padding', 'Padding', '--bulma-box-padding', '1.25rem', { max: 4 }),
      sel('shadow', 'Shadow', '--bulma-box-shadow', 'var(--bulma-shadow)', SHADOWS),
      col('background', 'Background', '--bulma-box-background-color', 'var(--bulma-scheme-main)'),
      col('color', 'Text colour', '--bulma-box-color', 'var(--bulma-text)'),
    ],
    variants: [
      { label: 'Default', html: '<div class="box">A box is a simple surface for grouping content.</div>' },
      {
        label: 'With content',
        html: `<div class="box">
  <p class="title is-5">Monthly report</p>
  <p class="subtitle is-6 has-text-grey">Updated 3 hours ago</p>
  <p>Revenue grew 12% against the prior period, driven mostly by returning customers.</p>
</div>`,
      },
    ],
    docs: {
      usage: 'Reach for a box when you need separation but no header, footer or media slots. Otherwise use a card.',
      classes: [{ name: 'box', description: 'The surface itself. No modifiers.' }],
      dos: ['Use for self-contained blocks such as a form or a summary panel.'],
      donts: ['Do not nest boxes inside boxes; the stacked shadows read as noise.'],
    },
  },
  {
    id: 'notification',
    name: 'Notification',
    category: 'Elements',
    selector: '.notification',
    description: 'A coloured block for feedback that sits inline in the page flow.',
    controls: [
      radiusControl('--bulma-notification-radius'),
      len('padding', 'Padding', '--bulma-notification-padding', '1.25rem 2.5rem 1.25rem 1.5rem', {
        max: 4,
        help: 'Right padding leaves room for the delete button.',
      }),
    ],
    variants: [
      {
        label: 'Colours',
        html: `<div class="notification is-primary"><button class="delete"></button>Your changes have been saved.</div>
<div class="notification is-warning"><button class="delete"></button>Your trial ends in three days.</div>
<div class="notification is-danger"><button class="delete"></button>We could not process that payment.</div>`,
      },
      {
        label: 'Light',
        html: '<div class="notification is-info is-light">Two of your teammates joined this workspace.</div>',
      },
    ],
    docs: {
      usage: 'Inline, dismissible feedback tied to the surrounding content.',
      classes: [
        { name: 'is-primary / is-info / is-success / is-warning / is-danger', description: 'Colour modifiers.' },
        { name: 'is-light', description: 'Tinted background with dark text.' },
        { name: 'delete', description: 'Dismiss button, placed as the first child.' },
      ],
      dos: ['Include a .delete button whenever the notification is dismissible.'],
      donts: ['Do not use for transient feedback; use a Toast instead.'],
    },
  },
  {
    id: 'tag',
    name: 'Tag',
    category: 'Elements',
    selector: '.tag:not(body)',
    description: 'Compact labels for metadata, categories and statuses.',
    controls: [
      radiusControl('--bulma-tag-radius', 'var(--bulma-radius-small)', 'radiusSmall'),
      num('hoverShift', 'Hover shift', '--bulma-tag-hover-background-l-delta', '-5', {
        min: -25,
        max: 25,
        step: 1,
        suffix: '%',
      }),
      len('deleteMargin', 'Delete spacing', '--bulma-tag-delete-margin', '0.25rem', { max: 1 }),
    ],
    variants: [
      {
        label: 'Colours',
        html: `<div class="tags">
  <span class="tag">Default</span>
  <span class="tag is-primary">Primary</span>
  <span class="tag is-link">Secondary</span>
  <span class="tag is-info">Info</span>
  <span class="tag is-success">Live</span>
  <span class="tag is-warning">Pending</span>
  <span class="tag is-danger">Failed</span>
</div>`,
      },
      {
        label: 'Variants',
        html: `<div class="tags">
  <span class="tag is-primary is-light">Light</span>
  <span class="tag is-primary is-rounded">Rounded</span>
  <span class="tag is-medium is-info">Medium</span>
  <span class="tag is-large is-success">Large</span>
  <span class="tag is-danger">Removable <button class="delete is-small"></button></span>
</div>`,
      },
      {
        label: 'Paired',
        html: `<div class="tags has-addons">
  <span class="tag is-dark">version</span>
  <span class="tag is-primary">1.4.0</span>
</div>`,
      },
    ],
    docs: {
      usage: 'Short, scannable labels. Keep them to one or two words.',
      classes: [
        { name: 'tags', description: 'Wrapper that spaces multiple tags.' },
        { name: 'has-addons', description: 'Joins tags into a single pill.' },
        { name: 'is-rounded / is-light / is-medium / is-large', description: 'Shape, weight and size.' },
      ],
      dos: ['Use consistent colours for the same status across the whole app.'],
      donts: ['Do not put sentences in a tag; it will not wrap gracefully.'],
    },
  },
  {
    id: 'title',
    name: 'Title & subtitle',
    category: 'Elements',
    selector: '.title, .subtitle',
    description: 'The heading pair. Sizes come from the global type scale.',
    controls: [
      sel('family', 'Title font', '--bulma-title-family', 'var(--bulma-family-secondary)', [
        { label: 'Heading font', value: 'var(--bulma-family-secondary)' },
        { label: 'Body font', value: 'var(--bulma-family-primary)' },
        { label: 'Code font', value: 'var(--bulma-family-code)' },
      ]),
      sel('weight', 'Title weight', '--bulma-title-weight', '700', WEIGHTS, {
        inheritsFrom: 'headingWeight',
      }),
      num('lineHeight', 'Title line height', '--bulma-title-line-height', '1.125', {
        min: 0.9,
        max: 1.8,
        step: 0.025,
      }),
      col('color', 'Title colour', '--bulma-title-color', 'var(--bulma-text-strong)'),
      sel('subWeight', 'Subtitle weight', '--bulma-subtitle-weight', '400', WEIGHTS),
      col('subColor', 'Subtitle colour', '--bulma-subtitle-color', 'var(--bulma-text)'),
      num('subLineHeight', 'Subtitle line height', '--bulma-subtitle-line-height', '1.25', {
        min: 0.9,
        max: 2,
        step: 0.025,
      }),
    ],
    variants: [
      {
        label: 'Scale',
        html: `<p class="title is-1">Title 1</p>
<p class="title is-3">Title 3</p>
<p class="title is-5">Title 5</p>`,
      },
      {
        label: 'Pairing',
        html: `<p class="title is-2">Ship faster</p>
<p class="subtitle is-4">A design system your team will actually use</p>`,
      },
    ],
    docs: {
      usage: 'Use .title for the heading and .subtitle directly after it for the supporting line.',
      classes: [
        { name: 'is-1 … is-7', description: 'Size steps from the global type scale.' },
        { name: 'is-spaced', description: 'Adds margin when a subtitle follows.' },
      ],
      dos: ['Keep heading levels semantic: use h1–h6 tags and the class for styling only.'],
      donts: ['Do not skip from is-1 to is-6 within one page; the hierarchy stops reading.'],
    },
  },
  {
    id: 'table',
    name: 'Table',
    category: 'Elements',
    selector: '.table',
    description: 'Data tables with striping, hover and bordered variants.',
    controls: [
      len('cellPadding', 'Cell padding', '--bulma-table-cell-padding', '0.5em 0.75em', {
        max: 2,
        units: ['em', 'rem', 'px'],
      }),
      len('borderWidth', 'Cell border width', '--bulma-table-cell-border-width', '0 0 1px', {
        max: 4,
        units: ['px'],
        help: 'Accepts shorthand, e.g. "0 0 1px" for horizontal rules only.',
      }),
      sel('borderStyle', 'Cell border style', '--bulma-table-cell-border-style', 'solid', BORDER_STYLES),
      col('borderColor', 'Cell border colour', '--bulma-table-cell-border-color', 'var(--bulma-border)'),
      sel('align', 'Cell alignment', '--bulma-table-cell-text-align', 'left', ALIGNMENTS),
      col('headColor', 'Header text colour', '--bulma-table-head-cell-color', 'var(--bulma-text-strong)'),
      col('headBg', 'Header background', '--bulma-table-head-background-color', 'transparent'),
      col('hoverBg', 'Row hover background', '--bulma-table-row-hover-background-color', 'var(--bulma-scheme-main-bis)'),
      col('stripeBg', 'Striped row background', '--bulma-table-striped-row-even-background-color', 'var(--bulma-scheme-main-bis)'),
      len('headBorderWidth', 'Header border width', '--bulma-table-head-cell-border-width', '0 0 2px', {
        max: 4,
        units: ['px'],
      }),
    ],
    variants: [
      {
        label: 'Default',
        html: `<table class="table is-fullwidth is-striped is-hoverable">
  <thead><tr><th>Invoice</th><th>Customer</th><th>Status</th><th>Amount</th></tr></thead>
  <tbody>
    <tr><td>INV-1042</td><td>Northwind Ltd</td><td><span class="tag is-success is-light">Paid</span></td><td>$1,240.00</td></tr>
    <tr><td>INV-1041</td><td>Acme Corp</td><td><span class="tag is-warning is-light">Pending</span></td><td>$860.00</td></tr>
    <tr><td>INV-1040</td><td>Globex</td><td><span class="tag is-danger is-light">Overdue</span></td><td>$2,115.50</td></tr>
  </tbody>
</table>`,
      },
      {
        label: 'Bordered & narrow',
        html: `<table class="table is-bordered is-narrow">
  <thead><tr><th>Key</th><th>Value</th></tr></thead>
  <tbody><tr><td>region</td><td>eu-west-1</td></tr><tr><td>replicas</td><td>3</td></tr></tbody>
</table>`,
      },
    ],
    docs: {
      usage: 'Wrap in .table-container when the table can overflow on small screens.',
      classes: [
        { name: 'is-fullwidth', description: 'Stretches to the container.' },
        { name: 'is-striped / is-hoverable / is-bordered / is-narrow', description: 'Presentation modifiers.' },
        { name: 'table-container', description: 'Scroll wrapper for wide tables.' },
      ],
      dos: ['Use <th> in <thead> so screen readers announce column headers.'],
      donts: ['Do not use tables for page layout.'],
    },
  },
  {
    id: 'progress',
    name: 'Progress bar',
    category: 'Elements',
    selector: '.progress',
    description: 'A linear determinate or indeterminate progress indicator.',
    controls: [
      radiusControl('--bulma-progress-border-radius', 'var(--bulma-radius-rounded)', 'radiusRounded'),
      col('trackColor', 'Track colour', '--bulma-progress-bar-background-color', 'var(--bulma-border-weak)'),
      col('valueColor', 'Value colour', '--bulma-progress-value-background-color', 'var(--bulma-text)'),
      text('indeterminate', 'Indeterminate duration', '--bulma-progress-indeterminate-duration', '1.5s', {
        help: 'Cycle time of the sliding bar when no value is set.',
      }),
    ],
    variants: [
      {
        label: 'Values',
        html: `<progress class="progress is-primary" value="72" max="100">72%</progress>
<progress class="progress is-success is-small" value="100" max="100">100%</progress>
<progress class="progress is-danger is-large" value="18" max="100">18%</progress>`,
      },
      { label: 'Indeterminate', html: '<progress class="progress is-primary" max="100">loading</progress>' },
    ],
    docs: {
      usage: 'Omit the value attribute for an indeterminate bar.',
      classes: [
        { name: 'is-small / is-medium / is-large', description: 'Bar thickness.' },
        { name: 'is-primary etc.', description: 'Colour of the filled portion.' },
      ],
      dos: ['Put the percentage in the element text as a fallback for assistive tech.'],
      donts: ['Do not use a determinate bar when you cannot actually measure progress.'],
    },
  },
  {
    id: 'content',
    name: 'Content (prose)',
    category: 'Elements',
    selector: '.content',
    description:
      'Applies sane typographic defaults to raw HTML. The right wrapper for markdown output.',
    controls: [
      len('blockMargin', 'Paragraph spacing', '--bulma-content-block-margin-bottom', '1em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      sel('headingWeight', 'Heading weight', '--bulma-content-heading-weight', '600', WEIGHTS),
      num('headingLineHeight', 'Heading line height', '--bulma-content-heading-line-height', '1.125', {
        min: 0.9,
        max: 1.8,
        step: 0.025,
      }),
      col('headingColor', 'Heading colour', '--bulma-content-heading-color', 'var(--bulma-text-strong)'),
      len('quotePadding', 'Blockquote padding', '--bulma-content-blockquote-padding', '1.25em 1.5em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      col('quoteBg', 'Blockquote background', '--bulma-content-blockquote-background-color', 'var(--bulma-background)'),
      text('quoteBorder', 'Blockquote border', '--bulma-content-blockquote-border-left', '5px solid var(--bulma-border)'),
      len('prePadding', 'Code block padding', '--bulma-content-pre-padding', '1.25em 1.5em', {
        max: 3,
        units: ['em', 'rem'],
      }),
    ],
    variants: [
      {
        label: 'Prose',
        html: `<div class="content">
  <h3>Getting started</h3>
  <p>Wrap any long-form HTML in <code>.content</code> and it will pick up the theme's typography automatically.</p>
  <ul><li>Lists get proper markers</li><li>and comfortable spacing</li></ul>
  <blockquote>Design systems are shared vocabulary, not just shared CSS.</blockquote>
</div>`,
      },
    ],
    docs: {
      usage: 'Wrap CMS or markdown output so headings, lists and quotes inherit the theme.',
      classes: [{ name: 'is-small / is-medium / is-large', description: 'Scales all prose inside.' }],
      dos: ['Use this for any HTML you did not hand-write with utility classes.'],
      donts: ['Do not apply to app UI; it restyles every nested heading and list.'],
    },
  },
  {
    id: 'icon',
    name: 'Icon',
    category: 'Elements',
    selector: '.icon',
    description: 'A fixed-size square container that keeps icons optically aligned with text.',
    controls: [
      len('dimensions', 'Default size', '--bulma-icon-dimensions', '1.5rem', { min: 0.5, max: 4 }),
      len('small', 'Small size', '--bulma-icon-dimensions-small', '1rem', { min: 0.5, max: 3 }),
      len('medium', 'Medium size', '--bulma-icon-dimensions-medium', '2rem', { min: 0.5, max: 4 }),
      len('large', 'Large size', '--bulma-icon-dimensions-large', '3rem', { min: 0.5, max: 6 }),
      len('textSpacing', 'Icon/text gap', '--bulma-icon-text-spacing', '0.25em', { max: 2, units: ['em', 'rem'] }),
    ],
    variants: [
      {
        label: 'Sizes',
        html: `<span class="icon is-small has-text-primary"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></span>
<span class="icon has-text-primary"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></span>
<span class="icon is-medium has-text-primary"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></span>`,
      },
      {
        label: 'With text',
        html: `<span class="icon-text has-text-success">
  <span class="icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></span>
  <span>All checks passed</span>
</span>`,
      },
    ],
    docs: {
      usage: 'Wrap the SVG in .icon so it occupies a predictable box regardless of the glyph.',
      classes: [
        { name: 'icon-text', description: 'Aligns an icon and a label on one baseline.' },
        { name: 'is-small / is-medium / is-large', description: 'Size modifiers.' },
      ],
      dos: ['Use stroke="currentColor" so icons inherit the text colour.'],
      donts: ['Do not set width/height on .icon directly; change the token instead.'],
    },
  },
  {
    id: 'delete',
    name: 'Delete button',
    category: 'Elements',
    selector: '.delete',
    description: 'The circular dismiss control used by tags, notifications and modals.',
    controls: [
      len('dimensions', 'Size', '--bulma-delete-dimensions', '1.25rem', { min: 0.75, max: 3 }),
      col('color', 'Cross colour', '--bulma-delete-color', 'var(--bulma-white)'),
      num('backgroundAlpha', 'Background opacity', '--bulma-delete-background-alpha', '0.5', {
        min: 0,
        max: 1,
        step: 0.05,
      }),
    ],
    variants: [
      {
        label: 'Sizes',
        html: '<button class="delete is-small"></button> <button class="delete"></button> <button class="delete is-medium"></button> <button class="delete is-large"></button>',
      },
    ],
    docs: {
      usage: 'Always a <button> so it is keyboard reachable.',
      classes: [{ name: 'is-small / is-medium / is-large', description: 'Size modifiers.' }],
      dos: ['Add aria-label="Close" — the button has no text content.'],
      donts: ['Do not use for destructive actions; it reads as "dismiss".'],
    },
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    category: 'Elements',
    selector: '.skeleton-block, .skeleton-lines',
    description: 'Loading placeholders that hold layout while content is fetched.',
    controls: [
      radiusControl('--bulma-skeleton-radius', 'var(--bulma-radius-small)', 'radiusSmall'),
      col('background', 'Placeholder colour', '--bulma-skeleton-background', 'var(--bulma-border)'),
      len('lineHeight', 'Line height', '--bulma-skeleton-line-height', '0.75em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      len('linesGap', 'Gap between lines', '--bulma-skeleton-lines-gap', '0.5em', {
        max: 2,
        units: ['em', 'rem'],
      }),
      len('blockMinHeight', 'Block min height', '--bulma-skeleton-block-min-height', '4.5em', {
        max: 12,
        units: ['em', 'rem'],
      }),
    ],
    variants: [
      { label: 'Block', html: '<div class="skeleton-block"></div>' },
      {
        label: 'Lines',
        html: '<div class="skeleton-lines"><div></div><div></div><div></div><div></div></div>',
      },
    ],
    docs: {
      usage: 'Mirror the shape of the real content so the layout does not jump when it loads.',
      classes: [
        { name: 'skeleton-block', description: 'A single filled rectangle.' },
        { name: 'skeleton-lines', description: 'Wrapper; each child div becomes one line.' },
        { name: 'is-skeleton', description: 'Applies the effect to many stock components directly.' },
      ],
      dos: ['Add aria-busy="true" to the region being loaded.'],
      donts: ['Do not show a skeleton for under ~300ms; the flash is worse than nothing.'],
    },
  },
  {
    id: 'block',
    name: 'Block',
    category: 'Elements',
    selector: '.block',
    description: 'Applies the standard bottom margin to any element except the last child.',
    controls: [
      len('spacing', 'Spacing', '--bulma-block-spacing', '1.5rem', {
        max: 5,
        inheritsFrom: 'density',
        help: 'This is the rhythm value shared by most stock components.',
      }),
    ],
    variants: [
      {
        label: 'Stacked',
        html: `<div class="block">First block, spaced from the next.</div>
<div class="block">Second block.</div>
<div class="block">Last block has no trailing margin.</div>`,
      },
    ],
    docs: {
      usage: 'The default vertical rhythm unit. Most components already apply it themselves.',
      classes: [{ name: 'block', description: 'Bottom margin except on :last-child.' }],
      dos: ['Prefer .block over ad-hoc margin utilities to keep spacing consistent.'],
      donts: ['Do not add it to the last element in a container; it is already handled.'],
    },
  },
  {
    id: 'image',
    name: 'Image',
    category: 'Elements',
    selector: '.image',
    description: 'A responsive container that reserves fixed or ratio-based dimensions.',
    controls: [],
    variants: [
      {
        label: 'Fixed squares',
        html: `<figure class="image is-64x64"><img src="https://placehold.co/128x128/e2e8f0/64748b?text=64" alt=""></figure>
<figure class="image is-96x96"><img src="https://placehold.co/192x192/e2e8f0/64748b?text=96" alt=""></figure>`,
      },
      {
        label: 'Ratios',
        html: '<figure class="image is-16by9"><img src="https://placehold.co/640x360/e2e8f0/64748b?text=16%3A9" alt=""></figure>',
      },
      {
        label: 'Rounded',
        html: '<figure class="image is-64x64"><img class="is-rounded" src="https://placehold.co/128x128/e2e8f0/64748b?text=%20" alt=""></figure>',
      },
    ],
    docs: {
      usage: 'Reserves space before the image loads, which prevents layout shift.',
      classes: [
        { name: 'is-16x16 … is-128x128', description: 'Fixed square sizes.' },
        { name: 'is-16by9 / is-4by3 / is-1by1 etc.', description: 'Aspect-ratio containers.' },
        { name: 'is-rounded', description: 'Circular crop, applied to the <img>.' },
      ],
      dos: ['Always set a meaningful alt attribute, or alt="" if purely decorative.'],
      donts: ['Do not omit the wrapper; without it images cause layout shift.'],
    },
  },
  {
    id: 'loader',
    name: 'Loader',
    category: 'Elements',
    selector: '.loader',
    description: 'The spinning indicator shared by is-loading states.',
    controls: [],
    variants: [
      {
        label: 'Spinner',
        html: '<span class="loader" style="width:2rem;height:2rem"></span>',
      },
      {
        label: 'On a button',
        html: '<button class="button is-primary is-loading">Saving</button>',
      },
    ],
    docs: {
      usage: 'Usually applied through is-loading on a button or control rather than directly.',
      classes: [{ name: 'loader', description: 'Standalone spinner element.' }],
      dos: ['Pair with aria-live so screen readers announce the wait.'],
      donts: ['Do not use for waits under ~300ms.'],
    },
  },
];
