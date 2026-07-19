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
import { Gallery, InstallTabs, SceneTabs } from '@/components/landing/interactive';
import { agentMarks } from '@/components/landing/agent-logos';
import {
  featureGroups,
  gallery,
  installMethods,
  scenes,
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
const heading = 'The control room for your coding agents';

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

const slides = gallery.map((item) => ({
  src: withBasePath(`${assetBase}/${item.shot}`),
  alt: item.alt,
  label: item.label,
  caption: item.caption,
  width: item.width,
  height: item.height,
}));

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);
  const agentSupportUrl = withBasePath(`${docsRoute}/reference/agent-support/`);

  return (
    <div className={`landing ${sans.variable} ${mono.variable}`}>
      <header className="nav">
        <div className="nav-inner">
          <Link className="wordmark" href="/">
            RimZ
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
          <h1>{heading}</h1>
          <p className="sub">
            Tens of coding agents in one Zellij or tmux room, with state, task, context health, and
            live cost at a glance.
          </p>

          <div className="hero-install">
            <InstallTabs methods={installMethods} />
          </div>

          <div className="shot-frame">
            <Gallery slides={slides} />
          </div>
        </section>

        {/* ---------- supported agents ----------
            Vendor marks only, all one ink. A row of thirteen brand palettes
            would shout louder than anything RimZ has to say, and the point of
            the strip is recognition, not decoration. */}
        <section className="section section-tight wrap" id="agents">
          <ul className="agent-marks reveal">
            {agentMarks.map(({ name, tier, Mark }) => (
              <li className={`agent-mark ${tier}`} key={name}>
                <Mark className="agent-glyph" />
                <span className="agent-name">{name}</span>
              </li>
            ))}
          </ul>
          <p className="works-sub">
            The agents you already run, stock: your flags, your config, and the official apps keep
            working. Claude Code and Codex are the daily drivers; the lighter marks are alpha or
            experimental. <Link href={agentSupportUrl}>Per-agent detail</Link>
          </p>
        </section>

        {/* ---------- why rimz ----------
            The header is a split on purpose: the right column carries the one
            capture on the page that is fully legible at rendered size, so the
            section opens with proof instead of another wall of claims. */}
        <section className="section wrap">
          <div className="why-head reveal">
            <div className="why-intro">
              <h2 className="section-label">Why RimZ?</h2>
              <p className="why-lede">
                One lightweight binary inside the terminal you already use, and the whole fleet
                reads at a glance.
              </p>
            </div>
            <figure className="why-card">
              <Image
                alt="A single RimZ agent card: working state, task, model and effort, context health bar, token counts, live dollar cost, and the subagent tree."
                className="why-card-shot"
                height={574}
                src={withBasePath(`${assetBase}/rimz-card.png`)}
                width={1236}
              />
              <figcaption>An agent card, up close.</figcaption>
            </figure>
          </div>

          <div className="fgroups reveal">
            {featureGroups.map((group) => (
              <section className="fgroup" key={group.title}>
                <h3>{group.title}</h3>
                <dl className="fitems">
                  {group.items.map((item) => (
                    <div className="fitem" key={item.term}>
                      <dt>{item.term}</dt>
                      <dd>{item.note}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </section>

        {/* ---------- everyday moves ----------
            The command column is narrower than the container on purpose: a
            shell line reads worse the wider it gets, and the aligned trailing
            comments stop scanning once the gap grows past a few words. */}
        <section className="section wrap">
          <h2 className="section-label">Everyday moves</h2>
          <div className="moves-body reveal">
            <p className="lede">
              These run from any pane in the room, and from any script or CI job that reaches it.
              They compose: a profile becomes a team, the team lands in a worktree, the
              worktree&rsquo;s agents take messages, and a schedule fires the whole thing while you
              sleep.
            </p>
            <SceneTabs scenes={scenes} />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot-cta">
          <h2>Run the room.</h2>
          <p className="foot-proof">
            RimZ is built with RimZ: the fleet behind the repository routinely runs 50 to 100
            concurrent agents across parallel worktrees.
          </p>
          <div className="foot-buttons">
            <Link className="btn btn-primary" href={docsUrl}>
              Read the docs →
            </Link>
            <a className="btn btn-secondary" href={productGitHubUrl}>
              ★ Star on GitHub
            </a>
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
