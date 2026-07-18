"use client";

import { usePathname } from "next/navigation";
import { Bot, LayoutGrid, Menu, Table2 } from "lucide-react";
import { SideNav } from "@/components/layout/SideNav";
import { useAdaptiveLayout } from "./AdaptiveLayoutProvider";
import { AdaptiveAIPanel } from "./AdaptiveAIPanel";
import { BottomSheet } from "./BottomSheet";
import { FloatingActionButton } from "./FloatingActionButton";
import { FloatingToolbar } from "./FloatingToolbar";

const TABLE_ROUTES = [
  "/analytics",
  "/vocabulary",
  "/mistakes",
  "/voice-library",
  "/heatmap",
  "/reports",
  "/phrases",
];

function isTableRoute(pathname: string): boolean {
  return TABLE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export function AdaptiveChrome() {
  const pathname = usePathname();
  const {
    tier,
    treeOpen,
    openTree,
    closeTree,
    aiOpen,
    openAi,
    closeAi,
    tableMode,
    enterTableMode,
    exitTableMode,
    toolbarCollapsed,
    toggleToolbar,
  } = useAdaptiveLayout();

  const showTableAction = isTableRoute(pathname);
  const isAuth = pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/auth" || pathname.startsWith("/auth/");
  if (isAuth) return null;

  const toolbarActions = [
    {
      id: "tree",
      label: "Feature tree",
      icon: <LayoutGrid className="h-4 w-4" />,
      onClick: openTree,
      active: treeOpen,
    },
    {
      id: "ai",
      label: "AI assistant",
      icon: <Bot className="h-4 w-4" />,
      onClick: openAi,
      active: aiOpen,
    },
    ...(showTableAction
      ? [
          {
            id: "table",
            label: tableMode ? "Exit table view" : "Table view",
            icon: <Table2 className="h-4 w-4" />,
            onClick: tableMode ? exitTableMode : enterTableMode,
            active: tableMode,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Phone: FAB opens feature tree bottom sheet */}
      {tier === "phone" && (
        <FloatingActionButton
          onClick={openTree}
          icon={<Menu className="h-6 w-6" />}
          label="Open feature navigation"
        />
      )}

      {/* Phone + tablet: collapsible floating toolbar */}
      {tier !== "desktop" && (
        <FloatingToolbar
          actions={toolbarActions}
          collapsed={toolbarCollapsed}
          onToggleCollapse={toggleToolbar}
        />
      )}

      {/* Phone: tree as bottom sheet */}
      {tier === "phone" && (
        <BottomSheet
          open={treeOpen}
          onClose={closeTree}
          title="All features"
          subtitle="Browse every practice tool"
          fullScreen={tableMode}
        >
          <SideNav mobile onNavigate={closeTree} onClose={closeTree} className="!relative !flex !h-auto !w-full !max-w-none !rounded-none !border-0 !shadow-none" />
        </BottomSheet>
      )}

      {/* Phone: AI assistant as bottom sheet */}
      {tier === "phone" && (
        <BottomSheet
          open={aiOpen}
          onClose={closeAi}
          title="AI Coach"
          subtitle="Quick assistant"
        >
          <AdaptiveAIPanel />
        </BottomSheet>
      )}

      {/* Tablet: AI as slide-over panel */}
      {tier === "tablet" && aiOpen && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-slate-900/25 backdrop-blur-[4px] lg:hidden"
            onClick={closeAi}
            aria-hidden
          />
          <aside
            className="fixed inset-y-0 right-0 z-[56] flex w-[min(88vw,380px)] flex-col border-l border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-[30px] dark:border-white/10 dark:bg-slate-900/95 lg:hidden"
            role="dialog"
            aria-label="AI assistant panel"
          >
            <AdaptiveAIPanel />
          </aside>
        </>
      )}
    </>
  );
}
