#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const catalog = JSON.parse(await readFile(path.join(repoRoot, 'content', 'versions.json'), 'utf8'));

assert.equal(catalog.schemaVersion, 3, 'unsupported content/versions.json schema');
assert.ok(Array.isArray(catalog.versions), 'content/versions.json lists no versions');
assert.equal(catalog.versions[0]?.id, 'main', 'trunk is not the first, default version');

const ids = catalog.versions.map((version) => version.id);
assert.deepEqual(ids, [...new Set(ids)], 'content/versions.json repeats a version');
assert.deepEqual(
  (await readdir(path.join(repoRoot, 'content', 'versions'))).sort(),
  [...ids].sort(),
  'content/versions/ does not match content/versions.json',
);

for (const version of catalog.versions) {
  if (version.id === 'main') {
    assert.equal(version.kind, 'development');
    assert.equal(version.ref, 'main');
  } else {
    assert.equal(version.kind, 'release', `${version.id} is not a release`);
    assert.match(version.id, /^v[0-9]+(?:\.[0-9]+){0,2}$/, `not a stable release tag: ${version.id}`);
    assert.equal(version.ref, version.id, `${version.id} was built from another ref`);
  }
  assert.match(version.sourceCommit, /^[0-9a-f]{40}$/);

  await checkVersion(version);
}

async function checkVersion(version) {
  const docsRoot = path.join(repoRoot, 'content', 'versions', version.id);
  const routeBase = version.id === 'main' ? '/docs' : `/docs/${version.id}`;
  const assetBase = `/docs-assets/${version.id}`;
  const files = await filesBelow(docsRoot);
  const pages = files.filter((file) => file.endsWith('.mdx'));
  const descriptions = new Map();

  assert.ok(pages.length > 0, `${version.id} has no documentation pages`);
  assert.ok(files.includes('meta.json'), `${version.id} has no root meta.json`);

  for (const file of pages) {
    const page = `${version.id}/${file}`;
    const markdown = await readFile(path.join(docsRoot, file), 'utf8');
    const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)?.[1];
    assert.ok(frontmatter, `${page} has no frontmatter`);

    const descriptionLiteral = frontmatter.match(/^description:\s*(.+)$/m)?.[1];
    assert.ok(descriptionLiteral, `${page} has no meta description`);

    let description;
    try {
      description = JSON.parse(descriptionLiteral);
    } catch {
      assert.fail(`${page} has an invalid JSON-string meta description`);
    }
    assert.equal(typeof description, 'string', `${page} has a non-string meta description`);
    assert.ok(description.length >= 70, `${page} has a meta description that is too thin`);
    assert.ok(description.length <= 180, `${page} has a meta description longer than 180 characters`);

    const duplicate = descriptions.get(description);
    assert.ok(!duplicate, `${page} and ${duplicate} have the same meta description`);
    descriptions.set(description, page);

    // Every docs link must stay inside the page's own version.
    const docsLinks = [
      ...markdown.matchAll(/\]\((\/docs(?:\/[^\s)#]*)?)/g),
      ...markdown.matchAll(/\bhref=["'](\/docs(?:\/[^"'#]*)?)/g),
    ];
    for (const [, target] of docsLinks) {
      const own = version.id === 'main'
        ? !/^\/docs\/v[0-9]/.test(target)
        : target === routeBase || target.startsWith(`${routeBase}/`);
      assert.ok(own, `${page} links outside its version: ${target}`);
    }

    const images = [
      ...markdown.matchAll(/(?:src=["']|!\[[^\]]*\]\()(\/[^"')\s]+)/g),
    ].map((match) => match[1]);
    for (const image of images) {
      assert.ok(
        image.startsWith(`${assetBase}/`),
        `${page} references an image outside ${assetBase}: ${image}`,
      );
      assert.ok(
        await exists(path.join(repoRoot, 'public', image)),
        `${page} references a missing image: ${image}`,
      );
    }

    // A release's source links must pin its tag; only trunk may link to main.
    if (version.id !== 'main') {
      assert.ok(
        !markdown.includes('https://github.com/rimio-ai/rimz/blob/main/'),
        `${page} links release details to main`,
      );
    }
  }

  const assets = await filesBelow(path.join(repoRoot, 'public', 'docs-assets', version.id));
  assert.ok(assets.length > 0, `${version.id} has no documentation assets`);
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function filesBelow(root) {
  const entries = await readdir(root, { recursive: true });
  const files = [];

  for (const entry of entries) {
    if ((await stat(path.join(root, entry))).isFile()) files.push(entry.replaceAll(path.sep, '/'));
  }

  return files.sort();
}
