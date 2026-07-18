import { CONTAINER, PAGE_PADDING, PAGE_PADDING_BOTTOM, PAGE_PY, hasSelfChrome, containerForPath } from "./design-tokens";

export { CONTAINER, PAGE_PADDING, PAGE_PADDING_BOTTOM, PAGE_PY, hasSelfChrome, containerForPath };

/** Main content area classes for AppShell */
export function mainContentClasses(pathname: string): string {
  const selfChrome = hasSelfChrome(pathname);
  return [
    "flex-1 min-w-0 overflow-x-hidden",
    PAGE_PY,
    selfChrome ? "px-0 py-0 pb-0 lg:px-6 lg:py-6 lg:pb-8" : PAGE_PADDING,
    selfChrome ? "" : PAGE_PADDING_BOTTOM,
  ]
    .filter(Boolean)
    .join(" ");
}
