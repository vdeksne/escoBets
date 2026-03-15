/**
 * Stub for next/navigation in Storybook (React/Vite builder).
 * Provides usePathname so components like Header render without the Next.js router.
 */
export function usePathname(): string {
  return "/";
}

export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
    prefetch: () => {},
  };
}

export function useSearchParams() {
  return new URLSearchParams();
}
