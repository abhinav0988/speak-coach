"use client";

import Link from "next/link";
import { DesktopTopBar, MobileTopBar } from "./DesktopTopBar";
import { useIsDesktop } from "@/hooks/useMediaQuery";

export function TopNav({
  minimal = false,
  onMenuClick,
}: {
  minimal?: boolean;
  onMenuClick?: () => void;
}) {
  const isDesktop = useIsDesktop();

  if (minimal) {
    return (
      <header className="sticky top-0 z-50 border-b border-surface-border bg-[var(--card)]/90 backdrop-blur-xl dark:border-gray-800">
        <div className="mx-auto flex h-14 max-w-ultra items-center justify-center px-4 sm:px-6">
          <Link href="/" className="text-base font-bold tracking-tight md:text-lg">
            Speak Coach
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      {isDesktop ? <DesktopTopBar /> : <MobileTopBar onMenuClick={onMenuClick} />}
    </>
  );
}
