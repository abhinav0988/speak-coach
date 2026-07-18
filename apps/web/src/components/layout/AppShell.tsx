"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { MobileBottomNav } from "./MobileBottomNav";
import { AuthGate } from "@/components/AuthProvider";
import { useSidebar } from "@/components/layout/SidebarContext";
import {
  AdaptiveChrome,
  AdaptiveLayoutProvider,
  TabletSidebarRail,
  useAdaptiveLayoutOptional,
} from "@/components/adaptive";
import { useIsDesktop, useIsTablet } from "@/hooks/useBreakpoint";
import { hasSelfChrome } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

function isDesktopDashboardRoute(pathname: string) {
  return pathname === "/dashboard";
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/auth" ||
    pathname.startsWith("/auth/");
  const selfChrome = hasSelfChrome(pathname);
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();
  const desktopDash = isDesktopDashboardRoute(pathname);
  const { desktopOpen, closeDesktop } = useSidebar();
  const adaptive = useAdaptiveLayoutOptional();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tabletTreeOpen, setTabletTreeOpen] = useState(true);
  const isFirstNav = useRef(true);

  const showTopNav = !selfChrome || isDesktop;
  const sidebarLocksScroll =
    mobileSidebarOpen || (desktopOpen && !desktopDash) || adaptive?.aiOpen;

  useEffect(() => {
    if (sidebarLocksScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarLocksScroll]);

  useEffect(() => {
    if (desktopDash && desktopOpen) closeDesktop();
  }, [desktopDash, desktopOpen, closeDesktop]);

  useEffect(() => {
    if (isFirstNav.current) {
      isFirstNav.current = false;
      return;
    }
    setMobileSidebarOpen(false);
    closeDesktop();
    adaptive?.closePanel();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset chrome on route change only
  }, [pathname]);

  if (isAuthPage) {
    return (
      <div className="min-h-dvh overflow-x-hidden">
        <AuthGate>{children}</AuthGate>
      </div>
    );
  }

  const openTabletTree = () => {
    setTabletTreeOpen(true);
    adaptive?.openTree();
  };

  return (
    <div className="min-h-dvh overflow-x-hidden gradient-mesh">
      <div className="flex min-h-0 w-full">
        {/* Tablet: persistent icon rail (two-pane layout) */}
        {isTablet && !desktopDash && (
          <TabletSidebarRail onExpandTree={openTabletTree} />
        )}

        {/* Tablet: resizable tree pane */}
        {isTablet && tabletTreeOpen && !desktopDash && (
          <div className="hidden w-[min(280px,32vw)] shrink-0 overflow-hidden border-r border-white/40 md:block lg:hidden dark:border-white/10">
            <SideNav
              className="!relative !flex !h-full !w-full !max-w-none !rounded-none !border-0 !shadow-none"
              onNavigate={() => setTabletTreeOpen(false)}
            />
          </div>
        )}

        {/* Phone: left drawer (legacy menu button) */}
        {mobileSidebarOpen && !isTablet && !isDesktop && (
          <>
            <div
              className="premium-backdrop-enter fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden
            />
            <SideNav
              mobile
              className="fixed inset-y-0 left-0 z-50 h-dvh max-h-dvh w-[min(84vw,390px)] md:hidden"
              onNavigate={() => setMobileSidebarOpen(false)}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </>
        )}

        {/* Desktop: overlay sidebar from top bar toggle */}
        {desktopOpen && !desktopDash && isDesktop && (
          <>
            <div
              className="premium-backdrop-enter fixed inset-0 z-40 hidden bg-slate-900/20 backdrop-blur-[6px] lg:block"
              onClick={closeDesktop}
              aria-hidden
            />
            <SideNav
              desktopOverlay
              className="fixed inset-y-0 left-0 z-50 hidden h-dvh max-h-dvh lg:flex"
              onNavigate={closeDesktop}
              onClose={closeDesktop}
            />
          </>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {showTopNav && (
            <div className={cn(desktopDash && "lg:hidden")}>
              <TopNav onMenuClick={() => setMobileSidebarOpen(true)} />
            </div>
          )}
          <main
            className={cn(
              "flex-1 min-w-0",
              desktopDash
                ? "lg:overflow-visible max-lg:overflow-x-hidden max-lg:px-4 max-lg:py-4 max-lg:pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:max-lg:px-6 md:max-lg:py-6 md:max-lg:px-8 md:max-lg:pb-8"
                : cn(
                    "overflow-x-hidden",
                    adaptive?.tableMode && "fixed inset-0 z-20 overflow-y-auto bg-[var(--background)] px-4 py-4 md:relative md:inset-auto md:z-auto",
                    selfChrome && !isDesktop
                      ? adaptive?.tableMode ? "pb-4" : "pb-0"
                      : cn(
                          "px-4 py-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 md:py-6 lg:px-8 lg:pb-8",
                          isTablet && "md:pb-6"
                        )
                  )
            )}
          >
            <AuthGate>{children}</AuthGate>
          </main>
        </div>
      </div>

      {/* Phone bottom nav + adaptive chrome (FAB, toolbar, bottom sheets) */}
      <MobileBottomNav />
      <AdaptiveChrome />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AdaptiveLayoutProvider>
      <AppShellInner>{children}</AppShellInner>
    </AdaptiveLayoutProvider>
  );
}
