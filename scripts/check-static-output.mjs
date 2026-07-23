#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const outputRoot = path.join(repoRoot, 'out');
const version = JSON.parse(await readFile(path.join(repoRoot, 'content', 'version.json'), 'utf8'));
const pages = await filesBelow(outputRoot, '.html');
const broken = [];

await assertFile('docs/index.html');
await assertFile('docs/getting-started/quickstart/index.html');
await assertFile('docs-assets/rimz-sidebar.png');
await assertFile('llms.mdx/docs/content.md');
await assertFile('og/docs/image.png');
await assertFile('api/search');
await assertFile('llms.txt');
await assertFile('llms-full.txt');
await assertFile('sitemap.xml');
await assertFile('robots.txt');
await assertFile('icon.svg');
await assertFile('.nojekyll');

for (const page of pages) {
  const html = await readFile(path.join(outputRoot, page), 'utf8');
  const references = html.matchAll(/\b(?:href|src)="([^"]+)"/g);

  for (const match of references) {
    const target = match[1].replaceAll('&amp;', '&');
    if (!target.startsWith('/') || target.startsWith('//')) continue;

    const pathname = decodeURIComponent(target.split(/[?#]/, 1)[0]);
    if (!(await outputPathExists(pathname))) broken.push(`${page} -> ${pathname}`);
  }
}

assert.deepEqual(broken, [], `broken static links:\n${broken.join('\n')}`);

const indexablePages = pages.filter((page) => page === 'index.html' || page.startsWith('docs/'));
const pageTitles = new Map();
const pageDescriptions = new Map();

for (const page of indexablePages) {
  const html = await readFile(path.join(outputRoot, page), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"\/?>/)?.[1];

  assert.ok(title, `${page} has no title`);
  assert.ok(description, `${page} has no meta description`);
  assert.ok(!/\(v[0-9]/.test(title), `${page} puts a release number in its search title`);
  assert.ok(!pageTitles.has(title), `${page} and ${pageTitles.get(title)} have the same title`);
  assert.ok(
    !pageDescriptions.has(description),
    `${page} and ${pageDescriptions.get(description)} have the same meta description`,
  );
  pageTitles.set(title, page);
  pageDescriptions.set(description, page);

  for (const tag of [
    /<link rel="canonical" href="https?:\/\/[^"]+"\/?>/,
    /<meta property="og:title" content="[^"]+"\/?>/,
    /<meta property="og:description" content="[^"]+"\/?>/,
    /<meta property="og:url" content="https?:\/\/[^"]+"\/?>/,
    /<meta property="og:image" content="https?:\/\/[^"]+"\/?>/,
    /<meta name="twitter:card" content="summary_large_image"\/?>/,
    /<meta name="twitter:title" content="[^"]+"\/?>/,
    /<meta name="twitter:description" content="[^"]+"\/?>/,
    /<meta name="twitter:image" content="https?:\/\/[^"]+"\/?>/,
    /<link rel="icon" href="\/icon\.svg[^"]*"[^>]*>/,
  ]) {
    assert.match(html, tag, `${page} is missing search or social metadata: ${tag}`);
  }

  assert.equal(
    [...html.matchAll(/<h1(?:\s|>)/g)].length,
    1,
    `${page} does not have exactly one h1`,
  );
  assert.ok(!/<meta name="robots"[^>]*noindex/i.test(html), `${page} is marked noindex`);

  if (page === 'index.html') {
    assert.ok(html.includes('"@type":"WebSite"'), 'the homepage has no WebSite structured data');
  } else if (page !== 'docs/index.html') {
    assert.ok(
      html.includes('"@type":"BreadcrumbList"'),
      `${page} has no breadcrumb structured data`,
    );
  }
}

const docsHtml = await readFile(path.join(outputRoot, 'docs', 'index.html'), 'utf8');
assert.ok(
  /rel="canonical" href="https?:\/\/[^"/]+\/docs\/"/.test(docsHtml),
  'the docs root does not canonicalize to itself',
);
assert.ok(docsHtml.includes(version.id), 'the docs shell does not name the release it documents');
assert.ok(
  !/href="\/docs\/v[0-9]/.test(docsHtml),
  'the docs shell still links to a version-prefixed route',
);

const homeHtml = await readFile(path.join(outputRoot, 'index.html'), 'utf8');
assert.ok(!homeHtml.includes('http-equiv="refresh"'), 'the homepage still uses a meta refresh');
assert.ok(
  homeHtml.includes('The control room for your coding agents'),
  'the homepage is missing the product heading',
);
for (const section of ['Why RimZ?', 'Everyday moves']) {
  assert.ok(homeHtml.includes(section), `the homepage is missing the ${section} section`);
}
assert.ok(homeHtml.includes('id="agents"'), 'the homepage dropped the #agents anchor');
// Install moved into the hero, so the commands must render above the fold
// rather than in a section of their own.
for (const method of ['install.sh | sh', 'brew install', 'cargo install']) {
  assert.ok(homeHtml.includes(method), `the hero is missing the ${method} install method`);
}
assert.ok(
  homeHtml.includes('agent-mark supported') && homeHtml.includes('agent-mark experimental'),
  'the homepage is missing the supported-agent marks',
);

const sitemap = await readFile(path.join(outputRoot, 'sitemap.xml'), 'utf8');
assert.ok(!/\/docs\/v[0-9]/.test(sitemap), 'the sitemap includes a version-prefixed route');
assert.ok(sitemap.includes('/docs/'), 'the sitemap omits the documentation');
assert.ok(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].every((match) => match[1].endsWith('/')),
  'the sitemap includes a URL that redirects to add a trailing slash',
);

const robots = await readFile(path.join(outputRoot, 'robots.txt'), 'utf8');
assert.ok(robots.includes('User-Agent: *'), 'robots.txt has no global crawler rule');
assert.ok(robots.includes('Sitemap:'), 'robots.txt does not advertise the sitemap');

async function outputPathExists(pathname) {
  if (pathname === '/') return isFile(path.join(outputRoot, 'index.html'));

  const relative = pathname.replace(/^\/+|\/+$/g, '');
  return (
    (await isFile(path.join(outputRoot, relative))) ||
    (await isFile(path.join(outputRoot, relative, 'index.html')))
  );
}

async function assertFile(relative) {
  assert.ok(await isFile(path.join(outputRoot, relative)), `missing out/${relative}`);
}

async function filesBelow(root, suffix) {
  const entries = await readdir(root, { recursive: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.endsWith(suffix)) continue;
    if ((await stat(path.join(root, entry))).isFile()) files.push(entry.replaceAll(path.sep, '/'));
  }

  return files.sort();
}

async function isFile(target) {
  try {
    return (await stat(target)).isFile();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}
