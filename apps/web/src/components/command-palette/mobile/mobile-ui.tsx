"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Mic2,
  Pin,
  Search,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import type { NavItem } from "@/lib/navigation";
import {
  getDisplayMeta,
  getIconGradient,
  MOBILE_QUICK_CHIPS,
} from "@/lib/command-palette";
import { cn } from "@/lib/utils";

const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];

type MobileDetailSheetProps = {
  item: NavItem;
  pinned: boolean;
  onClose: () => void;
  onOpen: () => void;
  onTogglePin: () => void;
};

export function MobileDetailSheet({
  item,
  pinned,
  onClose,
  onOpen,
  onTogglePin,
}: MobileDetailSheetProps) {
  const Icon = item.icon;
  const meta = getDisplayMeta(item);
  const gradient = getIconGradient(item);
  const difficulty = DIFFICULTY[(item.label.length + item.href.length) % 3];

  return (
    <motion.div
      className="cp-mobile-detail fixed inset-0 z-[210] md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        aria-label="Close preview"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-label={`${item.label} details`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 420, damping: 36 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.35 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80 || info.velocity.y > 400) onClose();
        }}
        className="cp-mobile-detail-sheet absolute inset-x-0 bottom-0 max-h-[72vh] overflow-y-auto rounded-t-[28px] border-t border-slate-200 bg-white px-5 pb-8 pt-3 shadow-[0_-20px_60px_rgba(15,23,42,0.12)]"
      >
        <div className="cp-mobile-drag mx-auto mb-4" aria-hidden />

        <div
          className={cn(
            "mb-5 flex h-[120px] items-center justify-center rounded-[22px] bg-gradient-to-br shadow-inner",
            gradient
          )}
        >
          <Icon className="h-14 w-14 text-white drop-shadow-md" strokeWidth={1.8} />
        </div>

        <h3 className="text-[20px] font-bold tracking-tight text-foreground">{item.label}</h3>
        {item.description && (
          <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-bold text-violet-700">
            <Zap className="h-3 w-3" />+{meta.xp} XP
          </span>
          <span className="flex items-center gap-1 rounded-full bg-slate-500/8 px-2.5 py-1 text-[11px] font-bold text-muted">
            <Clock className="h-3 w-3" />
            {meta.duration}
          </span>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-700">
            {difficulty}
          </span>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            {meta.completion}% complete
          </span>
        </div>

        <div className="mt-6 flex gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onOpen}
            className="group flex flex-1 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] py-3.5 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(79,70,229,0.35)]"
          >
            Open
            <ArrowRight className="h-4 w-4 transition group-active:translate-x-0.5" />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={onTogglePin}
            className={cn(
              "rounded-[16px] border border-slate-200 bg-slate-50 p-3.5",
              pinned && "border-amber-300/60 text-amber-600"
            )}
            aria-label={pinned ? "Unpin" : "Pin"}
          >
            <Pin className="h-4 w-4" />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={onTogglePin}
            className="rounded-[16px] border border-slate-200 bg-slate-50 p-3.5"
            aria-label="Favorite"
          >
            <Star className={cn("h-4 w-4", pinned && "fill-amber-400 text-amber-500")} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MobileEmptyState({ query }: { query: string }) {
  const suggestions = ["Start Session", "Grammar", "Vocabulary", "AI Coach"];

  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-4 flex h-[88px] w-[88px] items-center justify-center rounded-[26px] bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-5xl shadow-[0_16px_48px_rgba(79,70,229,0.3)]"
        role="img"
        aria-label="AI assistant"
      >
        🤖
      </motion.div>
      {query ? (
        <>
          <p className="text-[17px] font-bold text-foreground">No results for &ldquo;{query}&rdquo;</p>
          <p className="mt-1.5 text-[13px] text-muted">Try a different search term</p>
        </>
      ) : (
        <>
          <p className="text-[17px] font-bold text-foreground">Search anything</p>
          <p className="mt-1.5 text-[13px] text-muted">Lessons, grammar, vocabulary & more</p>
        </>
      )}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <span
            key={s}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MobileSkeleton() {
  return (
    <div className="space-y-1 px-3 py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="cp-skeleton flex h-[72px] items-center gap-3 rounded-[14px] px-3">
          <div className="h-11 w-11 shrink-0 rounded-[12px]" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/5 rounded-md" />
            <div className="h-3 w-3/5 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MobileSectionLabel({ title }: { title: string }) {
  return (
    <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
      {title}
    </p>
  );
}

export function MobileResultCard({
  item,
  active,
  pinned,
  index,
  onPress,
  onTogglePin,
}: {
  item: NavItem;
  active: boolean;
  pinned: boolean;
  index: number;
  onPress: () => void;
  onTogglePin: () => void;
}) {
  const Icon = item.icon;
  const meta = getDisplayMeta(item);
  const gradient = getIconGradient(item);

  return (
    <motion.li
      role="option"
      aria-selected={active}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.015, 0.12), duration: 0.2 }}
      className="list-none px-3"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={cn(
          "cp-mobile-card group relative flex h-[72px] items-center gap-3 rounded-[14px] border px-3 pr-2 transition-all duration-200",
          active
            ? "border-[#5B5CF6]/30 bg-violet-50 shadow-[0_4px_16px_rgba(91,92,246,0.12)]"
            : "border-slate-200/80 bg-white shadow-sm active:bg-slate-50"
        )}
      >
        <button
          type="button"
          onClick={onPress}
          className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none"
        >
          <motion.div
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br text-white shadow-md",
              gradient
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-semibold leading-tight text-foreground">
              {item.label}
            </p>
            {item.description && (
              <p className="mt-0.5 truncate text-[13px] text-slate-600">{item.description}</p>
            )}
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              <span className="font-semibold text-[#5B5CF6]">+{meta.xp} XP</span>
              <span className="mx-1 text-slate-300">·</span>
              {meta.duration}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#5B5CF6]/60" />
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className={cn(
            "shrink-0 rounded-lg p-2 text-muted/50",
            pinned && "text-amber-500"
          )}
          aria-label={pinned ? "Unpin" : "Pin"}
        >
          <Star className={cn("h-4 w-4", pinned && "fill-current")} />
        </motion.button>
      </motion.div>
    </motion.li>
  );
}

export function MobileQuickChips({
  onSelect,
}: {
  onSelect: (href: string, label: string) => void;
}) {
  return (
    <div className="cp-mobile-chips flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
      {MOBILE_QUICK_CHIPS.map((chip) => (
        <motion.button
          key={chip.label}
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelect(chip.href, chip.label)}
          className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-2 text-[12px] font-semibold text-slate-700 shadow-sm active:bg-slate-200"
        >
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
}

export function MobileSearchHeader({
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
    <div className="shrink-0 px-4 pb-3 pt-1">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "cp-mobile-search relative min-w-0 flex-1",
            (query || listening) && "cp-mobile-search-active"
          )}
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B5CF6]" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="cp-mobile-search-input h-14 w-full rounded-[14px] border border-slate-200 bg-white pl-10 pr-3 text-[17px] font-medium text-slate-900 outline-none placeholder:text-slate-400 shadow-sm"
            aria-autocomplete="list"
            aria-controls="command-palette-results"
          />
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onVoice}
          className={cn(
            "cp-mobile-voice flex h-14 w-11 shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-slate-600 shadow-sm",
            listening && "cp-mobile-voice-active border-cyan-400 bg-cyan-50 text-cyan-600"
          )}
          aria-label="Voice search"
        >
          <Mic2 className="h-4 w-4" />
        </motion.button>
        {query && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onClear}
            className="flex h-14 w-11 shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-slate-500 shadow-sm"
            aria-label="Clear search"
          >
            <span className="text-[13px] font-bold">⌫</span>
          </motion.button>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={onClose}
          className="flex h-14 w-11 shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-slate-500 shadow-sm"
          aria-label="Close"
        >
          <span className="text-lg leading-none">✕</span>
        </motion.button>
      </div>
    </div>
  );
}

export type MobileBarAction = "recent" | "favorites" | "pinned" | "voice" | "ai";

export function MobileBottomBar({
  listening,
  activeAction,
  onAction,
}: {
  listening: boolean;
  activeAction: MobileBarAction | null;
  onAction: (action: MobileBarAction) => void;
}) {
  const items: { id: MobileBarAction; label: string; icon: React.ReactNode }[] = [
    { id: "recent", label: "Recent", icon: <Clock className="h-4 w-4" /> },
    { id: "favorites", label: "Favorites", icon: <Star className="h-4 w-4" /> },
    { id: "pinned", label: "Pinned", icon: <Pin className="h-4 w-4" /> },
    {
      id: "voice",
      label: "Voice",
      icon: <Mic2 className={cn("h-4 w-4", listening && "text-cyan-600")} />,
    },
    { id: "ai", label: "AI", icon: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <div className="cp-mobile-bottom-bar shrink-0 border-t border-slate-200 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
      <div className="flex items-center justify-around">
        {items.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onAction(item.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition",
              activeAction === item.id
                ? "text-[#5B5CF6]"
                : "text-slate-500"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function MobileFilterTabs({
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
    <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition",
            value === tab.id
              ? "bg-[#5B5CF6] text-white shadow-sm"
              : "border border-slate-200 bg-slate-100 text-slate-600"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
