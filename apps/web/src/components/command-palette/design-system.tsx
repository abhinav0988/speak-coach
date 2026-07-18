"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mic2, Search, Star, X } from "lucide-react";
import type { NavItem } from "@/lib/navigation";
import {
  DESKTOP_QUICK_CHIPS,
  getCategoryBadge,
  getDisplayMeta,
  getIconGradient,
  SECTION_DISPLAY,
  type PaletteSectionId,
} from "@/lib/command-palette";
import { cn } from "@/lib/utils";

export function PaletteSectionLabel({
  title,
  section,
}: {
  title: string;
  section?: PaletteSectionId;
}) {
  const display = section ? SECTION_DISPLAY[section] : null;
  return (
    <p className="cp-section-label px-0 pb-1.5 pt-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500 first:pt-2">
      {display?.title ?? title}
    </p>
  );
}

export function PaletteResultCardMobile({
  item,
  active,
  pinned,
  onSelect,
  onHover,
  onTogglePin,
  index,
}: {
  item: NavItem;
  active: boolean;
  pinned: boolean;
  onSelect: () => void;
  onHover: () => void;
  onTogglePin: () => void;
  index: number;
}) {
  const Icon = item.icon;
  const meta = getDisplayMeta(item);
  const badge = getCategoryBadge(item);
  const gradient = getIconGradient(item);

  return (
    <motion.li
      role="option"
      aria-selected={active}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.22 }}
      className="list-none px-2"
      onMouseEnter={onHover}
    >
      <div
        className={cn(
          "cp-result-card group relative flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 pr-10 text-left transition-all duration-300",
          active
            ? "cp-result-card-active"
            : "border-transparent bg-white hover:border-slate-200 hover:shadow-md"
        )}
      >
        {active && <span className="cp-active-indicator" aria-hidden />}
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none"
        >
          <div
            className={cn(
              "cp-icon-wrap flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition duration-300 group-hover:scale-105 group-hover:rotate-3",
              gradient
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[16px] font-bold text-foreground">{item.label}</p>
              <span className="cp-badge rounded-full px-2 py-0.5 text-[11px] font-bold">{badge}</span>
            </div>
            {item.description && (
              <p className="mt-0.5 truncate text-[13px] text-muted">{item.description}</p>
            )}
            <p className="mt-1 truncate font-mono text-[11px] text-muted/80">{item.href}</p>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-1 text-right sm:flex">
            <span className="text-[12px] font-bold text-violet-600">+{meta.xp} XP</span>
            <span className="text-[11px] text-muted">{meta.duration}</span>
            <span className="text-[11px] font-semibold text-emerald-600">{meta.completion}%</span>
          </div>
          <ArrowRight
            className={cn(
              "h-4 w-4 shrink-0 text-violet-500 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100",
              active && "translate-x-0.5 opacity-100"
            )}
          />
        </button>
        <button
          type="button"
          onClick={onTogglePin}
          className={cn(
            "absolute right-2 top-2 z-10 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-amber-500",
            pinned && "text-amber-500"
          )}
          aria-label={pinned ? "Unpin" : "Pin"}
        >
          <Star className={cn("h-3.5 w-3.5", pinned && "fill-current")} />
        </button>
      </div>
    </motion.li>
  );
}

export function PaletteResultCardDesktop({
  item,
  active,
  pinned,
  onSelect,
  onOpen,
  onHover,
  onTogglePin,
  index,
}: {
  item: NavItem;
  active: boolean;
  pinned: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onHover: () => void;
  onTogglePin: () => void;
  index: number;
  section?: PaletteSectionId;
}) {
  const Icon = item.icon;
  const meta = getDisplayMeta(item);
  const badge = getCategoryBadge(item);
  const gradient = getIconGradient(item);
  const difficulty = ["Beginner", "Intermediate", "Advanced"][
    (item.label.length + item.href.length) % 3
  ];

  return (
    <motion.li
      role="option"
      aria-selected={active}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.18), duration: 0.2 }}
      className="list-none"
      onMouseEnter={onHover}
    >
      <div
        className={cn(
          "cp-desktop-card group flex h-20 w-full items-center gap-3 rounded-[18px] border px-3 text-left transition-all duration-200",
          active
            ? "border-[#5B5CF6]/35 bg-violet-50 shadow-[0_4px_16px_rgba(91,92,246,0.1)]"
            : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md"
        )}
      >
        <button
          type="button"
          onClick={onSelect}
          onDoubleClick={onOpen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#5B5CF6]/40 focus-visible:ring-offset-2"
        >
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-[0_6px_16px_rgba(91,92,246,0.25)] transition-transform duration-200 group-hover:scale-105",
              gradient
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-[18px] font-bold leading-tight text-foreground">{item.label}</p>
              {pinned && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" />}
            </div>
            {item.description && (
              <p className="mt-0.5 truncate text-[14px] text-slate-600">{item.description}</p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] font-semibold">
              <span className="text-[#5B5CF6]">+{meta.xp} XP</span>
              <span className="text-muted/30">·</span>
              <span className="text-muted">{meta.duration}</span>
              <span className="text-muted/30">·</span>
              <span className="text-muted">{difficulty}</span>
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{badge}</span>
            </div>
          </div>
          <ArrowRight
            className={cn(
              "h-4 w-4 shrink-0 text-[#5B5CF6]/70 transition-all duration-200",
              active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className={cn(
            "mr-1 shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-amber-500",
            pinned && "text-amber-500"
          )}
          aria-label={pinned ? "Unpin" : "Pin"}
        >
          <Star className={cn("h-4 w-4", pinned && "fill-current")} />
        </button>
      </div>
    </motion.li>
  );
}

export function PaletteResultCard(props: Parameters<typeof PaletteResultCardMobile>[0]) {
  return <PaletteResultCardMobile {...props} />;
}

export function PaletteEmptyState({ query }: { query: string }) {
  const desktopSuggestions = [
    "Resume Lesson",
    "Open AI",
    "Grammar",
    "Vocabulary",
  ];

  return (
    <div className="cp-empty flex flex-col items-center px-6 py-14 text-center md:py-16">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="cp-empty-orb mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-3xl shadow-[0_20px_60px_rgba(79,70,229,0.35)] md:h-24 md:w-24 md:text-5xl"
      >
        <span className="md:hidden">✨</span>
        <span className="hidden md:inline" role="img" aria-label="AI assistant">
          🤖
        </span>
      </motion.div>
      {query ? (
        <>
          <p className="text-[16px] font-bold text-foreground md:text-[17px]">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-2 max-w-sm text-[13px] text-muted">
            Try natural language like &ldquo;Start today&apos;s lesson&quot; or &ldquo;Open pronunciation&quot;
          </p>
        </>
      ) : (
        <>
          <p className="text-[16px] font-bold text-foreground md:text-[17px]">What would you like to do?</p>
          <p className="mt-2 text-[13px] text-muted">Type to search or pick a suggestion</p>
        </>
      )}
      <div className="mt-6 hidden flex-wrap justify-center gap-2 md:flex">
        {desktopSuggestions.map((ex) => (
          <span
            key={ex}
            className="rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-[12px] font-medium text-slate-600"
          >
            {ex}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PaletteSkeleton() {
  return (
    <div className="space-y-2 px-2 py-3 md:space-y-3 md:px-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="cp-skeleton flex items-center gap-3 rounded-[18px] p-3 md:rounded-[16px] md:p-4"
        >
          <div className="h-12 w-12 rounded-2xl md:h-14 md:w-14 md:rounded-[16px]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/5 rounded-lg" />
            <div className="h-3 w-3/5 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Desktop footer removed — ESC chip only */
export function PaletteFooter() {
  return null;
}

export function PaletteFilterTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: import("@/lib/command-palette").CategoryFilter) => void;
}) {
  const tabs = [
    { id: "all" as const, label: "All" },
    { id: "practice" as const, label: "Practice" },
    { id: "progress" as const, label: "Progress" },
    { id: "ai" as const, label: "AI" },
    { id: "settings" as const, label: "Settings" },
  ];
  return (
    <div className="flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-none md:px-5 md:pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 rounded-xl px-3 py-1.5 text-[12px] font-bold transition md:rounded-full md:px-3 md:py-1 md:text-[11px] md:font-semibold",
            value === tab.id
              ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md md:shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 md:bg-transparent md:hover:bg-slate-100"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function PaletteQuickChips({
  onSelect,
}: {
  onSelect: (href: string, label: string) => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {DESKTOP_QUICK_CHIPS.map((chip) => (
        <motion.button
          key={chip.label}
          type="button"
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(chip.href, chip.label)}
          className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-[#5B5CF6]"
        >
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
}

export function DesktopEscChip({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
      aria-label="Close command palette"
    >
      ⌨ ESC Close
    </button>
  );
}

export function DesktopSearchHeader({
  query,
  placeholder,
  listening,
  inputRef,
  onChange,
  onClear,
  onVoice,
  onClose,
  onKeyDown,
}: {
  query: string;
  placeholder: string;
  listening: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (v: string) => void;
  onClear: () => void;
  onVoice: () => void;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "cp-search-box relative min-w-0 flex-1",
          (query || listening) && "cp-search-box-active"
        )}
      >
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5B5CF6]"
          strokeWidth={2.2}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="cp-search-input h-[52px] w-full rounded-[18px] border border-slate-200 bg-white pl-12 pr-4 text-[18px] font-medium text-slate-900 outline-none placeholder:text-slate-400 shadow-sm"
          aria-autocomplete="list"
          aria-controls="command-palette-results"
        />
      </div>
      <button
        type="button"
        onClick={onVoice}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50",
          listening && "border-cyan-300 bg-cyan-50 text-cyan-600"
        )}
        aria-label="Voice search"
      >
        <Mic2 className="h-4 w-4" />
      </button>
      {query && (
        <button
          type="button"
          onClick={onClear}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <motion.button
        type="button"
        onClick={onClose}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </motion.button>
    </div>
  );
}

export function DesktopSegmentedControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: import("@/lib/command-palette").CategoryFilter) => void;
}) {
  const tabs = [
    { id: "all" as const, label: "All" },
    { id: "practice" as const, label: "Practice" },
    { id: "ai" as const, label: "AI" },
    { id: "progress" as const, label: "Progress" },
    { id: "settings" as const, label: "Settings" },
  ];
  return (
    <div className="cp-segmented flex gap-1 overflow-x-auto rounded-[14px] border border-slate-200 bg-slate-100/80 p-1 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 rounded-[10px] px-4 py-2 text-[13px] font-semibold transition-all duration-200",
            value === tab.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** @deprecated use DesktopSearchHeader */
export function PaletteTopBarDesktop(props: Parameters<typeof DesktopSearchHeader>[0]) {
  return <DesktopSearchHeader {...props} />;
}
