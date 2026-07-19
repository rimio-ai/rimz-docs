import './landing.css';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Geist, JetBrains_Mono } from 'next/font/google';
import {
  appDescription,
  docsRoute,
  productGitHubUrl,
  siteUrl,
  withBasePath,
} from '@/lib/shared';
import { latestVersion } from '@/lib/versions';
import { InstallTabs, SceneTabs } from '@/components/landing/interactive';
import {
  agentTiers,
  capabilities,
  installMethods,
  scenes,
  showcase,
  statusNotice,
} from '@/components/landing/content';

const sans = Geist({
  subsets: ['latin'],
  variable: '--font-rimz-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-rimz-mono',
  display: 'swap',
});

const title = 'RimZ: the control room for your coding agents';

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

const assetBase = `/docs-assets/${latestVersion.id}`;
const heroShot = withBasePath(`${assetBase}/rimz-full.png`);

const hookSteps: Array<{ command: string; note: string }> = [
  { command: 'rimz hooks install --dry-run', note: 'a unified diff, writes nothing' },
  { command: 'rimz hooks install', note: 'every agent found on the machine' },
  { command: 'rimz doctor', note: 'verify backend, hooks, and room health' },
];

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);
  const installUrl = withBasePath(`${docsRoute}/getting-started/installation/`);
  const agentSupportUrl = withBasePath(`${docsRoute}/reference/agent-support/`);
  const fleetUrl = withBasePath(`${docsRoute}/agents/fleet/`);

  return (
    <div className={`landing ${sans.variable} ${mono.variable}`}>
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
            <a className="nav-link" href={productGitHubUrl}>
              github
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ---------- hero ---------- */}
        <section className="hero wrap" id="top">
          <h1>The control room for your coding agents.</h1>
          <p className="sub">
            One human, tens of coding agents, one Zellij or tmux room. Every agent reads at a
            glance.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href={productGitHubUrl}>
              ★ Star on GitHub
            </a>
            <Link className="btn btn-secondary" href={docsUrl}>
              Read the docs →
            </Link>
          </div>

          <figure className="shot-frame reveal">
            <Image
              alt="A RimZ room in a Zellij session: a sidebar at left triages a fleet of coding agents, each a live card showing model, working state, token mix, and live dollar cost, while agents work in their own panes."
              className="shot"
              height={3044}
              priority
              src={heroShot}
              width={5344}
            />
            <figcaption className="shot-cap">
              The sidebar triages the fleet on the left, agents work in their own panes, and spend
              tracks below.
            </figcaption>
          </figure>
        </section>

        {/* ---------- works with ---------- */}
        <section className="section section-tight wrap">
          <div className="works">
            <span className="item">
              <span aria-hidden="true" className="tick">
                ✓
              </span>{' '}
              Claude Code
            </span>
            <span className="item">
              <span aria-hidden="true" className="tick">
                ✓
              </span>{' '}
              Codex
            </span>
            <span className="item">
              <span aria-hidden="true" className="tick alpha">
                ◐
              </span>{' '}
              Pi
            </span>
            <span className="item">
              <span aria-hidden="true" className="tick alpha">
                ◐
              </span>{' '}
              OpenCode
            </span>
            <a className="item rest" href="#agents">
              + 9 more
            </a>
          </div>
          <p className="works-sub">
            RimZ wraps the agents you already run. They run stock, with your flags and your config;
            the official command-line, web, desktop, and mobile apps all keep working.
          </p>
        </section>

        {/* ---------- what it does ---------- */}
        <section className="section wrap">
          <h2 className="section-label">What it does</h2>

          <div className="showcase">
            {showcase.map((item) => (
              <article className={item.tall ? 'show-row tall reveal' : 'show-row reveal'} key={item.title}>
                <div className="show-copy">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
                <div className="show-shot">
                  <Image
                    alt={item.alt}
                    className="shot"
                    height={item.height}
                    src={withBasePath(`${assetBase}/${item.shot}`)}
                    width={item.width}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="caps">
            {capabilities.map((item) => (
              <article className="cap-row" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <p className="more">
            Worktrees, agent-to-agent messaging, headless scripting, auto-continue, and phone
            control are all covered in <Link href={fleetUrl}>the fleet guide</Link>.
          </p>
        </section>

        {/* ---------- how it works ---------- */}
        <section className="section wrap">
          <h2 className="section-label">How it works</h2>
          <div className="layer term-layer">
            <span className="layer-label">
              <b>terminal</b>: ghostty, iterm2, warp, kitty, vscode
            </span>
            <div className="layer mux-layer">
              <span className="layer-label">
                <b>zellij or tmux</b>: your keybinds, your layout
              </span>
              <div className="diagram">
                <div className="sources">
                  <div className="node">
                    <span className="tag">agents</span>
                    <h4>claude, codex, pi</h4>
                    <div className="meta">
                      hooks, transcripts, oauth
                      <br />
                      statusline, extensions
                    </div>
                  </div>
                  <div className="node">
                    <span className="tag">your repo and box</span>
                    <h4>git status, /proc</h4>
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
                  <span className="tag">engine</span>
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
                  <div className="meta">the whole fleet, triaged and live</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hiw-notes">
            <div className="row">
              <span>
                <b>Agents report themselves.</b>{' '}
                Sessions, tool calls, live status, and blocking questions arrive the moment they
                happen, through each agent&rsquo;s own hooks, transcripts, and APIs.
              </span>
            </div>
            <div className="row">
              <span>
                <b>RimZ drives the panes.</b>{' '}
                Messages, steering, and headless runs land as keystrokes in the agent&rsquo;s own
                pane, so every agent runs its stock CLI in a full terminal, exactly as if you typed.
              </span>
            </div>
            <div className="row">
              <span>
                <b>RimZ fuses every channel.</b>{' '}
                Agent events, git churn, process stats, and account state combine into one live
                picture, and the sidebar renders it.
              </span>
            </div>
          </div>
        </section>

        {/* ---------- everyday moves ---------- */}
        <section className="section wrap">
          <h2 className="section-label">Everyday moves</h2>
          <p className="lede">
            These run from any pane in the room, and from any script or CI job that reaches it. They
            compose: a profile becomes a team, the team lands in a worktree, the worktree&rsquo;s
            agents take messages, and a schedule fires the whole thing while you sleep.
          </p>
          <SceneTabs scenes={scenes} />
        </section>

        {/* ---------- install ---------- */}
        <section className="section wrap">
          <h2 className="section-label">Install</h2>
          <div className="install-split">
            <div className="install-main">
              <InstallTabs methods={installMethods} />
              <p className="install-sub">
                MIT licensed, written in Rust, and it runs the room on Zellij or tmux.{' '}
                <Link href={installUrl}>Installation guide</Link>
              </p>
            </div>
            <div className="install-hooks">
              <h3>Then let the agents report in</h3>
              <p>
                Hooks are how agents reach the room. The first run offers to install them with a
                diff preview, and the install is additive, so your existing hooks stay.
              </p>
              <ul className="steps">
                {hookSteps.map((step) => (
                  <li key={step.command}>
                    <code>{step.command}</code>
                    <span>{step.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- agents ---------- */}
        <section className="section wrap" id="agents">
          <h2 className="section-label">Agent support</h2>
          <div className="tiers">
            {agentTiers.map((tier) => (
              <article className="tier" key={tier.tier}>
                <div className="tier-head">
                  <h3>{tier.tier}</h3>
                  <ul className="tier-agents">
                    {tier.agents.map((agent) => (
                      <li key={agent}>{agent}</li>
                    ))}
                  </ul>
                </div>
                <p>{tier.note}</p>
              </article>
            ))}
          </div>
          <p className="install-sub">
            RimZ tracks each agent&rsquo;s most recent release; older CLI versions are not supported.
            Run <code>rimz coverage</code> to print the live capability grid on your own machine, or
            read the <Link href={agentSupportUrl}>per-agent detail</Link>.
          </p>
        </section>

        {/* ---------- release-stage notice ---------- */}
        <section className="section-tight wrap">
          <aside className="notice">
            <p>
              <b>{statusNotice.title}</b> {statusNotice.body}
            </p>
          </aside>
        </section>
      </main>

      <footer className="foot">
        <div className="foot-cta">
          <h2>Run the room.</h2>
          <div className="foot-buttons">
            <a className="btn btn-primary" href={productGitHubUrl}>
              ★ Star on GitHub
            </a>
            <Link className="btn btn-secondary" href={docsUrl}>
              Read the docs →
            </Link>
          </div>
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
