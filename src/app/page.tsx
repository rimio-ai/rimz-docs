import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  appDescription,
  docsRoute,
  productGitHubUrl,
  siteUrl,
  withBasePath,
} from '@/lib/shared';

export const metadata: Metadata = {
  title: { absolute: 'RimZ: the open-source control room for coding agents' },
  description: appDescription,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'RimZ: the open-source control room for coding agents',
    description: appDescription,
    url: siteUrl,
    images: '/docs-assets/v0.3/rimz-full.png',
  },
};

/*
 * Landing page. Locked dark (the product is a dark terminal UI; every
 * screenshot is dark), independent of the docs theme toggle.
 *
 * Palette: page #0b0e14, surfaces white/[0.03], code panes #0d1117,
 * borders white/10, text zinc-100 over zinc-400. Single accent: sky-300.
 * Radius rule: interactive elements rounded-lg, panels and frames rounded-xl.
 */

const asset = (name: string) => withBasePath(`/docs-assets/v0.3/${name}`);

function Term({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <pre
      className={`overflow-x-auto rounded-lg border border-white/10 bg-[#0d1117] p-4 font-mono text-[13px] leading-6 text-zinc-300 ${className}`}
    >
      <code>{children}</code>
    </pre>
  );
}

function Prompt() {
  return <span className="select-none text-sky-300">$ </span>;
}

function Comment({ children }: { children: ReactNode }) {
  return <span className="text-zinc-500">{children}</span>;
}

const agentTiers: { label: string; tone: string; agents: string[] }[] = [
  {
    label: 'Supported',
    tone: 'border-sky-300/40 text-sky-300',
    agents: ['Claude Code', 'Codex'],
  },
  {
    label: 'Alpha',
    tone: 'border-white/20 text-zinc-200',
    agents: ['Pi', 'OpenCode'],
  },
  {
    label: 'Experimental',
    tone: 'border-white/10 text-zinc-400',
    agents: ['Amp', 'Copilot', 'Cursor', 'Droid', 'Antigravity', 'Kimi', 'Kiro', 'Qwen', 'Grok'],
  },
];

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);

  return (
    <main className="min-h-screen bg-[#0b0e14] text-zinc-100 antialiased">
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#0b0e14]/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link className="font-mono text-base font-semibold tracking-tight text-zinc-100" href="/">
            rimz
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link className="text-zinc-400 transition-colors hover:text-zinc-100" href={docsUrl}>
              Docs
            </Link>
            <a
              className="text-zinc-400 transition-colors hover:text-zinc-100"
              href={productGitHubUrl}
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero: copy only, left-aligned; the room screenshot follows full-width below. */}
      <section className="mx-auto max-w-[1200px] px-6 pb-14 pt-20 sm:pt-24">
        <h1 className="landing-rise max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          The control room for your coding agents.
        </h1>
        <p className="landing-rise landing-delay-1 mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Live cards for every agent, attention routed to whoever needs you, inside the tmux or
          Zellij you already run.
        </p>
        <div className="landing-rise landing-delay-2 mt-8 flex flex-wrap items-center gap-3">
          <Link
            className="rounded-lg bg-sky-300 px-5 py-2.5 text-sm font-medium text-[#0b0e14] transition-colors hover:bg-sky-200 active:translate-y-px"
            href={docsUrl}
          >
            Read the docs
          </Link>
          <a
            className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-white/30 active:translate-y-px"
            href={productGitHubUrl}
          >
            GitHub
          </a>
          <code className="hidden rounded-lg border border-white/10 bg-[#0d1117] px-4 py-2.5 font-mono text-[13px] text-zinc-300 sm:block">
            <Prompt />
            brew install rimio-ai/rimz/rimz
          </code>
        </div>
      </section>

      {/* The room, full width. */}
      <section className="landing-rise landing-delay-3 mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50">
          <Image
            alt="A RimZ room: the sidebar triaging a fleet of coding agents beside their panes"
            className="h-auto w-full"
            height="3044"
            priority
            src={asset('rimz-full.png')}
            width="5344"
          />
        </div>
        <p className="mt-3 text-center text-sm text-zinc-500">
          One room: the sidebar triages the fleet on the left, agents work in their own panes.
        </p>
      </section>

      {/* Sidebar split: tall screenshot beside the three things it gives you. */}
      <section className="mx-auto max-w-[1200px] px-6 pb-8 pt-24 sm:pt-32">
        <div className="landing-reveal grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pt-8">
            <h2 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              One glance reads the whole fleet.
            </h2>
            <p className="mt-4 max-w-md text-zinc-400">
              Agents report themselves through their own hooks and transcripts, and the sidebar
              fuses it into one live picture.
            </p>
            <dl className="mt-10 max-w-md space-y-8">
              <div className="border-l-2 border-sky-300/60 pl-5">
                <dt className="font-medium text-zinc-100">A live card per agent</dt>
                <dd className="mt-1.5 text-sm leading-6 text-zinc-400">
                  Working state and task, model and effort, context health, live token stats and
                  dollar cost, and the subagent tree.
                </dd>
              </div>
              <div className="border-l-2 border-sky-300/60 pl-5">
                <dt className="font-medium text-zinc-100">Attention, routed</dt>
                <dd className="mt-1.5 text-sm leading-6 text-zinc-400">
                  The cockpit line counts who is waiting, and the column below arrives already
                  triaged: whoever needs you sits on top.
                </dd>
              </div>
              <div className="border-l-2 border-sky-300/60 pl-5">
                <dt className="font-medium text-zinc-100">One click to the pane</dt>
                <dd className="mt-1.5 text-sm leading-6 text-zinc-400">
                  Jump straight into the agent&apos;s own UI, answer, and move on. RimZ never sits
                  between you and the stock CLI.
                </dd>
              </div>
            </dl>
          </div>
          <div className="relative max-h-[720px] overflow-hidden rounded-xl border border-white/10">
            <Image
              alt="The RimZ sidebar: worktree pods with per-agent cards showing state, context, and cost"
              className="h-auto w-full"
              height="2310"
              src={asset('rimz-sidebar.png')}
              width="1042"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0e14] to-transparent"
            />
          </div>
        </div>
      </section>

      {/* Command-grammar bento: 5 cells, 2+1 over 1+2. */}
      <section className="mx-auto max-w-[1200px] px-6 pt-24 sm:pt-28">
        <div className="landing-reveal">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Steer the fleet with one command grammar.
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Every agent answers to a handle. The same commands serve you, your scripts, and the
            agents themselves.
          </p>
        </div>
        <div className="landing-reveal mt-10 grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
            <h3 className="font-medium">Message agents like teammates</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Durable delivery that parks at the turn boundary, interrupts the live turn, or waits
              for the reply.
            </p>
            <Term className="mt-5">
              <Prompt />
              rimz message @claude &quot;add coverage for the expiry edge cases&quot;{'\n'}
              <Prompt />
              rimz message --steer @coder &quot;stop: the parser test comes first&quot;{'\n'}
              <Prompt />
              rimz message @coder --wait &quot;did the migration land? one line&quot;
            </Term>
          </article>
          <article className="rounded-xl border border-sky-300/20 bg-gradient-to-b from-sky-300/[0.08] to-transparent p-6">
            <h3 className="font-medium">Teams, cross-model by design</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              A planner, a coder, and a reviewer launch as one team, each role on the model best at
              its job. A mixed team catches what a single model lets through.
            </p>
            <Term className="mt-5">
              <Prompt />
              rimz agents forge -w feat-auth
            </Term>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="font-medium">A worktree per line of work</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              One spec lays out agents, editors, and shells in an isolated Git worktree.
            </p>
            <Term className="mt-5">
              <Prompt />
              rimz agents claude,codex -w feat-a{'\n'}
              <Prompt />
              rimz agents &apos;vim,codex+term&apos; -w feat-b
            </Term>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
            <h3 className="font-medium">Script it, then put it on a clock</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              One supervised turn with an exit code for scripts and CI, and scheduled loops that
              check first and spend a turn only when there is work.
            </p>
            <Term className="mt-5">
              <Prompt />
              rimz agents codex &quot;Prepare the release checklist.&quot; -p --timeout 30m{'\n'}
              <Prompt />
              rimz loop add watchdog --check &quot;cargo test&quot; --on fail \{'\n'}
              {'      '}--agent codex --prompt &quot;fix the failing test&quot; --every 15m
            </Term>
          </article>
        </div>
      </section>

      {/* Insight: stacked copy over the stats screenshot. */}
      <section className="mx-auto max-w-[1200px] px-6 pt-24 sm:pt-32">
        <div className="landing-reveal">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Know where the week is going.
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Tokens and dollars for today, the week, and the month, with plan and budget-window bars
            per provider. Dollar caps are enforced: an agent, a loop task, a room, or a whole
            provider login parks at its limit instead of quietly overspending.
          </p>
        </div>
        <div className="landing-reveal mx-auto mt-10 max-w-[1000px] overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50">
          <Image
            alt="rimz stats: a yearly token-activity heatmap with per-model and per-agent spend breakdowns"
            className="h-auto w-full"
            height="2008"
            src={asset('rimz-stats.png')}
            width="2512"
          />
        </div>
      </section>

      {/* Agent tier wall. */}
      <section className="mx-auto max-w-[1200px] px-6 pt-24 sm:pt-32">
        <div className="landing-reveal">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Your agents run stock.
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Type <code className="font-mono text-sm text-zinc-200">claude</code> or{' '}
            <code className="font-mono text-sm text-zinc-200">codex</code> into any pane and it
            joins the room. The official CLIs run untouched, with your flags and session files, and
            the web, desktop, and mobile apps keep working.
          </p>
        </div>
        <div className="landing-reveal mt-10 space-y-5">
          {agentTiers.map((tier) => (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline" key={tier.label}>
              <span className="w-32 shrink-0 text-sm font-medium text-zinc-500">{tier.label}</span>
              <ul className="flex flex-wrap gap-2">
                {tier.agents.map((agent) => (
                  <li
                    className={`rounded-lg border px-3.5 py-1.5 font-mono text-[13px] ${tier.tone}`}
                    key={agent}
                  >
                    {agent}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Install CTA: the one centered section on the page. */}
      <section className="mx-auto max-w-[1200px] px-6 pb-28 pt-24 sm:pt-32">
        <div className="landing-reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Open the room.</h2>
          <p className="mt-4 text-zinc-400">
            One lightweight binary. Hooks install on the first run, with your consent and a diff
            preview.
          </p>
          <Term className="mt-8 text-left">
            <Comment># install</Comment>
            {'\n'}
            <Prompt />
            brew install rimio-ai/rimz/rimz{'\n'}
            {'\n'}
            <Comment># open a room in your project</Comment>
            {'\n'}
            <Prompt />
            cd ~/code/your-project{'\n'}
            <Prompt />
            rimz
          </Term>
          <div className="mt-8 flex justify-center">
            <Link
              className="rounded-lg bg-sky-300 px-5 py-2.5 text-sm font-medium text-[#0b0e14] transition-colors hover:bg-sky-200 active:translate-y-px"
              href={docsUrl}
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center">
          <span className="font-mono text-zinc-400">rimz</span>
          <div className="flex items-center gap-6">
            <Link className="transition-colors hover:text-zinc-200" href={docsUrl}>
              Docs
            </Link>
            <a className="transition-colors hover:text-zinc-200" href={productGitHubUrl}>
              GitHub
            </a>
            <a
              className="transition-colors hover:text-zinc-200"
              href={`${productGitHubUrl}/blob/main/LICENSE`}
            >
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
