import type { InstallMethod, Scene } from './interactive';

/** The "what it does" grid, tracking the feature list in the RimZ README. */
export const features: Array<{ label: string; title: string; body: string }> = [
  {
    label: 'lightweight',
    title: 'Extremely lightweight.',
    body: 'A single binary that hooks the agents you already run, inside the Zellij or tmux you already use: same keybinds, same terminal, zero learning curve.',
  },
  {
    label: 'dashboard',
    title: 'Realtime harness dashboard.',
    body: 'Working state and task, model and effort, context health and compactions, live token stats and dollar cost, and the subagent tree.',
  },
  {
    label: 'attention',
    title: 'Attention, routed.',
    body: 'One glance at the cockpit line reads the whole fleet, the column below arrives already triaged, and one click drops you into the pane that is waiting.',
  },
  {
    label: 'spend',
    title: 'Know your pace.',
    body: 'Spending and token insight for today, week, and month, with plan and 5h/7d budget bars for providers that expose those account surfaces.',
  },
  {
    label: 'worktrees',
    title: 'A worktree for every agent.',
    body: 'Open agents together, side by side in an isolated worktree with a dynamic layout: your editor, an agent, and a shell in one tab.',
  },
  {
    label: 'teams',
    title: 'Teams, cross-model by design.',
    body: 'Pair a planner on one model with a coder on another and launch them as one team, each role on the model best at its job.',
  },
  {
    label: 'messages',
    title: 'Agents chat as in Slack.',
    body: 'Every agent answers to a handle. Steer and queue delivery guarantees the message lands, and agents talk to each other inside channels.',
  },
  {
    label: 'scripting',
    title: 'Scriptable, end to end.',
    body: 'One headless grammar for every agent, with exit codes, JSON output, streaming, and the full transcript kept, so agents drop into scripts and CI.',
  },
  {
    label: 'loops',
    title: 'Loops, yours to engineer.',
    body: 'Schedule supervised runs on a clock — calendar, interval, cron, or a check-guarded watchdog that runs a command and wakes an agent on the result.',
  },
  {
    label: 'recovery',
    title: 'Auto-continue while you are away.',
    body: 'A rate-limit pause resumes the moment the budget window resets, and transient API overload retries on a backoff ramp. Agents recover themselves.',
  },
  {
    label: 'phone',
    title: 'Steer the fleet from your phone.',
    body: 'When an agent stops to ask, the question reaches the official Claude and ChatGPT mobile apps; your answer lands in the same terminal session.',
  },
  {
    label: 'anywhere',
    title: 'Local or remote, continuously.',
    body: 'Start on your laptop or a server, close the lid, and reattach from anywhere; the link heals itself every time you reconnect.',
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
        modes, reusable profiles, layouts, and isolated worktrees — <code>,</code> splits,{' '}
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

type Cell = 'full' | 'partial' | 'none';
type Tier = 'supported' | 'alpha' | 'experimental';

export type MatrixRow = {
  agent: string;
  tier: Tier;
  status: string;
  cells: Cell[];
};

export const matrixColumns = ['State', 'Live', 'History', 'Account', 'Ask', 'Subagents'];

export const matrixRows: MatrixRow[] = [
  { agent: 'Claude Code', tier: 'supported', status: 'Supported', cells: ['full', 'full', 'full', 'full', 'full', 'full'] },
  { agent: 'Codex', tier: 'supported', status: 'Supported', cells: ['full', 'full', 'full', 'full', 'full', 'full'] },
  { agent: 'Pi', tier: 'alpha', status: 'Alpha', cells: ['full', 'full', 'full', 'full', 'full', 'full'] },
  { agent: 'OpenCode', tier: 'alpha', status: 'Alpha', cells: ['full', 'full', 'full', 'full', 'full', 'full'] },
  { agent: 'Antigravity', tier: 'experimental', status: 'Experimental', cells: ['partial', 'partial', 'partial', 'full', 'partial', 'partial'] },
  { agent: 'Copilot', tier: 'experimental', status: 'Experimental', cells: ['full', 'partial', 'partial', 'partial', 'full', 'none'] },
  { agent: 'Droid', tier: 'experimental', status: 'Experimental', cells: ['full', 'partial', 'partial', 'none', 'partial', 'none'] },
  { agent: 'Cursor', tier: 'experimental', status: 'Experimental', cells: ['full', 'partial', 'partial', 'partial', 'partial', 'full'] },
  { agent: 'Amp', tier: 'experimental', status: 'Experimental', cells: ['full', 'partial', 'full', 'partial', 'full', 'none'] },
  { agent: 'Kiro', tier: 'experimental', status: 'Experimental', cells: ['full', 'partial', 'partial', 'none', 'partial', 'none'] },
  { agent: 'Qwen', tier: 'experimental', status: 'Experimental', cells: ['full', 'partial', 'full', 'partial', 'full', 'full'] },
  { agent: 'Kimi', tier: 'experimental', status: 'Experimental', cells: ['full', 'full', 'full', 'full', 'full', 'partial'] },
  { agent: 'Grok', tier: 'experimental', status: 'Experimental', cells: ['full', 'partial', 'full', 'partial', 'full', 'full'] },
];

export const cellGlyph: Record<Cell, string> = { full: '●', partial: '◐', none: '✗' };

export const matrixColumnNotes: Array<{ term: string; note: string }> = [
  { term: 'State', note: 'live working / idle / waiting' },
  { term: 'Live', note: 'realtime context health and cost' },
  { term: 'History', note: 'full session read and per-turn spend' },
  { term: 'Account', note: 'login, plan, and rate-limit windows' },
  { term: 'Ask', note: 'blocking prompts routed to your keyboard' },
  { term: 'Subagents', note: 'the child-agent tree' },
];

export const statusCells: Array<{ title: string; body: string }> = [
  {
    title: 'Alpha, moving fast',
    body: 'Expect rough edges and the occasional bug, and expect the surface to shift: commands, flags, config keys, and output formats can change between releases while the design settles.',
  },
  {
    title: 'Built with RimZ, on RimZ',
    body: 'The fleet behind the repository routinely runs 50–100 concurrent agents across 10–30 parallel worktrees and pull requests, and a single room stays responsive with 100+ agents from multiple providers at once.',
  },
  {
    title: 'Ready for daily use',
    body: 'Ready for personal, daily use today. For production workflows that need a stable interface, wait for the 1.0 release.',
  },
  {
    title: 'Zero configuration',
    body: 'RimZ runs with no configuration at all, and everything you can tune is plain TOML in files you own: no config daemon, no bespoke language.',
  },
];

export const wordmarkArt = `  ██████╗ ██╗███╗   ███╗  ███████╗
  ██╔══██╗██║████╗ ████║  ╚══███╔╝
  ██████╔╝██║██╔████╔██║    ███╔╝
  ██╔══██╗██║██║╚██╔╝██║   ███╔╝
  ██║  ██║██║██║ ╚═╝ ██║  ███████╗
  ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝  ╚══════╝`;
