#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const repoRoot = process.cwd();
const rimzRoot = path.resolve(process.env.RIMZ_SRC ?? path.join(repoRoot, '..', 'rimz'));
const versionPath = path.join(repoRoot, 'content', 'version.json');
const syncScript = path.join(repoRoot, 'scripts', 'sync-content.mjs');

await main();

async function main() {
  const ref = latestReleaseRef();
  const sourceCommit = resolveCommit(ref);

  await syncRef(ref);
  await writeFile(
    versionPath,
    `${JSON.stringify({ schemaVersion: 2, id: ref, ref, sourceCommit }, null, 2)}\n`,
    'utf8',
  );
}

// The site documents exactly one release: the highest stable release tag in
// the product repository. Patch tags such as v0.4.1 supersede v0.4
// automatically, and a future v0.5 takes over without any change here.
// Prereleases (v0.5.0-rc.1 and friends) are never published.
function latestReleaseRef() {
  const refs = git(['tag', '--list', 'v[0-9]*'])
    .split('\n')
    .map((value) => value.trim())
    .filter((value) => parseVersion(value)?.prerelease === '')
    .sort(compareVersions);

  const latest = refs.at(-1);
  if (!latest) throw new Error(`no stable release tags found in ${rimzRoot}`);

  return latest;
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);

  for (let index = 0; index < 3; index += 1) {
    const difference = a.numbers[index] - b.numbers[index];
    if (difference !== 0) return difference;
  }

  return 0;
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

async function syncRef(ref) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'rimz-docs-'));
  const worktree = path.join(tempRoot, 'source');
  let added = false;

  try {
    git(['worktree', 'add', '--detach', worktree, ref], { stdio: 'inherit' });
    added = true;
    execFileSync(process.execPath, [syncScript], {
      cwd: repoRoot,
      env: { ...process.env, RIMZ_SRC: worktree, RIMZ_REF: ref },
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

function git(args, options = {}) {
  const output = execFileSync('git', ['-C', rimzRoot, ...args], {
    encoding: 'utf8',
    ...options,
  });

  return typeof output === 'string' ? output.trim() : '';
}
