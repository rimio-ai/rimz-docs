import {
  getDocsStaticParams,
  getPageImage,
  getPageMarkdownUrl,
  getVersionSwitches,
  resolveDocsRequest,
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
import { absoluteUrl, docsGitConfig } from '@/lib/shared';
import { baseOptions } from '@/lib/layout.shared';
import { explicitVersionUrl, latestVersion, type DocsVersion } from '@/lib/versions';
import Link from 'next/link';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const request = resolveDocsRequest(params.slug);
  const page = request.source.getPage(request.pageSlugs);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page, request.version).url;
  const switches = getVersionSwitches(page.slugs);

  return (
    <DocsLayout tree={request.source.getPageTree()} {...baseOptions(request.version, switches)}>
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <VersionNotice version={request.version} switches={switches} />
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${docsGitConfig.user}/${docsGitConfig.repo}/blob/${docsGitConfig.branch}/content/versions/${request.version.id}/${page.path}`}
          />
        </div>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(request.source, page),
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
  const request = resolveDocsRequest(params.slug);
  const page = request.source.getPage(request.pageSlugs);
  if (!page) notFound();

  const canonical = absoluteUrl(`${explicitVersionUrl(request.version, page.slugs)}/`);
  const isIntroduction = page.slugs.length === 0;

  return {
    title: isIntroduction
      ? `RimZ documentation (${request.version.id})`
      : `${page.data.title} (${request.version.id})`,
    description: page.data.description,
    alternates: { canonical },
    robots: request.version.kind === 'development' ? { index: false, follow: true } : undefined,
    openGraph: {
      url: canonical,
      images: absoluteUrl(getPageImage(page, request.version).url),
    },
  };
}

function VersionNotice({
  version,
  switches,
}: {
  version: DocsVersion;
  switches: ReturnType<typeof getVersionSwitches>;
}) {
  if (version.kind === 'development') {
    const latest = switches.find((item) => item.version.id === latestVersion.id);
    return (
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
        This page documents unreleased work on <code>main</code>.{' '}
        {latest && <Link className="font-medium underline underline-offset-4" href={latest.url}>Read the latest release.</Link>}
      </div>
    );
  }

  if (version.id !== latestVersion.id) {
    const latest = switches.find((item) => item.version.id === latestVersion.id);
    return (
      <div className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm">
        You are reading documentation for an older RimZ release.{' '}
        {latest && <Link className="font-medium underline underline-offset-4" href={latest.url}>Read {latestVersion.id}.</Link>}
      </div>
    );
  }

  return null;
}
