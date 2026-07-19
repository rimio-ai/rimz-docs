'use client';

import { useCallback, useState, type ReactNode } from 'react';

/** Copy-to-clipboard state shared by every copy affordance on the page. */
function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  }, []);

  return [copied, copy];
}

/** Single-line install pill used in the hero. */
export function CopyLine({ command, prompt = '$' }: { command: string; prompt?: string }) {
  const [copied, copy] = useCopy();

  return (
    <div className="copyline">
      <code>
        <span className="pmt">{prompt} </span>
        {command}
      </code>
      <button
        aria-label="Copy command"
        className={copied ? 'copybtn ok' : 'copybtn'}
        onClick={() => copy(command)}
        type="button"
      >
        {copied ? '[copied]' : '[copy]'}
      </button>
    </div>
  );
}

export type CodeToken = { text: string; kind?: 'cmd' | 'flag' | 'str' };
export type CodeLine = { tokens: CodeToken[]; comment?: string };

function renderTokens(tokens: CodeToken[]) {
  return tokens.map((token, index) => (
    <span className={token.kind ? `tok-${token.kind}` : undefined} key={index}>
      {token.text}
    </span>
  ));
}

/** Dark terminal panel with a copy button in its title bar. */
export function Terminal({
  title,
  lines,
  raw,
}: {
  title: string;
  lines: CodeLine[];
  raw: string;
}) {
  const [copied, copy] = useCopy();

  return (
    <div className="term">
      <div className="term-bar">
        <span aria-hidden="true" className="lights">
          <i />
          <i />
          <i />
        </span>
        <span className="title">{title}</span>
        <button
          aria-label="Copy commands"
          className={copied ? 'term-copy ok' : 'term-copy'}
          onClick={() => copy(raw)}
          type="button"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <div className="term-body">
        {lines.map((line, index) => (
          <div className="code-line" key={index}>
            <span className="cmd">{renderTokens(line.tokens)}</span>
            {line.comment ? <span className="cmt">{line.comment}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export type Scene = {
  id: string;
  label: string;
  lede: ReactNode;
  title: string;
  lines: CodeLine[];
  raw: string;
};

/** Tabbed terminal scenes for the everyday-moves section. */
export function SceneTabs({ scenes }: { scenes: Scene[] }) {
  const [active, setActive] = useState(scenes[0].id);
  const scene = scenes.find((item) => item.id === active) ?? scenes[0];

  return (
    <div>
      <div aria-label="Everyday moves" className="tabs" role="tablist">
        {scenes.map((item) => (
          <button
            aria-selected={item.id === scene.id}
            className="tab"
            key={item.id}
            onClick={() => setActive(item.id)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="lede">{scene.lede}</p>
      <Terminal lines={scene.lines} raw={scene.raw} title={scene.title} />
    </div>
  );
}

export type InstallMethod = {
  id: string;
  label: string;
  lines: string[];
};

/** Tabbed install methods rendered as a light card. */
export function InstallTabs({ methods }: { methods: InstallMethod[] }) {
  const [active, setActive] = useState(methods[0].id);
  const [copied, copy] = useCopy();
  const method = methods.find((item) => item.id === active) ?? methods[0];

  return (
    <div>
      <div aria-label="Install method" className="tabs" role="tablist">
        {methods.map((item) => (
          <button
            aria-selected={item.id === method.id}
            className="tab"
            key={item.id}
            onClick={() => setActive(item.id)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="install-block">
        <pre>
          {method.lines.map((line, index) => (
            <div key={index}>
              <span className="pmt">$ </span>
              {line}
            </div>
          ))}
        </pre>
        <button
          aria-label="Copy install command"
          className={copied ? 'copybtn ok' : 'copybtn'}
          onClick={() => copy(method.lines.join('\n'))}
          type="button"
        >
          {copied ? '[copied]' : '[copy]'}
        </button>
      </div>
    </div>
  );
}
