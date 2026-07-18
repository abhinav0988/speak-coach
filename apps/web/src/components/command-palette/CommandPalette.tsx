"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ALL_FEATURES, searchFeatures } from "@/lib/navigation";
import {
  buildAiSuggestion,
  DESKTOP_SEARCH_PLACEHOLDERS,
  findFeature,
  groupItems,
  itemKey,
  matchesCategoryFilter,
  MOBILE_SEARCH_PLACEHOLDERS,
  normalizeSearchInput,
  QUICK_ACTIONS,
  rowsFromSections,
  type CategoryFilter,
  type PaletteRow,
  type PaletteSectionId,
} from "@/lib/command-palette";
import { useCommandPaletteStorage } from "@/hooks/useCommandPaletteStorage";
import { useSidebarData } from "@/hooks/useSidebarData";
import { USER_NAME } from "@/components/dashboard/constants";
import { cn } from "@/lib/utils";
import { DesktopCommandPalette } from "./desktop/DesktopCommandPalette";
import { MobileCommandPalette } from "./mobile/MobileCommandPalette";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const isPending = query !== deferredQuery;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const sidebar = useSidebarData(USER_NAME, { autoRefresh: false, enabled: open });
  const { recent, pinned, frequent, recordVisit, togglePin, pinnedKeys } = useCommandPaletteStorage();

  const close = useCallback(() => {
    onClose();
    setQuery("");
    setActiveIndex(0);
    setCategoryFilter("all");
  }, [onClose]);

  const navigate = useCallback(
    (href: string, item: (typeof ALL_FEATURES)[0]) => {
      recordVisit(item);
      router.push(href);
      close();
    },
    [close, recordVisit, router]
  );

  const rows: PaletteRow[] = useMemo(() => {
    const q = deferredQuery.trim();
    if (q) {
      const normalized = normalizeSearchInput(deferredQuery);
      const items = searchFeatures(normalized).filter((i) => matchesCategoryFilter(i, categoryFilter));
      return rowsFromSections(groupItems(items));
    }

    const sections: { section: PaletteSectionId; items: typeof ALL_FEATURES }[] = [];

    sections.push({ section: "quick", items: QUICK_ACTIONS.filter((i) => matchesCategoryFilter(i, categoryFilter)) });

    const aiItem = buildAiSuggestion(
      sidebar.loading ? null : sidebar.aiTip,
      sidebar.resume ? `Resume ${sidebar.resume.label}` : null
    );
    if (aiItem && matchesCategoryFilter(aiItem, categoryFilter)) {
      sections.push({ section: "ai-suggest", items: [aiItem] });
    }

    const recentFiltered = recent.filter((i) => matchesCategoryFilter(i, categoryFilter));
    if (recentFiltered.length) sections.push({ section: "recent", items: recentFiltered.slice(0, 5) });

    const pinnedFiltered = pinned.filter((i) => matchesCategoryFilter(i, categoryFilter));
    if (pinnedFiltered.length) sections.push({ section: "pinned", items: pinnedFiltered });

    const freqFiltered = frequent
      .filter((i) => matchesCategoryFilter(i, categoryFilter))
      .filter((i) => !pinnedFiltered.some((p) => itemKey(p) === itemKey(i)));
    if (freqFiltered.length) sections.push({ section: "frequent", items: freqFiltered.slice(0, 4) });

    const browse = ALL_FEATURES.filter((i) => matchesCategoryFilter(i, categoryFilter));
    sections.push(...groupItems(browse));

    return rowsFromSections(sections.filter((s) => s.items.length > 0));
  }, [categoryFilter, deferredQuery, frequent, pinned, recent, sidebar.aiTip, sidebar.loading, sidebar.resume]);

  const groupedRows = useMemo(() => {
    const groups: { section: PaletteSectionId; rows: PaletteRow[] }[] = [];
    for (const row of rows) {
      const last = groups[groups.length - 1];
      if (last?.section === row.section) last.rows.push(row);
      else groups.push({ section: row.section, rows: [row] });
    }
    return groups;
  }, [rows]);

  const showDesktopExtras = isDesktop && !deferredQuery.trim();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => setActiveIndex(0), [deferredQuery, categoryFilter]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const placeholders = isDesktop ? DESKTOP_SEARCH_PLACEHOLDERS : MOBILE_SEARCH_PLACEHOLDERS;
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % placeholders.length), 3000);
    return () => clearInterval(id);
  }, [open, isDesktop]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDesktop) return;
    if (e.key === "Enter" && rows[activeIndex]) {
      e.preventDefault();
      navigate(rows[activeIndex].item.href, rows[activeIndex].item);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  useEffect(() => {
    if (!open || !isDesktop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Enter") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        if (rows[activeIndex]) {
          e.preventDefault();
          navigate(rows[activeIndex].item.href, rows[activeIndex].item);
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(rows.length - 1, 0)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(Math.max(rows.length - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, isDesktop, navigate, open, rows]);

  useEffect(() => {
    if (!isDesktop) return;
    const el = listRef.current?.querySelector(`[data-cp-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isDesktop]);

  const startVoice = () => {
    type SRCtor = new () => {
      lang: string;
      interimResults: boolean;
      onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
      start: () => void;
    };
    const Win = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
    const SR = Win.SpeechRecognition ?? Win.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      if (text) setQuery(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  };

  const handleChipSelect = (href: string, label: string) => {
    const item = findFeature(href, label) ?? findFeature(href);
    if (item) navigate(item.href, item);
    else router.push(href);
    close();
  };

  const desktopPlaceholder = DESKTOP_SEARCH_PLACEHOLDERS[placeholderIdx % DESKTOP_SEARCH_PLACEHOLDERS.length];

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cp-backdrop"
            className={cn(
              "cp-backdrop fixed inset-0 z-[200]",
              isDesktop
                ? "flex items-center justify-center p-6"
                : "pointer-events-none"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onMouseDown={(e) => {
              if (isDesktop && e.target === e.currentTarget) close();
            }}
            role="presentation"
          >
            <div className="cp-aurora pointer-events-none fixed inset-0 hidden md:block" aria-hidden />
            <div className="cp-noise pointer-events-none fixed inset-0 hidden md:block" aria-hidden />
            <div className="cp-blobs pointer-events-none fixed inset-0 hidden md:block" aria-hidden>
              <span className="cp-blob cp-blob-1" />
              <span className="cp-blob cp-blob-2" />
            </div>

            {isDesktop && (
              <DesktopCommandPalette
                query={query}
                deferredQuery={deferredQuery}
                isPending={isPending}
                placeholder={desktopPlaceholder}
                listening={listening}
                categoryFilter={categoryFilter}
                groupedRows={groupedRows}
                rows={rows}
                activeIndex={activeIndex}
                pinnedKeys={pinnedKeys}
                showExtras={showDesktopExtras}
                resumeLabel={sidebar.resume?.label}
                inputRef={inputRef}
                listRef={listRef}
                onQueryChange={setQuery}
                onCategoryChange={setCategoryFilter}
                onActiveIndexChange={setActiveIndex}
                onNavigate={navigate}
                onTogglePin={togglePin}
                onChipSelect={handleChipSelect}
                onVoice={startVoice}
                onClose={close}
                onInputKeyDown={handleInputKeyDown}
              />
            )}
          </motion.div>

          {!isDesktop && (
            <motion.button
              type="button"
              key="cp-mobile-backdrop"
              className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close search"
              onClick={close}
            />
          )}

          {!isDesktop && (
            <MobileCommandPalette
              query={query}
              deferredQuery={deferredQuery}
              isPending={isPending}
              placeholderIdx={placeholderIdx}
              listening={listening}
              categoryFilter={categoryFilter}
              groupedRows={groupedRows}
              pinnedKeys={pinnedKeys}
              inputRef={inputRef}
              listRef={listRef}
              onQueryChange={setQuery}
              onCategoryChange={setCategoryFilter}
              onNavigate={navigate}
              onTogglePin={togglePin}
              onChipSelect={handleChipSelect}
              onVoice={startVoice}
              onClose={close}
            />
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
