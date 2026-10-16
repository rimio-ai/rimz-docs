import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { createElement } from 'react';
import * as runtime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { remarkGfm } from 'fumadocs-core/mdx-plugins/remark-gfm';
import { escapeMdxText } from './sync-content.mjs';

const requireMdx = createRequire(import.meta.resolve('fumadocs-mdx'));
const { evaluate } = await import(requireMdx.resolve('@mdx-js/mdx'));

async function render(markdown) {
  const { default: Content } = await evaluate(escapeMdxText(markdown), { ...runtime, remarkPlugins: [remarkGfm] });
  return renderToStaticMarkup(createElement(Content));
}

test('escaped backticks outside code do not hide placeholders or expressions', async () => {
  assert.equal(
    await render('Use \\` with <room> and {root}.'),
    '<p>Use ` with &lt;room&gt; and {root}.</p>',
  );
});

test('backslashes inside code are literal and do not escape its closing delimiter', async () => {
  assert.equal(
    await render('`no room at <root>: run \\`rimz start\\` there, or pass --root <room>`'),
    '<p><code>no room at &lt;root&gt;: run \\</code>rimz start` there, or pass --root &lt;room&gt;`</p>',
  );
});

test('only a run of the opening length closes inline code', async () => {
  assert.equal(
    await render('Use ``one ` <room> {root} ``` two`` then <target> and {value}.'),
    '<p>Use <code>one ` &lt;room&gt; {root} ``` two</code> then &lt;target&gt; and {value}.</p>',
  );
});

test('an unmatched backtick run stays literal', async () => {
  assert.equal(
    await render('Use `literal <room> and {root}.'),
    '<p>Use `literal &lt;room&gt; and {root}.</p>',
  );
});

test('an even number of backslashes does not escape an opening backtick', async () => {
  assert.equal(
    await render('Use \\\\`<room> {root}` then <target>.'),
    '<p>Use \\<code>&lt;room&gt; {root}</code> then &lt;target&gt;.</p>',
  );
});

test('only the first backtick of an escaped run is escaped', async () => {
  assert.equal(
    await render('Use \\``<room> {root}` then <target>.'),
    '<p>Use `<code>&lt;room&gt; {root}</code> then &lt;target&gt;.</p>',
  );
});

test('inline code can cross soft line endings but not paragraph boundaries', async () => {
  assert.equal(
    await render('Use ``one\n<room> {root} ` two`` then <target>.'),
    '<p>Use <code>one &lt;room&gt; {root} ` two</code> then &lt;target&gt;.</p>',
  );
  assert.equal(
    await render('Use `one <room>\n\n{root} two`.'),
    '<p>Use `one &lt;room&gt;</p>\n<p>{root} two`.</p>',
  );
});

test('fenced code preserves raw content and closes only with its own fence', async () => {
  const markdown = '````text\n<room> {root} \\`\n```\n<target> {value}\n~~~\n````\n\nOutside <room> {root}.';
  assert.equal(
    await render(markdown),
    '<pre><code class="language-text">&lt;room&gt; {root} \\`\n```\n&lt;target&gt; {value}\n~~~\n</code></pre>\n<p>Outside &lt;room&gt; {root}.</p>',
  );
  assert.equal(escapeMdxText('~~~text\n<room> {root} `\n~~~'), '~~~text\n<room> {root} `\n~~~');
});

test('intended HTML still renders as elements alongside escaped prose', async () => {
  assert.equal(
    await render('Use \\`literal\\` <b>bold</b><br> and <room> {root}.'),
    '<p>Use `literal` <b>bold</b><br/> and &lt;room&gt; {root}.</p>',
  );
  assert.equal(
    await render('<p><b>Use</b> ``one ` <room> {root}`` then <target>.</p>'),
    '<p><b>Use</b> <code>one ` &lt;room&gt; {root}</code> then &lt;target&gt;.</p>',
  );
});

test('MDX indentation does not turn prose into protected code', async () => {
  assert.equal(
    await render('    Use <room> {root} and `<target>`.'),
    '<p>Use &lt;room&gt; {root} and <code>&lt;target&gt;</code>.</p>',
  );
});

test('inline code cannot cross GFM table cell boundaries', async () => {
  const html = await render('| One | Two |\n| --- | --- |\n| `literal <room> | after {root}` |');
  assert.match(html, /<td>`literal &lt;room&gt;<\/td>/);
  assert.match(html, /<td>after \{root\}`<\/td>/);
});
