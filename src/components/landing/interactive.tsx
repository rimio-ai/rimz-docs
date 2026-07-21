'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

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

/**
 * Arrow-key navigation for a tablist, per the ARIA tabs pattern: Left and
 * Right step through the tabs and wrap at the ends, Home and End jump to the
 * ends, and focus follows selection. Paired with a roving `tabIndex` on the
 * buttons, this makes the strip one Tab stop instead of three.
 */
function onTabKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  ids: string[],
  current: string,
  setActive: (id: string) => void,
) {
  const from = ids.indexOf(current);
  const last = ids.length - 1;
  let next: number;

  if (event.key === 'ArrowRight') next = from === last ? 0 : from + 1;
  else if (event.key === 'ArrowLeft') next = from === 0 ? last : from - 1;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = last;
  else return;

  event.preventDefault();
  setActive(ids[next]);
  event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
}

export type Slide = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  width: number;
  height: number;
};

const ADVANCE_MS = 6500;

/**
 * Hero gallery. Advances on its own so the page shows more than one view
 * without demanding a click, but stops for good the moment the reader takes
 * manual control, and never starts under `prefers-reduced-motion`.
 *
 * Three ways in, none of them shouting: click the half of the capture you want
 * to travel toward, press Left or Right once the gallery has focus, or hit a
 * segment of the hairline switcher underneath. The switcher carries no text —
 * the caption already names the current view, so labels on the bar would say
 * it twice — which is why each segment needs an `aria-label` of its own.
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
      aria-label="Views of the room"
      aria-roledescription="carousel"
      className="gallery"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false);
      }}
      onFocus={() => setHovered(true)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + 1);
        else if (event.key === 'ArrowLeft') go(index - 1);
        else return;
        event.preventDefault();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="group"
      tabIndex={0}
    >
      {/* Click-to-travel: the half you click is the direction you go, which
          needs no chrome drawn over the capture and stays true whether there
          are two views or ten. Keyboard readers get the same two moves from
          the arrow keys on the group above, so this is not the only route. */}
      <div
        className="gallery-viewport"
        onClick={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          go(event.clientX - box.left < box.width / 2 ? index - 1 : index + 1);
        }}
      >
        <div className="gallery-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, position) => (
            <div className="gallery-slide" key={slide.src}>
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

        {/* Cursor affordance only: these two carry the direction glyphs so the
            pointer shape flips at the midline. They are decorative and the
            click is handled above, so they take no role and no tab stop. */}
        <div aria-hidden="true" className="gallery-half back" />
        <div aria-hidden="true" className="gallery-half fwd" />
      </div>

      <div className="gallery-bar">
        {slides.map((slide, position) => (
          <button
            aria-current={position === index}
            aria-label={slide.label}
            className={position === index ? 'gallery-dash on' : 'gallery-dash'}
            key={slide.src}
            onClick={() => go(position)}
            type="button"
          />
        ))}
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
          className={copied ? 'copy-btn on-dark ok' : 'copy-btn on-dark'}
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
  const ids = scenes.map((item) => item.id);

  return (
    <div>
      <div
        aria-label="Everyday moves"
        className="tabs"
        onKeyDown={(event) => onTabKeyDown(event, ids, scene.id, setActive)}
        role="tablist"
      >
        {scenes.map((item) => (
          <button
            aria-controls={`scene-panel-${item.id}`}
            aria-selected={item.id === scene.id}
            className="tab"
            id={`scene-tab-${item.id}`}
            key={item.id}
            onClick={() => setActive(item.id)}
            role="tab"
            tabIndex={item.id === scene.id ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`scene-tab-${scene.id}`}
        id={`scene-panel-${scene.id}`}
        role="tabpanel"
      >
        <p className="lede">{scene.lede}</p>
        <Terminal lines={scene.lines} raw={scene.raw} title={scene.title} />
      </div>
    </div>
  );
}

export type InstallMethod = {
  id: string;
  label: string;
  /** The command, on one line. It is both what is shown and what is copied. */
  command: string;
  /**
   * The substring set in full ink against the rest of the muted command: on a
   * long URL it is the segment the reader needs to verify before pasting the
   * line into a shell, and picking it out saves reading the whole thing.
   */
  emphasis?: string;
};

/** Splits a command around its emphasised segment, on the first match. */
function renderCommand({ command, emphasis }: InstallMethod) {
  const at = emphasis ? command.indexOf(emphasis) : -1;
  if (at < 0 || !emphasis) return command;

  return (
    <>
      {command.slice(0, at)}
      <span className="em">{emphasis}</span>
      {command.slice(at + emphasis.length)}
    </>
  );
}

/**
 * The install command, as one self-contained block: the method switcher and
 * the copy button ride in the block's own header rather than floating above
 * it, so the control and the surface it controls read as one object.
 *
 * Every method is rendered into the same grid cell and the inactive ones are
 * hidden with `visibility`, which keeps them out of the accessibility tree
 * while still letting them set the block's height. The block is therefore as
 * tall as its longest command and switching tabs cannot move the page.
 *
 * No `$` prompt: the tab already says this is a shell command, and the glyph
 * is one more thing to mis-select when copying by hand.
 */
export function InstallTabs({ methods }: { methods: InstallMethod[] }) {
  const [active, setActive] = useState(methods[0].id);
  const [copied, copy] = useCopy();
  const method = methods.find((item) => item.id === active) ?? methods[0];
  const ids = methods.map((item) => item.id);

  return (
    <div className="install">
      <div className="install-head">
        <div
          aria-label="Install method"
          className="install-tabs"
          onKeyDown={(event) => onTabKeyDown(event, ids, method.id, setActive)}
          role="tablist"
        >
          {methods.map((item) => (
            <button
              aria-controls={`install-panel-${item.id}`}
              aria-selected={item.id === method.id}
              className="install-tab"
              id={`install-tab-${item.id}`}
              key={item.id}
              onClick={() => setActive(item.id)}
              role="tab"
              tabIndex={item.id === method.id ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          aria-label={`Copy the ${method.label} command`}
          className={copied ? 'copy-btn on-light ok' : 'copy-btn on-light'}
          onClick={() => copy(method.command)}
          type="button"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>

      <div className="install-body">
        {methods.map((item) => {
          const on = item.id === method.id;
          return (
            <pre
              aria-labelledby={`install-tab-${item.id}`}
              className="install-cmd"
              data-on={on ? '' : undefined}
              id={`install-panel-${item.id}`}
              key={item.id}
              role="tabpanel"
              tabIndex={on ? 0 : -1}
            >
              {renderCommand(item)}
            </pre>
          );
        })}
      </div>
    </div>
  );
}
