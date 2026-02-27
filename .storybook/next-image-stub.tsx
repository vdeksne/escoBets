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
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...rest}
    />
  );
}
