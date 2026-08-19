import type { ComponentDef } from '../types.js';
import { col, len, num, text } from './helpers.js';

export const LAYOUT: ComponentDef[] = [
  {
    id: 'section',
    name: 'Section',
    category: 'Layout',
    selector: '.section',
    description: 'The standard vertical page band. The main rhythm of a page.',
    controls: [
      len('padding', 'Padding', '--bulma-section-padding', '3rem 1.5rem', { max: 8 }),
      len('paddingDesktop', 'Padding (desktop)', '--bulma-section-padding-desktop', '3rem 3rem', { max: 10 }),
      len('paddingMedium', 'Padding (is-medium)', '--bulma-section-padding-medium', '9rem 4.5rem', { max: 16 }),
      len('paddingLarge', 'Padding (is-large)', '--bulma-section-padding-large', '18rem 6rem', { max: 24 }),
    ],
    variants: [
      {
        label: 'Default',
        html: `<section class="section" style="background:var(--bulma-scheme-main-bis)">
  <h2 class="title is-3">Built for teams</h2>
  <p class="subtitle">Sections give a page its vertical rhythm.</p>
</section>`,
      },
    ],
    docs: {
      usage: 'Wrap each major page band in a section, with a container inside for width.',
      classes: [{ name: 'is-medium / is-large', description: 'Taller padding variants.' }],
      dos: ['Alternate section backgrounds to separate bands without borders.'],
      donts: ['Do not nest sections.'],
    },
  },
  {
    id: 'container',
    name: 'Container',
    category: 'Layout',
    selector: '.container',
    description: 'Centres content and caps its width at each breakpoint.',
    controls: [],
    variants: [
      {
        label: 'Default',
        html: '<div class="container" style="outline:1px dashed var(--bulma-border);padding:1rem">Centred, width-capped content.</div>',
      },
      {
        label: 'Widths',
        html: `<div class="container is-max-desktop" style="outline:1px dashed var(--bulma-border);padding:1rem">is-max-desktop</div>
<div class="container is-widescreen" style="outline:1px dashed var(--bulma-border);padding:1rem;margin-top:.5rem">is-widescreen</div>`,
      },
    ],
    docs: {
      usage: 'Put a container immediately inside a section to constrain line length.',
      classes: [
        { name: 'is-fluid', description: 'Full width with padding.' },
        { name: 'is-max-tablet / is-max-desktop / is-max-widescreen', description: 'Caps the width.' },
        { name: 'is-widescreen / is-fullhd', description: 'Only constrains above that breakpoint.' },
      ],
      dos: ['Cap text-heavy pages at is-max-desktop so lines stay readable.'],
      donts: ['Do not nest containers.'],
    },
  },
  {
    id: 'hero',
    name: 'Hero',
    category: 'Layout',
    selector: '.hero',
    description: 'A full-width banner, optionally the full height of the viewport.',
    controls: [
      len('bodyPadding', 'Body padding', '--bulma-hero-body-padding', '3rem 1.5rem', { max: 10 }),
      len('bodyPaddingTablet', 'Body padding (tablet)', '--bulma-hero-body-padding-tablet', '3rem 3rem', { max: 12 }),
      len('bodyPaddingMedium', 'Body padding (is-medium)', '--bulma-hero-body-padding-medium', '9rem 4.5rem', { max: 18 }),
      len('bodyPaddingLarge', 'Body padding (is-large)', '--bulma-hero-body-padding-large', '18rem 6rem', { max: 26 }),
      num('gradientH', 'Gradient hue offset', '--bulma-hero-gradient-h-offset', '10', {
        min: -60,
        max: 60,
        step: 1,
        suffix: 'deg',
        help: 'Applies to is-bold heroes, which fade between two hues.',
      }),
      num('gradientS', 'Gradient saturation offset', '--bulma-hero-gradient-s-offset', '5', {
        min: -50,
        max: 50,
        step: 1,
        suffix: '%',
      }),
      num('gradientL', 'Gradient lightness offset', '--bulma-hero-gradient-l-offset', '10', {
        min: -50,
        max: 50,
        step: 1,
        suffix: '%',
      }),
    ],
    variants: [
      {
        label: 'Primary',
        html: `<section class="hero is-primary">
  <div class="hero-body"><p class="title">Design once, build fast</p><p class="subtitle">Hand your LLM a system it cannot drift from.</p></div>
</section>`,
      },
      {
        label: 'Bold gradient',
        html: `<section class="hero is-link is-bold">
  <div class="hero-body"><p class="title">Gradient hero</p><p class="subtitle">is-bold fades between two tints of the colour.</p></div>
</section>`,
      },
      {
        label: 'With head and foot',
        html: `<section class="hero is-info is-medium">
  <div class="hero-head"><nav class="navbar"><div class="navbar-brand"><a class="navbar-item has-text-weight-bold">Acme</a></div></nav></div>
  <div class="hero-body"><p class="title">Medium hero</p></div>
  <div class="hero-foot"><nav class="tabs is-boxed"><ul><li class="is-active"><a>Overview</a></li><li><a>Pricing</a></li></ul></nav></div>
</section>`,
      },
    ],
    docs: {
      usage: 'Content goes in .hero-body. Add .hero-head and .hero-foot only for full-height heroes.',
      classes: [
        { name: 'is-small / is-medium / is-large / is-halfheight / is-fullheight', description: 'Height.' },
        { name: 'is-bold', description: 'Gradient background.' },
        { name: 'is-primary etc.', description: 'Colour modifiers.' },
      ],
      dos: ['Keep hero copy to one heading and one supporting line.'],
      donts: ['Do not put a form with many fields in a hero.'],
    },
  },
  {
    id: 'level',
    name: 'Level',
    category: 'Layout',
    selector: '.level',
    description: 'A horizontal bar that pins items left and right on one baseline.',
    controls: [
      len('itemSpacing', 'Item spacing', '--bulma-level-item-spacing', '1.5rem', { max: 5 }),
    ],
    variants: [
      {
        label: 'Toolbar',
        html: `<nav class="level">
  <div class="level-left">
    <div class="level-item"><p class="subtitle is-5"><strong>128</strong> orders</p></div>
    <div class="level-item"><input class="input" type="text" placeholder="Search"></div>
  </div>
  <div class="level-right">
    <p class="level-item"><a class="button is-ghost">Export</a></p>
    <p class="level-item"><a class="button is-primary">New order</a></p>
  </div>
</nav>`,
      },
      {
        label: 'Statistics',
        html: `<nav class="level has-text-centered">
  <div class="level-item"><div><p class="heading">Tweets</p><p class="title">3,456</p></div></div>
  <div class="level-item"><div><p class="heading">Following</p><p class="title">123</p></div></div>
  <div class="level-item"><div><p class="heading">Followers</p><p class="title">456K</p></div></div>
</nav>`,
      },
    ],
    docs: {
      usage: 'The standard pattern for a page header with a title on the left and actions on the right.',
      classes: [
        { name: 'level-left / level-right', description: 'The two groups.' },
        { name: 'level-item', description: 'One child; centred vertically.' },
        { name: 'is-mobile', description: 'Stays horizontal on small screens.' },
      ],
      dos: ['Use .level-item on every direct child so alignment works.'],
      donts: ['Do not use for page layout columns; use Columns or Grid.'],
    },
  },
  {
    id: 'media',
    name: 'Media object',
    category: 'Layout',
    selector: '.media',
    description: 'An image or avatar beside a block of content. Comments, feeds, notifications.',
    controls: [
      len('spacing', 'Row spacing', '--bulma-media-spacing', '1rem', { max: 4 }),
      len('spacingLarge', 'Large row spacing', '--bulma-media-spacing-large', '1.5rem', { max: 5 }),
      len('contentSpacing', 'Content spacing', '--bulma-media-content-spacing', '0.75rem', { max: 3 }),
      col('borderColor', 'Divider colour', '--bulma-media-border-color', 'var(--bulma-border-weak)'),
      len('borderSize', 'Divider width', '--bulma-media-border-size', '1px', {
        max: 4,
        step: 1,
        units: ['px'],
      }),
    ],
    variants: [
      {
        label: 'Comment',
        html: `<article class="media">
  <figure class="media-left"><p class="image is-64x64"><img class="is-rounded" src="https://placehold.co/128x128/cbd5e1/475569?text=GH" alt=""></p></figure>
  <div class="media-content">
    <div class="content"><p><strong>Grace Hopper</strong> <small>@grace</small> <small>2h</small><br>The most damaging phrase in the language is "we have always done it this way".</p></div>
  </div>
  <div class="media-right"><button class="delete"></button></div>
</article>`,
      },
    ],
    docs: {
      usage: 'media-left for the avatar, media-content for the body, media-right for actions.',
      classes: [
        { name: 'media-left / media-content / media-right', description: 'The three slots.' },
        { name: 'is-large', description: 'Wider spacing.' },
      ],
      dos: ['Nest .media inside .media-content for threaded replies.'],
      donts: ['Do not nest more than two levels; it becomes unreadable on mobile.'],
    },
  },
  {
    id: 'footer',
    name: 'Footer',
    category: 'Layout',
    selector: '.footer',
    description: 'The page footer band.',
    controls: [
      col('background', 'Background', '--bulma-footer-background-color', 'var(--bulma-scheme-main-bis)'),
      col('color', 'Text colour', '--bulma-footer-color', 'var(--bulma-text)'),
      len('padding', 'Padding', '--bulma-footer-padding', '3rem 1.5rem 6rem', { max: 10 }),
    ],
    variants: [
      {
        label: 'Default',
        html: `<footer class="footer">
  <div class="content has-text-centered">
    <p><strong>Acme</strong> — built with Design Forge. Source licensed MIT.</p>
  </div>
</footer>`,
      },
    ],
    docs: {
      usage: 'One per page, as the last element in the body.',
      classes: [{ name: 'footer', description: 'The band. No modifiers.' }],
      dos: ['Wrap footer text in .content so links and lists are styled.'],
      donts: ['Do not put primary navigation only in the footer.'],
    },
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'Grid',
    selector: '.grid',
    description:
      'A responsive CSS grid that reflows automatically. Prefer this over Columns for new layouts.',
    controls: [
      len('gap', 'Gap', '--bulma-grid-gap', '0.75rem', { max: 4 }),
      len('columnMin', 'Minimum column width', '--bulma-grid-column-min', '9rem', {
        min: 2,
        max: 30,
        help: 'Columns wrap once they would shrink below this width.',
      }),
    ],
    variants: [
      {
        label: 'Auto grid',
        html: `<div class="grid">
  <div class="cell"><div class="box has-text-centered">1</div></div>
  <div class="cell"><div class="box has-text-centered">2</div></div>
  <div class="cell"><div class="box has-text-centered">3</div></div>
  <div class="cell"><div class="box has-text-centered">4</div></div>
  <div class="cell"><div class="box has-text-centered">5</div></div>
  <div class="cell"><div class="box has-text-centered">6</div></div>
</div>`,
      },
      {
        label: 'Fixed columns',
        html: `<div class="fixed-grid has-3-cols">
  <div class="grid">
    <div class="cell"><div class="box has-text-centered">1</div></div>
    <div class="cell is-col-span-2"><div class="box has-text-centered">Spans 2</div></div>
    <div class="cell"><div class="box has-text-centered">3</div></div>
  </div>
</div>`,
      },
    ],
    docs: {
      usage: 'Wrap in .fixed-grid.has-N-cols when you need an exact column count.',
      classes: [
        { name: 'cell', description: 'One grid child.' },
        { name: 'fixed-grid has-1-cols … has-12-cols', description: 'Fixed column counts.' },
        { name: 'is-col-span-N / is-row-span-N', description: 'Spanning on a cell.' },
        { name: 'is-gap-N / is-column-gap-N / is-row-gap-N', description: 'Gap utilities.' },
      ],
      dos: ['Use the auto grid for card lists; it needs no breakpoint classes.'],
      donts: ['Do not mix .grid and .columns in the same layout.'],
    },
  },
  {
    id: 'columns',
    name: 'Columns',
    category: 'Grid',
    selector: '.columns',
    description: 'The classic 12-column flexbox grid with per-breakpoint sizing.',
    controls: [
      len('gap', 'Column gap', '--bulma-column-gap', '0.75rem', {
        max: 4,
        inheritsFrom: 'columnGap',
      }),
    ],
    variants: [
      {
        label: 'Equal columns',
        html: `<div class="columns">
  <div class="column"><div class="box has-text-centered">First</div></div>
  <div class="column"><div class="box has-text-centered">Second</div></div>
  <div class="column"><div class="box has-text-centered">Third</div></div>
</div>`,
      },
      {
        label: 'Sized & responsive',
        html: `<div class="columns">
  <div class="column is-8-desktop is-12-mobile"><div class="box">Main content (8/12)</div></div>
  <div class="column is-4-desktop is-12-mobile"><div class="box">Sidebar (4/12)</div></div>
</div>`,
      },
      {
        label: 'Modifiers',
        html: `<div class="columns is-vcentered is-multiline is-centered">
  <div class="column is-narrow"><div class="box">Narrow</div></div>
  <div class="column"><div class="box">Fills the rest</div></div>
</div>`,
      },
    ],
    docs: {
      usage: 'Columns are horizontal from tablet up by default. Add is-mobile to keep them side by side.',
      classes: [
        { name: 'is-1 … is-12', description: 'Width in twelfths.' },
        { name: 'is-N-mobile / -tablet / -desktop / -widescreen', description: 'Per-breakpoint widths.' },
        { name: 'is-narrow', description: 'Shrinks to content width.' },
        { name: 'is-multiline / is-vcentered / is-centered / is-gapless', description: 'Layout modifiers.' },
      ],
      dos: ['Prefer .grid for simple equal-width card lists; use columns when you need exact ratios.'],
      donts: ['Do not exceed 12 units across one row unless you add is-multiline.'],
    },
  },
];
