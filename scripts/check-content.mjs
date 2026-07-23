#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const version = JSON.parse(await readFile(path.join(repoRoot, 'content', 'version.json'), 'utf8'));

assert.equal(version.schemaVersion, 2, 'unsupported content/version.json schema');
assert.match(version.id, /^v[0-9][0-9A-Za-z.+-]*$/, `not a release identifier: ${version.id}`);
assert.equal(version.ref, version.id, 'the documented version and its source tag differ');
assert.match(version.sourceCommit, /^[0-9a-f]{40}$/);

const docsRoot = path.join(repoRoot, 'content', 'docs');
const files = await filesBelow(docsRoot);
const pages = files.filter((file) => file.endsWith('.mdx'));
const descriptions = new Map();

assert.ok(pages.length > 0, 'there are no documentation pages');
assert.ok(files.includes('meta.json'), 'there is no root meta.json');

for (const page of pages) {
  const markdown = await readFile(path.join(docsRoot, page), 'utf8');
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

  // Nothing may link into a version-prefixed route now that the site serves a
  // single release from unprefixed paths.
  const versioned = [
    ...markdown.matchAll(/\]\((\/docs\/v[0-9][^\s)#]*)/g),
    ...markdown.matchAll(/\bhref=["'](\/docs\/v[0-9][^"'#]*)/g),
  ];
  for (const match of versioned) {
    assert.fail(`${page} links to a version-prefixed route: ${match[1]}`);
  }

  assert.ok(
    !/(?:src=["']|\]\()\/rimz-[^/]+\.(?:avif|gif|jpe?g|png|svg|webp)/i.test(markdown),
    `${page} references an image outside /docs-assets`,
  );

  assert.ok(
    !markdown.includes('https://github.com/rimio-ai/rimz/blob/main/'),
    `${page} links release details to main`,
  );
}

const assets = await filesBelow(path.join(repoRoot, 'public', 'docs-assets'));
assert.ok(assets.length > 0, 'there are no documentation assets');

async function filesBelow(root) {
  const entries = await readdir(root, { recursive: true });
  const files = [];

  for (const entry of entries) {
    if ((await stat(path.join(root, entry))).isFile()) files.push(entry.replaceAll(path.sep, '/'));
  }

  return files.sort();
}
