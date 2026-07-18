/**
 * Unified design tokens — 8px spacing system, shared across all pages.
 * Use Tailwind classes where possible; CSS vars for runtime/theming.
 */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** Container max-widths per page tier */
export const CONTAINER = {
  narrow: "max-w-3xl",   // learn, forms
  default: "max-w-5xl",  // coach, profile, settings
  wide: "max-w-7xl",     // dashboard, analytics
  full: "max-w-[1920px]", // ultra-wide
} as const;

/** Responsive page padding — matches CSS vars --page-px */
export const PAGE_PADDING = "px-4 sm:px-6 lg:px-8 xl:px-12";

/** Bottom padding accounting for mobile nav + safe area */
export const PAGE_PADDING_BOTTOM =
  "pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8";

/** Standard vertical rhythm */
export const PAGE_PY = "py-4 md:py-6 xl:py-8";

/** Responsive grid for cards/metrics */
export const GRID_CARDS =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4";

export const GRID_CARDS_2 =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4";

export const GRID_ANALYTICS =
  "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

/** Typography scale */
export const TYPE = {
  hero: "text-3xl font-black tracking-tight md:text-4xl xl:text-5xl",
  title: "text-xl font-black tracking-tight md:text-2xl xl:text-[30px]",
  card: "text-base font-bold md:text-[22px]",
  body: "text-sm md:text-base",
  caption: "text-xs md:text-[13px]",
} as const;

/** Unified radii — 24px cards, 14px buttons, 12px inputs */
export const RADIUS = {
  card: "rounded-[24px]",
  btn: "rounded-2xl",
  input: "rounded-xl",
  pill: "rounded-full",
} as const;

/** Touch-friendly minimum */
export const TOUCH = "min-h-12 min-w-12";

/** Glass card base */
export const GLASS =
  "rounded-[24px] border border-white/60 bg-white/58 shadow-[0_24px_64px_rgba(15,23,42,0.09)] backdrop-blur-[30px] dark:border-white/10 dark:bg-slate-900/55";

/** Primary gradient */
export const GRADIENT_PRIMARY =
  "bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED]";

/** Routes with self-contained top chrome (hide AppShell TopNav) */
export const SELF_CHROME_PATHS = ["/coach", "/profile"] as const;

export function hasSelfChrome(pathname: string): boolean {
  return SELF_CHROME_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/** Container width per route */
export function containerForPath(pathname: string): keyof typeof CONTAINER {
  if (pathname.startsWith("/session") || pathname === "/rewards") return "narrow";
  if (pathname === "/" || pathname === "/dashboard" || pathname.startsWith("/analytics")) return "wide";
  if (hasSelfChrome(pathname)) return "default";
  return "default";
}
