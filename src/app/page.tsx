import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  appDescription,
  docsRoute,
  productGitHubUrl,
  siteUrl,
  withBasePath,
} from '@/lib/shared';

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

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link className="text-xl font-semibold tracking-tight" href="/">
          RimZ
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link className="text-muted-foreground transition-colors hover:text-foreground" href={docsUrl}>
            Documentation
          </Link>
          <a
            className="text-muted-foreground transition-colors hover:text-foreground"
            href={productGitHubUrl}
          >
            GitHub
          </a>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24">
        <div>
          <p className="mb-5 text-sm font-medium text-muted-foreground">
            Open source · Rust · tmux + Zellij
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Run and steer a fleet of coding agents from your terminal.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            RimZ is a realtime dashboard and control room for agentic coding. See every Claude Code,
            Codex, and supported agent at a glance, route your attention to the ones that need you,
            and keep the fleet moving inside the tmux or Zellij workflow you already use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background"
              href={docsUrl}
            >
              Read the documentation
            </Link>
            <a
              className="rounded-lg border px-5 py-3 text-sm font-medium"
              href={productGitHubUrl}
            >
              View on GitHub
            </a>
          </div>
          <pre className="mt-8 max-w-xl overflow-x-auto rounded-xl border bg-card p-4 text-left text-sm"><code>brew install rimio-ai/rimz/rimz{`\n`}rimz</code></pre>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/10">
          <Image
            alt="RimZ dashboard showing a fleet of coding agents running in terminal panes"
            className="h-auto w-full"
            height="1080"
            src={withBasePath('/docs-assets/v0.3/rimz-full.png')}
            width="1920"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 md:grid-cols-3">
        <article className="rounded-xl border p-6">
          <h2 className="font-semibold">One live fleet view</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Track agent state, task, context health, tokens, cost, and subagents without opening every
            pane.
          </p>
        </article>
        <article className="rounded-xl border p-6">
          <h2 className="font-semibold">Steer without context switching</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Route messages, answers, and scheduled work to agents while their stock command-line tools
            keep running.
          </p>
        </article>
        <article className="rounded-xl border p-6">
          <h2 className="font-semibold">Local, remote, and scriptable</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Reattach over SSH, supervise headless runs, and build loops or CI workflows around one RimZ
            command grammar.
          </p>
        </article>
      </section>
    </main>
  );
}
