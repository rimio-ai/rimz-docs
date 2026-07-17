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
const refreshReleases = process.argv.includes('--refresh-releases');

await main();

async function main() {
  const previous = await readCatalog();
  const previousById = new Map(previous?.versions.map((entry) => [entry.id, entry]) ?? []);
  const releaseRefs = listReleaseRefs();

  if (releaseRefs.length === 0) {
    throw new Error(`no release tags found in ${rimzRoot}`);
  }

  for (const version of previous?.versions ?? []) {
    if (version.kind === 'release' && !releaseRefs.includes(version.ref)) {
      throw new Error(`published documentation tag disappeared: ${version.ref}`);
    }
  }

  const mainRef = resolveMainRef();
  const mainCommit = resolveCommit(mainRef);
  const beforeMain = await hashVersion('main');
  await syncRef('main', mainRef, 'main');
  const afterMain = await hashVersion('main');
  const previousMain = previousById.get('main');
  const renderedMainChanged = beforeMain !== afterMain;
  const mainSourceCommit = renderedMainChanged || !previousMain
    ? mainCommit
    : previousMain.sourceCommit;

  const releases = [];
  for (const ref of releaseRefs) {
    const sourceCommit = resolveCommit(ref);
    const previousRelease = previousById.get(ref);

    if (previousRelease && previousRelease.sourceCommit !== sourceCommit) {
      throw new Error(
        `release tag ${ref} moved from ${previousRelease.sourceCommit} to ${sourceCommit}`,
      );
    }

    const exists = await isDirectory(path.join(contentRoot, ref));
    if (!exists || refreshReleases) await syncRef(ref, ref);

    releases.push({
      id: ref,
      label: ref,
      ref,
      sourceCommit,
      kind: 'release',
    });
  }

  const latest = releases[0].id;
  const versions = [
    { ...releases[0], label: `${releases[0].label} (latest)` },
    {
      id: 'main',
      label: 'main (unreleased)',
      ref: 'main',
      sourceCommit: mainSourceCommit,
      kind: 'development',
    },
    ...releases.slice(1),
  ];

  await writeFile(
    catalogPath,
    `${JSON.stringify({ schemaVersion: 1, latest, versions }, null, 2)}\n`,
    'utf8',
  );
}

function listReleaseRefs() {
  const refs = git(['tag', '--list', 'v[0-9]*'])
    .split('\n')
    .map((value) => value.trim())
    .filter((value) => parseVersion(value));

  return refs.sort(compareVersions).reverse();
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);

  for (let index = 0; index < 3; index += 1) {
    const difference = a.numbers[index] - b.numbers[index];
    if (difference !== 0) return difference;
  }

  if (!a.prerelease && b.prerelease) return 1;
  if (a.prerelease && !b.prerelease) return -1;
  return a.prerelease.localeCompare(b.prerelease, undefined, { numeric: true });
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
      // Try the remote-tracking ref used by detached CI checkouts.
    }
  }

  throw new Error(`cannot resolve main or origin/main in ${rimzRoot}`);
}

async function syncRef(version, ref, sourceRef = ref) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), `rimz-docs-${version}-`));
  const worktree = path.join(tempRoot, 'source');
  let added = false;

  try {
    git(['worktree', 'add', '--detach', worktree, ref], { stdio: 'inherit' });
    added = true;
    execFileSync(process.execPath, [syncScript], {
      cwd: repoRoot,
      env: {
        ...process.env,
        RIMZ_SRC: worktree,
        RIMZ_VERSION: version,
        RIMZ_REF: sourceRef,
      },
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
      hash.update(path.relative(root, target));
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
