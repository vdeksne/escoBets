import type { ImgHTMLAttributes } from "react";

/**
 * Stub for next/image in Storybook (Vite builder).
 * Renders a plain <img> so stories work without Next.js (avoids "process is not defined").
 */
export default function Image({
  src,
  alt,
  width,
  height,
  className,
  priority,
  fill,
  sizes,
  placeholder,
  loader,
  quality,
  unoptimized,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  placeholder?: string;
  loader?: () => void;
  quality?: number;
  unoptimized?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt ?? ""}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      {...rest}
    />
  );
}
