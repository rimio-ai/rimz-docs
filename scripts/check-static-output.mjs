#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const outputRoot = path.join(repoRoot, 'out');
const catalog = JSON.parse(await readFile(path.join(repoRoot, 'content', 'versions.json'), 'utf8'));
const pages = await filesBelow(outputRoot, '.html');
const broken = [];

for (const version of catalog.versions) {
  await assertFile(`docs/${version.id}/index.html`);
  await assertFile(`docs/${version.id}/getting-started/quickstart/index.html`);
  await assertFile(`docs-assets/${version.id}/rimz-sidebar.png`);
  await assertFile(`llms.mdx/docs/${version.id}/content.md`);
  await assertFile(`llms/${version.id}/index.txt`);
  await assertFile(`og/docs/${version.id}/image.png`);

  const versionHtml = await readFile(path.join(outputRoot, 'docs', version.id, 'index.html'), 'utf8');
  assert.ok(versionHtml.includes(`Docs: ${version.label}`), `${version.id} has no active version label`);
  for (const target of catalog.versions) {
    assert.ok(versionHtml.includes(`/docs/${target.id}`), `${version.id} cannot switch to ${target.id}`);
  }

  if (version.kind === 'development') {
    assert.ok(versionHtml.includes('documents unreleased work'), 'main has no unreleased notice');
  } else if (version.id !== catalog.latest) {
    assert.ok(versionHtml.includes('older RimZ release'), `${version.id} has no older-release notice`);
  }
}

await assertFile('docs/index.html');
await assertFile('api/search');
await assertFile('llms.txt');
await assertFile('llms-full.txt');
await assertFile('sitemap.xml');
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

const latestHtml = await readFile(path.join(outputRoot, 'docs', 'index.html'), 'utf8');
assert.ok(
  new RegExp(`rel="canonical" href="https?://[^"/]+/docs/${catalog.latest}(?:/|\\")`).test(latestHtml),
  'the floating docs route does not canonicalize to the latest release',
);

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
