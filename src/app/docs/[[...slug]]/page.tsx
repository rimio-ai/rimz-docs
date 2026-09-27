import {
  getDocsStaticParams,
  getPageImage,
  getPageMarkdownUrl,
  getVersionSwitches,
  resolveDocsPage,
} from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import Link from 'next/link';
import { absoluteUrl, docsGitConfig } from '@/lib/shared';
import { baseOptions } from '@/lib/layout.shared';
import { JsonLd } from '@/components/json-ld';
import { VersionSelect } from '@/components/version-select';
import {
  defaultVersion,
  isDefaultVersion,
  versionBaseUrl,
  versionDescription,
  versionLabel,
  type DocsVersion,
} from '@/lib/versions';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const { version, source, page } = resolveDocsPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page, version).url;
  const canonical = pageCanonical(version, page.slugs);
  const searchTitle = plainTextTitle(page.data.title);
  const switches = getVersionSwitches(page.slugs);
  const rootName = documentationName(version);
  const breadcrumbJsonLd =
    page.slugs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: rootName,
              item: absoluteUrl(`${versionBaseUrl(version)}/`),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: searchTitle,
              item: canonical,
            },
          ],
        }
      : undefined;

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        banner: (
          <VersionSelect
            current={version.id}
            options={switches.map((item) => ({
              id: item.version.id,
              label: versionLabel(item.version),
              description: versionDescription(item.version),
              url: item.url,
            }))}
          />
        ),
      }}
    >
      {breadcrumbJsonLd ? <JsonLd data={breadcrumbJsonLd} /> : null}
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        breadcrumb={{ includeRoot: true, includePage: true }}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <VersionNotice
          version={version}
          latestUrl={switches.find((item) => isDefaultVersion(item.version))?.url}
        />
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${docsGitConfig.user}/${docsGitConfig.repo}/blob/${docsGitConfig.branch}/content/versions/${version.id}/${page.path}`}
          />
        </div>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  return getDocsStaticParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const { version, page } = resolveDocsPage(params.slug);
  if (!page) notFound();

  const canonical = pageCanonical(version, page.slugs);
  const isIntroduction = page.slugs.length === 0;
  const isDefault = isDefaultVersion(version);
  const title = isIntroduction
    ? isDefault
      ? 'RimZ Documentation: Installation, CLI, and Agent Guides'
      : documentationName(version)
    : isDefault
      ? plainTextTitle(page.data.title)
      : `${plainTextTitle(page.data.title)} (${version.id})`;

  return {
    title: isIntroduction ? { absolute: title } : title,
    description: page.data.description,
    alternates: { canonical },
    // Release snapshots stay reachable but out of search results, which would
    // otherwise fill with near-duplicates of the current documentation.
    robots: isDefault ? undefined : { index: false, follow: true },
    openGraph: {
      url: canonical,
      images: absoluteUrl(getPageImage(page, version).url),
    },
  };
}

function VersionNotice({ version, latestUrl }: { version: DocsVersion; latestUrl?: string }) {
  if (isDefaultVersion(version)) return null;

  return (
    <div className="rounded-lg border border-fd-primary/30 bg-fd-primary/10 px-4 py-3 text-sm">
      You are reading the documentation for RimZ <code>{version.id}</code>.{' '}
      {latestUrl ? (
        <Link className="font-medium underline underline-offset-4" href={latestUrl}>
          Read the {versionLabel(defaultVersion)} documentation.
        </Link>
      ) : null}
    </div>
  );
}

function documentationName(version: DocsVersion) {
  return isDefaultVersion(version) ? 'RimZ Documentation' : `RimZ Documentation (${version.id})`;
}

function pageCanonical(version: DocsVersion, slugs: string[]) {
  return absoluteUrl(`${[versionBaseUrl(version), ...slugs].join('/')}/`);
}

function plainTextTitle(title: string) {
  return title.replace(/`([^`]+)`/g, '$1');
}
