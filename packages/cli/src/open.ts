/**
 * Open a URL in the default browser.
 *
 * This is the entire reason the `open` package usually gets installed; at ten lines it isn't
 * worth a dependency in a package that otherwise has none.
 */

import { spawn } from 'node:child_process';

export function openBrowser(url: string): void {
  const [command, args] =
    process.platform === 'win32'
      ? // The empty string is the window title `start` expects; without it a quoted URL is
        // swallowed as the title and nothing opens.
        ['cmd', ['/c', 'start', '', url]]
      : process.platform === 'darwin'
        ? ['open', [url]]
        : ['xdg-open', [url]];

  try {
    const child = spawn(command, args, { detached: true, stdio: 'ignore' });
    // Failing to open a browser is a convenience problem, not a fatal one — the URL is
    // already printed to the terminal.
    child.on('error', () => {});
    child.unref();
  } catch {
    // Same reasoning: never let this take the server down.
  }
}
