"use client";

import { motion } from "framer-motion";
import type { NavItem } from "@/lib/navigation";
import {
  itemKey,
  SECTION_TITLES,
  type CategoryFilter,
  type PaletteRow,
  type PaletteSectionId,
} from "@/lib/command-palette";
import { USER_NAME } from "@/components/dashboard/constants";
import { CommandPaletteAiHeader } from "../CommandPaletteAiHeader";
import {
  DesktopEscChip,
  DesktopSearchHeader,
  DesktopSegmentedControl,
  PaletteEmptyState,
  PaletteQuickChips,
  PaletteResultCardDesktop,
  PaletteSectionLabel,
  PaletteSkeleton,
} from "../design-system";
import { DesktopPreviewPanel } from "./DesktopPreviewPanel";

type DesktopCommandPaletteProps = {
  query: string;
  deferredQuery: string;
  isPending: boolean;
  placeholder: string;
  listening: boolean;
  categoryFilter: CategoryFilter;
  groupedRows: { section: PaletteSectionId; rows: PaletteRow[] }[];
  rows: PaletteRow[];
  activeIndex: number;
  pinnedKeys: string[];
  showExtras: boolean;
  resumeLabel?: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  onQueryChange: (v: string) => void;
  onCategoryChange: (f: CategoryFilter) => void;
  onActiveIndexChange: (i: number) => void;
  onNavigate: (href: string, item: NavItem) => void;
  onTogglePin: (item: NavItem) => void;
  onChipSelect: (href: string, label: string) => void;
  onVoice: () => void;
  onClose: () => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function DesktopCommandPalette({
  query,
  deferredQuery,
  isPending,
  placeholder,
  listening,
  categoryFilter,
  groupedRows,
  rows,
  activeIndex,
  pinnedKeys,
  showExtras,
  resumeLabel,
  inputRef,
  listRef,
  onQueryChange,
  onCategoryChange,
  onActiveIndexChange,
  onNavigate,
  onTogglePin,
  onChipSelect,
  onVoice,
  onClose,
  onInputKeyDown,
}: DesktopCommandPaletteProps) {
  const activeItem = rows[activeIndex]?.item ?? null;

  const indexByKey = new Map(rows.map((r, i) => [itemKey(r.item), i]));

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="cp-desktop-modal flex h-[85vh] w-[min(1400px,92vw)] max-w-[1400px] flex-col overflow-hidden rounded-[32px] border shadow-[0_40px_120px_rgba(0,0,0,0.15)]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex shrink-0 items-center justify-end px-6 pt-4">
        <DesktopEscChip onClose={onClose} />
      </div>

      <div className="shrink-0 px-6 pb-4">
        <DesktopSearchHeader
          query={query}
          placeholder={placeholder}
          listening={listening}
          inputRef={inputRef}
          onChange={onQueryChange}
          onClear={() => onQueryChange("")}
          onVoice={onVoice}
          onClose={onClose}
          onKeyDown={onInputKeyDown}
        />
      </div>

      <div className="cp-desktop-body min-h-0 flex-1 overflow-hidden px-6 pb-6">
        <div className="cp-desktop-grid h-full min-h-0 overflow-hidden">
          {/* Left — scrollable list */}
          <div className="cp-desktop-list flex min-h-0 min-w-0 flex-col overflow-hidden">
            <div
              ref={listRef}
              id="command-palette-results"
              className="cp-desktop-list-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
              role="listbox"
            >
              {showExtras && (
                <>
                  <CommandPaletteAiHeader
                    userName={USER_NAME}
                    resumeLabel={resumeLabel}
                    onResume={() => onChipSelect("/session", "Resume")}
                    onAskAi={() => onChipSelect("/coach", "AI Coach")}
                  />
                  <PaletteQuickChips onSelect={onChipSelect} />
                </>
              )}

              <div className="sticky top-0 bg-[#F7F8FC] pb-2 pt-1">
                <DesktopSegmentedControl value={categoryFilter} onChange={onCategoryChange} />
              </div>

              {isPending ? (
                <PaletteSkeleton />
              ) : rows.length === 0 ? (
                <PaletteEmptyState query={deferredQuery} />
              ) : (
                groupedRows.map((group) => (
                  <div key={group.section}>
                    <PaletteSectionLabel title={SECTION_TITLES[group.section]} section={group.section} />
                    <ul className="space-y-1.5 pb-2">
                      {group.rows.map((row) => {
                        const idx = indexByKey.get(itemKey(row.item)) ?? 0;
                        const active = idx === activeIndex;
                        return (
                          <div key={itemKey(row.item)} data-cp-index={idx}>
                            <PaletteResultCardDesktop
                              item={row.item}
                              active={active}
                              pinned={pinnedKeys.includes(itemKey(row.item))}
                              index={idx}
                              onHover={() => onActiveIndexChange(idx)}
                              onSelect={() => onActiveIndexChange(idx)}
                              onOpen={() => onNavigate(row.item.href, row.item)}
                              onTogglePin={() => onTogglePin(row.item)}
                            />
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right — preview panel */}
          <div className="cp-desktop-preview flex min-h-0 min-w-0 flex-col overflow-hidden border-slate-200 lg:border-l lg:pl-8 max-lg:border-t max-lg:pt-5">
            <DesktopPreviewPanel
              item={activeItem}
              pinned={activeItem ? pinnedKeys.includes(itemKey(activeItem)) : false}
              onOpen={() => {
                if (activeItem) onNavigate(activeItem.href, activeItem);
              }}
              onAskAi={() => onChipSelect("/coach", "AI Coach")}
              onTogglePin={() => {
                if (activeItem) onTogglePin(activeItem);
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
