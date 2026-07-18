import type { Metadata } from 'next';
import Image from 'next/image';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { CommandDeck, InstallCommand } from '@/components/home-command-deck';
import {
  appDescription,
  docsRoute,
  productGitHubUrl,
  siteUrl,
  withBasePath,
} from '@/lib/shared';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-rimz-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-rimz-mono',
});

export const metadata: Metadata = {
  title: { absolute: 'RimZ | Open-source control room for coding agents' },
  description: appDescription,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'RimZ | Open-source control room for coding agents',
    description: appDescription,
    url: siteUrl,
    images: '/landing/rimz-room.webp',
  },
};

const attentionPrinciples = [
  {
    title: 'Waiting moves first',
    body: 'Blocking questions rise to the top. One focus command takes you straight to the pane that needs an answer.',
  },
  {
    title: 'Context stays visible',
    body: 'Task, model, effort, context health, tokens, cost, and subagents stay readable without opening every pane.',
  },
  {
    title: 'Your terminal stays yours',
    body: 'Official agent CLIs keep their sessions, UI, and keybindings. RimZ observes and routes the room around them.',
  },
];

const automationPrinciples = [
  {
    title: 'Start with clean context',
    body: 'Scheduled agent turns open in fresh supervised panes and leave a durable run record behind.',
  },
  {
    title: 'Wake the session you have',
    body: 'Hand work back to a running agent later, with the conversation and its decisions still in scope.',
  },
  {
    title: 'Check before spending',
    body: 'Run a deterministic command first. The agent wakes only when the result needs judgment or repair.',
  },
  {
    title: 'Verify before success',
    body: 'Use the command that defines done to re-prompt the same session until the work is actually green.',
  },
];

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);
  const installGuideUrl = withBasePath(`${docsRoute}/getting-started/installation/`);

  return (
    <main className={`${geist.variable} ${geistMono.variable} home-shell`}>
      <header className="home-nav-wrap">
        <nav className="home-nav" aria-label="Primary navigation">
          <Link className="home-wordmark" href="/" aria-label="RimZ home">
            RimZ
          </Link>
          <div className="home-nav-links">
            <Link href={docsUrl}>Documentation</Link>
            <a href={productGitHubUrl}>GitHub</a>
          </div>
        </nav>
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-kicker">Open source control for tmux and Zellij</p>
          <h1 id="home-title">Every agent. One room.</h1>
          <p className="home-hero-summary">
            See every coding agent, route each decision, and keep work moving inside the terminal you already use.
          </p>
          <div className="home-hero-actions">
            <a className="home-button home-button-primary" href="#install">
              Install RimZ
            </a>
            <Link className="home-button home-button-secondary" href={docsUrl}>
              Documentation
            </Link>
          </div>
        </div>

        <figure className="home-shot-frame home-hero-shot">
          <Image
            alt="A RimZ room with a triaged agent sidebar beside active Claude Code and Codex panes"
            className="home-shot"
            height={1368}
            priority
            sizes="(max-width: 767px) 92vw, (max-width: 1200px) 58vw, 820px"
            src={withBasePath('/landing/rimz-room.webp')}
            width={2400}
          />
        </figure>
      </section>

      <section className="home-proof" aria-label="RimZ product facts">
        <dl>
          <div>
            <dt>footprint</dt>
            <dd>One Rust binary</dd>
          </div>
          <div>
            <dt>agents</dt>
            <dd>Stock provider CLIs</dd>
          </div>
          <div>
            <dt>backends</dt>
            <dd>tmux and Zellij</dd>
          </div>
          <div>
            <dt>reach</dt>
            <dd>Local and remote</dd>
          </div>
        </dl>
      </section>

      <section className="home-section home-attention home-reveal" aria-labelledby="attention-title">
        <div className="home-attention-copy">
          <h2 id="attention-title">The room routes your attention.</h2>
          <p className="home-section-summary">
            RimZ ranks the fleet by what needs you now, then takes you directly to the agent&apos;s own pane.
          </p>

          <div className="home-principles">
            {attentionPrinciples.map((principle) => (
              <article key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>

        <figure className="home-shot-frame home-sidebar-shot">
          <Image
            alt="The RimZ sidebar showing fleet status, agent work, context use, spend, and provider budget windows"
            className="home-shot"
            height={1684}
            sizes="(max-width: 767px) 86vw, 430px"
            src={withBasePath('/landing/rimz-sidebar.webp')}
            width={760}
          />
        </figure>
      </section>

      <section className="home-command-section home-reveal" aria-labelledby="grammar-title">
        <div className="home-section-heading">
          <h2 id="grammar-title">One grammar runs the whole room.</h2>
          <p>
            Launch a team, park a message, supervise a run, or put the next turn on a clock.
          </p>
        </div>
        <CommandDeck />
      </section>

      <section className="home-automation home-reveal" aria-labelledby="automation-title">
        <div className="home-automation-inner">
          <div className="home-automation-lead">
            <h2 id="automation-title">The room keeps time, not a daemon.</h2>
            <p>
              Schedule fresh turns, wake existing sessions, guard work with checks, and verify the result before a task passes.
            </p>
          </div>

          <div className="home-automation-grid">
            {automationPrinciples.map((principle) => (
              <article key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-insight home-reveal" aria-labelledby="insight-title">
        <div className="home-section-heading">
          <h2 id="insight-title">See where the week went.</h2>
          <p>Track tokens and spend by model, agent, day, week, month, and year.</p>
        </div>

        <figure className="home-stats-figure">
          <div className="home-shot-frame">
            <Image
              alt="The rimz stats view with token activity and spend grouped by model and agent"
              className="home-shot"
              height={1279}
              sizes="(max-width: 767px) 92vw, 1060px"
              src={withBasePath('/landing/rimz-stats.webp')}
              width={1600}
            />
          </div>
          <figcaption>Token and spend history from <code>rimz stats</code>.</figcaption>
        </figure>
      </section>

      <section className="home-install home-reveal" id="install" aria-labelledby="install-title">
        <div className="home-install-inner">
          <div>
            <h2 id="install-title">One binary, then your own CLIs.</h2>
            <p>
              Hooks report the agent. RimZ watches the room. Your sessions and keybindings stay where they are.
            </p>
          </div>

          <div className="home-install-action">
            <InstallCommand />
            <Link className="home-text-link" href={installGuideUrl}>
              Installation guide <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>RimZ is open source under the MIT license.</p>
        <div>
          <Link href={docsUrl}>Documentation</Link>
          <a href={productGitHubUrl}>GitHub</a>
        </div>
      </footer>
    </main>
  );
}
