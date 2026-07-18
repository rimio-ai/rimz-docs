'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type CopyState = 'idle' | 'copying' | 'copied' | 'error';

type CommandExample = {
  key: string;
  label: string;
  summary: string;
  command: string;
};

const commandExamples: CommandExample[] = [
  {
    key: 'launch',
    label: 'Launch',
    summary: 'Give each role a handle and open the whole line of work in an isolated worktree.',
    command: 'rimz agents claude:planner,codex:coder -w auth-refresh',
  },
  {
    key: 'message',
    label: 'Message',
    summary: 'Park the handoff until the planner finishes, then deliver it to the coder at a clean turn boundary.',
    command: 'rimz message @coder --after @planner "read plan.md and start"',
  },
  {
    key: 'supervise',
    label: 'Supervise',
    summary: 'Run one observable turn, verify the result, and return an exit code that a script can trust.',
    command:
      'rimz agents codex "Fix the failing auth test." -p \\\n  --verify "cargo xtask test auth"',
  },
  {
    key: 'schedule',
    label: 'Schedule',
    summary: 'Run the cheap check first. Wake an agent only when the test suite needs repair.',
    command:
      'rimz loop add watchdog --check "cargo test" --on fail \\\n  --agent codex --prompt "fix the failing test" --every 15m',
  },
];

function useClipboard() {
  const [state, setState] = useState<CopyState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copy(value: string) {
    setState('copying');

    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
      resetTimer.current = setTimeout(() => setState('idle'), 1800);
    } catch {
      setState('error');
    }
  }

  function reset() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setState('idle');
  }

  return { state, copy, reset };
}

function copyLabel(state: CopyState) {
  switch (state) {
    case 'copying':
      return 'Copying';
    case 'copied':
      return 'Copied';
    case 'error':
      return 'Copy manually';
    default:
      return 'Copy';
  }
}

export function CommandDeck() {
  const [activeKey, setActiveKey] = useState(commandExamples[0].key);
  const selected = useMemo(
    () => commandExamples.find((example) => example.key === activeKey) ?? commandExamples[0],
    [activeKey],
  );
  const { state, copy, reset } = useClipboard();

  return (
    <div className="home-command-deck">
      <div className="home-command-tabs" role="tablist" aria-label="RimZ command examples">
        {commandExamples.map((example) => (
          <button
            aria-controls={`command-panel-${example.key}`}
            aria-selected={example.key === selected.key}
            id={`command-tab-${example.key}`}
            key={example.key}
            onClick={() => {
              reset();
              setActiveKey(example.key);
            }}
            role="tab"
            type="button"
          >
            {example.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`command-tab-${selected.key}`}
        className="home-command-panel"
        id={`command-panel-${selected.key}`}
        key={selected.key}
        role="tabpanel"
      >
        <p>{selected.summary}</p>
        <div className="home-code-block">
          <pre tabIndex={0}>
            <code>{selected.command}</code>
          </pre>
          <button
            data-state={state}
            disabled={state === 'copying'}
            onClick={() => copy(selected.command)}
            type="button"
          >
            {copyLabel(state)}
          </button>
        </div>
        <p className="home-copy-status" aria-live="polite">
          {state === 'error' ? 'Clipboard access failed. Select the command to copy it.' : ''}
        </p>
      </div>
    </div>
  );
}

const installCommand = 'brew install rimio-ai/rimz/rimz';

export function InstallCommand() {
  const { state, copy } = useClipboard();

  return (
    <div>
      <div className="home-install-command">
        <code>{installCommand}</code>
        <button
          data-state={state}
          disabled={state === 'copying'}
          onClick={() => copy(installCommand)}
          type="button"
        >
          {copyLabel(state)}
        </button>
      </div>
      <p className="home-copy-status" aria-live="polite">
        {state === 'error' ? 'Clipboard access failed. Select the command to copy it.' : ''}
      </p>
    </div>
  );
}
