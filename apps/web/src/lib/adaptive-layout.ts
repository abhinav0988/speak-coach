/**
 * Adaptive layout breakpoints and panel identifiers.
 *
 * Phone:   < 768px  — bottom nav, full-screen editor, bottom sheets
 * Tablet:  768–1023px — two-pane editor + tree rail, slide-overs
 * Desktop: ≥ 1024px — multi-panel workspace, resizable splits
 */

export const ADAPTIVE_BREAKPOINTS = {
  phoneMax: 767,
  tabletMin: 768,
  tabletMax: 1023,
  desktopMin: 1024,
} as const;

export type AdaptiveTier = "phone" | "tablet" | "desktop";

export const ADAPTIVE_MEDIA = {
  phone: `(max-width: ${ADAPTIVE_BREAKPOINTS.phoneMax}px)`,
  tablet: `(min-width: ${ADAPTIVE_BREAKPOINTS.tabletMin}px) and (max-width: ${ADAPTIVE_BREAKPOINTS.tabletMax}px)`,
  desktop: `(min-width: ${ADAPTIVE_BREAKPOINTS.desktopMin}px)`,
  notDesktop: `(max-width: ${ADAPTIVE_BREAKPOINTS.tabletMax}px)`,
} as const;

export type AdaptivePanel = "tree" | "editor" | "table" | "ai" | "compare";

export const DEFAULT_SPLIT_RATIO = 0.32;
export const MIN_SPLIT_PANE_PX = 240;
export const MAX_SPLIT_PANE_PX = 480;

export function tierFromWidth(width: number): AdaptiveTier {
  if (width <= ADAPTIVE_BREAKPOINTS.phoneMax) return "phone";
  if (width <= ADAPTIVE_BREAKPOINTS.tabletMax) return "tablet";
  return "desktop";
}

/** Tailwind class helpers */
export const ADAPTIVE_CLASSES = {
  phoneOnly: "md:hidden",
  tabletOnly: "hidden md:block lg:hidden",
  desktopOnly: "hidden lg:block",
  notDesktop: "lg:hidden",
  phoneBottomPad: "pb-[calc(5.5rem+env(safe-area-inset-bottom))]",
  desktopBottomPad: "lg:pb-8",
} as const;
