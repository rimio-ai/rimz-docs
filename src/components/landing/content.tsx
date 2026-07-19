import type { InstallMethod, Scene } from './interactive';

/**
 * The three features that carry the pitch, each paired with a detail crop.
 * `shot` names a file inside the versioned docs-asset directory.
 */
export const showcase: Array<{
  title: string;
  body: string;
  shot: string;
  alt: string;
  width: number;
  height: number;
  tall?: boolean;
}> = [
  {
    title: 'Attention, routed.',
    body: 'One glance at the cockpit line reads the whole fleet. The column below arrives already triaged, and one click drops you into the pane that is waiting on you.',
    shot: 'rimz-sidebar.png',
    alt: 'The RimZ sidebar triaging a fleet of agents, each card showing model, working state, context health, and live cost.',
    width: 1042,
    height: 2310,
    tall: true,
  },
  {
    title: 'Every agent, read at a glance.',
    body: 'Working state and current task, model and effort, context health and compactions, live token stats and dollar cost, and the subagent tree.',
    shot: 'rimz-card.png',
    alt: 'A single RimZ agent card in detail, showing model and effort, a context health bar, token mix, and running cost.',
    width: 1236,
    height: 574,
  },
  {
    title: 'Know your pace.',
    body: 'Spending and token insight for today, this week, and this month, with plan and budget-window bars for every provider that exposes them.',
    shot: 'rimz-stats.png',
    alt: 'The RimZ spend dashboard, showing token and dollar totals over time alongside plan and rate-limit budget bars.',
    width: 2512,
    height: 2008,
  },
];

/** Supporting capabilities, rendered as a divided list rather than a card wall. */
export const capabilities: Array<{ title: string; body: string }> = [
  {
    title: 'Teams, cross-model by design',
    body: 'Pair a planner on one model with a coder on another and launch them as one team, each role on the model best at its job, in an isolated worktree.',
  },
  {
    title: 'Loops, yours to engineer',
    body: 'Schedule supervised runs on a clock: calendar, interval, cron, or a check-guarded watchdog that runs a command and wakes an agent on the result.',
  },
  {
    title: 'Local or remote, continuously',
    body: 'Start on your laptop or a server, close the lid, and reattach from anywhere. The link heals itself every time you reconnect.',
  },
];

/** Tabbed terminal scenes for the everyday-moves section. */
export const scenes: Scene[] = [
  {
    id: 'start',
    label: 'start agents',
    title: '~/code/query-engine',
    lede: (
      <>
        Every supported agent joins the room the same way: type its own command into any pane. When
        you want more than the default, <span className="em">rimz agents</span> adds permission
        modes, reusable profiles, layouts, and isolated worktrees: <code>,</code> splits,{' '}
        <code>+</code> tiles, <code>/</code> stacks.
      </>
    ),
    lines: [
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' agents claude' },
        ],
        comment: '# stock agent, own pane',
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' agents codex-yolo' },
        ],
        comment: '# modes: -auto, -ask, -plan, -yolo',
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' agents claude,codex ' },
          { text: '-w feat-a', kind: 'flag' },
        ],
        comment: '# two agents, side by side',
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: " agents 'vim,codex+term' " },
          { text: '-w feat-c', kind: 'flag' },
        ],
        comment: '# editor | agent tiled over a shell',
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' agents forge ' },
          { text: '-w feat-complex', kind: 'flag' },
        ],
        comment: '# a team: planner, coder, reviewer',
      },
    ],
    raw: [
      'rimz agents claude              # stock agent, own pane',
      'rimz agents codex-yolo          # permission modes: -auto, -ask, -plan, -yolo',
      'rimz agents claude,codex -w feat-a          # two agents, side by side',
      "rimz agents 'vim,codex+term' -w feat-c      # editor | agent tiled over a shell",
      'rimz agents forge -w feat-complex           # a team: planner, coder, reviewer',
    ].join('\n'),
  },
  {
    id: 'steer',
    label: 'steer the fleet',
    title: '~/code/query-engine',
    lede: (
      <>
        Every agent answers to a <span className="em">handle</span>, named by kind, profile, or team
        role. Every message becomes a durable record, so it lands: parked at the turn boundary by
        default, <code>--steer</code> to interrupt the live turn now, <code>--schedule</code> to
        deliver later.
      </>
    ),
    lines: [
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' message @claude ' },
          { text: '"add coverage for the expiry edge cases"', kind: 'str' },
        ],
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' message ' },
          { text: '--steer', kind: 'flag' },
          { text: ' @codex ' },
          { text: '"stop: the parser test comes first"', kind: 'str' },
        ],
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' message @coder ' },
          { text: '--wait', kind: 'flag' },
          { text: ' ' },
          { text: '"did the migration land? one line"', kind: 'str' },
        ],
      },
      {
        tokens: [
          { text: 'git diff main | ' },
          { text: 'rimz', kind: 'cmd' },
          { text: ' message @reviewer ' },
          { text: '--stdin', kind: 'flag' },
          { text: ' ' },
          { text: '"review this"', kind: 'str' },
        ],
      },
    ],
    raw: [
      'rimz message @claude "add coverage for the expiry edge cases"',
      'rimz message --steer @codex "stop: the parser test comes first"',
      'rimz message @coder --wait "did the migration land? one line"',
      'git diff main | rimz message @reviewer --stdin "review this"',
    ].join('\n'),
  },
  {
    id: 'automate',
    label: 'automate the routine',
    title: '~/code/query-engine',
    lede: (
      <>
        A supervised <span className="em">headless turn</span> gives a script or CI job one exit code
        to branch on, and swapping the provider behind a pipeline is a one-word change. Schedules
        fire the same turns on a clock, guarded by a check that decides whether the agent wakes at
        all.
      </>
    ),
    lines: [
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' agents codex ' },
          { text: '"Prepare the release checklist."', kind: 'str' },
          { text: ' ' },
          { text: '-p --output-format json', kind: 'flag' },
        ],
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' agents claude ' },
          { text: '"Run the migration audit."', kind: 'str' },
          { text: ' ' },
          { text: '-p --bg', kind: 'flag' },
        ],
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' agents wait swift-otter ' },
          { text: '--stream', kind: 'flag' },
        ],
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' loop add watchdog ' },
          { text: '--check', kind: 'flag' },
          { text: ' ' },
          { text: '"cargo test"', kind: 'str' },
          { text: ' ' },
          { text: '--on fail', kind: 'flag' },
          { text: '\n    ' },
          { text: '--agent codex --prompt', kind: 'flag' },
          { text: ' ' },
          { text: '"fix the failing test"', kind: 'str' },
          { text: ' ' },
          { text: '--every 15m', kind: 'flag' },
        ],
      },
    ],
    raw: [
      'rimz agents codex "Prepare the release checklist." -p --output-format json',
      'rimz agents claude "Run the migration audit." -p --bg',
      'rimz agents wait swift-otter --stream',
      'rimz loop add watchdog --check "cargo test" --on fail \\',
      '    --agent codex --prompt "fix the failing test" --every 15m',
    ].join('\n'),
  },
  {
    id: 'away',
    label: 'step away',
    title: '~/code/query-engine',
    lede: (
      <>
        A room is plain Zellij or tmux under SSH. Close the laptop mid-run, reattach from another
        machine, and every agent is where you left it. When one stops to ask, two toggles route the
        question to the <span className="em">providers&rsquo; own mobile apps</span> and your answer
        back into the same session.
      </>
    ),
    lines: [
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' remote add dev dev-box:~/code/query-engine' },
        ],
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' remote connect dev' },
        ],
        comment: '# every agent where you left it',
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' remote connect dev ' },
          { text: '--web', kind: 'flag' },
        ],
        comment: '# the same room in your browser',
      },
      {
        tokens: [
          { text: 'rimz', kind: 'cmd' },
          { text: ' config set remote_control.claude true' },
        ],
        comment: '# answer asks from your phone',
      },
    ],
    raw: [
      'rimz remote add dev dev-box:~/code/query-engine',
      'rimz remote connect dev          # the room rebuilds, every agent where you left it',
      'rimz remote connect dev --web    # the same room in your browser at 127.0.0.1',
      'rimz config set remote_control.claude true    # answer asks from your phone',
    ].join('\n'),
  },
];

export const installMethods: InstallMethod[] = [
  {
    id: 'script',
    label: 'install script',
    lines: ['curl -fsSL https://raw.githubusercontent.com/rimio-ai/rimz/main/scripts/install.sh | sh'],
  },
  { id: 'homebrew', label: 'homebrew', lines: ['brew install rimio-ai/rimz/rimz'] },
  { id: 'cargo', label: 'cargo', lines: ['cargo install --locked rimz'] },
];

/**
 * Agent support, grouped by tier. The full per-capability grid lives in the
 * docs; reproducing it here buries the two agents that matter most.
 */
export const agentTiers: Array<{ tier: string; agents: string[]; note: string }> = [
  {
    tier: 'Supported',
    agents: ['Claude Code', 'Codex'],
    note: 'The daily drivers, and the best experience today. Every surface is wired: live state, context health, cost and history, account windows, blocking asks, and the subagent tree.',
  },
  {
    tier: 'Alpha',
    agents: ['Pi', 'OpenCode'],
    note: 'Wired end to end and close behind, with less mileage on them so far.',
  },
  {
    tier: 'Experimental',
    agents: [
      'Antigravity',
      'Copilot',
      'Droid',
      'Cursor',
      'Amp',
      'Kiro',
      'Qwen',
      'Kimi',
      'Grok',
    ],
    note: 'Wired and tested against each documented surface, but not yet dogfooded enough to promote. Expect the occasional bug. Any of them still mostly just works.',
  },
];

/**
 * Release-stage caveat. Honest, but it is not a reason to adopt RimZ, so it
 * reads as a closing footnote rather than a headline or a section of its own.
 */
export const statusNotice = {
  title: 'Alpha, and dogfooded hard.',
  body: 'The fleet behind the repository runs 50 to 100 concurrent agents across 10 to 30 worktrees daily, so RimZ is ready for personal use today. Commands, flags, and output formats can still change between releases; wait for 1.0 if you need a stable interface.',
};
