import './landing.css';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import {
  appDescription,
  docsRoute,
  productGitHubUrl,
  siteUrl,
  withBasePath,
} from '@/lib/shared';
import { latestVersion } from '@/lib/versions';
import { CopyLine, InstallTabs, SceneTabs, Terminal } from '@/components/landing/interactive';
import {
  cellGlyph,
  features,
  installMethods,
  matrixColumnNotes,
  matrixColumns,
  matrixRows,
  scenes,
  statusCells,
  wordmarkArt,
} from '@/components/landing/content';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-rimz-mono',
  display: 'swap',
});

const title = 'RimZ — The control room for your coding agents';

export const metadata: Metadata = {
  title: { absolute: title },
  description: appDescription,
  alternates: { canonical: siteUrl },
  openGraph: {
    title,
    description: appDescription,
    url: siteUrl,
    images: `/docs-assets/${latestVersion.id}/rimz-full.png`,
  },
};

const heroShot = withBasePath(`/docs-assets/${latestVersion.id}/rimz-full.png`);
const galleryShot = withBasePath(`/docs-assets/${latestVersion.id}/rimz-gallery.png`);

const hooksLines = [
  {
    tokens: [
      { text: 'rimz', kind: 'cmd' as const },
      { text: ' hooks install ' },
      { text: '--dry-run', kind: 'flag' as const },
    ],
    comment: '# a unified diff; writes nothing',
  },
  {
    tokens: [
      { text: 'rimz', kind: 'cmd' as const },
      { text: ' hooks install' },
    ],
    comment: '# every agent found on the machine',
  },
  {
    tokens: [
      { text: 'rimz', kind: 'cmd' as const },
      { text: ' doctor' },
    ],
    comment: '# verify backend, hooks, room health',
  },
];

const hooksRaw = [
  'rimz hooks install --dry-run    # per-agent summary plus a unified diff; writes nothing',
  'rimz hooks install              # every agent detected on the machine',
  'rimz doctor                     # verify backend, hooks, and room health',
].join('\n');

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);
  const installUrl = withBasePath(`${docsRoute}/getting-started/installation/`);
  const agentSupportUrl = withBasePath(`${docsRoute}/reference/agent-support/`);

  return (
    <div className={`landing ${mono.variable}`}>
      <header className="nav">
        <div className="nav-inner">
          <Link className="wordmark" href="/">
            rimz
            <span aria-hidden="true" className="cursor" />
          </Link>
          <nav className="nav-right">
            <Link className="nav-link" href={docsUrl}>
              docs
            </Link>
            <span aria-hidden="true" className="sep">
              ·
            </span>
            <a className="nav-link" href={productGitHubUrl}>
              github
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ---------- hero ---------- */}
        <section className="hero wrap" id="top">
          <p className="eyebrow">
            <b>alpha</b> · moving fast, and built with RimZ on RimZ
          </p>
          <h1>The control room for your coding agents.</h1>
          <p className="sub">
            RimZ is a realtime dashboard for harnessing agentic coding: one human and tens of agents
            working together in one Zellij or tmux room, where everything about every agent reads at
            a glance.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CopyLine command="brew install rimio-ai/rimz/rimz" />
          </div>
          <div className="hero-cta">
            <a className="btn btn-primary" href={productGitHubUrl}>
              ★ Star on GitHub
            </a>
            <Link className="btn btn-secondary" href={docsUrl}>
              Read the docs →
            </Link>
          </div>

          <div className="shot-frame">
            <Image
              alt="A RimZ room in a Zellij session: a sidebar at left triages a fleet of coding agents, each a live card showing model, working state, token mix, and live dollar cost, while agents work in their own panes."
              className="shot"
              height={3044}
              priority
              src={heroShot}
              width={5344}
            />
            <p className="shot-cap">
              One room — the sidebar triages the fleet on the left, agents work in their own panes,
              and spend tracks below.
            </p>
          </div>
        </section>

        {/* ---------- works with ---------- */}
        <section className="section wrap">
          <div className="works">
            <span className="item">
              <span aria-hidden="true" className="tick">
                ✓
              </span>{' '}
              Claude Code
            </span>
            <span aria-hidden="true" className="dot">
              ·
            </span>
            <span className="item">
              <span aria-hidden="true" className="tick">
                ✓
              </span>{' '}
              Codex
            </span>
            <span aria-hidden="true" className="dot">
              ·
            </span>
            <span className="item">
              <span aria-hidden="true" className="tick alpha">
                ◐
              </span>{' '}
              Pi
            </span>
            <span aria-hidden="true" className="dot">
              ·
            </span>
            <span className="item">
              <span aria-hidden="true" className="tick alpha">
                ◐
              </span>{' '}
              OpenCode
            </span>
            <span aria-hidden="true" className="dot">
              ·
            </span>
            <a className="item rest" href="#agents">
              + 9 more, experimental
            </a>
          </div>
          <p className="works-sub">
            RimZ wraps the agents you already run. They run stock, with your flags and your config;
            the official command-line, web, desktop, and mobile apps all keep working.
          </p>
        </section>

        {/* ---------- 01 what it does ---------- */}
        <section className="section wrap">
          <h2 className="section-label">
            <span className="idx">01</span> What it does
          </h2>
          <div className="features">
            {features.map((feature) => (
              <article className="feature" key={feature.label}>
                <div className="label">{feature.label}</div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
          <div className="shot-frame">
            <Image
              alt="The RimZ sidebar in detail: agent cards with model and effort, context health bars, token mix, live cost, and a provider dashboard tracking plan and budget windows."
              className="shot"
              height={3044}
              src={galleryShot}
              width={5344}
            />
            <p className="shot-cap">
              Working state and task, model and effort, context health, live token stats and dollar
              cost, and the subagent tree — all at a glance.
            </p>
          </div>
        </section>

        {/* ---------- 02 how it works ---------- */}
        <section className="section wrap">
          <h2 className="section-label">
            <span className="idx">02</span> How it works
          </h2>
          <div className="layer term-layer">
            <span className="layer-label">
              <b>terminal</b> — ghostty · iterm2 · warp · kitty · vscode
            </span>
            <div className="layer mux-layer">
              <span className="layer-label">
                <b>zellij / tmux</b> — your keybinds, your layout
              </span>
              <div className="diagram">
                <div className="sources">
                  <div className="node">
                    <span className="tag">agents</span>
                    <h4>claude · codex · pi · opencode · …</h4>
                    <div className="meta">
                      hooks · transcripts (.jsonl) · oauth api
                      <br />
                      statusline · app-server · extensions
                    </div>
                  </div>
                  <div className="node">
                    <span className="tag">your repo &amp; box</span>
                    <h4>git status · /proc</h4>
                    <div className="meta">churn, diffs, process stats</div>
                  </div>
                </div>
                <div className="arrow">
                  <span aria-hidden="true" className="g">
                    →
                  </span>
                  <span className="cap">report</span>
                </div>
                <div className="node core">
                  <span className="tag">
                    <span aria-hidden="true" className="live-dot" />
                    engine
                  </span>
                  <h4>rimz</h4>
                  <div className="meta">fuses every channel into one live picture</div>
                </div>
                <div className="arrow">
                  <span aria-hidden="true" className="g">
                    →
                  </span>
                  <span className="cap">renders</span>
                </div>
                <div className="node">
                  <span className="tag">output</span>
                  <h4>sidebar</h4>
                  <div className="meta">the whole fleet, triaged &amp; live</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hiw-notes">
            <div className="row">
              <span aria-hidden="true" className="mk">
                [+]
              </span>
              <span>
                <b>Agents report themselves</b> — sessions, tool calls, live status, and blocking
                questions arrive the moment they happen, through each agent&rsquo;s own hooks,
                transcripts, and APIs.
              </span>
            </div>
            <div className="row">
              <span aria-hidden="true" className="mk">
                [+]
              </span>
              <span>
                <b>RimZ drives the panes</b> — messages, steering, and headless runs land as
                keystrokes in the agent&rsquo;s own pane, so every agent runs its stock CLI in a full
                terminal, exactly as if you typed.
              </span>
            </div>
            <div className="row">
              <span aria-hidden="true" className="mk">
                [+]
              </span>
              <span>
                <b>RimZ fuses every channel</b> — agent events, git churn, process stats, and account
                state combine into one live picture, and the sidebar renders it.
              </span>
            </div>
          </div>
        </section>

        {/* ---------- 03 everyday moves ---------- */}
        <section className="section wrap">
          <h2 className="section-label">
            <span className="idx">03</span> Everyday moves
          </h2>
          <p className="lede">
            These run from any pane in the room, and from any script or CI job that reaches it. They
            compose: a profile becomes a team, the team lands in a worktree, the worktree&rsquo;s
            agents take messages, and a schedule fires the whole thing while you sleep.
          </p>
          <SceneTabs scenes={scenes} />
        </section>

        {/* ---------- 04 install ---------- */}
        <section className="section wrap">
          <h2 className="section-label">
            <span className="idx">04</span> Install
          </h2>
          <InstallTabs methods={installMethods} />
          <p className="install-sub">
            Then open a room with <code>rimz</code> and launch agents as you always do. Hooks are how
            agents report to the room: the first run offers to install them with a diff preview, and
            the install is additive, so your existing hooks stay.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Terminal lines={hooksLines} raw={hooksRaw} title="~/code/query-engine" />
          </div>
          <p className="install-sub">
            <span className="ok">●</span> MIT licensed · Rust · Zellij or tmux runs the room ·{' '}
            <Link href={installUrl}>installation guide</Link>
          </p>
        </section>

        {/* ---------- 05 agents ---------- */}
        <section className="section wrap" id="agents">
          <h2 className="section-label">
            <span className="idx">05</span> Agent compatibility
          </h2>
          <p className="lede">
            <span className="em">Claude Code and Codex are the daily drivers</span> and give the best
            experience today. <span className="em">Pi and OpenCode are in alpha</span> — wired end to
            end and close behind. Every other agent is experimental: wired and tested against its
            documented surface, but not yet dogfooded enough, so expect the occasional bug. Any of
            them still mostly just works.
          </p>
          <div className="matrix-scroll">
            <table className="matrix">
              <thead>
                <tr>
                  <th className="agent" scope="col">
                    Agent
                  </th>
                  <th scope="col" style={{ textAlign: 'left' }}>
                    Status
                  </th>
                  {matrixColumns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row) => (
                  <tr className={`tier-${row.tier}`} key={row.agent}>
                    <td className="agent">{row.agent}</td>
                    <td className="status">
                      <span aria-hidden="true" className="pip">
                        ●
                      </span>
                      {row.status}
                    </td>
                    {row.cells.map((cell, index) => (
                      <td className={`cell ${cell}`} key={matrixColumns[index]}>
                        {cellGlyph[cell]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="matrix-legend">● full · ◐ partial · ✗ unsupported by the RimZ adapter</p>
          <ul className="matrix-cols">
            {matrixColumnNotes.map((note) => (
              <li key={note.term}>
                <b>{note.term}</b> — {note.note}
              </li>
            ))}
          </ul>
          <p className="install-sub">
            RimZ tracks each agent&rsquo;s most recent release; older CLI versions are not supported.
            Run <code>rimz coverage</code> to print the live grid on your own machine, with a reason
            on every cell · <Link href={agentSupportUrl}>per-agent detail</Link>
          </p>
        </section>

        {/* ---------- 06 project status ---------- */}
        <section className="section wrap">
          <h2 className="section-label">
            <span className="idx">06</span> Project status
          </h2>
          <div className="status-grid">
            {statusCells.map((cell) => (
              <article className="status-cell" key={cell.title}>
                <h3>{cell.title}</h3>
                <p>{cell.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot-cta">
          <h2>Run the room.</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href={productGitHubUrl}>
              ★ Star on GitHub
            </a>
            <Link className="btn btn-secondary" href={docsUrl}>
              Read the docs →
            </Link>
          </div>
        </div>
        <div className="foot-art">
          <pre aria-label="rimz">{wordmarkArt}</pre>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} RimZ · MIT</span>
          <span className="links">
            <a href={productGitHubUrl}>GitHub</a>
            <Link href={docsUrl}>Docs</Link>
            <a href={`${productGitHubUrl}/blob/main/LICENSE`}>License</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
