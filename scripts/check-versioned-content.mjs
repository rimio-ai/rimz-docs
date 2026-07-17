#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const catalog = JSON.parse(await readFile(path.join(repoRoot, 'content', 'versions.json'), 'utf8'));
const ids = new Set();

assert.equal(catalog.schemaVersion, 1, 'unsupported content/versions.json schema');
assert.ok(Array.isArray(catalog.versions) && catalog.versions.length > 1, 'version catalog is empty');

for (const version of catalog.versions) {
  assert.match(version.id, /^(?:main|v[0-9][0-9A-Za-z.+-]*)$/);
  assert.ok(!ids.has(version.id), `duplicate documentation version: ${version.id}`);
  assert.match(version.sourceCommit, /^[0-9a-f]{40}$/);
  ids.add(version.id);

  const docsRoot = path.join(repoRoot, 'content', 'versions', version.id);
  const files = await filesBelow(docsRoot);
  const pages = files.filter((file) => file.endsWith('.mdx'));
  assert.ok(pages.length > 0, `${version.id} has no documentation pages`);
  assert.ok(files.includes('meta.json'), `${version.id} has no root meta.json`);

  for (const page of pages) {
    const markdown = await readFile(path.join(docsRoot, page), 'utf8');
    const internalRoutes = [
      ...markdown.matchAll(/\]\((\/docs(?:\/[^\s)#]*)?)/g),
      ...markdown.matchAll(/\bhref=["'](\/docs(?:\/[^"'#]*)?)/g),
    ];

    for (const match of internalRoutes) {
      assert.ok(
        match[1] === `/docs/${version.id}` || match[1].startsWith(`/docs/${version.id}/`),
        `${version.id}/${page} escapes its version through ${match[1]}`,
      );
    }

    assert.ok(
      !/(?:src=["']|\]\()\/rimz-[^/]+\.(?:avif|gif|jpe?g|png|svg|webp)/i.test(markdown),
      `${version.id}/${page} uses an unversioned image`,
    );

    if (version.kind === 'release') {
      assert.ok(
        !markdown.includes('https://github.com/rimio-ai/rimz/blob/main/'),
        `${version.id}/${page} links release details to main`,
      );
    }
  }

  const assets = await filesBelow(path.join(repoRoot, 'public', 'docs-assets', version.id));
  assert.ok(assets.length > 0, `${version.id} has no versioned assets`);
}

assert.ok(ids.has('main'), 'version catalog has no main snapshot');
assert.ok(ids.has(catalog.latest), `latest version ${catalog.latest} is missing`);
assert.equal(
  catalog.versions.find((version) => version.id === catalog.latest)?.kind,
  'release',
  'latest documentation version is not a release',
);

assert.deepEqual(
  await directoryNames(path.join(repoRoot, 'content', 'versions')),
  [...ids].sort(),
  'content snapshot directories differ from the version catalog',
);
assert.deepEqual(
  await directoryNames(path.join(repoRoot, 'public', 'docs-assets')),
  [...ids].sort(),
  'asset snapshot directories differ from the version catalog',
);

async function filesBelow(root) {
  const entries = await readdir(root, { recursive: true });
  const files = [];

  for (const entry of entries) {
    if ((await stat(path.join(root, entry))).isFile()) files.push(entry.replaceAll(path.sep, '/'));
  }

  return files.sort();
}

async function directoryNames(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}
