"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { AdaptivePanel } from "@/lib/adaptive-layout";

type AdaptiveLayoutContextValue = {
  tier: ReturnType<typeof useBreakpoint>;
  /** Tree / feature navigation panel */
  treeOpen: boolean;
  openTree: () => void;
  closeTree: () => void;
  toggleTree: () => void;
  /** AI coach assistant panel */
  aiOpen: boolean;
  openAi: () => void;
  closeAi: () => void;
  toggleAi: () => void;
  /** Table / list full-screen mode (phone) */
  tableMode: boolean;
  enterTableMode: () => void;
  exitTableMode: () => void;
  /** Floating toolbar collapsed state */
  toolbarCollapsed: boolean;
  toggleToolbar: () => void;
  /** Active panel for slide-overs */
  activePanel: AdaptivePanel | null;
  openPanel: (panel: AdaptivePanel) => void;
  closePanel: () => void;
};

const AdaptiveLayoutContext = createContext<AdaptiveLayoutContextValue | null>(null);

export function AdaptiveLayoutProvider({ children }: { children: ReactNode }) {
  const tier = useBreakpoint();
  const [treeOpen, setTreeOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [tableMode, setTableMode] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<AdaptivePanel | null>(null);

  const openTree = useCallback(() => {
    setTreeOpen(true);
    setActivePanel("tree");
  }, []);
  const closeTree = useCallback(() => {
    setTreeOpen(false);
    setActivePanel((p) => (p === "tree" ? null : p));
  }, []);
  const toggleTree = useCallback(() => setTreeOpen((v) => !v), []);

  const openAi = useCallback(() => {
    setAiOpen(true);
    setActivePanel("ai");
  }, []);
  const closeAi = useCallback(() => {
    setAiOpen(false);
    setActivePanel((p) => (p === "ai" ? null : p));
  }, []);
  const toggleAi = useCallback(() => setAiOpen((v) => !v), []);

  const enterTableMode = useCallback(() => setTableMode(true), []);
  const exitTableMode = useCallback(() => setTableMode(false), []);
  const toggleToolbar = useCallback(() => setToolbarCollapsed((v) => !v), []);

  const openPanel = useCallback((panel: AdaptivePanel) => {
    setActivePanel(panel);
    if (panel === "tree") setTreeOpen(true);
    if (panel === "ai") setAiOpen(true);
    if (panel === "table") setTableMode(true);
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel(null);
    setTreeOpen(false);
    setAiOpen(false);
    setTableMode(false);
  }, []);

  const value = useMemo(
    () => ({
      tier,
      treeOpen,
      openTree,
      closeTree,
      toggleTree,
      aiOpen,
      openAi,
      closeAi,
      toggleAi,
      tableMode,
      enterTableMode,
      exitTableMode,
      toolbarCollapsed,
      toggleToolbar,
      activePanel,
      openPanel,
      closePanel,
    }),
    [
      tier,
      treeOpen,
      openTree,
      closeTree,
      toggleTree,
      aiOpen,
      openAi,
      closeAi,
      toggleAi,
      tableMode,
      enterTableMode,
      exitTableMode,
      toolbarCollapsed,
      toggleToolbar,
      activePanel,
      openPanel,
      closePanel,
    ]
  );

  return (
    <AdaptiveLayoutContext.Provider value={value}>{children}</AdaptiveLayoutContext.Provider>
  );
}

export function useAdaptiveLayout() {
  const ctx = useContext(AdaptiveLayoutContext);
  if (!ctx) {
    throw new Error("useAdaptiveLayout must be used within AdaptiveLayoutProvider");
  }
  return ctx;
}

export function useAdaptiveLayoutOptional() {
  return useContext(AdaptiveLayoutContext);
}
