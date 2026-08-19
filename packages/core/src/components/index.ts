import type { ComponentCategory, ComponentDef } from '../types.js';
import { CATEGORY_ORDER } from '../types.js';
import { ELEMENTS } from './elements.js';
import { FORM } from './form.js';
import { COMPONENTS } from './components.js';
import { LAYOUT } from './layout.js';
import { EXTENSIONS } from './extensions.js';

/** Every component the design system covers, in display order. */
export const ALL_COMPONENTS: ComponentDef[] = [
  ...ELEMENTS,
  ...FORM,
  ...COMPONENTS,
  ...LAYOUT,
  ...EXTENSIONS,
];

export const COMPONENT_BY_ID = new Map(ALL_COMPONENTS.map((c) => [c.id, c]));

export function componentsByCategory(): { category: ComponentCategory; items: ComponentDef[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: ALL_COMPONENTS.filter((c) => c.category === category),
  })).filter((g) => g.items.length > 0);
}

export { ELEMENTS, FORM, COMPONENTS, LAYOUT, EXTENSIONS };
