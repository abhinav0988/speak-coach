import {
  ALL_FEATURES,
  FEATURE_GROUPS,
  type NavItem,
} from "@/lib/navigation";
import {
  Bot,
  Play,
  Sparkles,
  Target,
} from "lucide-react";

export type CategoryFilter = "all" | "practice" | "progress" | "ai" | "settings";

export type PaletteSectionId =
  | "quick"
  | "ai-suggest"
  | "recent"
  | "pinned"
  | "frequent"
  | "navigation"
  | "practice"
  | "ai-features"
  | "learning"
  | "progress"
  | "achievements"
  | "settings"
  | "commands";

export const FILTER_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "practice", label: "Practice" },
  { id: "progress", label: "Progress" },
  { id: "ai", label: "AI" },
  { id: "settings", label: "Settings" },
];

export const SECTION_TITLES: Record<PaletteSectionId, string> = {
  quick: "Quick Actions",
  "ai-suggest": "AI Suggestions",
  recent: "Recent",
  pinned: "Pinned",
  frequent: "Frequently Used",
  navigation: "Navigation",
  practice: "Practice",
  "ai-features": "AI Features",
  learning: "Learning",
  progress: "Progress",
  achievements: "Achievements",
  settings: "Settings",
  commands: "Commands",
};

/** Desktop section headers with emoji */
export const SECTION_DISPLAY: Record<PaletteSectionId, { title: string; emoji: string }> = {
  quick: { title: "Quick Actions", emoji: "⭐" },
  "ai-suggest": { title: "AI Suggestions", emoji: "🧠" },
  recent: { title: "Recent", emoji: "🕘" },
  pinned: { title: "Pinned", emoji: "📌" },
  frequent: { title: "Frequently Used", emoji: "🔥" },
  navigation: { title: "Navigation", emoji: "🧭" },
  practice: { title: "Practice", emoji: "🎯" },
  "ai-features": { title: "AI Features", emoji: "🤖" },
  learning: { title: "Learning", emoji: "📚" },
  progress: { title: "Progress", emoji: "📈" },
  achievements: { title: "Achievements", emoji: "🏆" },
  settings: { title: "Settings", emoji: "⚙️" },
  commands: { title: "Commands", emoji: "⌘" },
};

export const NL_PLACEHOLDERS = [
  "Search anything…",
  "Start today's lesson",
  "Open AI Coach",
  "Resume Day 2",
  "Vocabulary",
  "Pronunciation",
  "Grammar",
  "Mistakes",
  "Achievements",
  "Progress",
];

/** Desktop search field — rotates every 3s */
export const DESKTOP_SEARCH_PLACEHOLDERS = [
  "Search lessons…",
  "Search Grammar…",
  "Search Vocabulary…",
  "Search AI…",
  "Search Progress…",
];

/** Mobile search field — rotates every 3s */
export const MOBILE_SEARCH_PLACEHOLDERS = [
  "Search lessons…",
  "Grammar…",
  "Vocabulary…",
  "AI…",
  "Recent…",
];

export const MOBILE_QUICK_CHIPS: { label: string; href: string }[] = [
  { label: "Resume", href: "/session" },
  { label: "AI Coach", href: "/coach" },
  { label: "Pronunciation", href: "/sound-gym" },
  { label: "Grammar", href: "/correct" },
  { label: "Vocabulary", href: "/vocabulary" },
  { label: "Progress", href: "/analytics" },
  { label: "Recent", href: "/session" },
  { label: "Pinned", href: "/dashboard" },
];

export const DESKTOP_QUICK_CHIPS: { label: string; href: string }[] = [
  { label: "Resume", href: "/session" },
  { label: "Pronunciation", href: "/sound-gym" },
  { label: "Grammar", href: "/correct" },
  { label: "Vocabulary", href: "/vocabulary" },
  { label: "AI Coach", href: "/coach" },
  { label: "Progress", href: "/analytics" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Recent", href: "/session" },
];

export const PLACEHOLDER_EXAMPLES = [
  "Practice",
  "Grammar",
  "Vocabulary",
  "Dashboard",
  "Pronunciation",
  "AI Coach",
  "Settings",
  "Achievements",
];

export const EMPTY_SUGGESTIONS = ["Grammar", "Speaking", "Vocabulary", "Progress", "Achievements"];

export const QUICK_ACTIONS: NavItem[] = [
  {
    href: "/session",
    label: "Start Session",
    description: "Launch today's guided lesson",
    icon: Play,
    keywords: ["start", "practice", "lesson"],
  },
  {
    href: "/session",
    label: "Resume Lesson",
    description: "Pick up where you left off",
    icon: Target,
    keywords: ["resume", "continue"],
  },
  {
    href: "/coach",
    label: "Ask AI",
    description: "Open AI Coach chat",
    icon: Bot,
    keywords: ["ai", "coach", "help"],
  },
];

const GROUP_SECTION: Record<string, PaletteSectionId> = {
  app: "navigation",
  daily: "learning",
  speaking: "practice",
  skills: "practice",
  writing: "practice",
  progress: "progress",
  extras: "ai-features",
};

const ICON_GRADIENTS = [
  "from-[#4F46E5] to-[#7C3AED]",
  "from-[#06B6D4] to-[#3B82F6]",
  "from-[#22C55E] to-[#14B8A6]",
  "from-[#F59E0B] to-[#EF4444]",
  "from-[#EC4899] to-[#8B5CF6]",
];

export function itemKey(item: NavItem): string {
  return `${item.href}::${item.label}`;
}

export function findFeature(href: string, label?: string): NavItem | undefined {
  return ALL_FEATURES.find((f) => f.href === href && (!label || f.label === label));
}

export function getSectionForItem(item: NavItem): PaletteSectionId {
  if (item.href === "/rewards") return "achievements";
  if (item.href === "/settings" || item.href === "/profile") return "settings";
  if (item.href === "/coach") return "ai-features";
  for (const group of FEATURE_GROUPS) {
    if (group.items.some((i) => i.href === item.href && i.label === item.label)) {
      return GROUP_SECTION[group.id] ?? "navigation";
    }
  }
  return "navigation";
}

export function matchesCategoryFilter(item: NavItem, filter: CategoryFilter): boolean {
  if (filter === "all") return true;
  const section = getSectionForItem(item);
  switch (filter) {
    case "practice":
      return (
        section === "practice" ||
        section === "learning" ||
        item.href === "/" ||
        item.href === "/explore"
      );
    case "progress":
      return section === "progress" || item.href === "/mistakes";
    case "ai":
      return section === "ai-features" || item.href === "/coach";
    case "settings":
      return section === "settings";
    default:
      return true;
  }
}

export function getIconGradient(item: NavItem): string {
  const n = item.label.length + item.href.length;
  return ICON_GRADIENTS[n % ICON_GRADIENTS.length];
}

export function getDisplayMeta(item: NavItem) {
  const n = item.label.length + item.href.length;
  const durations = ["5 min", "8 min", "10 min", "12 min", "15 min"];
  const xpValues = [15, 20, 25, 40, 50, 80];
  return {
    duration: durations[n % durations.length],
    xp: xpValues[n % xpValues.length],
    completion: Math.min(99, 12 + (n * 11) % 88),
  };
}

export function getCategoryBadge(item: NavItem): string {
  const section = getSectionForItem(item);
  return SECTION_TITLES[section] ?? "Feature";
}

export function buildAiSuggestion(tip: string | null, resumeLabel: string | null): NavItem | null {
  if (resumeLabel) {
    return {
      href: "/session",
      label: "Continue Learning",
      description: resumeLabel,
      icon: Sparkles,
      keywords: ["continue", "resume"],
    };
  }
  if (tip) {
    return {
      href: "/coach",
      label: "AI Recommendation",
      description: tip.slice(0, 72),
      icon: Bot,
      keywords: ["ai"],
    };
  }
  return null;
}

export function groupItems(items: NavItem[]): { section: PaletteSectionId; items: NavItem[] }[] {
  const map = new Map<PaletteSectionId, NavItem[]>();
  for (const item of items) {
    const section = getSectionForItem(item);
    const list = map.get(section) ?? [];
    list.push(item);
    map.set(section, list);
  }
  const order: PaletteSectionId[] = [
    "navigation",
    "practice",
    "learning",
    "ai-features",
    "progress",
    "achievements",
    "settings",
    "commands",
  ];
  return order
    .filter((s) => map.has(s))
    .map((section) => ({ section, items: map.get(section)! }));
}

export type PaletteRow = {
  item: NavItem;
  section: PaletteSectionId;
};

export function rowsFromSections(sections: { section: PaletteSectionId; items: NavItem[] }[]): PaletteRow[] {
  return sections.flatMap(({ section, items }) => items.map((item) => ({ item, section })));
}

/** Client-side input hints — still uses searchFeatures() */
export function normalizeSearchInput(query: string): string {
  const q = query.trim().toLowerCase();
  if (!q) return query;
  if (/start.*lesson|today.*lesson|resume/.test(q)) return "session";
  if (/open ai|ask ai|ai coach/.test(q)) return "coach";
  if (/pronunciation|sound/.test(q)) return "sound gym";
  if (/grammar|correct/.test(q)) return "grammar";
  if (/vocabulary|words/.test(q)) return "vocabulary";
  if (/progress|analytics|stats/.test(q)) return "analytics";
  if (/achievement|reward|badge/.test(q)) return "rewards";
  if (/dashboard|home/.test(q)) return "dashboard";
  return query;
}

export function rankByFrequency(items: NavItem[], freqMap: Record<string, number>): NavItem[] {
  return [...items].sort(
    (a, b) => (freqMap[itemKey(b)] ?? 0) - (freqMap[itemKey(a)] ?? 0)
  );
}

export const AI_QUICK_CHIPS: { label: string; href: string; query?: string }[] = [
  { label: "Resume", href: "/session" },
  { label: "Grammar", href: "/correct" },
  { label: "Pronunciation", href: "/sound-gym" },
  { label: "AI Coach", href: "/coach" },
  { label: "Vocabulary", href: "/vocabulary" },
];

export const DEFAULT_PINNED_HREFS = ["/session", "/coach", "/dashboard"];
