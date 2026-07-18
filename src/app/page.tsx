import './home.css';
import type { Metadata } from 'next';
import Image from 'next/image';
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import { InstallLine } from '@/components/home-install';
import {
  appDescription,
  docsRoute,
  productGitHubUrl,
  siteUrl,
  withBasePath,
} from '@/lib/shared';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--rimz-display',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--rimz-body',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--rimz-mono',
});

export const metadata: Metadata = {
  title: { absolute: 'RimZ — Open-source control room for coding agents' },
  description: appDescription,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'RimZ — Open-source control room for coding agents',
    description: appDescription,
    url: siteUrl,
    images: '/docs-assets/v0.3/rimz-full.png',
  },
};

const attentionPoints = [
  {
    role: 'wait',
    glyph: '?',
    title: 'Waiting rises first',
    body: 'A blocking question or a stalled turn sorts to the top of the sidebar, so the agent that needs a decision is never buried under the ones that do not.',
  },
  {
    role: 'run',
    glyph: '▶',
    title: 'Context stays visible',
    body: 'Task, model, effort, context health, tokens, live cost, and the subagent tree all read at a glance — without opening a single pane.',
  },
  {
    role: 'idle',
    glyph: '·',
    title: 'Your terminal stays yours',
    body: 'The official CLIs keep their sessions, UI, and keybindings. RimZ watches the room and routes it, and never sits between you and the agent.',
  },
];

const insightPoints = [
  {
    role: 'done',
    glyph: '✓',
    title: 'Spend, not guesswork',
    body: 'Live cost per agent and per turn, totalled across the fleet and grouped by model, so the monthly bill is never a surprise.',
  },
  {
    role: 'run',
    glyph: '▶',
    title: 'Budget windows, paced',
    body: 'The 5-hour and 7-day windows for providers that expose them, so you can read the week’s remaining capacity before you spend it.',
  },
];

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);
  const installGuideUrl = withBasePath(`${docsRoute}/getting-started/installation/`);

  return (
    <main className={`home-shell ${display.variable} ${body.variable} ${mono.variable}`}>
      <nav className="home-nav" aria-label="Primary">
        <Link className="home-wordmark" href="/" aria-label="RimZ home">
          <span className="spark" aria-hidden="true">
            ▚
          </span>
          rimz
        </Link>
        <div className="home-nav-links">
          <Link href={docsUrl}>docs</Link>
          <a href={productGitHubUrl}>github</a>
          <a className="home-nav-cta" href="#install">
            install
          </a>
        </div>
      </nav>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-eyebrow">
            <span className="dot" aria-hidden="true" />
            the control room for coding agents
          </p>
          <h1 id="home-title">
            Run tens of coding agents.{' '}
            <span className="accent">Steer the one that needs you.</span>
          </h1>
          <p className="home-hero-sub">
            RimZ is a realtime dashboard for agentic coding — one human and a fleet of agents in a
            single tmux or Zellij room. Every agent gets a live card, and the sidebar ranks them by
            who needs you and drops you straight into the right pane.
          </p>
          <div className="home-hero-actions">
            <Link className="home-btn home-btn-primary" href={docsUrl}>
              Read the docs{' '}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <a className="home-btn home-btn-ghost" href={productGitHubUrl}>
              View source
            </a>
          </div>
          <InstallLine command="brew install rimio-ai/rimz/rimz" />
        </div>

        <div
          className="home-console"
          role="img"
          aria-label="A RimZ sidebar ranking three agents on the auth-refresh channel. @planner is waiting on a question and marked as needing you; @coder is running; @reviewer is idle."
        >
          <div className="home-console-bar">
            <span className="lights" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="path">
              <b>rimz</b> ~/code/query-engine
            </span>
            <span className="right">remote 41ms</span>
          </div>

          <div className="home-cockpit">
            <span className="seg wait">
              <span className="k">?</span>
              <span className="n">2</span>
            </span>
            <span className="seg ask">
              <span className="k">!</span>
              <span className="n">1</span>
            </span>
            <span className="seg run">
              <span className="k">▶</span>
              <span className="n">5</span>
            </span>
            <span className="seg done">
              <span className="k">✓</span>
              <span className="n">12</span>
            </span>
            <span className="spend">$14.82</span>
          </div>

          <div className="home-console-list">
            <div className="home-group-label">
              <span className="branch">⑂ auth-refresh</span>
              <span>forge team</span>
              <span className="rule" />
              <span className="diff-add">+218</span>
              <span className="diff-del">−12</span>
            </div>

            <article className="home-card is-wait">
              <span className="rail" aria-hidden="true" />
              <div>
                <div className="home-card-top">
                  <span className="home-handle">@planner</span>
                  <span className="home-status">
                    <span className="glyph" aria-hidden="true">
                      ?
                    </span>
                    waiting
                  </span>
                  <span className="home-model">opus · high</span>
                  <span className="home-card-cost">$7.30</span>
                </div>
                <p className="home-card-task">which rotation strategy should we use?</p>
                <div className="home-card-meta">
                  <span className="home-bar" aria-hidden="true">
                    <i style={{ width: '42%' }} />
                  </span>
                  <span>78k</span>
                  <span className="home-card-age">2m</span>
                </div>
              </div>
              <span className="home-needs">
                <span className="ping" aria-hidden="true" />
                needs you
              </span>
            </article>

            <article className="home-card is-run">
              <span className="rail" aria-hidden="true" />
              <div>
                <div className="home-card-top">
                  <span className="home-handle">@coder</span>
                  <span className="home-status">
                    <span className="glyph" aria-hidden="true">
                      ▶
                    </span>
                    running
                  </span>
                  <span className="home-model">gpt-5.5 · xhigh</span>
                  <span className="home-card-cost">$6.04</span>
                </div>
                <p className="home-card-task">wire up the refresh-token path</p>
                <div className="home-card-meta">
                  <span className="home-bar" aria-hidden="true">
                    <i style={{ width: '31%' }} />
                  </span>
                  <span>54k</span>
                  <span className="home-card-age">0s</span>
                </div>
              </div>
            </article>

            <article className="home-card is-idle">
              <span className="rail" aria-hidden="true" />
              <div>
                <div className="home-card-top">
                  <span className="home-handle">@reviewer</span>
                  <span className="home-status">idle</span>
                  <span className="home-model">opus · high</span>
                  <span className="home-card-cost">$2.18</span>
                </div>
                <p className="home-card-task">review the diff once coder lands</p>
                <div className="home-card-meta">
                  <span className="home-bar" aria-hidden="true">
                    <i style={{ width: '8%' }} />
                  </span>
                  <span>12k</span>
                  <span className="home-card-age">15m</span>
                </div>
              </div>
            </article>
          </div>

          <div className="home-console-foot">
            <span className="cmd">
              $ rimz agents focus <b>@planner</b>
            </span>
            <span className="go" aria-hidden="true">
              ↵
            </span>
          </div>
        </div>
      </section>

      <div className="home-proof">
        <ul>
          <li>
            <b>One Rust binary</b>
          </li>
          <li>Stock agent CLIs</li>
          <li>tmux &amp; Zellij</li>
          <li>Local &amp; remote</li>
          <li>
            <b>MIT licensed</b>
          </li>
        </ul>
      </div>

      <section className="home-section home-reveal" aria-labelledby="attention-title">
        <div className="home-split">
          <div>
            <p className="home-section-eyebrow wait">
              <span className="tag" aria-hidden="true" />
              attention, routed
            </p>
            <h2 id="attention-title">The room routes your attention.</h2>
            <p className="home-section-lead">
              RimZ ranks the fleet by who needs you now — a blocking question, a stalled turn, a
              finished run — then one command drops you into that agent’s own pane.
            </p>
            <div className="home-points">
              {attentionPoints.map((point) => (
                <div className={`home-point ${point.role}`} key={point.title}>
                  <span className="glyph" aria-hidden="true">
                    {point.glyph}
                  </span>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <figure className="home-split-figure">
            <div className="home-shot">
              <Image
                alt="The RimZ sidebar ranking agents by fleet status, task, context use, spend, and provider budget windows"
                height={2310}
                sizes="(max-width: 899px) 90vw, 420px"
                src={withBasePath('/docs-assets/main/rimz-sidebar.png')}
                width={1042}
              />
            </div>
            <figcaption className="home-shot-cap">The sidebar, triaging a live fleet</figcaption>
          </figure>
        </div>
      </section>

      <section className="home-section home-reveal" aria-labelledby="grammar-title">
        <p className="home-section-eyebrow accent">
          <span className="tag" aria-hidden="true" />
          one command grammar
        </p>
        <h2 id="grammar-title">One grammar runs the whole fleet.</h2>
        <p className="home-section-lead">
          Every agent answers to a handle. The same commands launch a cross-model team, steer a live
          turn, script a headless run, or put the next turn on a clock — for you, your scripts, and
          the agents themselves.
        </p>

        <div className="home-grammar">
          <div className="home-grammar-bar">
            <span className="lights" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>rimz — the room, from any pane</span>
          </div>
          <pre className="home-grammar-body">
            <div className="row">
              <span className="prompt">$ </span>
              <span className="cmd">rimz agents</span>
              <span className="arg"> claude:planner,codex:coder</span>
              <span className="flag"> -w</span>
              <span className="arg"> feat-auth</span>
              <span className="note">{'   '}# a cross-model team, isolated in a worktree</span>
            </div>
            <div className="row">
              <span className="prompt">$ </span>
              <span className="cmd">rimz message</span>
              <span className="flag"> --steer</span>
              <span className="handle"> @coder</span>
              <span className="arg"> &quot;rebase on main first&quot;</span>
              <span className="note">{'   '}# interrupt the live turn now</span>
            </div>
            <div className="row">
              <span className="prompt">$ </span>
              <span className="cmd">rimz agents</span>
              <span className="arg"> codex &quot;prep the release notes&quot;</span>
              <span className="flag"> -p</span>
              <span className="note">{'   '}# one supervised, exit-coded run</span>
            </div>
            <div className="row">
              <span className="prompt">$ </span>
              <span className="cmd">rimz loop add</span>
              <span className="arg"> nightly</span>
              <span className="flag"> --agent</span>
              <span className="arg"> claude</span>
              <span className="flag"> --every</span>
              <span className="arg"> day</span>
              <span className="flag"> --at</span>
              <span className="arg"> 02:00</span>
              <span className="note">{'   '}# triage bugs, open PRs</span>
            </div>
          </pre>
        </div>
      </section>

      <section className="home-section home-reveal" aria-labelledby="insight-title">
        <div className="home-split flip">
          <div>
            <p className="home-section-eyebrow done">
              <span className="tag" aria-hidden="true" />
              token &amp; dollar insight
            </p>
            <h2 id="insight-title">See where the week went.</h2>
            <p className="home-section-lead">
              Token and dollar insight for every model and agent, by day, week, and month — with the
              provider budget windows that pace a subscription.
            </p>
            <div className="home-points">
              {insightPoints.map((point) => (
                <div className={`home-point ${point.role}`} key={point.title}>
                  <span className="glyph" aria-hidden="true">
                    {point.glyph}
                  </span>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <figure className="home-split-figure">
            <div className="home-shot">
              <Image
                alt="The rimz stats view showing token activity and spend grouped by model, agent, and time period"
                height={2008}
                sizes="(max-width: 899px) 90vw, 560px"
                src={withBasePath('/docs-assets/main/rimz-stats.png')}
                width={2512}
              />
            </div>
            <figcaption className="home-shot-cap">
              Token and spend history from <code>rimz stats</code>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="home-cta home-reveal" id="install" aria-labelledby="install-title">
        <div className="home-cta-inner">
          <div>
            <h2 id="install-title">One binary, then the CLIs you already run.</h2>
            <p>
              Install RimZ inside your tmux or Zellij. Approve the reporting hooks once, type{' '}
              <code>claude</code> or <code>codex</code>, and the room lights up. Your sessions,
              keybindings, and the official apps stay exactly where they are.
            </p>
          </div>
          <div className="home-cta-side">
            <InstallLine command="curl -fsSL https://rimz.rimio.ai/install.sh | sh" />
            <Link className="home-textlink" href={installGuideUrl}>
              Full installation guide{' '}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-inner">
          <p>RimZ — open source under the MIT license.</p>
          <div className="home-footer-links">
            <Link href={docsUrl}>Documentation</Link>
            <a href={productGitHubUrl}>GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
