import { getVersionSource } from '@/lib/source';
import { docsVersions, findVersion } from '@/lib/versions';
import { llms } from 'fumadocs-core/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _request: Request,
  { params }: RouteContext<'/llms/[version]/index.txt'>,
) {
  const { version: id } = await params;
  const version = findVersion(id);
  if (!version) notFound();

  return new Response(llms(getVersionSource(version)).index());
}

export function generateStaticParams() {
  return docsVersions.map((version) => ({ version: version.id }));
}
