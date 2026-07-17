import { getExplicitPages, getPageImage, resolveExplicitPage } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const resolved = resolveExplicitPage(slug.slice(0, -1));
  if (!resolved) notFound();

  return new ImageResponse(
    <DefaultImage
      title={`${resolved.page.data.title} (${resolved.version.id})`}
      description={resolved.page.data.description}
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return getExplicitPages().map(({ page, version }) => ({
    lang: page.locale,
    slug: getPageImage(page, version).segments,
  }));
}
