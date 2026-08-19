import { useEffect, useState } from 'react';
import type { ExportResult } from './api';

/**
 * Shown after a successful export.
 *
 * This is the handoff moment — the point where the design system stops being a thing in a
 * browser tab and becomes files in the user's repo. A toast would scroll away before they
 * could act on it, so this stays until dismissed and gives them the three things they need
 * next: where the files went, the exact lines to paste, and the path to hand their LLM.
 */
export function ExportPanel({ result, onClose }: { result: ExportResult; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="df-overlay" onClick={onClose} role="presentation">
      <div
        className="df-export"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Export complete"
      >
        <div className="df-export-head">
          <h2>
            Exported to <code>{result.relativeOutDir}/</code>
          </h2>
          <button type="button" className="df-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="df-export-meta">
          {result.files.length} files · {(result.bytes / 1024).toFixed(0)} kB
        </p>

        <Section title={`Add to ${result.snippet.file}`} code={result.snippet.code} />

        <Section
          title="Then point your coding agent at the docs"
          code={`Follow ${result.docsPath} exactly: use only the documented\nclasses, never hardcode colours or spacing, and do not add\nanother CSS framework.`}
        />

        <details className="df-export-files">
          <summary>{result.files.length} files written</summary>
          <ul>
            {result.files.map((f) => (
              <li key={f}>
                <code>{f}</code>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}

function Section({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the text is selectable either way.
    }
  };

  return (
    <div className="df-export-section">
      <div className="df-export-section-head">
        <span>{title}</span>
        <button type="button" className="df-copy" onClick={() => void copy()}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
