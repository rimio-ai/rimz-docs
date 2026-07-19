'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

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

export type Slide = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

const ADVANCE_MS = 6500;

/**
 * Hero gallery. Advances on its own so the page shows more than one view
 * without demanding a click, but stops for good the moment the reader takes
 * manual control, and never starts under `prefers-reduced-motion`.
 */
export function Gallery({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (engaged || hovered || reduced.current) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), ADVANCE_MS);
    return () => clearInterval(timer);
  }, [engaged, hovered, slides.length]);

  const go = useCallback(
    (next: number) => {
      setEngaged(true);
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length],
  );

  return (
    <div
      aria-roledescription="carousel"
      className="gallery"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false);
      }}
      onFocus={() => setHovered(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="group"
    >
      <div className="gallery-viewport">
        <div className="gallery-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, position) => (
            <div
              aria-hidden={position !== index}
              aria-label={`${position + 1} of ${slides.length}`}
              aria-roledescription="slide"
              className="gallery-slide"
              key={slide.src}
              role="group"
            >
              <Image
                alt={slide.alt}
                className="shot"
                height={slide.height}
                priority={position === 0}
                src={slide.src}
                width={slide.width}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="gallery-bar">
        <button
          aria-label="Previous view"
          className="gallery-arrow"
          onClick={() => go(index - 1)}
          type="button"
        >
          ←
        </button>
        <div className="gallery-pips">
          {slides.map((slide, position) => (
            <button
              aria-current={position === index}
              aria-label={slide.caption}
              className={position === index ? 'gallery-pip on' : 'gallery-pip'}
              key={slide.src}
              onClick={() => go(position)}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label="Next view"
          className="gallery-arrow"
          onClick={() => go(index + 1)}
          type="button"
        >
          →
        </button>
      </div>

      <p aria-live="polite" className="shot-cap">
        {slides[index].caption}
      </p>
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
