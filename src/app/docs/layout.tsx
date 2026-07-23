import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'RimZ Documentation',
    template: '%s | RimZ Docs',
  },
};

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return children;
}
