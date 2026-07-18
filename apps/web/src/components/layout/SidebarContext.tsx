"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type SidebarContextValue = {
  desktopOpen: boolean;
  toggleDesktop: () => void;
  closeDesktop: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

const STORAGE_KEY = "speak-coach-sidebar-open";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const path = window.location.pathname;
    const onDesktopDashboard = path === "/dashboard";
    if (stored === "true" && !onDesktopDashboard) setDesktopOpen(true);
    setHydrated(true);
    document.body.style.overflow = "";
  }, []);

  const toggleDesktop = useCallback(() => {
    setDesktopOpen((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const closeDesktop = useCallback(() => {
    setDesktopOpen(false);
    localStorage.setItem(STORAGE_KEY, "false");
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDesktop();
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        toggleDesktop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hydrated, desktopOpen, closeDesktop, toggleDesktop]);

  return (
    <SidebarContext.Provider value={{ desktopOpen, toggleDesktop, closeDesktop }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export function useSidebarOptional() {
  return useContext(SidebarContext);
}
