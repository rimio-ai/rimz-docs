import type { InstallMethod, Scene } from './interactive';

/**
 * Hero gallery. Every one of these is a window capture that ships with its own
 * rounded corners and drop shadow in the alpha channel, so they float on the
 * canvas rather than sitting in a frame. `shot` names a file inside the
 * versioned docs-asset directory.
 */
export const gallery: Array<{
  shot: string;
  alt: string;
  /** Not painted anywhere: the gallery's switcher is an unlabeled hairline, so
   *  this is the accessible name of that slide's control. */
  label: string;
  caption: string;
  width: number;
  height: number;
}> = [
  {
    shot: 'rimz-full.png',
    alt: 'A RimZ room in a Zellij session: a sidebar at left triages a fleet of coding agents, each a live card showing model, working state, token mix, and live dollar cost, while agents work in their own panes.',
    label: 'the room',
    caption: 'The sidebar triages the fleet on the left; agents work in their own panes.',
    width: 5344,
    height: 3044,
  },
  {
    shot: 'rimz-gallery.png',
    alt: 'The RimZ sidebar in detail: agent cards with model and effort, context health bars, token mix, live cost, and a provider dashboard tracking plan and budget windows.',
    label: 'the sidebar',
    caption: 'Working state, model and effort, context health, live cost, and the subagent tree.',
    width: 5344,
    height: 3044,
  },
];

/**
 * The case for RimZ, as plain grouped lists. Grouping by what the reader is
 * trying to do keeps twelve capabilities scannable where a flat list of twelve,
 * or a wall of twelve cards, would not be.
 */
export const featureGroups: Array<{
  title: string;
  items: Array<{ term: string; note: string }>;
}> = [
  {
    title: 'See the fleet',
    items: [
      {
        term: 'Attention, routed',
        note: 'The cockpit line reads the whole fleet, the column below arrives already triaged, and one click drops you into the pane that is waiting.',
      },
      {
        term: 'Live agent cards',
        note: 'Working state and current task, model and effort, context health and compactions, live token stats, and the subagent tree.',
      },
      {
        term: 'Know your pace',
        note: 'Spend and token insight by day, week, and month, with plan and budget-window bars for every provider that exposes them.',
      },
      {
        term: 'Extremely lightweight',
        note: 'A single binary that hooks the agents you already run, inside the Zellij or tmux you already use. Same keybinds, same terminal.',
      },
    ],
  },
  {
    title: 'Drive the work',
    items: [
      {
        term: 'Teams, cross-model',
        note: 'Pair a planner on one model with a coder on another and launch them as one team, each role on the model best at its job.',
      },
      {
        term: 'A worktree per agent',
        note: 'Open agents side by side in an isolated worktree with a dynamic layout: your editor, an agent, and a shell in one tab.',
      },
      {
        term: 'Handles and messages',
        note: 'Every agent answers to a handle. Park at the turn boundary, steer the live turn, or schedule for later; agents talk to each other.',
      },
      {
        term: 'Scriptable, end to end',
        note: 'One headless grammar for every agent, with exit codes, JSON output, streaming, and the full transcript kept for scripts and CI.',
      },
    ],
  },
  {
    title: 'Keep it running',
    items: [
      {
        term: 'Loops on a clock',
        note: 'Calendar, interval, cron, or a check-guarded watchdog that runs a command and wakes an agent on the result.',
      },
      {
        term: 'Auto-continue',
        note: 'A rate-limit pause resumes the moment the budget window resets, and transient overload retries on a backoff ramp.',
      },
      {
        term: 'Local or remote',
        note: 'Start on your laptop or a server, close the lid, and reattach from anywhere. The link heals itself every time you reconnect.',
      },
      {
        term: 'Steer from your phone',
        note: 'When an agent stops to ask, the question reaches the official Claude and ChatGPT mobile apps, and your answer lands in the session.',
      },
    ],
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
    id: 'curl',
    label: 'curl',
    command:
      'curl -fsSL https://raw.githubusercontent.com/rimio-ai/rimz/main/scripts/install.sh | sh',
    emphasis: 'rimio-ai/rimz',
  },
  {
    id: 'homebrew',
    label: 'homebrew',
    command: 'brew install rimio-ai/rimz/rimz',
    emphasis: 'rimio-ai/rimz/rimz',
  },
  { id: 'cargo', label: 'cargo', command: 'cargo install --locked rimz', emphasis: 'rimz' },
];
