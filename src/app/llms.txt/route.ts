import { getVersionSource } from '@/lib/source';
import { defaultVersion } from '@/lib/versions';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

export function GET() {
  return new Response(llms(getVersionSource(defaultVersion)).index());
}
