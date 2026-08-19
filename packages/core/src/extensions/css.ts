/**
 * extensions.css — the components Bulma does not ship.
 *
 * Rules of this file:
 *   1. Never hardcode a colour, radius, duration or font. Everything reads a --bulma-*
 *      token, so these components respond to the theme exactly like stock ones and get
 *      dark mode for free (Bulma's scheme variables already flip).
 *   2. Follow Bulma's variable naming (--bulma-<component>-<property>) so the studio's
 *      per-component overrides and the exported docs stay uniform.
 *   3. Follow Bulma's class conventions: is-* for modifiers, block__element naming
 *      avoided in favour of Bulma's flat, hyphenated class names.
 *
 * Exported as a string so the same source works in the browser (studio preview) and in
 * Node (the CLI exporter) without bundler-specific raw imports.
 */

export const EXTENSIONS_CSS = String.raw`
/* ==========================================================================
   Design Forge extensions for Bulma
   Components Bulma does not provide, built on Bulma's own design tokens.
   Load after bulma.css and before theme.css.
   ========================================================================== */

/* Native controls follow the brand without any extra markup. */
input[type="checkbox"],
input[type="radio"],
input[type="range"],
progress {
  accent-color: var(--bulma-primary);
}

/* --------------------------------------------------------------------------
   Toggle / switch
   -------------------------------------------------------------------------- */
.toggle {
  --bulma-toggle-color: var(--bulma-primary);
  --bulma-toggle-width: 2.75em;
  --bulma-toggle-height: 1.5em;
  --bulma-toggle-gap: 0.125em;
  --bulma-toggle-track-color: var(--bulma-border);
  --bulma-toggle-thumb-color: var(--bulma-scheme-main);
  --bulma-toggle-label-spacing: 0.625em;
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: var(--bulma-toggle-label-spacing);
  line-height: 1.5;
}
.toggle.is-link { --bulma-toggle-color: var(--bulma-link); }
.toggle.is-info { --bulma-toggle-color: var(--bulma-info); }
.toggle.is-success { --bulma-toggle-color: var(--bulma-success); }
.toggle.is-warning { --bulma-toggle-color: var(--bulma-warning); }
.toggle.is-danger { --bulma-toggle-color: var(--bulma-danger); }
.toggle.is-small { font-size: var(--bulma-size-7); }
.toggle.is-medium { font-size: var(--bulma-size-5); }
.toggle.is-large { font-size: var(--bulma-size-4); }
.toggle input {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
.toggle-track {
  background-color: var(--bulma-toggle-track-color);
  border-radius: var(--bulma-radius-rounded);
  display: inline-block;
  flex: none;
  height: var(--bulma-toggle-height);
  position: relative;
  transition-duration: var(--bulma-duration);
  transition-property: background-color;
  transition-timing-function: var(--bulma-easing);
  width: var(--bulma-toggle-width);
}
.toggle-track::after {
  background-color: var(--bulma-toggle-thumb-color);
  border-radius: var(--bulma-radius-rounded);
  box-shadow: 0 1px 2px hsla(var(--bulma-shadow-h), var(--bulma-shadow-s), var(--bulma-shadow-l), 0.25);
  content: "";
  inset-block-start: var(--bulma-toggle-gap);
  inset-inline-start: var(--bulma-toggle-gap);
  position: absolute;
  height: calc(var(--bulma-toggle-height) - var(--bulma-toggle-gap) * 2);
  width: calc(var(--bulma-toggle-height) - var(--bulma-toggle-gap) * 2);
  transition-duration: var(--bulma-speed);
  transition-property: translate;
  transition-timing-function: var(--bulma-easing);
}
.toggle input:checked + .toggle-track { background-color: var(--bulma-toggle-color); }
.toggle input:checked + .toggle-track::after {
  translate: calc(var(--bulma-toggle-width) - var(--bulma-toggle-height)) 0;
}
.toggle input:focus-visible + .toggle-track {
  outline: var(--bulma-focus-width) var(--bulma-focus-style) var(--bulma-toggle-color);
  outline-offset: var(--bulma-focus-offset);
}
.toggle input:disabled + .toggle-track { opacity: 0.5; }
.toggle:has(input:disabled) { cursor: not-allowed; }

/* --------------------------------------------------------------------------
   Segmented control
   -------------------------------------------------------------------------- */
.segmented {
  --bulma-segmented-background: var(--bulma-background);
  --bulma-segmented-padding: 0.25em;
  --bulma-segmented-radius: var(--bulma-radius);
  --bulma-segmented-item-radius: calc(var(--bulma-radius) - 0.125em);
  --bulma-segmented-selected-background: var(--bulma-scheme-main);
  --bulma-segmented-selected-color: var(--bulma-text-strong);
  background-color: var(--bulma-segmented-background);
  border-radius: var(--bulma-segmented-radius);
  display: inline-flex;
  gap: 0.125em;
  padding: var(--bulma-segmented-padding);
}
.segmented.is-fullwidth { display: flex; width: 100%; }
.segmented.is-fullwidth > * { flex: 1 1 0; }
.segmented > button,
.segmented > a {
  background: transparent;
  border: none;
  border-radius: var(--bulma-segmented-item-radius);
  color: var(--bulma-text-weak);
  cursor: pointer;
  font-family: inherit;
  font-size: 1em;
  font-weight: var(--bulma-weight-medium);
  padding: 0.375em 0.875em;
  text-align: center;
  text-decoration: none;
  transition-duration: var(--bulma-speed);
  transition-property: background-color, color;
  transition-timing-function: var(--bulma-easing);
  white-space: nowrap;
}
.segmented > button:hover,
.segmented > a:hover { color: var(--bulma-text-strong); }
.segmented > .is-selected,
.segmented > [aria-selected="true"] {
  background-color: var(--bulma-segmented-selected-background);
  box-shadow: 0 1px 2px hsla(var(--bulma-shadow-h), var(--bulma-shadow-s), var(--bulma-shadow-l), 0.12);
  color: var(--bulma-segmented-selected-color);
}

/* --------------------------------------------------------------------------
   Avatar
   -------------------------------------------------------------------------- */
.avatar {
  --bulma-avatar-size: 2.5rem;
  --bulma-avatar-radius: var(--bulma-radius-rounded);
  --bulma-avatar-background: var(--bulma-primary);
  --bulma-avatar-color: var(--bulma-primary-invert);
  --bulma-avatar-border-width: 0;
  --bulma-avatar-border-color: var(--bulma-scheme-main);
  --bulma-avatar-weight: var(--bulma-weight-semibold);
  align-items: center;
  background-color: var(--bulma-avatar-background);
  border: var(--bulma-avatar-border-width) solid var(--bulma-avatar-border-color);
  border-radius: var(--bulma-avatar-radius);
  color: var(--bulma-avatar-color);
  display: inline-flex;
  flex: none;
  font-size: calc(var(--bulma-avatar-size) * 0.4);
  font-weight: var(--bulma-avatar-weight);
  height: var(--bulma-avatar-size);
  justify-content: center;
  line-height: 1;
  overflow: hidden;
  position: relative;
  user-select: none;
  width: var(--bulma-avatar-size);
}
.avatar img { height: 100%; object-fit: cover; width: 100%; }
.avatar.is-small { --bulma-avatar-size: 1.75rem; }
.avatar.is-medium { --bulma-avatar-size: 3.5rem; }
.avatar.is-large { --bulma-avatar-size: 5rem; }
.avatar.is-square { --bulma-avatar-radius: var(--bulma-radius); }
.avatar.is-link { --bulma-avatar-background: var(--bulma-link); --bulma-avatar-color: var(--bulma-link-invert); }
.avatar.is-info { --bulma-avatar-background: var(--bulma-info); --bulma-avatar-color: var(--bulma-info-invert); }
.avatar.is-success { --bulma-avatar-background: var(--bulma-success); --bulma-avatar-color: var(--bulma-success-invert); }
.avatar.is-warning { --bulma-avatar-background: var(--bulma-warning); --bulma-avatar-color: var(--bulma-warning-invert); }
.avatar.is-danger { --bulma-avatar-background: var(--bulma-danger); --bulma-avatar-color: var(--bulma-danger-invert); }
.avatar-group {
  --bulma-avatar-group-overlap: 0.75em;
  display: inline-flex;
}
.avatar-group .avatar { --bulma-avatar-border-width: 2px; }
.avatar-group .avatar + .avatar { margin-inline-start: calc(var(--bulma-avatar-group-overlap) * -1); }

/* --------------------------------------------------------------------------
   Badge (count indicator)
   -------------------------------------------------------------------------- */
.badge {
  --bulma-badge-background: var(--bulma-danger);
  --bulma-badge-color: var(--bulma-danger-invert);
  --bulma-badge-size: 1.25em;
  --bulma-badge-radius: var(--bulma-radius-rounded);
  --bulma-badge-font-size: var(--bulma-size-7);
  align-items: center;
  background-color: var(--bulma-badge-background);
  border-radius: var(--bulma-badge-radius);
  color: var(--bulma-badge-color);
  display: inline-flex;
  font-size: var(--bulma-badge-font-size);
  font-weight: var(--bulma-weight-semibold);
  justify-content: center;
  line-height: 1;
  min-width: var(--bulma-badge-size);
  height: var(--bulma-badge-size);
  padding: 0 0.4em;
}
.badge.is-primary { --bulma-badge-background: var(--bulma-primary); --bulma-badge-color: var(--bulma-primary-invert); }
.badge.is-link { --bulma-badge-background: var(--bulma-link); --bulma-badge-color: var(--bulma-link-invert); }
.badge.is-info { --bulma-badge-background: var(--bulma-info); --bulma-badge-color: var(--bulma-info-invert); }
.badge.is-success { --bulma-badge-background: var(--bulma-success); --bulma-badge-color: var(--bulma-success-invert); }
.badge.is-warning { --bulma-badge-background: var(--bulma-warning); --bulma-badge-color: var(--bulma-warning-invert); }
.badge.is-dot { min-width: 0.625em; height: 0.625em; padding: 0; }
.badge-wrapper { display: inline-flex; position: relative; }
.badge-wrapper > .badge {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  translate: 35% -35%;
}

/* --------------------------------------------------------------------------
   Tooltip
   -------------------------------------------------------------------------- */
.tooltip {
  --bulma-tooltip-background: var(--bulma-scheme-invert-ter);
  --bulma-tooltip-color: var(--bulma-scheme-main);
  --bulma-tooltip-radius: var(--bulma-radius-small);
  --bulma-tooltip-font-size: var(--bulma-size-7);
  --bulma-tooltip-padding: 0.4em 0.6em;
  --bulma-tooltip-offset: 0.5em;
  --bulma-tooltip-max-width: 16rem;
  position: relative;
}
.tooltip::after {
  background-color: var(--bulma-tooltip-background);
  border-radius: var(--bulma-tooltip-radius);
  color: var(--bulma-tooltip-color);
  content: attr(data-tooltip);
  font-size: var(--bulma-tooltip-font-size);
  font-weight: var(--bulma-weight-normal);
  inset-block-end: 100%;
  inset-inline-start: 50%;
  line-height: 1.4;
  margin-block-end: var(--bulma-tooltip-offset);
  max-width: var(--bulma-tooltip-max-width);
  opacity: 0;
  padding: var(--bulma-tooltip-padding);
  pointer-events: none;
  position: absolute;
  transition: opacity var(--bulma-speed) var(--bulma-easing);
  translate: -50% 0;
  white-space: pre;
  width: max-content;
  z-index: 40;
}
.tooltip:hover::after,
.tooltip:focus-visible::after { opacity: 1; }
.tooltip.is-bottom::after {
  inset-block-end: auto;
  inset-block-start: 100%;
  margin-block-end: 0;
  margin-block-start: var(--bulma-tooltip-offset);
}
.tooltip.is-multiline::after { white-space: normal; }

/* --------------------------------------------------------------------------
   Accordion
   -------------------------------------------------------------------------- */
.accordion {
  --bulma-accordion-border-color: var(--bulma-border-weak);
  --bulma-accordion-radius: var(--bulma-radius);
  --bulma-accordion-header-padding: 0.875em 1em;
  --bulma-accordion-body-padding: 0 1em 1em;
  --bulma-accordion-header-weight: var(--bulma-weight-semibold);
  --bulma-accordion-hover-background: var(--bulma-background);
  border: 1px solid var(--bulma-accordion-border-color);
  border-radius: var(--bulma-accordion-radius);
  overflow: hidden;
}
.accordion-item + .accordion-item { border-block-start: 1px solid var(--bulma-accordion-border-color); }
.accordion-item > summary {
  align-items: center;
  color: var(--bulma-text-strong);
  cursor: pointer;
  display: flex;
  font-weight: var(--bulma-accordion-header-weight);
  gap: 0.75em;
  justify-content: space-between;
  list-style: none;
  padding: var(--bulma-accordion-header-padding);
  transition: background-color var(--bulma-speed) var(--bulma-easing);
}
.accordion-item > summary::-webkit-details-marker { display: none; }
.accordion-item > summary:hover { background-color: var(--bulma-accordion-hover-background); }
.accordion-item > summary:focus-visible {
  outline: var(--bulma-focus-width) var(--bulma-focus-style) var(--bulma-focus-color, var(--bulma-link));
  outline-offset: calc(var(--bulma-focus-offset) * -1);
}
.accordion-item > summary::after {
  border-inline-end: 2px solid currentColor;
  border-block-end: 2px solid currentColor;
  content: "";
  flex: none;
  height: 0.5em;
  rotate: 45deg;
  transition: rotate var(--bulma-speed) var(--bulma-easing);
  width: 0.5em;
}
.accordion-item[open] > summary::after { rotate: -135deg; }
.accordion-body { color: var(--bulma-text); padding: var(--bulma-accordion-body-padding); }

/* --------------------------------------------------------------------------
   Stepper
   -------------------------------------------------------------------------- */
.stepper {
  --bulma-stepper-color: var(--bulma-primary);
  --bulma-stepper-marker-size: 2rem;
  --bulma-stepper-track-color: var(--bulma-border);
  --bulma-stepper-track-width: 2px;
  --bulma-stepper-inactive-color: var(--bulma-text-weak);
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
.stepper-item {
  flex: 1 1 0;
  position: relative;
  text-align: center;
}
.stepper-item::before {
  background-color: var(--bulma-stepper-track-color);
  content: "";
  height: var(--bulma-stepper-track-width);
  inset-block-start: calc(var(--bulma-stepper-marker-size) / 2);
  inset-inline-start: -50%;
  position: absolute;
  width: 100%;
  z-index: 0;
}
.stepper-item:first-child::before { display: none; }
.stepper-item.is-complete::before,
.stepper-item.is-active::before { background-color: var(--bulma-stepper-color); }
.stepper-marker {
  align-items: center;
  background-color: var(--bulma-scheme-main);
  border: var(--bulma-stepper-track-width) solid var(--bulma-stepper-track-color);
  border-radius: var(--bulma-radius-rounded);
  color: var(--bulma-stepper-inactive-color);
  display: inline-flex;
  font-size: var(--bulma-size-7);
  font-weight: var(--bulma-weight-semibold);
  height: var(--bulma-stepper-marker-size);
  justify-content: center;
  position: relative;
  width: var(--bulma-stepper-marker-size);
  z-index: 1;
}
.stepper-item.is-active .stepper-marker {
  border-color: var(--bulma-stepper-color);
  color: var(--bulma-stepper-color);
}
.stepper-item.is-complete .stepper-marker {
  background-color: var(--bulma-stepper-color);
  border-color: var(--bulma-stepper-color);
  color: var(--bulma-primary-invert);
}
.stepper-label {
  color: var(--bulma-stepper-inactive-color);
  display: block;
  font-size: var(--bulma-size-7);
  margin-block-start: 0.5em;
}
.stepper-item.is-active .stepper-label {
  color: var(--bulma-text-strong);
  font-weight: var(--bulma-weight-semibold);
}
.stepper-item.is-complete .stepper-label { color: var(--bulma-text); }
.stepper.is-vertical { flex-direction: column; gap: 1.5rem; }
.stepper.is-vertical .stepper-item { display: flex; gap: 0.75rem; text-align: start; }
.stepper.is-vertical .stepper-item::before {
  height: 100%;
  inset-block-start: calc(var(--bulma-stepper-marker-size) * -1);
  inset-inline-start: calc(var(--bulma-stepper-marker-size) / 2);
  width: var(--bulma-stepper-track-width);
}
.stepper.is-vertical .stepper-label { margin-block-start: 0.35em; }

/* --------------------------------------------------------------------------
   Toast
   -------------------------------------------------------------------------- */
.toast-container {
  --bulma-toast-gap: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: var(--bulma-toast-gap);
  inset-block-end: 1.5rem;
  inset-inline-end: 1.5rem;
  position: fixed;
  z-index: 60;
}
.toast-container.is-top { inset-block-end: auto; inset-block-start: 1.5rem; }
.toast-container.is-left { inset-inline-end: auto; inset-inline-start: 1.5rem; }
.toast-container.is-centered { inset-inline: 0; align-items: center; }
.toast {
  --bulma-toast-background: var(--bulma-scheme-main);
  --bulma-toast-color: var(--bulma-text-strong);
  --bulma-toast-radius: var(--bulma-radius);
  --bulma-toast-padding: 0.875em 1em;
  --bulma-toast-shadow: var(--bulma-shadow);
  --bulma-toast-accent: var(--bulma-primary);
  --bulma-toast-accent-width: 3px;
  --bulma-toast-min-width: 18rem;
  align-items: center;
  background-color: var(--bulma-toast-background);
  border-radius: var(--bulma-toast-radius);
  border-inline-start: var(--bulma-toast-accent-width) solid var(--bulma-toast-accent);
  box-shadow: var(--bulma-toast-shadow);
  color: var(--bulma-toast-color);
  display: flex;
  gap: 0.75em;
  min-width: var(--bulma-toast-min-width);
  padding: var(--bulma-toast-padding);
}
.toast.is-info { --bulma-toast-accent: var(--bulma-info); }
.toast.is-success { --bulma-toast-accent: var(--bulma-success); }
.toast.is-warning { --bulma-toast-accent: var(--bulma-warning); }
.toast.is-danger { --bulma-toast-accent: var(--bulma-danger); }
.toast-content { flex: 1 1 auto; }
.toast-title { font-weight: var(--bulma-weight-semibold); }
.toast-message { color: var(--bulma-text); font-size: var(--bulma-size-7); }

/* --------------------------------------------------------------------------
   Drawer / off-canvas
   -------------------------------------------------------------------------- */
.drawer {
  --bulma-drawer-width: 22rem;
  --bulma-drawer-background: var(--bulma-scheme-main);
  --bulma-drawer-overlay: hsla(var(--bulma-scheme-h), var(--bulma-scheme-s), var(--bulma-scheme-invert-l), 0.6);
  --bulma-drawer-padding: 1.5rem;
  --bulma-drawer-shadow: var(--bulma-shadow);
  display: none;
  inset: 0;
  position: fixed;
  z-index: 50;
}
.drawer.is-active { display: block; }
.drawer-overlay { background-color: var(--bulma-drawer-overlay); inset: 0; position: absolute; }
.drawer-panel {
  background-color: var(--bulma-drawer-background);
  box-shadow: var(--bulma-drawer-shadow);
  display: flex;
  flex-direction: column;
  inset-block: 0;
  inset-inline-end: 0;
  max-width: 100%;
  position: absolute;
  width: var(--bulma-drawer-width);
}
.drawer.is-left .drawer-panel { inset-inline-end: auto; inset-inline-start: 0; }
.drawer-head {
  align-items: center;
  border-block-end: 1px solid var(--bulma-border-weak);
  display: flex;
  justify-content: space-between;
  padding: var(--bulma-drawer-padding);
}
.drawer-title { color: var(--bulma-text-strong); font-weight: var(--bulma-weight-bold); }
.drawer-body { flex: 1 1 auto; overflow-y: auto; padding: var(--bulma-drawer-padding); }
.drawer-foot {
  border-block-start: 1px solid var(--bulma-border-weak);
  padding: var(--bulma-drawer-padding);
}

/* --------------------------------------------------------------------------
   Rating
   -------------------------------------------------------------------------- */
.rating {
  --bulma-rating-color: var(--bulma-warning);
  --bulma-rating-empty-color: var(--bulma-border);
  --bulma-rating-size: 1.25rem;
  --bulma-rating-gap: 0.125em;
  display: inline-flex;
  gap: var(--bulma-rating-gap);
  line-height: 1;
}
.rating-star {
  color: var(--bulma-rating-empty-color);
  height: var(--bulma-rating-size);
  width: var(--bulma-rating-size);
}
.rating-star.is-filled { color: var(--bulma-rating-color); }
.rating-star svg { display: block; height: 100%; width: 100%; }

/* --------------------------------------------------------------------------
   Timeline
   -------------------------------------------------------------------------- */
.timeline {
  --bulma-timeline-color: var(--bulma-primary);
  --bulma-timeline-track-color: var(--bulma-border);
  --bulma-timeline-marker-size: 0.75rem;
  --bulma-timeline-gutter: 1.25rem;
  --bulma-timeline-gap: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: var(--bulma-timeline-gap);
  list-style: none;
  margin: 0;
  padding: 0;
}
.timeline-item {
  padding-inline-start: var(--bulma-timeline-gutter);
  position: relative;
}
.timeline-item::before {
  background-color: var(--bulma-timeline-track-color);
  content: "";
  inset-block-start: var(--bulma-timeline-marker-size);
  inset-inline-start: calc(var(--bulma-timeline-marker-size) / 2 - 1px);
  height: calc(100% + var(--bulma-timeline-gap) - var(--bulma-timeline-marker-size));
  position: absolute;
  width: 2px;
}
.timeline-item:last-child::before { display: none; }
.timeline-marker {
  background-color: var(--bulma-timeline-color);
  border-radius: var(--bulma-radius-rounded);
  height: var(--bulma-timeline-marker-size);
  inset-block-start: 0.3em;
  inset-inline-start: 0;
  position: absolute;
  width: var(--bulma-timeline-marker-size);
}
.timeline-marker.is-outlined {
  background-color: var(--bulma-scheme-main);
  border: 2px solid var(--bulma-timeline-color);
}
.timeline-title { color: var(--bulma-text-strong); font-weight: var(--bulma-weight-semibold); }
.timeline-meta { color: var(--bulma-text-weak); font-size: var(--bulma-size-7); }

/* --------------------------------------------------------------------------
   Stat tile
   -------------------------------------------------------------------------- */
.stat {
  --bulma-stat-padding: 1.25rem;
  --bulma-stat-radius: var(--bulma-radius-large);
  --bulma-stat-background: var(--bulma-scheme-main);
  --bulma-stat-border-color: var(--bulma-border-weak);
  --bulma-stat-value-size: var(--bulma-size-3);
  --bulma-stat-label-size: var(--bulma-size-7);
  background-color: var(--bulma-stat-background);
  border: 1px solid var(--bulma-stat-border-color);
  border-radius: var(--bulma-stat-radius);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: var(--bulma-stat-padding);
}
.stat-label {
  color: var(--bulma-text-weak);
  font-size: var(--bulma-stat-label-size);
  font-weight: var(--bulma-weight-medium);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.stat-value {
  color: var(--bulma-text-strong);
  font-family: var(--bulma-family-secondary);
  font-size: var(--bulma-stat-value-size);
  font-weight: var(--bulma-weight-bold);
  line-height: 1.1;
}
.stat-trend {
  align-items: center;
  display: inline-flex;
  font-size: var(--bulma-size-7);
  font-weight: var(--bulma-weight-medium);
  gap: 0.25em;
}
.stat-trend.is-up { color: var(--bulma-success-on-scheme); }
.stat-trend.is-down { color: var(--bulma-danger-on-scheme); }

/* --------------------------------------------------------------------------
   Empty state
   -------------------------------------------------------------------------- */
.empty-state {
  --bulma-empty-state-padding: 3rem 1.5rem;
  --bulma-empty-state-icon-size: 3rem;
  --bulma-empty-state-icon-color: var(--bulma-text-weak);
  --bulma-empty-state-max-width: 26rem;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: var(--bulma-empty-state-padding);
  text-align: center;
}
.empty-state-icon {
  color: var(--bulma-empty-state-icon-color);
  height: var(--bulma-empty-state-icon-size);
  width: var(--bulma-empty-state-icon-size);
}
.empty-state-icon svg { height: 100%; width: 100%; }
.empty-state-title {
  color: var(--bulma-text-strong);
  font-family: var(--bulma-family-secondary);
  font-size: var(--bulma-size-5);
  font-weight: var(--bulma-weight-semibold);
}
.empty-state-description {
  color: var(--bulma-text-weak);
  max-width: var(--bulma-empty-state-max-width);
}

/* --------------------------------------------------------------------------
   Combobox / autocomplete
   -------------------------------------------------------------------------- */
.combobox {
  --bulma-combobox-radius: var(--bulma-radius);
  --bulma-combobox-background: var(--bulma-scheme-main);
  --bulma-combobox-shadow: var(--bulma-shadow);
  --bulma-combobox-max-height: 16rem;
  --bulma-combobox-item-padding: 0.5em 0.75em;
  --bulma-combobox-hover-background: var(--bulma-background);
  --bulma-combobox-selected-background: var(--bulma-primary);
  --bulma-combobox-selected-color: var(--bulma-primary-invert);
  position: relative;
}
.combobox-list {
  background-color: var(--bulma-combobox-background);
  border-radius: var(--bulma-combobox-radius);
  box-shadow: var(--bulma-combobox-shadow);
  display: none;
  inset-block-start: calc(100% + 0.25rem);
  inset-inline: 0;
  list-style: none;
  margin: 0;
  max-height: var(--bulma-combobox-max-height);
  overflow-y: auto;
  padding: 0.25rem;
  position: absolute;
  z-index: 30;
}
.combobox.is-active .combobox-list { display: block; }
.combobox-item {
  border-radius: calc(var(--bulma-combobox-radius) - 0.125rem);
  color: var(--bulma-text);
  cursor: pointer;
  padding: var(--bulma-combobox-item-padding);
}
.combobox-item:hover { background-color: var(--bulma-combobox-hover-background); }
.combobox-item[aria-selected="true"] {
  background-color: var(--bulma-combobox-selected-background);
  color: var(--bulma-combobox-selected-color);
}
.combobox-empty { color: var(--bulma-text-weak); padding: var(--bulma-combobox-item-padding); }

/* --------------------------------------------------------------------------
   Progress ring
   -------------------------------------------------------------------------- */
.progress-ring {
  --bulma-progress-ring-size: 5rem;
  --bulma-progress-ring-thickness: 0.5rem;
  --bulma-progress-ring-color: var(--bulma-primary);
  --bulma-progress-ring-track-color: var(--bulma-border-weak);
  --bulma-progress-ring-value: 0;
  align-items: center;
  aspect-ratio: 1;
  background:
    conic-gradient(
      var(--bulma-progress-ring-color) calc(var(--bulma-progress-ring-value) * 1%),
      var(--bulma-progress-ring-track-color) 0
    );
  border-radius: var(--bulma-radius-rounded);
  display: inline-flex;
  justify-content: center;
  position: relative;
  width: var(--bulma-progress-ring-size);
}
.progress-ring::before {
  background-color: var(--bulma-scheme-main);
  border-radius: inherit;
  content: "";
  inset: var(--bulma-progress-ring-thickness);
  position: absolute;
}
.progress-ring-label {
  color: var(--bulma-text-strong);
  font-size: var(--bulma-size-6);
  font-weight: var(--bulma-weight-bold);
  position: relative;
}
.progress-ring.is-link { --bulma-progress-ring-color: var(--bulma-link); }
.progress-ring.is-info { --bulma-progress-ring-color: var(--bulma-info); }
.progress-ring.is-success { --bulma-progress-ring-color: var(--bulma-success); }
.progress-ring.is-warning { --bulma-progress-ring-color: var(--bulma-warning); }
.progress-ring.is-danger { --bulma-progress-ring-color: var(--bulma-danger); }

@media (prefers-reduced-motion: reduce) {
  .toggle-track,
  .toggle-track::after,
  .segmented > button,
  .segmented > a,
  .accordion-item > summary,
  .accordion-item > summary::after,
  .tooltip::after {
    transition-duration: 0.01ms;
  }
}
`;
