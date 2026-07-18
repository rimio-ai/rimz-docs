'use client';

import { useState } from 'react';

export function InstallLine({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard is best-effort; the command stays selectable either way.
    }
  }

  return (
    <div className="home-install-line">
      <span className="prompt" aria-hidden="true">
        $
      </span>
      <code>{command}</code>
      <button
        type="button"
        className={`home-copy${copied ? ' is-copied' : ''}`}
        onClick={copy}
        aria-label={copied ? 'Command copied' : 'Copy install command'}
      >
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  );
}
