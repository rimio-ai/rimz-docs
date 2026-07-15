import defaultMdxComponents from 'fumadocs-ui/mdx';
import { withBasePath } from '@/lib/shared';
import type { MDXComponents } from 'mdx/types';
import type { StaticImageData } from 'next/image';
import type { ComponentProps } from 'react';

type ImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  src?: ComponentProps<'img'>['src'] | StaticImageData;
};

function isStaticImageData(src: ImageProps['src']): src is StaticImageData {
  return typeof src === 'object' && src !== null && 'src' in src && typeof src.src === 'string';
}

function getImageSrc(src: ImageProps['src']): ComponentProps<'img'>['src'] {
  if (typeof src === 'string') return withBasePath(src);
  if (isStaticImageData(src)) return withBasePath(src.src);

  return src;
}

function Image({ alt = '', src, height, width, ...props }: ImageProps) {
  const staticImage = isStaticImageData(src) ? src : undefined;
  const imageSrc = getImageSrc(src);

  // Markdown images compile to StaticImageData, while raw HTML images keep string sources.
  // Flatten both to a URL before rendering a native img and prefix static base paths.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt} height={height ?? staticImage?.height} src={imageSrc} width={width ?? staticImage?.width} />;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: Image,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
