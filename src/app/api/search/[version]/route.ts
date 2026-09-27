import { getVersionSource } from '@/lib/source';
import { docsVersions, requireVersion } from '@/lib/versions';
import { createFromSource } from 'fumadocs-core/search/server';

// One static index per documentation version, so a reader downloads only the
// index for the version they are searching.
function createSearch(versionId: string) {
  return createFromSource(getVersionSource(requireVersion(versionId)), {
    // https://docs.orama.com/docs/orama-js/supported-languages
    language: 'english',
    buildIndex(page) {
      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        id: page.url,
        structuredData: page.data.structuredData,
      };
    },
  });
}

export const dynamic = 'force-static';

export async function GET(_request: Request, { params }: RouteContext<'/api/search/[version]'>) {
  const { version } = await params;
  return createSearch(version).staticGET();
}

export function generateStaticParams() {
  return docsVersions.map((version) => ({ version: version.id }));
}
