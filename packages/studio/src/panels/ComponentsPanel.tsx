import {
  ALL_COMPONENTS,
  CATEGORY_ORDER,
  componentValue,
  inheritedValue,
  isComponentOverridden,
  type ComponentDef,
} from '@design-forge/core';
import { Control } from '../controls/Control';
import { componentById, useStudio } from '../store';

export function ComponentsPanel() {
  const selectedId = useStudio((s) => s.selectedComponentId);
  const selected = componentById(selectedId);
  return selected ? <ComponentEditor component={selected} /> : <ComponentList />;
}

function ComponentList() {
  const theme = useStudio((s) => s.theme);
  const search = useStudio((s) => s.search);
  const setSearch = useStudio((s) => s.setSearch);
  const select = useStudio((s) => s.selectComponent);

  const q = search.trim().toLowerCase();
  const match = (c: ComponentDef) =>
    !q || c.name.toLowerCase().includes(q) || c.id.includes(q) || c.category.toLowerCase().includes(q);

  const total = ALL_COMPONENTS.filter(match).length;

  return (
    <div className="df-panel">
      <div className="df-search-wrap">
        <input
          className="df-input df-search"
          type="search"
          placeholder="Search components…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {total === 0 ? <p className="df-empty">No components match “{search}”.</p> : null}

      {CATEGORY_ORDER.map((cat) => {
        const items = ALL_COMPONENTS.filter((c) => c.category === cat && match(c));
        if (!items.length) return null;
        return (
          <section key={cat} className="df-group">
            <p className="df-cat-title">{cat}</p>
            <ul className="df-list">
              {items.map((c) => {
                const n = Object.keys(theme.components[c.id] ?? {}).length;
                return (
                  <li key={c.id}>
                    <button type="button" className="df-list-item" onClick={() => select(c.id)}>
                      <span className="df-list-name">
                        {c.name}
                        {c.extension ? <span className="df-ext">ext</span> : null}
                      </span>
                      {n > 0 ? <span className="df-count">{n}</span> : null}
                      {c.controls.length === 0 ? (
                        <span className="df-nocontrols" title="Follows global tokens only">
                          global
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ComponentEditor({ component }: { component: ComponentDef }) {
  const theme = useStudio((s) => s.theme);
  const select = useStudio((s) => s.selectComponent);
  const update = useStudio((s) => s.updateComponent);
  const clear = useStudio((s) => s.clearComponent);
  const clearAll = useStudio((s) => s.clearComponentAll);

  const overrideCount = Object.keys(theme.components[component.id] ?? {}).length;

  return (
    <div className="df-panel">
      <div className="df-back-row">
        <button type="button" className="df-back" onClick={() => select(null)}>
          ← All components
        </button>
        {overrideCount > 0 ? (
          <button type="button" className="df-reset" onClick={() => clearAll(component.id)}>
            ⟲ reset all ({overrideCount})
          </button>
        ) : null}
      </div>

      <div className="df-comp-head">
        <h2 className="df-comp-title">
          {component.name}
          {component.extension ? <span className="df-ext">ext</span> : null}
        </h2>
        <p className="df-comp-desc">{component.description}</p>
        <code className="df-var">{component.selector.replace(/\n/g, ' ')}</code>
      </div>

      {component.controls.length === 0 ? (
        <p className="df-empty">
          This component has no tokens of its own — it follows the global tokens. Change its
          appearance from the <strong>Globals</strong> tab.
        </p>
      ) : (
        <div className="df-group-body">
          {component.controls.map((control) => {
            const overridden = isComponentOverridden(theme, component.id, control.id);
            const value = overridden
              ? (componentValue(theme, component.id, control.id) as string)
              : inheritedValue(theme, component, control.id);
            return (
              <Control
                key={control.id}
                control={control}
                value={value}
                overridden={overridden}
                inheritedFrom={control.inheritsFrom ? `global · ${control.inheritsFrom}` : 'Bulma default'}
                onChange={(v) => update(component.id, control.id, v)}
                onReset={() => clear(component.id, control.id)}
              />
            );
          })}
        </div>
      )}

      <details className="df-docs">
        <summary>Classes &amp; guidance</summary>
        <ul className="df-classlist">
          {component.docs.classes.map((c) => (
            <li key={c.name}>
              <code>{c.name}</code>
              <span>{c.description}</span>
            </li>
          ))}
        </ul>
        {component.docs.dos.length ? (
          <>
            <p className="df-do-title">Do</p>
            <ul className="df-dolist">
              {component.docs.dos.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </>
        ) : null}
        {component.docs.donts.length ? (
          <>
            <p className="df-do-title is-dont">Do not</p>
            <ul className="df-dolist">
              {component.docs.donts.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </>
        ) : null}
      </details>
    </div>
  );
}
