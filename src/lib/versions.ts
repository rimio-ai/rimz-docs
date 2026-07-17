import catalogJson from '../../content/versions.json';
import { docsRoute } from './shared';

export type DocsVersion = {
  id: string;
  label: string;
  ref: string;
  sourceCommit: string;
  kind: 'development' | 'release';
};

type VersionCatalog = {
  schemaVersion: 1;
  latest: string;
  versions: DocsVersion[];
};

export const versionCatalog = catalogJson as VersionCatalog;
export const docsVersions = versionCatalog.versions;
export const latestVersion = requireVersion(versionCatalog.latest);

export function findVersion(id: string | undefined) {
  if (!id) return undefined;
  return docsVersions.find((version) => version.id === id);
}

export function requireVersion(id: string) {
  const version = findVersion(id);
  if (!version) throw new Error(`unknown documentation version: ${id}`);
  return version;
}

export function explicitVersionUrl(version: DocsVersion, slugs: string[] = []) {
  return `${docsRoute}/${[version.id, ...slugs].join('/')}`;
}

export function latestAliasUrl(slugs: string[] = []) {
  return `${docsRoute}${slugs.length > 0 ? `/${slugs.join('/')}` : ''}`;
}

export function versionFromPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const docsIndex = segments.indexOf(docsRoute.slice(1));
  const candidate = docsIndex === -1 ? undefined : findVersion(segments[docsIndex + 1]);
  return candidate ?? latestVersion;
}
