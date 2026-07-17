import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute, withBasePath } from './shared';
import {
  docsVersions,
  explicitVersionUrl,
  latestVersion,
  type DocsVersion,
} from './versions';

const collection = docs.toFumadocsSource();

// This combined source owns canonical version-prefixed URLs and the search index.
export const source = loader({
  baseUrl: docsRoute,
  source: collection,
  plugins: [lucideIconsPlugin()],
});

function createVersionSource(version: DocsVersion, baseUrl: string) {
  const prefix = `${version.id}/`;
  const files = collection.files
    .filter((file) => file.path.startsWith(prefix))
    .map((file) => ({ ...file, path: file.path.slice(prefix.length) }));

  return loader({
    baseUrl,
    source: { files: files as typeof collection.files },
    plugins: [lucideIconsPlugin()],
  });
}

export type VersionSource = ReturnType<typeof createVersionSource>;

const explicitSources = new Map(
  docsVersions.map((version) => [
    version.id,
    createVersionSource(version, explicitVersionUrl(version)),
  ]),
);

export const latestSource = createVersionSource(latestVersion, docsRoute);

export function getVersionSource(version: DocsVersion) {
  const versionSource = explicitSources.get(version.id);
  if (!versionSource) throw new Error(`missing content source for ${version.id}`);
  return versionSource;
}

export function resolveDocsRequest(slug: string[] | undefined) {
  const segments = slug ?? [];
  const explicitVersion = docsVersions.find((version) => version.id === segments[0]);

  if (explicitVersion) {
    return {
      version: explicitVersion,
      source: getVersionSource(explicitVersion),
      pageSlugs: segments.slice(1),
      alias: false,
    };
  }

  return {
    version: latestVersion,
    source: latestSource,
    pageSlugs: segments,
    alias: true,
  };
}

export function getDocsStaticParams() {
  const aliases = latestSource.getPages().map((page) => ({ slug: page.slugs }));
  const explicit = docsVersions.flatMap((version) =>
    getVersionSource(version).getPages().map((page) => ({
      slug: [version.id, ...page.slugs],
    })),
  );

  return [...aliases, ...explicit];
}

export function getVersionSwitches(pageSlugs: string[]) {
  return docsVersions.map((version) => {
    const versionSource = getVersionSource(version);
    const targetSlugs = versionSource.getPage(pageSlugs) ? pageSlugs : [];

    return {
      version,
      url: explicitVersionUrl(version, targetSlugs),
    };
  });
}

export function getExplicitPages() {
  return docsVersions.flatMap((version) => {
    const versionSource = getVersionSource(version);
    return versionSource.getPages().map((page) => ({ version, source: versionSource, page }));
  });
}

export function resolveExplicitPage(segments: string[]) {
  const version = docsVersions.find((candidate) => candidate.id === segments[0]);
  if (!version) return undefined;

  const versionSource = getVersionSource(version);
  const page = versionSource.getPage(segments.slice(1));
  if (!page) return undefined;

  return { version, source: versionSource, page };
}

export function getPageImage(page: VersionSource['$inferPage'], version: DocsVersion) {
  const segments = [version.id, ...page.slugs, 'image.png'];

  return {
    segments,
    url: withBasePath(`${docsImageRoute}/${segments.join('/')}`),
  };
}

export function getPageMarkdownUrl(page: VersionSource['$inferPage'], version: DocsVersion) {
  const segments = [version.id, ...page.slugs, 'content.md'];

  return {
    segments,
    url: withBasePath(`${docsContentRoute}/${segments.join('/')}`),
  };
}

export async function getLLMText(page: VersionSource['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
