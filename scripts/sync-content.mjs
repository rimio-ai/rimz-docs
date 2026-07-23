#!/usr/bin/env node

import assert from 'node:assert/strict';
import { copyFile, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const rimzRoot = path.resolve(process.env.RIMZ_SRC ?? path.join(repoRoot, '..', 'rimz'));
const sourceRef = process.env.RIMZ_REF ?? 'main';
const templateRoot = path.join(repoRoot, 'content', 'template');
const docsRoot = path.join(repoRoot, 'content', 'docs');
const publicRoot = path.join(repoRoot, 'public', 'docs-assets');
const docsRouteBase = '/docs';
const assetRouteBase = '/docs-assets';
const githubBase = `https://github.com/rimio-ai/rimz/blob/${sourceRef}`;
const voidHtmlTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
const passthroughHtmlTags = new Set([
  'a',
  'b',
  'code',
  'p',
  'sub',
]);

const mappings = [
  // Getting started
  ['docs/guide/installation.md', 'getting-started/installation.mdx'],
  ['docs/guide/setup.md', 'getting-started/setup.mdx'],
  // Working with agents
  ['docs/guide/sidebar.md', 'agents/sidebar.mdx'],
  ['docs/guide/fleet.md', 'agents/fleet.mdx'],
  ['docs/guide/insight.md', 'agents/insight.mdx'],
  ['docs/guide/budget.md', 'agents/budget.mdx'],
  ['docs/guide/remote.md', 'agents/remote.mdx'],
  ['docs/guide/web.md', 'agents/web.mdx'],
  // Harness engineering
  ['docs/guide/worktrees.md', 'harness/worktrees.mdx'],
  ['docs/guide/messaging.md', 'harness/messaging.mdx'],
  ['docs/guide/teams.md', 'harness/teams.mdx'],
  ['docs/guide/scripting.md', 'harness/scripting.mdx'],
  ['docs/guide/loops.md', 'harness/loops.mdx'],
  ['docs/guide/notifications.md', 'harness/notifications.mdx'],
  // Customization
  ['docs/guide/configuration.md', 'customization/configuration.mdx'],
  ['docs/guide/theme.md', 'customization/theme.mdx'],
  ['docs/guide/pets.md', 'customization/pets.mdx'],
  ['docs/guide/multiplexer.md', 'customization/multiplexer.mdx'],
  // Help
  ['docs/guide/troubleshooting.md', 'help/troubleshooting.mdx'],
  ['docs/guide/security.md', 'help/security.mdx'],
  // Reference
  ['docs/reference/cli.md', 'reference/cli/index.mdx'],
  ['docs/reference/cli/getting-started.md', 'reference/cli/getting-started.mdx'],
  ['docs/reference/cli/events.md', 'reference/cli/events.mdx'],
  ['docs/reference/cli/config.md', 'reference/cli/config.mdx'],
  ['docs/reference/cli/agents.md', 'reference/cli/agents.mdx'],
  ['docs/reference/cli/asks.md', 'reference/cli/asks.mdx'],
  ['docs/reference/cli/message.md', 'reference/cli/message.mdx'],
  ['docs/reference/cli/transcript.md', 'reference/cli/transcript.mdx'],
  ['docs/reference/cli/pane.md', 'reference/cli/pane.mdx'],
  ['docs/reference/cli/remote.md', 'reference/cli/remote.mdx'],
  ['docs/reference/cli/stats.md', 'reference/cli/stats.mdx'],
  ['docs/reference/cli/providers.md', 'reference/cli/providers.mdx'],
  ['docs/reference/cli/loop.md', 'reference/cli/loop.mdx'],
  ['docs/reference/cli/channel.md', 'reference/cli/channel.mdx'],
  ['docs/reference/cli/worktree.md', 'reference/cli/worktree.mdx'],
  ['docs/reference/cli/web.md', 'reference/cli/web.mdx'],
  ['docs/reference/cli/hooks-trust.md', 'reference/cli/hooks-trust.mdx'],
  ['docs/reference/cli/maintenance.md', 'reference/cli/maintenance.mdx'],
  ['docs/reference/agent-support.md', 'reference/agent-support.mdx'],
  ['docs/reference/agent-plugins.md', 'reference/agent-plugins.mdx'],
];

const sourceScopes = ['docs/guide', 'docs/reference'];
const excludedSources = new Set([
  // Intentionally-unmapped files under the scopes above.
  'docs/guide/AGENTS.md',
]);
const readmeSections = [
  ['project-status', 'Project status'],
  ['what-it-does', 'What it does'],
  ['how-it-works', 'How it works'],
  ['agent-compatibility', 'Agent compatibility matrix'],
];

const srcToRoute = new Map(
  mappings.map(([src, dest]) => [cleanPath(src), routeForDestination(dest)]),
);

await main();

async function main() {
  selfCheck();
  await assertMappingComplete();
  const activeMappings = await availableMappings();
  await prepareDestination(activeMappings);

  for (const [source, destination] of activeMappings) {
    const markdown = await readFile(path.join(rimzRoot, source), 'utf8');
    const output = transformDocument(markdown, cleanPath(source));
    const target = path.join(docsRoot, destination);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, output, 'utf8');
  }

  await syncReadmeSections();
  await mkdir(publicRoot, { recursive: true });
  await copyImages();
}

async function availableMappings() {
  const available = [];

  for (const mapping of mappings) {
    try {
      await readFile(path.join(rimzRoot, mapping[0]), 'utf8');
      available.push(mapping);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  return available;
}

async function prepareDestination(activeMappings) {
  await rm(docsRoot, { recursive: true, force: true });
  await rm(publicRoot, { recursive: true, force: true });
  await mkdir(path.dirname(docsRoot), { recursive: true });
  await mkdir(path.dirname(publicRoot), { recursive: true });
  await cp(templateRoot, docsRoot, { recursive: true });
  await pruneUnavailablePages(activeMappings);

  const entries = await readdir(docsRoot, { recursive: true });
  for (const entry of entries) {
    if (!entry.endsWith('.mdx')) continue;

    const target = path.join(docsRoot, entry);
    const markdown = await readFile(target, 'utf8');
    await writeFile(target, rewriteTemplateRoutes(markdown), 'utf8');
  }
}

async function pruneUnavailablePages(activeMappings) {
  const available = new Set(activeMappings.map(([, destination]) => cleanPath(destination)));

  for (const [, destination] of mappings) {
    if (available.has(cleanPath(destination))) continue;

    const directory = path.dirname(destination);
    const page = path.basename(destination, path.extname(destination));
    const metadataPath = path.join(docsRoot, directory, 'meta.json');

    try {
      const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
      if (!Array.isArray(metadata.pages) || !metadata.pages.includes(page)) continue;

      metadata.pages = metadata.pages.filter((entry) => entry !== page);
      await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

function rewriteTemplateRoutes(markdown) {
  return markdown
    .replace(/(\]\()\/docs(?=\/|#|\)|\s)/g, `$1${docsRouteBase}`)
    .replace(/(\bhref=["'])\/docs(?=\/|#|["'])/g, `$1${docsRouteBase}`)
    .replace(
      /(\bsrc=["'])\/(rimz-[^/?"']+\.(?:avif|gif|jpe?g|png|svg|webp))/gi,
      `$1${assetRouteBase}/$2`,
    )
    .replace(
      /(!\[[^\]]*\]\()\/(rimz-[^/?)]+\.(?:avif|gif|jpe?g|png|svg|webp))/gi,
      `$1${assetRouteBase}/$2`,
    );
}

async function syncReadmeSections() {
  const sourcePath = 'README.md';
  const source = await readFile(path.join(rimzRoot, sourcePath), 'utf8');
  const target = path.join(docsRoot, 'index.mdx');
  let index = await readFile(target, 'utf8');

  const introduction = extractIntroduction(source, sourcePath);
  index = replaceSyncedBlock(index, 'introduction', transformFragment(introduction, sourcePath));

  for (const [id, heading] of readmeSections) {
    const section = extractSection(source, heading, sourcePath);
    const transformed = transformFragment(section, sourcePath);
    index = replaceSyncedBlock(index, id, transformed);
  }

  await writeFile(target, index, 'utf8');
}

function extractIntroduction(markdown, sourcePath) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const end = lines.findIndex((line) => line === '## Project status');
  if (end === -1) throw new Error(`${sourcePath}: missing section "Project status"`);

  let start = -1;
  for (let index = 0; index < end; index += 1) {
    if (lines[index] === '---') start = index + 1;
  }
  if (start === -1) throw new Error(`${sourcePath}: missing introduction divider`);

  const llms = lines.find((line, index) => (
    index < start && line.includes('<b>AI agents / LLMs:</b>')
  ));
  if (!llms) throw new Error(`${sourcePath}: missing AI agents / LLMs callout`);

  return `${llms}\n\n${lines.slice(start, end).join('\n').trim()}`;
}

function extractSection(markdown, heading, sourcePath) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((line) => line === `## ${heading}`);
  if (start === -1) throw new Error(`${sourcePath}: missing section "${heading}"`);

  const next = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  const end = next === -1 ? lines.length : next;
  return lines.slice(start, end).join('\n').trimEnd();
}

function transformFragment(markdown, sourcePath) {
  assertNoConflictMarkers(markdown, sourcePath);
  return escapeMdxText(
    normalizeFenceLanguages(
      rewriteHtmlImageSources(rewriteLinks(markdown, sourcePath), sourcePath),
    ),
  ).trimEnd();
}

function replaceSyncedBlock(markdown, id, replacement) {
  const start = `{/* sync:${id}:start */}`;
  const end = `{/* sync:${id}:end */}`;
  const startIndex = markdown.indexOf(start);
  const endIndex = markdown.indexOf(end);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`content/docs/index.mdx: missing sync markers for "${id}"`);
  }
  if (markdown.indexOf(start, startIndex + start.length) !== -1 || markdown.indexOf(end, endIndex + end.length) !== -1) {
    throw new Error(`content/docs/index.mdx: duplicate sync markers for "${id}"`);
  }

  return `${markdown.slice(0, startIndex + start.length)}\n${replacement}\n${markdown.slice(endIndex)}`;
}

async function copyImages() {
  const docsImageRoot = path.join(rimzRoot, 'docs');
  const images = await readdir(docsImageRoot);

  for (const image of images) {
    if (!/^rimz-.*\.(avif|gif|jpe?g|png|svg|webp)$/i.test(image)) continue;
    await copyFile(path.join(docsImageRoot, image), path.join(publicRoot, image));
  }
}

async function assertMappingComplete() {
  const mapped = new Set(mappings.map(([src]) => cleanPath(src)));
  const missing = [];

  for (const scope of sourceScopes) {
    const entries = await readdir(path.join(rimzRoot, scope), { recursive: true });
    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;

      const rel = cleanPath(path.join(scope, entry));
      if (!mapped.has(rel) && !excludedSources.has(rel)) missing.push(rel);
    }
  }

  if (missing.length) {
    throw new Error(`unmapped docs under site scope:\n  ${missing.join('\n  ')}`);
  }
}

function transformDocument(markdown, sourcePath) {
  assertNoConflictMarkers(markdown, sourcePath);
  const { title, body } = stripTitle(markdown);
  const description = descriptionFrom(body);
  const transformed = escapeMdxText(normalizeFenceLanguages(rewriteHtmlImageSources(rewriteLinks(body, sourcePath), sourcePath))).trimEnd();
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    description ? `description: ${JSON.stringify(description)}` : undefined,
    '---',
    '',
  ].filter(Boolean);

  return `${frontmatter.join('\n')}\n${transformed}\n`;
}

function rewriteHtmlImageSources(markdown, sourcePath) {
  return markdown
    .split('\n')
    .map((line) => line.replace(/(<img\b[^>]*\bsrc=)(["'])([^"']+)\2/gi, (_match, prefix, quote, src) => {
      return `${prefix}${quote}${rewriteTarget(src, sourcePath, true)}${quote}`;
    }))
    .join('\n');
}

function normalizeFenceLanguages(markdown) {
  return markdown.replace(/^(```|~~~)tmux$/gm, '$1text');
}

function stripTitle(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const index = lines.findIndex((line) => line.startsWith('# '));
  if (index === -1) throw new Error('missing H1 title');

  const title = lines[index].replace(/^#\s+/, '').trim();
  const body = [...lines.slice(0, index), ...lines.slice(index + 1)].join('\n').trimStart();
  return { title, body };
}

function descriptionFrom(body) {
  let inFence = false;
  let paragraph = [];

  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const trimmed = line.trim();
    if (!trimmed) {
      const description = cleanDescription(paragraph.join(' '));
      if (description) return firstSentence(description);
      paragraph = [];
      continue;
    }
    if (isNonProseLine(trimmed)) {
      paragraph = [];
      continue;
    }

    paragraph.push(trimmed);
  }

  const description = cleanDescription(paragraph.join(' '));
  return description ? firstSentence(description) : undefined;
}

function isNonProseLine(line) {
  return (
    line.startsWith('#') ||
    line.startsWith('>') ||
    line.startsWith('|') ||
    line.startsWith('![') ||
    line.startsWith('<') ||
    /^[-*+]\s/.test(line) ||
    /^\d+\.\s/.test(line)
  );
}

function cleanDescription(text) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstSentence(text) {
  const match = text.match(/^(.+?[.!?])(?:\s|$)/);
  const sentence = match?.[1] ?? text;
  return sentence.length > 180 ? undefined : sentence;
}

function rewriteLinks(markdown, sourcePath) {
  return markdown
    .split('\n')
    .map((line) => rewriteLinksInLine(line, sourcePath))
    .join('\n');
}

function rewriteLinksInLine(line, sourcePath) {
  let output = '';
  let index = 0;

  while (index < line.length) {
    const marker = line[index] === '!' && line[index + 1] === '[' ? '!' : '';
    const bracketIndex = marker ? index + 1 : index;

    if (line[bracketIndex] !== '[') {
      output += line[index];
      index += 1;
      continue;
    }

    const labelEnd = findMatchingBracket(line, bracketIndex);
    if (labelEnd === -1 || line[labelEnd + 1] !== '(') {
      output += line[index];
      index += 1;
      continue;
    }

    const targetStart = labelEnd + 2;
    const targetEnd = findClosingParen(line, targetStart);
    if (targetEnd === -1) {
      output += line[index];
      index += 1;
      continue;
    }

    const label = line.slice(bracketIndex + 1, labelEnd);
    const target = line.slice(targetStart, targetEnd);
    output += `${marker}[${label}](${rewriteTarget(target, sourcePath, marker === '!')})`;
    index = targetEnd + 1;
  }

  return output;
}

function findMatchingBracket(line, start) {
  let depth = 0;

  for (let index = start; index < line.length; index += 1) {
    if (line[index] === '\\') {
      index += 1;
      continue;
    }
    if (line[index] === '[') depth += 1;
    if (line[index] === ']') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function findClosingParen(line, start) {
  let depth = 0;

  for (let index = start; index < line.length; index += 1) {
    if (line[index] === '\\') {
      index += 1;
      continue;
    }
    if (line[index] === '(') depth += 1;
    if (line[index] === ')') {
      if (depth === 0) return index;
      depth -= 1;
    }
  }

  return -1;
}

function rewriteTarget(rawTarget, sourcePath, isImage) {
  const { href, suffix } = splitTarget(rawTarget.trim());
  if (!href) return rawTarget;

  const hostedDocsImage = isImage && href.match(
    /^https:\/\/raw\.githubusercontent\.com\/rimio-ai\/rimz\/(?:HEAD|main|v[^/]+)\/docs\/(rimz-[^/?]+\.(?:avif|gif|jpe?g|png|svg|webp))$/i,
  );
  if (hostedDocsImage) return `${assetRouteBase}/${hostedDocsImage[1]}${suffix}`;

  if (isExternal(href) || href.startsWith('#')) return rawTarget;

  if (isImage || /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(href)) {
    return `${assetRouteBase}/${path.posix.basename(href)}${suffix}`;
  }

  const resolved = cleanPath(path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), href)));
  const route = srcToRoute.get(resolved);
  if (route) return `${route}${suffix}`;

  const githubQuery = resolved.endsWith('.md') ? '?ref=docs' : '';
  return `${githubBase}/${resolved}${githubQuery}${suffix}`;
}

function splitTarget(target) {
  const quoted = target.match(/^(\S+)(\s+["'][^"']*["'])$/);
  const rawHref = quoted?.[1] ?? target;
  const suffixTitle = quoted?.[2] ?? '';
  const href = rawHref.replace(/^<|>$/g, '');
  const hashIndex = href.indexOf('#');

  if (hashIndex === -1) {
    return { href, suffix: suffixTitle };
  }

  return {
    href: href.slice(0, hashIndex),
    suffix: `${href.slice(hashIndex)}${suffixTitle}`,
  };
}

function isExternal(href) {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('/');
}

function escapeMdxText(markdown) {
  let inFence = false;

  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return escapeMdxLine(line);
    })
    .join('\n');
}

function escapeMdxLine(line) {
  let out = '';
  let inlineBackticks = 0;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '`') {
      const length = countRun(line, index, '`');
      inlineBackticks = inlineBackticks === length ? 0 : length;
      out += '`'.repeat(length);
      index += length - 1;
      continue;
    }

    if (inlineBackticks === 0) {
      if (char === '{' || char === '}') {
        out += `\\${char}`;
        continue;
      }
      if (char === '<' && !line.slice(index).startsWith('<http')) {
        const voidTag = normalizeVoidHtmlTag(line.slice(index));
        if (voidTag) {
          out += voidTag.html;
          index += voidTag.rawLength - 1;
          continue;
        }
        const htmlTag = normalizePassthroughHtmlTag(line.slice(index));
        if (htmlTag) {
          out += htmlTag.html;
          index += htmlTag.rawLength - 1;
          continue;
        }
        out += '&lt;';
        continue;
      }
    }

    out += char;
  }

  return out;
}

function normalizePassthroughHtmlTag(fragment) {
  const match = fragment.match(/^<\/?([A-Za-z][A-Za-z0-9:-]*)(\s[^<>]*)?>/);
  if (!match || !passthroughHtmlTags.has(match[1].toLowerCase())) return undefined;

  return {
    html: match[0],
    rawLength: match[0].length,
  };
}

function normalizeVoidHtmlTag(fragment) {
  const match = fragment.match(/^<([A-Za-z][A-Za-z0-9:-]*)(\s[^<>]*)?\/?>/);
  if (!match || !voidHtmlTags.has(match[1].toLowerCase())) return undefined;

  const attributes = (match[2] ?? '').replace(/\/\s*$/, '').trimEnd();
  return {
    html: attributes ? `<${match[1]}${attributes}/>` : `<${match[1]}/>`,
    rawLength: match[0].length,
  };
}

function countRun(text, start, char) {
  let count = 0;
  while (text[start + count] === char) count += 1;
  return count;
}

function routeForDestination(destination) {
  const withoutExtension = destination.replace(/\.mdx$/, '');
  const withoutIndex = withoutExtension.replace(/(^|\/)index$/, '');
  return `${docsRouteBase}${withoutIndex ? `/${withoutIndex}` : ''}`;
}

function cleanPath(value) {
  return value.replaceAll(path.sep, '/').replace(/^\.\//, '');
}

function selfCheck() {
  const source = 'docs/guide/example.md';
  srcToRoute.set('docs/guide/target.md', `${docsRouteBase}/guide/target`);
  assert.equal(
    rewriteLinks('[target](./target.md#install) and [code](../../crates/rimz/src/main.rs)', source),
    `[target](${docsRouteBase}/guide/target#install) and [code](${githubBase}/crates/rimz/src/main.rs)`,
  );
  assert.equal(
    rewriteLinks('[external](../externals/pinned.md#top)', source),
    `[external](${githubBase}/docs/externals/pinned.md?ref=docs#top)`,
  );
  assert.equal(
    rewriteLinks('```md\n[target](./target.md)\n```', source),
    `\`\`\`md\n[target](${docsRouteBase}/guide/target)\n\`\`\``,
  );
  assert.equal(
    rewriteLinks('[`[tmux] option`](./configuration.md#x)', 'docs/guide/setup.md'),
    '[`[tmux] option`](' + docsRouteBase + '/customization/configuration#x)',
  );
  assert.equal(escapeMdxText('Use {x} and <path> but keep `{x}`.'), 'Use \\{x\\} and &lt;path> but keep `{x}`.');
  assert.equal(escapeMdxText('Break<br> then <hr /> but keep <path>.'), 'Break<br/> then <hr/> but keep &lt;path>.');
  assert.equal(
    escapeMdxText('<p align="center"><sub><a href="/llms.txt"><code>x</code></a></sub></p> and <kind>'),
    '<p align="center"><sub><a href="/llms.txt"><code>x</code></a></sub></p> and &lt;kind>',
  );
  assert.equal(
    rewriteHtmlImageSources('<img src="../rimz-sidebar.png" alt="x">', 'docs/guide/sidebar.md'),
    `<img src="${assetRouteBase}/rimz-sidebar.png" alt="x">`,
  );
  assert.equal(
    rewriteHtmlImageSources('<img src="https://raw.githubusercontent.com/rimio-ai/rimz/HEAD/docs/rimz-full.png" alt="x">', 'README.md'),
    `<img src="${assetRouteBase}/rimz-full.png" alt="x">`,
  );
  assert.equal(
    extractIntroduction([
      '<p align="center"><sub><b>AI agents / LLMs:</b> fetch <a href="/llms.txt">the live index</a>.</sub></p>',
      '',
      '---',
      '',
      'Introduction copy.',
      '',
      '## Project status',
    ].join('\n'), 'README.md'),
    '<p align="center"><sub><b>AI agents / LLMs:</b> fetch <a href="/llms.txt">the live index</a>.</sub></p>\n\nIntroduction copy.',
  );
  assert.equal(descriptionFrom(`${'word '.repeat(37)}.`), undefined);
  assert.throws(
    () => transformDocument('# Title\n\n<<<<<<< Updated upstream\nold\n=======\nnew\n>>>>>>> Stashed changes\n', 'docs/guide/conflict.md'),
    /docs\/guide\/conflict\.md:3: unresolved merge conflict marker/,
  );
  srcToRoute.delete('docs/guide/target.md');
}

function assertNoConflictMarkers(markdown, sourcePath) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const markerLine = lines.findIndex((line) => /^(<{7}|={7}|>{7})(?:\s|$)/.test(line));
  if (markerLine !== -1) {
    throw new Error(`${sourcePath}:${markerLine + 1}: unresolved merge conflict marker`);
  }
}
