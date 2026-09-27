import { getLLMText, getVersionSource } from '@/lib/source';
import { defaultVersion } from '@/lib/versions';

export const revalidate = false;

export async function GET() {
  const scan = getVersionSource(defaultVersion).getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
