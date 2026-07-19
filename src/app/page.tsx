import './landing.css';

import type { Metadata } from 'next';
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
  caption: item.caption,
  width: item.width,
  height: item.height,
}));

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);
  const installUrl = withBasePath(`${docsRoute}/getting-started/installation/`);
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
            Realtime dashboard for harnessing agentic coding: one human and tens of agents working
            together in one Zellij or tmux room, where everything about every agent reads at a
            glance.
          </p>

          <div className="hero-install">
            <InstallTabs methods={installMethods} />
            <p className="hero-install-sub">
              MIT licensed, written in Rust, and it runs the room on Zellij or tmux.{' '}
              <Link href={installUrl}>Installation guide</Link>
            </p>
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
          <ul className="agent-marks">
            {agentMarks.map(({ name, tier, Mark }) => (
              <li className={`agent-mark ${tier}`} key={name}>
                <Mark className="agent-glyph" />
                <span className="agent-name">{name}</span>
              </li>
            ))}
          </ul>
          <p className="works-sub">
            RimZ wraps the agents you already run. They run stock, with your flags and your config;
            the official command-line, web, desktop, and mobile apps all keep working. Claude Code
            and Codex are the supported daily drivers, Pi and OpenCode are alpha, and the rest are
            experimental: <Link href={agentSupportUrl}>per-agent detail</Link>.
          </p>
        </section>

        {/* ---------- why rimz ---------- */}
        <section className="section wrap">
          <h2 className="section-label">Why RimZ?</h2>

          <div className="fgroups">
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

          <div className="section-cta">
            <Link className="btn btn-secondary" href={docsUrl}>
              Read the documentation →
            </Link>
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
