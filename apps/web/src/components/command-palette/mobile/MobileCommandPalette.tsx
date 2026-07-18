"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { NavItem } from "@/lib/navigation";
import {
  itemKey,
  MOBILE_SEARCH_PLACEHOLDERS,
  SECTION_TITLES,
  type CategoryFilter,
  type PaletteRow,
  type PaletteSectionId,
} from "@/lib/command-palette";
import {
  MobileBottomBar,
  MobileDetailSheet,
  MobileEmptyState,
  MobileFilterTabs,
  MobileQuickChips,
  MobileResultCard,
  MobileSearchHeader,
  MobileSectionLabel,
  MobileSkeleton,
  type MobileBarAction,
} from "./mobile-ui";

type MobileCommandPaletteProps = {
  query: string;
  deferredQuery: string;
  isPending: boolean;
  placeholderIdx: number;
  listening: boolean;
  categoryFilter: CategoryFilter;
  groupedRows: { section: PaletteSectionId; rows: PaletteRow[] }[];
  pinnedKeys: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  onQueryChange: (v: string) => void;
  onCategoryChange: (f: CategoryFilter) => void;
  onNavigate: (href: string, item: NavItem) => void;
  onTogglePin: (item: NavItem) => void;
  onChipSelect: (href: string, label: string) => void;
  onVoice: () => void;
  onClose: () => void;
};

export function MobileCommandPalette({
  query,
  deferredQuery,
  isPending,
  placeholderIdx,
  listening,
  categoryFilter,
  groupedRows,
  pinnedKeys,
  inputRef,
  listRef,
  onQueryChange,
  onCategoryChange,
  onNavigate,
  onTogglePin,
  onChipSelect,
  onVoice,
  onClose,
}: MobileCommandPaletteProps) {
  const [expandedItem, setExpandedItem] = useState<NavItem | null>(null);
  const [barAction, setBarAction] = useState<MobileBarAction | null>(null);
  const [displayFilter, setDisplayFilter] = useState<"all" | "recent" | "pinned">("all");
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const placeholder =
    MOBILE_SEARCH_PLACEHOLDERS[placeholderIdx % MOBILE_SEARCH_PLACEHOLDERS.length];

  const filteredGroups = useMemo(() => {
    if (displayFilter === "all") return groupedRows;
    if (displayFilter === "recent") {
      const recent = groupedRows.find((g) => g.section === "recent");
      if (recent) return [recent];
      const frequent = groupedRows.find((g) => g.section === "frequent");
      return frequent ? [frequent] : [];
    }
    const pinnedGroups = groupedRows
      .map((g) => ({
        ...g,
        rows: g.rows.filter((r) => pinnedKeys.includes(itemKey(r.item))),
      }))
      .filter((g) => g.rows.length > 0);
    if (pinnedGroups.length) return pinnedGroups;
    return groupedRows.filter((g) => g.section === "pinned");
  }, [displayFilter, groupedRows, pinnedKeys]);

  const flatRows = useMemo(
    () => filteredGroups.flatMap((g) => g.rows),
    [filteredGroups]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Enter" && flatRows[mobileActiveIndex]) {
      e.preventDefault();
      setExpandedItem(flatRows[mobileActiveIndex].item);
    }
  };

  useEffect(() => {
    if (query.trim()) setDisplayFilter("all");
    setMobileActiveIndex(0);
  }, [query]);

  const handleBarAction = (action: MobileBarAction) => {
    setBarAction(action);
    setMobileActiveIndex(0);
    if (action === "voice") {
      onVoice();
      return;
    }
    if (action === "ai") {
      onChipSelect("/coach", "AI Coach");
      return;
    }
    if (action === "recent") {
      setDisplayFilter((f) => (f === "recent" ? "all" : "recent"));
      onQueryChange("");
      return;
    }
    if (action === "favorites" || action === "pinned") {
      setDisplayFilter((f) => (f === "pinned" ? "all" : "pinned"));
      onQueryChange("");
    }
  };

  const indexByKey = useMemo(() => {
    const map = new Map<string, number>();
    let i = 0;
    for (const group of filteredGroups) {
      for (const row of group.rows) {
        map.set(itemKey(row.item), i++);
      }
    }
    return map;
  }, [filteredGroups]);

  return (
    <>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 420, damping: 38 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.45 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) onClose();
        }}
        className="cp-mobile-sheet fixed inset-x-0 bottom-0 z-[201] flex h-[92vh] flex-col overflow-hidden rounded-t-[32px] md:hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 flex-col items-center pt-3">
          <div className="cp-mobile-drag" aria-hidden />
        </div>

        <MobileSearchHeader
          query={query}
          placeholder={placeholder}
          listening={listening}
          inputRef={inputRef}
          onChange={onQueryChange}
          onClear={() => onQueryChange("")}
          onVoice={onVoice}
          onClose={onClose}
          onKeyDown={handleKeyDown}
        />

        {!query.trim() && <MobileQuickChips onSelect={onChipSelect} />}

        <MobileFilterTabs value={categoryFilter} onChange={onCategoryChange} />

        <div
          id="command-palette-results"
          ref={listRef}
          className="cp-mobile-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2"
          role="listbox"
        >
          {isPending ? (
            <MobileSkeleton />
          ) : filteredGroups.every((g) => g.rows.length === 0) ? (
            <MobileEmptyState query={deferredQuery} />
          ) : (
            filteredGroups.map((group) => (
              <div key={group.section}>
                <MobileSectionLabel title={SECTION_TITLES[group.section]} />
                <ul className="space-y-1">
                  {group.rows.map((row) => {
                    const idx = indexByKey.get(itemKey(row.item)) ?? 0;
                    const active = idx === mobileActiveIndex;
                    return (
                      <div
                        key={itemKey(row.item)}
                        data-cp-index={idx}
                        onTouchStart={() => setMobileActiveIndex(idx)}
                      >
                        <MobileResultCard
                          item={row.item}
                          active={active}
                          pinned={pinnedKeys.includes(itemKey(row.item))}
                          index={idx}
                          onPress={() => setExpandedItem(row.item)}
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

        <MobileBottomBar
          listening={listening}
          activeAction={barAction}
          onAction={handleBarAction}
        />
      </motion.div>

      <AnimatePresence>
        {expandedItem && (
          <MobileDetailSheet
            item={expandedItem}
            pinned={pinnedKeys.includes(itemKey(expandedItem))}
            onClose={() => setExpandedItem(null)}
            onOpen={() => {
              onNavigate(expandedItem.href, expandedItem);
              setExpandedItem(null);
            }}
            onTogglePin={() => onTogglePin(expandedItem)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
