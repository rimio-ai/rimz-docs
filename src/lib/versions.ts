import catalogJson from '../../content/versions.json';
import { docsRoute } from './shared';

export type DocsVersion = {
  /** `main` for trunk, or a release tag such as `v0.4.3`. */
  id: string;
  /** The product repository ref the set was built from. */
  ref: string;
  sourceCommit: string;
  kind: 'development' | 'release';
};

type VersionCatalog = {
  schemaVersion: 3;
  /** Trunk first, then stable releases newest first. */
  versions: DocsVersion[];
};

export const versionCatalog = catalogJson as VersionCatalog;
export const docsVersions = versionCatalog.versions;

/** Trunk: the default set, served at /docs with no version in the path. */
export const defaultVersion = requireVersion('main');
export const latestRelease = docsVersions.find((version) => version.kind === 'release');

export function findVersion(id: string | undefined) {
  if (!id) return undefined;
  return docsVersions.find((version) => version.id === id);
}

export function requireVersion(id: string) {
  const version = findVersion(id);
  if (!version) throw new Error(`unknown documentation version: ${id}`);
  return version;
}

export function isDefaultVersion(version: DocsVersion) {
  return version.id === defaultVersion.id;
}

/** Path segments that address a version below a route: none for trunk. */
export function versionSegments(version: DocsVersion) {
  return isDefaultVersion(version) ? [] : [version.id];
}

export function versionBaseUrl(version: DocsVersion) {
  return [docsRoute, ...versionSegments(version)].join('/');
}

export function versionLabel(version: DocsVersion) {
  return isDefaultVersion(version) ? 'latest' : version.id;
}

export function versionDescription(version: DocsVersion) {
  if (isDefaultVersion(version)) return 'main branch';
  if (version.id === latestRelease?.id) return 'latest release';
  return 'release';
}

/** Splits a path below a versioned route into its version and the rest. */
export function splitVersion(segments: string[] = []) {
  const explicit = findVersion(segments[0]);
  if (explicit && !isDefaultVersion(explicit)) {
    return { version: explicit, rest: segments.slice(1) };
  }

  return { version: defaultVersion, rest: segments };
}

export function versionFromPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const docsIndex = segments.indexOf(docsRoute.slice(1));
  if (docsIndex === -1) return defaultVersion;

  return splitVersion(segments.slice(docsIndex + 1)).version;
}

export function searchApiRoute(version: DocsVersion) {
  return `/api/search/${version.id}`;
}
