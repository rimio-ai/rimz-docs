#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const repoRoot = process.cwd();
const rimzRoot = path.resolve(process.env.RIMZ_SRC ?? path.join(repoRoot, '..', 'rimz'));
const catalogPath = path.join(repoRoot, 'content', 'versions.json');
const contentRoot = path.join(repoRoot, 'content', 'versions');
const assetRoot = path.join(repoRoot, 'public', 'docs-assets');
const syncScript = path.join(repoRoot, 'scripts', 'sync-content.mjs');

await main();

// The site documents trunk as `main`, served at /docs, plus every stable
// release tag at /docs/<tag>. Every set is rebuilt from scratch on each run, so
// a change to the transform reaches old releases too and a deleted tag drops
// out. Prereleases (v0.5.0-rc.1 and friends) are never published.
async function main() {
  const previous = await readCatalog();
  const previousMain = previous?.versions.find((version) => version.id === 'main');
  const beforeMain = await hashVersion('main');

  const mainRef = resolveMainRef();
  const releases = releaseRefs().map((ref) => ({
    id: ref,
    ref,
    sourceCommit: resolveCommit(ref),
    kind: 'release',
  }));
  if (releases.length === 0) throw new Error(`no stable release tags found in ${rimzRoot}`);

  await rm(contentRoot, { recursive: true, force: true });
  await rm(assetRoot, { recursive: true, force: true });

  await syncRef('main', mainRef, 'main');
  for (const release of releases) await syncRef(release.id, release.ref, release.ref);

  // Trunk moves on every product commit. Keep the recorded commit while the
  // rendered trunk docs are unchanged, so an unrelated commit does not produce
  // a docs commit and a redeploy.
  const mainCommit = resolveCommit(mainRef);
  const mainSourceCommit = previousMain && beforeMain === (await hashVersion('main'))
    ? previousMain.sourceCommit
    : mainCommit;

  const versions = [
    { id: 'main', ref: 'main', sourceCommit: mainSourceCommit, kind: 'development' },
    ...releases,
  ];

  await writeFile(
    catalogPath,
    `${JSON.stringify({ schemaVersion: 3, versions }, null, 2)}\n`,
    'utf8',
  );
}

/** Stable release tags, newest first. */
function releaseRefs() {
  return git(['tag', '--list', 'v[0-9]*'])
    .split('\n')
    .map((value) => value.trim())
    .filter((value) => parseVersion(value)?.prerelease === '')
    .sort(compareVersions)
    .reverse();
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);

  for (let index = 0; index < 3; index += 1) {
    const difference = a.numbers[index] - b.numbers[index];
    if (difference !== 0) return difference;
  }

  // v0.4 and v0.4.0 name the same release; keep the order deterministic.
  return left.localeCompare(right);
}

function parseVersion(value) {
  const match = value.match(/^v(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) return undefined;

  return {
    numbers: [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)],
    prerelease: match[4] ?? '',
  };
}

function resolveCommit(ref) {
  return git(['rev-parse', `${ref}^{commit}`]);
}

function resolveMainRef() {
  for (const ref of ['main', 'origin/main']) {
    try {
      resolveCommit(ref);
      return ref;
    } catch {
      // Try the remote-tracking ref a detached CI checkout carries.
    }
  }

  throw new Error(`cannot resolve main or origin/main in ${rimzRoot}`);
}

async function syncRef(version, ref, sourceRef) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), `rimz-docs-${version}-`));
  const worktree = path.join(tempRoot, 'source');
  let added = false;

  try {
    git(['worktree', 'add', '--detach', worktree, ref], { stdio: 'inherit' });
    added = true;
    execFileSync(process.execPath, [syncScript], {
      cwd: repoRoot,
      env: { ...process.env, RIMZ_SRC: worktree, RIMZ_VERSION: version, RIMZ_REF: sourceRef },
      stdio: 'inherit',
    });
  } finally {
    try {
      if (added) git(['worktree', 'remove', '--force', worktree], { stdio: 'inherit' });
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}

async function readCatalog() {
  try {
    return JSON.parse(await readFile(catalogPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

async function hashVersion(version) {
  const hash = createHash('sha256');
  let found = false;

  for (const root of [path.join(contentRoot, version), path.join(assetRoot, version)]) {
    if (!(await isDirectory(root))) continue;

    const entries = (await readdir(root, { recursive: true })).sort();
    for (const entry of entries) {
      const target = path.join(root, entry);
      if (!(await stat(target)).isFile()) continue;

      found = true;
      hash.update(`${path.relative(root, target)}\0`);
      hash.update(await readFile(target));
    }
  }

  return found ? hash.digest('hex') : undefined;
}

async function isDirectory(target) {
  try {
    return (await stat(target)).isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function git(args, options = {}) {
  const output = execFileSync('git', ['-C', rimzRoot, ...args], {
    encoding: 'utf8',
    ...options,
  });

  return typeof output === 'string' ? output.trim() : '';
}
