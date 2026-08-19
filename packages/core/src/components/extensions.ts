/**
 * Registry for the components Bulma does not ship. Every cssVar here is defined by
 * extensions/css.ts, so the two files must be kept in step.
 */

import type { ComponentDef } from '../types.js';
import { SHADOWS, col, len, radiusControl, sel, text, WEIGHTS } from './helpers.js';

const STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 17.3-6.2 3.6 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7z"/></svg>';

export const EXTENSIONS: ComponentDef[] = [
  {
    id: 'toggle',
    name: 'Toggle',
    category: 'Extensions',
    selector: '.toggle',
    extension: true,
    description: 'A switch for settings that apply immediately, with no save step.',
    controls: [
      col('color', 'On colour', '--bulma-toggle-color', 'var(--bulma-primary)'),
      len('width', 'Track width', '--bulma-toggle-width', '2.75em', { min: 1.5, max: 6, units: ['em', 'rem'] }),
      len('height', 'Track height', '--bulma-toggle-height', '1.5em', { min: 0.75, max: 3, units: ['em', 'rem'] }),
      len('gap', 'Thumb inset', '--bulma-toggle-gap', '0.125em', { max: 0.5, step: 0.0125, units: ['em'] }),
      col('trackColor', 'Off colour', '--bulma-toggle-track-color', 'var(--bulma-border)'),
      col('thumbColor', 'Thumb colour', '--bulma-toggle-thumb-color', 'var(--bulma-scheme-main)'),
      len('labelSpacing', 'Label gap', '--bulma-toggle-label-spacing', '0.625em', { max: 2, units: ['em', 'rem'] }),
    ],
    variants: [
      {
        label: 'States',
        html: `<label class="toggle"><input type="checkbox" checked><span class="toggle-track"></span><span>Email notifications</span></label>
<br><label class="toggle"><input type="checkbox"><span class="toggle-track"></span><span>Weekly digest</span></label>
<br><label class="toggle"><input type="checkbox" disabled><span class="toggle-track"></span><span>Unavailable on your plan</span></label>`,
      },
      {
        label: 'Colours & sizes',
        html: `<label class="toggle is-success"><input type="checkbox" checked><span class="toggle-track"></span><span>Success</span></label>
<br><label class="toggle is-danger is-small"><input type="checkbox" checked><span class="toggle-track"></span><span>Small danger</span></label>
<br><label class="toggle is-link is-medium"><input type="checkbox" checked><span class="toggle-track"></span><span>Medium link</span></label>`,
      },
    ],
    docs: {
      usage:
        'Markup is <label class="toggle"> wrapping a checkbox, a <span class="toggle-track"> and the label text. The checkbox is visually hidden but still focusable.',
      classes: [
        { name: 'toggle-track', description: 'Required span that draws the switch.' },
        { name: 'is-primary / is-link / is-info / is-success / is-warning / is-danger', description: 'On-state colour.' },
        { name: 'is-small / is-medium / is-large', description: 'Size modifiers.' },
      ],
      dos: ['Use a toggle only when the change takes effect immediately.'],
      donts: ['Do not use inside a form that needs a Save button; use a checkbox there.'],
    },
  },
  {
    id: 'segmented',
    name: 'Segmented control',
    category: 'Extensions',
    selector: '.segmented',
    extension: true,
    description: 'A compact single-choice control for two to five mutually exclusive options.',
    controls: [
      radiusControl('--bulma-segmented-radius'),
      col('background', 'Track background', '--bulma-segmented-background', 'var(--bulma-background)'),
      len('padding', 'Track padding', '--bulma-segmented-padding', '0.25em', { max: 1, units: ['em', 'rem'] }),
      col('selectedBg', 'Selected background', '--bulma-segmented-selected-background', 'var(--bulma-scheme-main)'),
      col('selectedColor', 'Selected text', '--bulma-segmented-selected-color', 'var(--bulma-text-strong)'),
      len('itemRadius', 'Item radius', '--bulma-segmented-item-radius', 'calc(var(--bulma-radius) - 0.125em)', { max: 2 }),
    ],
    variants: [
      {
        label: 'Default',
        html: `<div class="segmented" role="tablist">
  <button role="tab" aria-selected="true">Day</button>
  <button role="tab" aria-selected="false">Week</button>
  <button role="tab" aria-selected="false">Month</button>
</div>`,
      },
      {
        label: 'Full width',
        html: `<div class="segmented is-fullwidth" role="tablist">
  <button role="tab" aria-selected="false">List</button>
  <button role="tab" aria-selected="true">Board</button>
  <button role="tab" aria-selected="false">Calendar</button>
</div>`,
      },
    ],
    docs: {
      usage: 'Mark the chosen option with aria-selected="true" (or .is-selected).',
      classes: [
        { name: 'is-fullwidth', description: 'Stretches items to fill the row.' },
        { name: 'is-selected', description: 'Alternative to aria-selected.' },
      ],
      dos: ['Use role="tablist" and role="tab" when it switches views.'],
      donts: ['Do not use for more than about five options; use a Select.'],
    },
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'Extensions',
    selector: '.avatar',
    extension: true,
    description: 'A user image or initials, with an overlapping group variant.',
    controls: [
      len('size', 'Size', '--bulma-avatar-size', '2.5rem', { min: 1, max: 8 }),
      radiusControl('--bulma-avatar-radius', 'var(--bulma-radius-rounded)', 'radiusRounded'),
      col('background', 'Fallback background', '--bulma-avatar-background', 'var(--bulma-primary)'),
      col('color', 'Initials colour', '--bulma-avatar-color', 'var(--bulma-primary-invert)'),
      len('borderWidth', 'Ring width', '--bulma-avatar-border-width', '0', { max: 6, step: 1, units: ['px'] }),
      col('borderColor', 'Ring colour', '--bulma-avatar-border-color', 'var(--bulma-scheme-main)'),
      sel('weight', 'Initials weight', '--bulma-avatar-weight', '600', WEIGHTS),
      len('overlap', 'Group overlap', '--bulma-avatar-group-overlap', '0.75em', { max: 3, units: ['em', 'rem'] }),
    ],
    variants: [
      {
        label: 'Images & initials',
        html: `<span class="avatar"><img src="https://placehold.co/96x96/cbd5e1/475569?text=%20" alt="Ada Lovelace"></span>
<span class="avatar">AL</span>
<span class="avatar is-square is-medium">GH</span>
<span class="avatar is-success is-large">KJ</span>`,
      },
      {
        label: 'Group',
        html: `<span class="avatar-group">
  <span class="avatar">AL</span>
  <span class="avatar is-info">GH</span>
  <span class="avatar is-warning">KJ</span>
  <span class="avatar is-link">+4</span>
</span>`,
      },
    ],
    docs: {
      usage: 'Put an <img> inside for a photo, or two initials as text for the fallback.',
      classes: [
        { name: 'is-small / is-medium / is-large', description: 'Size modifiers.' },
        { name: 'is-square', description: 'Rounded rectangle instead of a circle.' },
        { name: 'avatar-group', description: 'Overlaps a row of avatars.' },
      ],
      dos: ['Put the person\'s name in the img alt attribute.'],
      donts: ['Do not show more than about five avatars in a group; use a +N chip.'],
    },
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'Extensions',
    selector: '.badge',
    extension: true,
    description: 'A small count or dot indicator, optionally anchored to another element.',
    controls: [
      col('background', 'Background', '--bulma-badge-background', 'var(--bulma-danger)'),
      col('color', 'Text colour', '--bulma-badge-color', 'var(--bulma-danger-invert)'),
      len('size', 'Minimum size', '--bulma-badge-size', '1.25em', { min: 0.5, max: 3, units: ['em', 'rem'] }),
      radiusControl('--bulma-badge-radius', 'var(--bulma-radius-rounded)', 'radiusRounded'),
      len('fontSize', 'Font size', '--bulma-badge-font-size', 'var(--bulma-size-7)', { min: 0.4, max: 2 }),
    ],
    variants: [
      {
        label: 'Standalone',
        html: `<span class="badge">3</span> <span class="badge is-primary">12</span> <span class="badge is-success">New</span> <span class="badge is-warning is-dot"></span>`,
      },
      {
        label: 'Anchored',
        html: `<span class="badge-wrapper">
  <button class="button">Inbox</button>
  <span class="badge">9</span>
</span>`,
      },
    ],
    docs: {
      usage: 'Wrap the host element and the badge in .badge-wrapper to pin it to the corner.',
      classes: [
        { name: 'is-dot', description: 'A dot with no number.' },
        { name: 'badge-wrapper', description: 'Positions the badge over its host.' },
        { name: 'is-primary / is-link / is-info / is-success / is-warning', description: 'Colour modifiers.' },
      ],
      dos: ['Cap large counts at "99+" so the badge keeps its shape.'],
      donts: ['Do not put a badge on something with no unread or pending concept.'],
    },
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'Extensions',
    selector: '.tooltip',
    extension: true,
    description: 'A CSS-only hover hint driven by a data-tooltip attribute.',
    controls: [
      col('background', 'Background', '--bulma-tooltip-background', 'var(--bulma-scheme-invert-ter)'),
      col('color', 'Text colour', '--bulma-tooltip-color', 'var(--bulma-scheme-main)'),
      radiusControl('--bulma-tooltip-radius', 'var(--bulma-radius-small)', 'radiusSmall'),
      len('padding', 'Padding', '--bulma-tooltip-padding', '0.4em 0.6em', { max: 2, units: ['em', 'rem'] }),
      len('offset', 'Distance from target', '--bulma-tooltip-offset', '0.5em', { max: 2, units: ['em', 'rem'] }),
      len('fontSize', 'Font size', '--bulma-tooltip-font-size', 'var(--bulma-size-7)', { min: 0.5, max: 1.5 }),
      len('maxWidth', 'Max width', '--bulma-tooltip-max-width', '16rem', { min: 6, max: 40 }),
    ],
    variants: [
      {
        label: 'Positions',
        html: `<span class="tooltip" data-tooltip="Appears above" tabindex="0"><button class="button">Hover me</button></span>
<span class="tooltip is-bottom" data-tooltip="Appears below" tabindex="0"><button class="button">Below</button></span>
<span class="tooltip is-multiline" data-tooltip="Longer explanations wrap onto several lines when you add is-multiline." tabindex="0"><button class="button">Multiline</button></span>`,
      },
    ],
    docs: {
      usage: 'Add .tooltip and data-tooltip="…" to the wrapper. No JavaScript required.',
      classes: [
        { name: 'is-bottom', description: 'Positions below instead of above.' },
        { name: 'is-multiline', description: 'Allows the text to wrap.' },
      ],
      dos: ['Add tabindex="0" so keyboard users can reveal it.'],
      donts: [
        'Do not put essential information in a tooltip; it is invisible on touch devices.',
        'Do not put interactive content inside; it cannot be reached.',
      ],
    },
  },
  {
    id: 'accordion',
    name: 'Accordion',
    category: 'Extensions',
    selector: '.accordion',
    extension: true,
    description: 'Collapsible sections built on native <details>, so it works without JavaScript.',
    controls: [
      radiusControl('--bulma-accordion-radius'),
      col('borderColor', 'Border colour', '--bulma-accordion-border-color', 'var(--bulma-border-weak)'),
      len('headerPadding', 'Header padding', '--bulma-accordion-header-padding', '0.875em 1em', { max: 3, units: ['em', 'rem'] }),
      len('bodyPadding', 'Body padding', '--bulma-accordion-body-padding', '0 1em 1em', { max: 3, units: ['em', 'rem'] }),
      sel('headerWeight', 'Header weight', '--bulma-accordion-header-weight', '600', WEIGHTS),
      col('hoverBackground', 'Header hover', '--bulma-accordion-hover-background', 'var(--bulma-background)'),
    ],
    variants: [
      {
        label: 'FAQ',
        html: `<div class="accordion">
  <details class="accordion-item" open>
    <summary>How do I change the primary colour?</summary>
    <div class="accordion-body">Open the Globals panel and pick a new brand colour. Every ramp, hover state and text colour is regenerated from it.</div>
  </details>
  <details class="accordion-item">
    <summary>Can I override a single component?</summary>
    <div class="accordion-body">Yes. Select the component and change any control; only that component is affected.</div>
  </details>
  <details class="accordion-item">
    <summary>Does this need a build step?</summary>
    <div class="accordion-body">No. The export is plain CSS that layers on top of Bulma.</div>
  </details>
</div>`,
      },
    ],
    docs: {
      usage: 'Each section is a <details class="accordion-item"> with a <summary> and a .accordion-body.',
      classes: [
        { name: 'accordion-item', description: 'The <details> element.' },
        { name: 'accordion-body', description: 'The revealed content.' },
      ],
      dos: ['Add the open attribute to the section that should start expanded.'],
      donts: ['Do not hide content users always need behind an accordion.'],
    },
  },
  {
    id: 'stepper',
    name: 'Stepper',
    category: 'Extensions',
    selector: '.stepper',
    extension: true,
    description: 'Progress through a sequence of steps, horizontal or vertical.',
    controls: [
      col('color', 'Active colour', '--bulma-stepper-color', 'var(--bulma-primary)'),
      len('markerSize', 'Marker size', '--bulma-stepper-marker-size', '2rem', { min: 1, max: 4 }),
      col('trackColor', 'Track colour', '--bulma-stepper-track-color', 'var(--bulma-border)'),
      len('trackWidth', 'Track width', '--bulma-stepper-track-width', '2px', { max: 8, step: 1, units: ['px'] }),
      col('inactiveColor', 'Inactive text', '--bulma-stepper-inactive-color', 'var(--bulma-text-weak)'),
    ],
    variants: [
      {
        label: 'Horizontal',
        html: `<ol class="stepper">
  <li class="stepper-item is-complete"><span class="stepper-marker">1</span><span class="stepper-label">Account</span></li>
  <li class="stepper-item is-complete"><span class="stepper-marker">2</span><span class="stepper-label">Billing</span></li>
  <li class="stepper-item is-active"><span class="stepper-marker">3</span><span class="stepper-label">Review</span></li>
  <li class="stepper-item"><span class="stepper-marker">4</span><span class="stepper-label">Done</span></li>
</ol>`,
      },
      {
        label: 'Vertical',
        html: `<ol class="stepper is-vertical">
  <li class="stepper-item is-complete"><span class="stepper-marker">1</span><span class="stepper-label">Order placed</span></li>
  <li class="stepper-item is-active"><span class="stepper-marker">2</span><span class="stepper-label">In transit</span></li>
  <li class="stepper-item"><span class="stepper-marker">3</span><span class="stepper-label">Delivered</span></li>
</ol>`,
      },
    ],
    docs: {
      usage: 'Mark finished steps .is-complete and the current one .is-active.',
      classes: [
        { name: 'is-complete / is-active', description: 'Step state on .stepper-item.' },
        { name: 'is-vertical', description: 'Stacks the steps.' },
      ],
      dos: ['Use an <ol> so the order is conveyed to assistive technology.'],
      donts: ['Do not use for navigation between unrelated views; use Tabs.'],
    },
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'Extensions',
    selector: '.toast',
    extension: true,
    description: 'Transient confirmation that appears in a corner and disappears on its own.',
    controls: [
      col('background', 'Background', '--bulma-toast-background', 'var(--bulma-scheme-main)'),
      radiusControl('--bulma-toast-radius'),
      sel('shadow', 'Shadow', '--bulma-toast-shadow', 'var(--bulma-shadow)', SHADOWS),
      col('accent', 'Accent colour', '--bulma-toast-accent', 'var(--bulma-primary)'),
      len('accentWidth', 'Accent width', '--bulma-toast-accent-width', '3px', { max: 12, step: 1, units: ['px'] }),
      len('padding', 'Padding', '--bulma-toast-padding', '0.875em 1em', { max: 3, units: ['em', 'rem'] }),
      len('minWidth', 'Minimum width', '--bulma-toast-min-width', '18rem', { min: 8, max: 40 }),
      len('gap', 'Stack gap', '--bulma-toast-gap', '0.75rem', { max: 3 }),
    ],
    variants: [
      {
        label: 'Stack',
        html: `<div class="toast-container" style="position:static;inset:auto">
  <div class="toast is-success">
    <div class="toast-content"><div class="toast-title">Changes saved</div><div class="toast-message">Your theme was exported.</div></div>
    <button class="delete" aria-label="close"></button>
  </div>
  <div class="toast is-danger">
    <div class="toast-content"><div class="toast-title">Upload failed</div><div class="toast-message">The file exceeds the 10 MB limit.</div></div>
    <button class="delete" aria-label="close"></button>
  </div>
</div>`,
      },
    ],
    docs: {
      usage:
        'Put .toast elements inside a fixed .toast-container. Remove them from the DOM after a timeout.',
      classes: [
        { name: 'toast-container', description: 'Fixed positioning wrapper.' },
        { name: 'is-top / is-left / is-centered', description: 'Container placement.' },
        { name: 'is-info / is-success / is-warning / is-danger', description: 'Accent colour.' },
      ],
      dos: [
        'Give the container aria-live="polite" so changes are announced.',
        'Keep toasts on screen for at least four seconds.',
      ],
      donts: ['Do not put actions users must take in a toast; it will vanish.'],
    },
  },
  {
    id: 'drawer',
    name: 'Drawer',
    category: 'Extensions',
    selector: '.drawer',
    extension: true,
    description: 'An off-canvas panel for filters, details or secondary navigation.',
    controls: [
      len('width', 'Panel width', '--bulma-drawer-width', '22rem', { min: 10, max: 50 }),
      col('background', 'Panel background', '--bulma-drawer-background', 'var(--bulma-scheme-main)'),
      col('overlay', 'Overlay colour', '--bulma-drawer-overlay', 'hsla(var(--bulma-scheme-h), var(--bulma-scheme-s), var(--bulma-scheme-invert-l), 0.6)'),
      len('padding', 'Padding', '--bulma-drawer-padding', '1.5rem', { max: 4 }),
      sel('shadow', 'Shadow', '--bulma-drawer-shadow', 'var(--bulma-shadow)', SHADOWS),
    ],
    variants: [
      {
        label: 'Open drawer',
        html: `<div class="drawer is-active" style="position:relative;height:22rem">
  <div class="drawer-overlay"></div>
  <div class="drawer-panel" style="position:absolute">
    <div class="drawer-head"><span class="drawer-title">Filters</span><button class="delete" aria-label="close"></button></div>
    <div class="drawer-body">
      <div class="field"><label class="label">Status</label><div class="select is-fullwidth"><select><option>Any</option><option>Active</option></select></div></div>
      <label class="toggle"><input type="checkbox" checked><span class="toggle-track"></span><span>Only my items</span></label>
    </div>
    <div class="drawer-foot"><div class="buttons"><button class="button is-primary">Apply</button><button class="button">Reset</button></div></div>
  </div>
</div>`,
      },
    ],
    docs: {
      usage: 'Toggle .is-active on the .drawer root to show it.',
      classes: [
        { name: 'is-active', description: 'Shows the drawer.' },
        { name: 'is-left', description: 'Slides in from the left instead of the right.' },
        { name: 'drawer-head / -body / -foot', description: 'The three regions.' },
      ],
      dos: ['Trap focus inside while open and close on Escape, as with a modal.'],
      donts: ['Do not use a drawer for the primary navigation on desktop.'],
    },
  },
  {
    id: 'rating',
    name: 'Rating',
    category: 'Extensions',
    selector: '.rating',
    extension: true,
    description: 'A read-only star rating display.',
    controls: [
      col('color', 'Filled colour', '--bulma-rating-color', 'var(--bulma-warning)'),
      col('emptyColor', 'Empty colour', '--bulma-rating-empty-color', 'var(--bulma-border)'),
      len('size', 'Star size', '--bulma-rating-size', '1.25rem', { min: 0.5, max: 4 }),
      len('gap', 'Gap', '--bulma-rating-gap', '0.125em', { max: 1, units: ['em', 'rem'] }),
    ],
    variants: [
      {
        label: 'Four of five',
        html: `<span class="rating" role="img" aria-label="Rated 4 out of 5">
  <span class="rating-star is-filled">${STAR}</span>
  <span class="rating-star is-filled">${STAR}</span>
  <span class="rating-star is-filled">${STAR}</span>
  <span class="rating-star is-filled">${STAR}</span>
  <span class="rating-star">${STAR}</span>
</span>`,
      },
    ],
    docs: {
      usage: 'Add .is-filled to each earned star.',
      classes: [
        { name: 'rating-star', description: 'One star; wraps an inline SVG.' },
        { name: 'is-filled', description: 'Marks a filled star.' },
      ],
      dos: ['Add role="img" and an aria-label stating the score in words.'],
      donts: ['Do not use for input; build a radio group for that.'],
    },
  },
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'Extensions',
    selector: '.timeline',
    extension: true,
    description: 'A vertical sequence of dated events.',
    controls: [
      col('color', 'Marker colour', '--bulma-timeline-color', 'var(--bulma-primary)'),
      col('trackColor', 'Track colour', '--bulma-timeline-track-color', 'var(--bulma-border)'),
      len('markerSize', 'Marker size', '--bulma-timeline-marker-size', '0.75rem', { min: 0.25, max: 2.5 }),
      len('gutter', 'Text indent', '--bulma-timeline-gutter', '1.25rem', { max: 4 }),
      len('gap', 'Gap between items', '--bulma-timeline-gap', '1.5rem', { max: 5 }),
    ],
    variants: [
      {
        label: 'Activity',
        html: `<ol class="timeline">
  <li class="timeline-item">
    <span class="timeline-marker"></span>
    <div class="timeline-title">Deployment succeeded</div>
    <div class="timeline-meta">Today at 14:02</div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-outlined"></span>
    <div class="timeline-title">Pull request merged</div>
    <div class="timeline-meta">Today at 13:40</div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-outlined"></span>
    <div class="timeline-title">Review requested</div>
    <div class="timeline-meta">Yesterday at 17:15</div>
  </li>
</ol>`,
      },
    ],
    docs: {
      usage: 'An <ol> of .timeline-item, each with a marker, a title and optional meta line.',
      classes: [
        { name: 'timeline-marker', description: 'The dot; add .is-outlined for past events.' },
        { name: 'timeline-title / timeline-meta', description: 'Event label and timestamp.' },
      ],
      dos: ['Order newest first and use <time datetime> for real timestamps.'],
      donts: ['Do not use for steps a user must complete; use a Stepper.'],
    },
  },
  {
    id: 'stat',
    name: 'Stat tile',
    category: 'Extensions',
    selector: '.stat',
    extension: true,
    description: 'A single headline metric with a label and optional trend.',
    controls: [
      radiusControl('--bulma-stat-radius', 'var(--bulma-radius-large)', 'radiusLarge'),
      len('padding', 'Padding', '--bulma-stat-padding', '1.25rem', { max: 4 }),
      col('background', 'Background', '--bulma-stat-background', 'var(--bulma-scheme-main)'),
      col('borderColor', 'Border colour', '--bulma-stat-border-color', 'var(--bulma-border-weak)'),
      len('valueSize', 'Value size', '--bulma-stat-value-size', 'var(--bulma-size-3)', { min: 0.75, max: 5 }),
      len('labelSize', 'Label size', '--bulma-stat-label-size', 'var(--bulma-size-7)', { min: 0.5, max: 2 }),
    ],
    variants: [
      {
        label: 'KPI row',
        html: `<div class="grid">
  <div class="cell"><div class="stat"><span class="stat-label">Revenue</span><span class="stat-value">$48.2k</span><span class="stat-trend is-up">+12.4% vs last month</span></div></div>
  <div class="cell"><div class="stat"><span class="stat-label">Active users</span><span class="stat-value">1,284</span><span class="stat-trend is-up">+3.1%</span></div></div>
  <div class="cell"><div class="stat"><span class="stat-label">Churn</span><span class="stat-value">2.4%</span><span class="stat-trend is-down">-0.6%</span></div></div>
</div>`,
      },
    ],
    docs: {
      usage: 'Label above, value below. Put the comparison period in the trend line.',
      classes: [
        { name: 'stat-label / stat-value / stat-trend', description: 'The three parts.' },
        { name: 'is-up / is-down', description: 'Trend direction colour.' },
      ],
      dos: ['Always state what the trend is compared against.'],
      donts: ['Do not colour a trend green just because it went up; falling churn is good.'],
    },
  },
  {
    id: 'empty-state',
    name: 'Empty state',
    category: 'Extensions',
    selector: '.empty-state',
    extension: true,
    description: 'What a list shows before it has any content, or when a filter matches nothing.',
    controls: [
      len('padding', 'Padding', '--bulma-empty-state-padding', '3rem 1.5rem', { max: 8 }),
      len('iconSize', 'Icon size', '--bulma-empty-state-icon-size', '3rem', { min: 1, max: 8 }),
      col('iconColor', 'Icon colour', '--bulma-empty-state-icon-color', 'var(--bulma-text-weak)'),
      len('maxWidth', 'Text max width', '--bulma-empty-state-max-width', '26rem', { min: 10, max: 50 }),
    ],
    variants: [
      {
        label: 'No results',
        html: `<div class="empty-state">
  <span class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span>
  <p class="empty-state-title">No invoices match those filters</p>
  <p class="empty-state-description">Try widening the date range, or clear the status filter to see everything.</p>
  <button class="button is-primary">Clear filters</button>
</div>`,
      },
    ],
    docs: {
      usage: 'Say what is missing, why, and give one action that fixes it.',
      classes: [
        { name: 'empty-state-icon / -title / -description', description: 'The parts.' },
      ],
      dos: ['Always offer an action; an empty state without one is a dead end.'],
      donts: ['Do not use a sad illustration for an error the user caused.'],
    },
  },
  {
    id: 'combobox',
    name: 'Combobox',
    category: 'Extensions',
    selector: '.combobox',
    extension: true,
    description: 'A text input with a filtered list of suggestions beneath it.',
    controls: [
      radiusControl('--bulma-combobox-radius'),
      col('background', 'List background', '--bulma-combobox-background', 'var(--bulma-scheme-main)'),
      sel('shadow', 'List shadow', '--bulma-combobox-shadow', 'var(--bulma-shadow)', SHADOWS),
      len('maxHeight', 'List max height', '--bulma-combobox-max-height', '16rem', { min: 4, max: 40 }),
      len('itemPadding', 'Item padding', '--bulma-combobox-item-padding', '0.5em 0.75em', { max: 2, units: ['em', 'rem'] }),
      col('hoverBackground', 'Item hover', '--bulma-combobox-hover-background', 'var(--bulma-background)'),
      col('selectedBackground', 'Item selected', '--bulma-combobox-selected-background', 'var(--bulma-primary)'),
      col('selectedColor', 'Selected text', '--bulma-combobox-selected-color', 'var(--bulma-primary-invert)'),
    ],
    variants: [
      {
        label: 'Open list',
        html: `<div class="combobox is-active" style="max-width:22rem;margin-bottom:12rem">
  <input class="input" type="text" role="combobox" aria-expanded="true" aria-controls="df-cb" value="ber">
  <ul class="combobox-list" id="df-cb" role="listbox">
    <li class="combobox-item" role="option" aria-selected="true">Berlin, Germany</li>
    <li class="combobox-item" role="option" aria-selected="false">Bern, Switzerland</li>
    <li class="combobox-item" role="option" aria-selected="false">Canberra, Australia</li>
  </ul>
</div>`,
      },
    ],
    docs: {
      usage: 'Toggle .is-active on the wrapper when there are suggestions to show.',
      classes: [
        { name: 'combobox-list / combobox-item', description: 'The suggestion list.' },
        { name: 'combobox-empty', description: 'Shown when nothing matches.' },
        { name: 'is-active', description: 'Reveals the list.' },
      ],
      dos: [
        'Use role="combobox" with aria-expanded, and role="listbox"/"option" on the list.',
        'Support Up/Down to move the highlight and Enter to choose.',
      ],
      donts: ['Do not use for short fixed lists; a native Select is more accessible.'],
    },
  },
  {
    id: 'progress-ring',
    name: 'Progress ring',
    category: 'Extensions',
    selector: '.progress-ring',
    extension: true,
    description: 'A circular progress indicator for dashboards and quota displays.',
    controls: [
      len('size', 'Diameter', '--bulma-progress-ring-size', '5rem', { min: 2, max: 14 }),
      len('thickness', 'Ring thickness', '--bulma-progress-ring-thickness', '0.5rem', { min: 0.0625, max: 2 }),
      col('color', 'Value colour', '--bulma-progress-ring-color', 'var(--bulma-primary)'),
      col('trackColor', 'Track colour', '--bulma-progress-ring-track-color', 'var(--bulma-border-weak)'),
    ],
    variants: [
      {
        label: 'Values',
        html: `<span class="progress-ring" style="--bulma-progress-ring-value:72" role="img" aria-label="72 percent"><span class="progress-ring-label">72%</span></span>
<span class="progress-ring is-success" style="--bulma-progress-ring-value:100" role="img" aria-label="100 percent"><span class="progress-ring-label">100%</span></span>
<span class="progress-ring is-danger" style="--bulma-progress-ring-value:18" role="img" aria-label="18 percent"><span class="progress-ring-label">18%</span></span>`,
      },
    ],
    docs: {
      usage:
        'Set the percentage with the inline custom property --bulma-progress-ring-value (a number from 0 to 100).',
      classes: [
        { name: 'progress-ring-label', description: 'Centred text inside the ring.' },
        { name: 'is-primary / is-link / is-info / is-success / is-warning / is-danger', description: 'Value colour.' },
      ],
      dos: ['Add role="img" and an aria-label spelling out the percentage.'],
      donts: ['Do not use a ring for indeterminate waits; use a Loader.'],
    },
  },
];
