import type { ComponentProps } from "react";

/**
 * Stub for next/link in Storybook (React/Vite builder).
 * Renders a plain <a> so stories work without Next.js router.
 */
export default function Link({
  href,
  children,
  ...rest
}: ComponentProps<"a"> & { href: string }) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
