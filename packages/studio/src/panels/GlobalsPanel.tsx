import { useState } from 'react';
import { GLOBAL_GROUPS, globalValue, isGlobalOverridden } from '@design-forge/core';
import { Control } from '../controls/Control';
import { useStudio } from '../store';

export function GlobalsPanel() {
  const theme = useStudio((s) => s.theme);
  const updateGlobal = useStudio((s) => s.updateGlobal);
  const clearGlobal = useStudio((s) => s.clearGlobal);

  // Colour and radius are what people reach for first, so those open by default.
  const [open, setOpen] = useState<Record<string, boolean>>({
    brand: true,
    radius: true,
  });

  return (
    <div className="df-panel">
      {GLOBAL_GROUPS.map((group) => {
        const changed = group.controls.filter((c) => isGlobalOverridden(theme, c.id)).length;
        const isOpen = open[group.id] ?? false;
        return (
          <section key={group.id} className="df-group">
            <button
              type="button"
              className="df-group-head"
              aria-expanded={isOpen}
              onClick={() => setOpen((o) => ({ ...o, [group.id]: !isOpen }))}
            >
              <span className={`df-chevron${isOpen ? ' is-open' : ''}`} aria-hidden="true" />
              <span className="df-group-title">{group.label}</span>
              {changed > 0 ? <span className="df-count">{changed}</span> : null}
            </button>

            {isOpen ? (
              <div className="df-group-body">
                {group.description ? <p className="df-group-desc">{group.description}</p> : null}
                {group.controls.map((control) => (
                  <Control
                    key={control.id}
                    control={control}
                    value={globalValue(theme, control.id)}
                    overridden={isGlobalOverridden(theme, control.id)}
                    inheritedFrom="default"
                    onChange={(v) => updateGlobal(control.id, v)}
                    onReset={() => clearGlobal(control.id)}
                  />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
