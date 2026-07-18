"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Desktop tier — ≥ 1024px. Prefer useBreakpoint() for full phone/tablet/desktop. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
