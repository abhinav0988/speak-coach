"use client";

import { useMediaQuery } from "./useMediaQuery";
import {
  ADAPTIVE_MEDIA,
  type AdaptiveTier,
  tierFromWidth,
} from "@/lib/adaptive-layout";

export function useIsPhone(): boolean {
  return useMediaQuery(ADAPTIVE_MEDIA.phone);
}

export function useIsTablet(): boolean {
  return useMediaQuery(ADAPTIVE_MEDIA.tablet);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(ADAPTIVE_MEDIA.desktop);
}

export function useBreakpoint(): AdaptiveTier {
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();
  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";
  return "phone";
}

/** SSR-safe initial tier from window width (client only). */
export function useWindowTier(): AdaptiveTier {
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();
  if (typeof window !== "undefined" && !isDesktop && !isTablet) {
    return tierFromWidth(window.innerWidth);
  }
  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";
  return "phone";
}
