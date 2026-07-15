import Link from 'next/link';
import { docsRoute, withBasePath } from '@/lib/shared';

export default function HomePage() {
  const docsUrl = withBasePath(`${docsRoute}/`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <meta httpEquiv="refresh" content={`0;url=${docsUrl}`} />
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace(${JSON.stringify(docsUrl)});` }} />
      <h1 className="text-2xl font-semibold">RimZ Docs</h1>
      <p className="text-muted-foreground">Redirecting to the documentation.</p>
      <Link className="underline underline-offset-4" href={docsRoute}>
        Open the docs
      </Link>
    </main>
  );
}
