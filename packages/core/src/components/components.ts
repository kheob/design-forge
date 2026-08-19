import type { ComponentDef } from '../types.js';
import {
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

export const COMPONENTS: ComponentDef[] = [
  {
    id: 'card',
    name: 'Card',
    category: 'Components',
    selector: '.card',
    description: 'A surface with optional header, media, content and footer regions.',
    controls: [
      radiusControl('--bulma-card-radius', 'var(--bulma-radius-large)', 'radiusLarge'),
      sel('shadow', 'Shadow', '--bulma-card-shadow', 'var(--bulma-shadow)', SHADOWS),
      col('background', 'Background', '--bulma-card-background-color', 'var(--bulma-scheme-main)'),
      col('color', 'Text colour', '--bulma-card-color', 'var(--bulma-text)'),
      len('contentPadding', 'Content padding', '--bulma-card-content-padding', '1.5rem', { max: 4 }),
      len('headerPadding', 'Header padding', '--bulma-card-header-padding', '0.75rem 1rem', { max: 4 }),
      sel('headerWeight', 'Header weight', '--bulma-card-header-weight', '700', WEIGHTS),
      col('headerColor', 'Header colour', '--bulma-card-header-color', 'var(--bulma-text-strong)'),
      sel('headerShadow', 'Header divider', '--bulma-card-header-shadow', '0 0.125em 0.25em hsla(var(--bulma-scheme-h), var(--bulma-scheme-s), var(--bulma-scheme-invert-l), 0.1)', [
        { label: 'None', value: 'none' },
        { label: 'Soft shadow', value: '0 0.125em 0.25em hsla(var(--bulma-scheme-h), var(--bulma-scheme-s), var(--bulma-scheme-invert-l), 0.1)' },
        { label: 'Hairline', value: '0 1px 0 0 var(--bulma-border-weak)' },
      ]),
      len('footerPadding', 'Footer padding', '--bulma-card-footer-padding', '0.75rem', { max: 3 }),
      text('footerBorder', 'Footer border', '--bulma-card-footer-border-top', '1px solid var(--bulma-border-weak)'),
    ],
    variants: [
      {
        label: 'Full card',
        html: `<div class="card" style="max-width:24rem">
  <header class="card-header"><p class="card-header-title">Team plan</p></header>
  <div class="card-content">
    <p class="title is-4">$29<span class="is-size-6 has-text-weight-normal">/month</span></p>
    <p>Everything in Starter, plus shared workspaces and audit logs.</p>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item">Compare</a>
    <a href="#" class="card-footer-item">Upgrade</a>
  </footer>
</div>`,
      },
      {
        label: 'With media',
        html: `<div class="card" style="max-width:24rem">
  <div class="card-image"><figure class="image is-16by9"><img src="https://placehold.co/640x360/e2e8f0/64748b?text=%20" alt=""></figure></div>
  <div class="card-content">
    <div class="media">
      <div class="media-left"><figure class="image is-48x48"><img class="is-rounded" src="https://placehold.co/96x96/cbd5e1/475569?text=AL" alt=""></figure></div>
      <div class="media-content"><p class="title is-5">Ada Lovelace</p><p class="subtitle is-6">@ada</p></div>
    </div>
    <div class="content">Notes from the analytical engine project.</div>
  </div>
</div>`,
      },
    ],
    docs: {
      usage: 'Use when content needs distinct header/body/footer regions. Otherwise a Box is simpler.',
      classes: [
        { name: 'card-header / card-header-title / card-header-icon', description: 'Header row.' },
        { name: 'card-image', description: 'Edge-to-edge media at the top.' },
        { name: 'card-content', description: 'Padded body region.' },
        { name: 'card-footer / card-footer-item', description: 'Equal-width footer actions.' },
      ],
      dos: ['Keep every card in a grid the same height by putting actions in the footer.'],
      donts: ['Do not make the whole card a link if it contains other links.'],
    },
  },
  {
    id: 'navbar',
    name: 'Navbar',
    category: 'Components',
    selector: '.navbar',
    description: 'The top-level navigation bar, with brand, menu and dropdown support.',
    controls: [
      col('background', 'Background', '--bulma-navbar-background-color', 'var(--bulma-scheme-main)'),
      len('padV', 'Padding (vertical)', '--bulma-navbar-padding-vertical', '1rem', { max: 3 }),
      len('padH', 'Padding (horizontal)', '--bulma-navbar-padding-horizontal', '2rem', { max: 5 }),
      col('itemColor', 'Item colour', '--bulma-navbar-item-color', 'var(--bulma-text)'),
      num('itemHover', 'Item hover shift', '--bulma-navbar-item-hover-background-l-delta', '-5', {
        min: -25,
        max: 25,
        step: 1,
        suffix: '%',
      }),
      len('shadowSize', 'Bottom shadow', '--bulma-navbar-bottom-box-shadow-size', '0 2px 0 0', {
        units: ['px'],
        max: 8,
        help: 'Offsets for the shadow under a fixed navbar.',
      }),
      col('shadowColor', 'Shadow colour', '--bulma-navbar-box-shadow-color', 'var(--bulma-border)'),
      radiusControl('--bulma-navbar-dropdown-radius', 'var(--bulma-radius-large)', 'radiusLarge', 'Dropdown radius'),
      col('dropdownBg', 'Dropdown background', '--bulma-navbar-dropdown-background-color', 'var(--bulma-scheme-main)'),
      len('dropdownBorderWidth', 'Dropdown border width', '--bulma-navbar-dropdown-border-width', '2px', {
        max: 6,
        step: 1,
        units: ['px'],
      }),
      len('itemImgMaxHeight', 'Logo max height', '--bulma-navbar-item-img-max-height', '1.75rem', {
        max: 5,
      }),
    ],
    variants: [
      {
        label: 'Default',
        html: `<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item has-text-weight-bold" href="#">Acme</a>
    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></a>
  </div>
  <div class="navbar-menu is-active">
    <div class="navbar-start">
      <a class="navbar-item" href="#">Product</a>
      <a class="navbar-item" href="#">Pricing</a>
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">Resources</a>
        <div class="navbar-dropdown">
          <a class="navbar-item" href="#">Documentation</a>
          <a class="navbar-item" href="#">Changelog</a>
          <hr class="navbar-divider">
          <a class="navbar-item" href="#">Support</a>
        </div>
      </div>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary"><strong>Sign up</strong></a>
          <a class="button is-light">Log in</a>
        </div>
      </div>
    </div>
  </div>
</nav>`,
      },
      {
        label: 'Coloured',
        html: `<nav class="navbar is-primary" role="navigation">
  <div class="navbar-brand"><a class="navbar-item has-text-weight-bold" href="#">Acme</a></div>
  <div class="navbar-menu is-active"><div class="navbar-start"><a class="navbar-item" href="#">Dashboard</a><a class="navbar-item is-active" href="#">Reports</a></div></div>
</nav>`,
      },
    ],
    docs: {
      usage: 'One navbar per page. The burger toggles .navbar-menu.is-active on mobile.',
      classes: [
        { name: 'navbar-brand / navbar-burger', description: 'Left region and mobile toggle.' },
        { name: 'navbar-start / navbar-end', description: 'Left- and right-aligned item groups.' },
        { name: 'has-dropdown / is-hoverable', description: 'Dropdown menu behaviour.' },
        { name: 'is-fixed-top / is-fixed-bottom', description: 'Pins the bar; add has-navbar-fixed-top to <html>.' },
        { name: 'is-transparent / is-spaced / is-shadow', description: 'Presentation modifiers.' },
      ],
      dos: [
        'Add role="navigation" and aria-label to the nav element.',
        'Toggle aria-expanded on the burger when it opens the menu.',
      ],
      donts: ['Do not put more than about seven items in navbar-start.'],
    },
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'Components',
    selector: '.modal',
    description: 'A blocking overlay dialog, either free-form or with the card layout.',
    controls: [
      col('overlay', 'Overlay colour', '--bulma-modal-background-background-color', 'hsla(var(--bulma-scheme-h), var(--bulma-scheme-s), var(--bulma-scheme-invert-l), 0.86)'),
      len('contentWidth', 'Content width', '--bulma-modal-content-width', '40rem', {
        min: 16,
        max: 80,
      }),
      radiusControl('--bulma-modal-card-head-radius', 'var(--bulma-radius-large)', 'radiusLarge', 'Card head radius'),
      len('footRadius', 'Card foot radius', '--bulma-modal-card-foot-radius', 'var(--bulma-radius-large)', {
        max: 3,
        inheritsFrom: 'radiusLarge',
      }),
      len('headPadding', 'Head padding', '--bulma-modal-card-head-padding', '2rem', { max: 4 }),
      len('bodyPadding', 'Body padding', '--bulma-modal-card-body-padding', '2rem', { max: 4 }),
      col('headBg', 'Head background', '--bulma-modal-card-head-background-color', 'var(--bulma-scheme-main)'),
      col('bodyBg', 'Body background', '--bulma-modal-card-body-background-color', 'var(--bulma-scheme-main)'),
      col('footBg', 'Foot background', '--bulma-modal-card-foot-background-color', 'var(--bulma-scheme-main-bis)'),
      len('titleSize', 'Title size', '--bulma-modal-card-title-size', 'var(--bulma-size-4)', { max: 4 }),
      col('titleColor', 'Title colour', '--bulma-modal-card-title-color', 'var(--bulma-text-strong)'),
    ],
    variants: [
      {
        label: 'Card modal',
        html: `<div class="modal is-active" style="position:relative;min-height:22rem">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Delete workspace</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <p>This permanently removes the workspace and all of its projects. This cannot be undone.</p>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons"><button class="button is-danger">Delete</button><button class="button">Cancel</button></div>
    </footer>
  </div>
</div>`,
      },
    ],
    docs: {
      usage: 'Add is-active to show it. Add is-clipped to <html> so the page behind cannot scroll.',
      classes: [
        { name: 'is-active', description: 'Shows the modal.' },
        { name: 'modal-background', description: 'The dimmed backdrop; clicking it should close.' },
        { name: 'modal-card-head / -body / -foot', description: 'Structured dialog regions.' },
        { name: 'modal-content', description: 'Free-form alternative to modal-card.' },
      ],
      dos: [
        'Use role="dialog" and aria-modal="true", and move focus into the dialog on open.',
        'Close on Escape as well as on the backdrop and the delete button.',
      ],
      donts: ['Do not stack modals; replace the content instead.'],
    },
  },
  {
    id: 'message',
    name: 'Message',
    category: 'Components',
    selector: '.message',
    description: 'A bordered callout with an optional header. Good for persistent guidance.',
    controls: [
      radiusControl('--bulma-message-radius'),
      len('borderWidth', 'Left border width', '--bulma-message-border-width', '4px', {
        max: 12,
        step: 1,
        units: ['px'],
      }),
      sel('borderStyle', 'Border style', '--bulma-message-border-style', 'solid', BORDER_STYLES),
      len('bodyPadding', 'Body padding', '--bulma-message-body-padding', '1.25em 1.5em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      len('headerPadding', 'Header padding', '--bulma-message-header-padding', '0.75em 1em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      sel('headerWeight', 'Header weight', '--bulma-message-header-weight', '700', WEIGHTS),
      len('bodyBorderWidth', 'Body border width', '--bulma-message-body-border-width', '0 0 0 4px', {
        max: 12,
        units: ['px'],
      }),
    ],
    variants: [
      {
        label: 'With header',
        html: `<article class="message is-info">
  <div class="message-header"><p>Scheduled maintenance</p><button class="delete" aria-label="delete"></button></div>
  <div class="message-body">Reporting will be read-only on Sunday between 02:00 and 04:00 UTC.</div>
</article>`,
      },
      {
        label: 'Body only',
        html: `<article class="message is-warning"><div class="message-body">Your API key expires in 7 days.</div></article>
<article class="message is-danger"><div class="message-body">Two payments failed this month.</div></article>`,
      },
    ],
    docs: {
      usage: 'Use for guidance that stays on the page, unlike a Toast which disappears.',
      classes: [
        { name: 'message-header / message-body', description: 'The two regions.' },
        { name: 'is-primary / is-info / is-warning / is-danger etc.', description: 'Colour modifiers.' },
        { name: 'is-small / is-medium / is-large', description: 'Size modifiers.' },
      ],
      dos: ['Lead with what the reader should do, not with the system state.'],
      donts: ['Do not use for field validation; use .help.is-danger.'],
    },
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'Components',
    selector: '.tabs',
    description: 'Switch between sibling views. Boxed and toggle styles included.',
    controls: [
      len('borderWidth', 'Underline width', '--bulma-tabs-border-bottom-width', '1px', {
        max: 8,
        step: 1,
        units: ['px'],
      }),
      col('borderColor', 'Underline colour', '--bulma-tabs-border-bottom-color', 'var(--bulma-border)'),
      sel('borderStyle', 'Underline style', '--bulma-tabs-border-bottom-style', 'solid', BORDER_STYLES),
      len('linkPadding', 'Link padding', '--bulma-tabs-link-padding', '0.5em 1em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      col('linkColor', 'Link colour', '--bulma-tabs-link-color', 'var(--bulma-text)'),
      col('activeColor', 'Active colour', '--bulma-tabs-link-active-color', 'var(--bulma-link-text-active)'),
      col('activeBorder', 'Active underline', '--bulma-tabs-link-active-border-bottom-color', 'var(--bulma-link)'),
      radiusControl('--bulma-tabs-boxed-link-radius', 'var(--bulma-radius)', 'radius', 'Boxed tab radius'),
      radiusControl('--bulma-tabs-toggle-link-radius', 'var(--bulma-radius)', 'radius', 'Toggle tab radius'),
    ],
    variants: [
      {
        label: 'Default',
        html: `<div class="tabs"><ul><li class="is-active"><a>Overview</a></li><li><a>Activity</a></li><li><a>Settings</a></li></ul></div>`,
      },
      {
        label: 'Boxed',
        html: `<div class="tabs is-boxed"><ul><li class="is-active"><a>Overview</a></li><li><a>Activity</a></li><li><a>Settings</a></li></ul></div>`,
      },
      {
        label: 'Toggle',
        html: `<div class="tabs is-toggle is-toggle-rounded"><ul><li class="is-active"><a>Day</a></li><li><a>Week</a></li><li><a>Month</a></li></ul></div>`,
      },
      {
        label: 'Centered & large',
        html: `<div class="tabs is-centered is-large"><ul><li class="is-active"><a>One</a></li><li><a>Two</a></li></ul></div>`,
      },
    ],
    docs: {
      usage: 'Mark the current tab with .is-active on the <li>.',
      classes: [
        { name: 'is-boxed / is-toggle / is-toggle-rounded', description: 'Visual styles.' },
        { name: 'is-centered / is-right / is-fullwidth', description: 'Alignment.' },
        { name: 'is-small / is-medium / is-large', description: 'Size modifiers.' },
      ],
      dos: ['Use role="tablist"/"tab"/"tabpanel" and aria-selected for real tab behaviour.'],
      donts: ['Do not use tabs for sequential steps; use a Stepper.'],
    },
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    category: 'Components',
    selector: '.dropdown',
    description: 'A toggleable menu anchored to a trigger.',
    controls: [
      radiusControl('--bulma-dropdown-content-radius', 'var(--bulma-radius)', 'radius', 'Menu radius'),
      col('background', 'Menu background', '--bulma-dropdown-content-background-color', 'var(--bulma-scheme-main)'),
      sel('shadow', 'Menu shadow', '--bulma-dropdown-content-shadow', 'var(--bulma-shadow)', SHADOWS),
      len('offset', 'Offset from trigger', '--bulma-dropdown-content-offset', '4px', {
        max: 24,
        step: 1,
        units: ['px'],
      }),
      len('padTop', 'Menu padding top', '--bulma-dropdown-content-padding-top', '0.5rem', { max: 2 }),
      len('padBottom', 'Menu padding bottom', '--bulma-dropdown-content-padding-bottom', '0.5rem', { max: 2 }),
      len('minWidth', 'Minimum width', '--bulma-dropdown-menu-min-width', '12rem', { min: 6, max: 30 }),
      num('itemHover', 'Item hover shift', '--bulma-dropdown-item-hover-background-l-delta', '-5', {
        min: -25,
        max: 25,
        step: 1,
        suffix: '%',
      }),
    ],
    variants: [
      {
        label: 'Open menu',
        html: `<div class="dropdown is-active">
  <div class="dropdown-trigger"><button class="button" aria-haspopup="true"><span>Actions</span><span class="icon is-small"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></span></button></div>
  <div class="dropdown-menu" role="menu">
    <div class="dropdown-content">
      <a href="#" class="dropdown-item">Duplicate</a>
      <a href="#" class="dropdown-item is-active">Rename</a>
      <hr class="dropdown-divider">
      <a href="#" class="dropdown-item has-text-danger">Delete</a>
    </div>
  </div>
</div>`,
      },
    ],
    docs: {
      usage: 'Toggle .is-active on the .dropdown wrapper from JavaScript.',
      classes: [
        { name: 'is-active', description: 'Shows the menu.' },
        { name: 'is-right / is-up', description: 'Alignment relative to the trigger.' },
        { name: 'is-hoverable', description: 'Opens on hover without JavaScript.' },
        { name: 'dropdown-divider', description: 'Separator between item groups.' },
      ],
      dos: ['Set aria-haspopup on the trigger and close the menu on Escape.'],
      donts: ['Do not rely on is-hoverable alone; it is unusable on touch devices.'],
    },
  },
  {
    id: 'menu',
    name: 'Menu (sidebar)',
    category: 'Components',
    selector: '.menu',
    description: 'A vertical navigation list with labels and nested items.',
    controls: [
      radiusControl('--bulma-menu-item-radius', 'var(--bulma-radius-small)', 'radiusSmall', 'Item radius'),
      len('linkPadding', 'Item padding', '--bulma-menu-list-link-padding', '0.5em 0.75em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      col('labelColor', 'Section label colour', '--bulma-menu-label-color', 'var(--bulma-text-weak)'),
      len('labelSize', 'Section label size', '--bulma-menu-label-font-size', '0.75em', {
        min: 0.5,
        max: 1.5,
        units: ['em', 'rem'],
      }),
      len('labelSpacing', 'Section label spacing', '--bulma-menu-label-spacing', '1em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      text('labelLetterSpacing', 'Label letter spacing', '--bulma-menu-label-letter-spacing', '0.1em'),
      text('nestedBorder', 'Nested list border', '--bulma-menu-list-border-left', '1px solid var(--bulma-border)'),
      num('itemHover', 'Item hover shift', '--bulma-menu-item-hover-background-l-delta', '-5', {
        min: -25,
        max: 25,
        step: 1,
        suffix: '%',
      }),
    ],
    variants: [
      {
        label: 'Sidebar',
        html: `<aside class="menu" style="max-width:16rem">
  <p class="menu-label">General</p>
  <ul class="menu-list">
    <li><a class="is-active">Dashboard</a></li>
    <li><a>Customers</a></li>
  </ul>
  <p class="menu-label">Administration</p>
  <ul class="menu-list">
    <li><a>Team settings</a></li>
    <li>
      <a>Manage members</a>
      <ul><li><a>Invitations</a></li><li><a>Permissions</a></li></ul>
    </li>
    <li><a>Billing</a></li>
  </ul>
</aside>`,
      },
    ],
    docs: {
      usage: 'The standard left-hand navigation for app shells.',
      classes: [
        { name: 'menu-label', description: 'Uppercase section heading.' },
        { name: 'menu-list', description: 'The list of links.' },
        { name: 'is-active', description: 'Marks the current page.' },
      ],
      dos: ['Wrap in <aside> and mark the current item with aria-current="page".'],
      donts: ['Do not nest more than two levels deep.'],
    },
  },
  {
    id: 'panel',
    name: 'Panel',
    category: 'Components',
    selector: '.panel',
    description: 'A composite list container with a heading, tabs and selectable rows.',
    controls: [
      radiusControl('--bulma-panel-radius', 'var(--bulma-radius-large)', 'radiusLarge'),
      sel('shadow', 'Shadow', '--bulma-panel-shadow', 'var(--bulma-shadow)', SHADOWS),
      len('margin', 'Outer margin', '--bulma-panel-margin', '1.5rem', { max: 4 }),
      len('headingPadding', 'Heading padding', '--bulma-panel-heading-padding', '0.75em 1em', {
        max: 3,
        units: ['em', 'rem'],
      }),
      sel('headingWeight', 'Heading weight', '--bulma-panel-heading-weight', '700', WEIGHTS),
      len('headingSize', 'Heading size', '--bulma-panel-heading-size', '1.25em', {
        min: 0.75,
        max: 3,
        units: ['em', 'rem'],
      }),
      text('itemBorder', 'Row border', '--bulma-panel-item-border', '1px solid var(--bulma-border)'),
      col('iconColor', 'Icon colour', '--bulma-panel-icon-color', 'var(--bulma-text-weak)'),
      col('activeBorder', 'Active row marker', '--bulma-panel-block-active-border-left-color', 'var(--bulma-link)'),
    ],
    variants: [
      {
        label: 'Full panel',
        html: `<nav class="panel" style="max-width:26rem">
  <p class="panel-heading">Repositories</p>
  <div class="panel-block">
    <p class="control has-icons-left">
      <input class="input" type="text" placeholder="Search">
      <span class="icon is-left"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span>
    </p>
  </div>
  <p class="panel-tabs"><a class="is-active">All</a><a>Public</a><a>Private</a></p>
  <a class="panel-block is-active"><span class="panel-icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/></svg></span>design-forge</a>
  <a class="panel-block"><span class="panel-icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/></svg></span>bulma</a>
  <div class="panel-block"><button class="button is-link is-outlined is-fullwidth">Reset all filters</button></div>
</nav>`,
      },
    ],
    docs: {
      usage: 'A good fit for filterable lists: search, tabs and rows in one surface.',
      classes: [
        { name: 'panel-heading / panel-tabs / panel-block', description: 'The regions.' },
        { name: 'panel-icon', description: 'Leading icon inside a block.' },
        { name: 'is-active', description: 'Marks the selected row or tab.' },
      ],
      dos: ['Use <a class="panel-block"> for navigable rows and <div> for static ones.'],
      donts: ['Do not put unrelated content in a panel; it reads as one list.'],
    },
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'Components',
    selector: '.pagination',
    description: 'Page navigation with previous/next and numbered links.',
    controls: [
      len('radius', 'Item radius', '--bulma-control-radius', 'var(--bulma-radius)', {
        max: 3,
        inheritsFrom: 'radius',
      }),
      len('margin', 'Outer margin', '--bulma-pagination-margin', '-0.25rem', { min: -2, max: 3 }),
      len('itemMargin', 'Item spacing', '--bulma-pagination-item-margin', '0.25rem', { max: 2 }),
      len('itemFontSize', 'Item font size', '--bulma-pagination-item-font-size', '1em', {
        min: 0.6,
        max: 2,
        units: ['em', 'rem'],
      }),
      len('minWidth', 'Item min width', '--bulma-pagination-min-width', '2.5em', {
        min: 1,
        max: 5,
        units: ['em', 'rem'],
      }),
      len('itemPadL', 'Item padding left', '--bulma-pagination-item-padding-left', '0.5em', {
        max: 2,
        units: ['em', 'rem'],
      }),
      len('itemPadR', 'Item padding right', '--bulma-pagination-item-padding-right', '0.5em', {
        max: 2,
        units: ['em', 'rem'],
      }),
      len('itemBorderWidth', 'Item border width', '--bulma-pagination-item-border-width', '1px', {
        max: 5,
        step: 1,
        units: ['px'],
      }),
      col('currentBg', 'Current page background', '--bulma-pagination-current-background-color', 'var(--bulma-link)'),
      col('currentColor', 'Current page text', '--bulma-pagination-current-color', 'var(--bulma-link-invert)'),
    ],
    variants: [
      {
        label: 'Default',
        html: `<nav class="pagination" role="navigation" aria-label="pagination">
  <a class="pagination-previous">Previous</a>
  <a class="pagination-next">Next</a>
  <ul class="pagination-list">
    <li><a class="pagination-link" aria-label="Goto page 1">1</a></li>
    <li><span class="pagination-ellipsis">&hellip;</span></li>
    <li><a class="pagination-link" aria-label="Goto page 45">45</a></li>
    <li><a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a></li>
    <li><a class="pagination-link" aria-label="Goto page 47">47</a></li>
  </ul>
</nav>`,
      },
      {
        label: 'Rounded & centered',
        html: `<nav class="pagination is-centered is-rounded is-small" role="navigation">
  <a class="pagination-previous">Prev</a><a class="pagination-next">Next</a>
  <ul class="pagination-list"><li><a class="pagination-link is-current">1</a></li><li><a class="pagination-link">2</a></li></ul>
</nav>`,
      },
    ],
    docs: {
      usage: 'Mark the current page with .is-current and aria-current="page".',
      classes: [
        { name: 'pagination-previous / -next / -list / -link / -ellipsis', description: 'The parts.' },
        { name: 'is-centered / is-right', description: 'Alignment.' },
        { name: 'is-rounded', description: 'Pill-shaped items.' },
      ],
      dos: ['Disable previous/next at the ends with the disabled attribute.'],
      donts: ['Do not show more than about seven numbered links; use ellipses.'],
    },
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'Components',
    selector: '.breadcrumb',
    description: 'Shows the path back up the hierarchy.',
    controls: [
      col('itemColor', 'Item colour', '--bulma-breadcrumb-item-color', 'var(--bulma-link-text)'),
      col('hoverColor', 'Hover colour', '--bulma-breadcrumb-item-hover-color', 'var(--bulma-link-text-hover)'),
      col('activeColor', 'Current colour', '--bulma-breadcrumb-item-active-color', 'var(--bulma-text-strong)'),
      col('separatorColor', 'Separator colour', '--bulma-breadcrumb-item-separator-color', 'var(--bulma-border)'),
      len('padH', 'Item padding (horizontal)', '--bulma-breadcrumb-item-padding-horizontal', '0.75em', {
        max: 2,
        units: ['em', 'rem'],
      }),
      len('padV', 'Item padding (vertical)', '--bulma-breadcrumb-item-padding-vertical', '0', {
        max: 2,
        units: ['em', 'rem'],
      }),
    ],
    variants: [
      {
        label: 'Default',
        html: `<nav class="breadcrumb" aria-label="breadcrumbs">
  <ul><li><a href="#">Home</a></li><li><a href="#">Reports</a></li><li class="is-active"><a href="#" aria-current="page">Q3 revenue</a></li></ul>
</nav>`,
      },
      {
        label: 'Separators',
        html: `<nav class="breadcrumb has-arrow-separator"><ul><li><a>Home</a></li><li class="is-active"><a>Arrow</a></li></ul></nav>
<nav class="breadcrumb has-bullet-separator"><ul><li><a>Home</a></li><li class="is-active"><a>Bullet</a></li></ul></nav>`,
      },
    ],
    docs: {
      usage: 'The last item is the current page and should not navigate anywhere new.',
      classes: [
        { name: 'has-arrow-separator / has-bullet-separator / has-dot-separator / has-succeeds-separator', description: 'Separator styles.' },
        { name: 'is-centered / is-right', description: 'Alignment.' },
      ],
      dos: ['Add aria-label="breadcrumbs" and aria-current="page" on the last link.'],
      donts: ['Do not use a breadcrumb when the hierarchy is only one level deep.'],
    },
  },
];
