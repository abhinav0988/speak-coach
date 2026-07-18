import {
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  FileText,
  Flame,
  Headphones,
  Layers,
  LayoutGrid,
  Map,
  MessageSquare,
  Mic,
  Moon,
  PenLine,
  Settings,
  Sparkles,
  Target,
  Timer,
  Trophy,
  TrendingUp,
  User,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { isPracticeFeaturePath } from "@/lib/sidebarNav";

export type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  keywords?: string[];
};

export type NavGroup = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  items: NavItem[];
};

const PRACTICE_PATHS = [
  "/live-speak", "/shadowing", "/roleplay", "/challenge", "/listen-repeat",
  "/sound-gym", "/correct", "/vocabulary", "/code-switch",
  "/paragraphs", "/coach",
];

export const MAIN_NAV = [
  { href: "/", label: "Practice Hub", icon: Sparkles, match: (p: string) => p === "/" || p === "/explore" || isPracticeFeaturePath(p) },
  { href: "/dashboard", label: "Dashboard", icon: Target, match: (p: string) => p === "/dashboard" },
  { href: "/session", label: "Learn", icon: BookOpen, match: (p: string) =>
    ["/session", "/journey", "/curriculum", "/homework"].some((r) => p === r || p.startsWith(r + "/")) },
  { href: "/analytics", label: "Progress", icon: BarChart3, match: (p: string) =>
    ["/analytics", "/reports", "/heatmap", "/mistakes", "/voice-timeline", "/voice", "/voice-library"].some((r) => p === r || p.startsWith(r + "/")) },
  { href: "/coach", label: "Coach", icon: Bot, match: (p: string) => p === "/coach" || p.startsWith("/coach/") },
] as const;

export const FEATURE_GROUPS: NavGroup[] = [
  {
    id: "app",
    label: "App",
    description: "Core pages & account",
    icon: LayoutGrid,
    items: [
      { href: "/", label: "Practice Hub", description: "All speaking modules & quick launch", icon: Sparkles, keywords: ["home", "practice", "hub"] },
      { href: "/dashboard", label: "Dashboard", description: "Missions, streak & daily overview", icon: Target, keywords: ["home", "overview", "stats"] },
      { href: "/explore", label: "Explore Features", description: "Browse every tool in the app", icon: LayoutGrid, keywords: ["find", "discover", "all"] },
      { href: "/rewards", label: "Rewards", description: "XP, badges, spins & treasure chests", icon: Trophy, keywords: ["gamification", "coins", "badges", "leaderboard"] },
      { href: "/profile", label: "Profile", description: "Identity, progress & achievements", icon: User, keywords: ["account", "me", "user"] },
      { href: "/settings", label: "Settings", description: "Notifications, language & preferences", icon: Settings, keywords: ["preferences", "config"] },
    ],
  },
  {
    id: "daily",
    label: "Daily learning",
    description: "Your structured 90-day path",
    icon: Calendar,
    items: [
      { href: "/session", label: "Daily Session", description: "10-step guided practice", icon: Target, keywords: ["lesson", "routine"] },
      { href: "/journey", label: "90-Day Journey", description: "Milestones & map", icon: Map, keywords: ["roadmap", "plan"] },
      { href: "/curriculum", label: "Curriculum", description: "All lessons by day", icon: BookOpen, keywords: ["syllabus"] },
      { href: "/homework", label: "Homework", description: "Tasks after each session", icon: PenLine, keywords: ["assignments"] },
    ],
  },
  {
    id: "speaking",
    label: "Speaking practice",
    description: "Build fluency through conversation",
    icon: Mic,
    items: [
      { href: "/live-speak", label: "Live Speaking", description: "Real-time conversation", icon: Mic, keywords: ["talk", "voice"] },
      { href: "/shadowing", label: "Shadowing", description: "Mirror native pronunciation", icon: Layers, keywords: ["repeat", "listen"] },
      { href: "/roleplay", label: "Roleplay", description: "Real-world scenarios", icon: Sparkles, keywords: ["interview", "conversation"] },
      { href: "/challenge", label: "60s Challenge", description: "Quick fluency burst", icon: Timer, keywords: ["speed", "quick"] },
      { href: "/listen-repeat", label: "Listen & Repeat", description: "Comprehend then respond", icon: Headphones, keywords: ["listening"] },
    ],
  },
  {
    id: "skills",
    label: "Skills & drills",
    description: "Target specific weaknesses",
    icon: Volume2,
    items: [
      { href: "/sound-gym", label: "Sound Gym", description: "Train difficult sounds", icon: Volume2, keywords: ["pronunciation", "phonics"] },
      { href: "/correct", label: "Grammar Fix", description: "Correct sentences + history", icon: PenLine, keywords: ["grammar", "mistakes"] },
      { href: "/vocabulary", label: "Vocabulary", description: "Learn & review words", icon: BookOpen, keywords: ["words", "flashcards"] },
      { href: "/code-switch", label: "Code Switch", description: "EN ↔ Hindi switching", icon: MessageSquare, keywords: ["bilingual"] },
      { href: "/mistakes", label: "Mistake Dictionary", description: "Your recurring errors", icon: Target, keywords: ["errors", "patterns"] },
    ],
  },
  {
    id: "writing",
    label: "Writing labs",
    description: "Paragraph practice with feedback",
    icon: FileText,
    items: [
      { href: "/paragraphs/write", label: "Write Paragraph", description: "Submit & get corrections", icon: PenLine },
      { href: "/paragraphs/read", label: "Read Aloud", description: "Record & compare", icon: Mic },
      { href: "/paragraphs/history", label: "Paragraph History", description: "Past attempts", icon: FileText },
    ],
  },
  {
    id: "progress",
    label: "Progress & insights",
    description: "Track growth over time",
    icon: TrendingUp,
    items: [
      { href: "/analytics", label: "Analytics", description: "Scores & trends", icon: BarChart3, keywords: ["stats", "dashboard"] },
      { href: "/reports", label: "Weekly Reports", description: "PDF summary & goals", icon: FileText },
      { href: "/heatmap", label: "Activity Calendar", description: "Practice & mistake heatmaps", icon: Flame },
      { href: "/voice-library", label: "Voice Library", description: "Download & before/after compare", icon: Mic, keywords: ["audio", "save", "download"] },
      { href: "/voice-timeline", label: "Voice Timeline", description: "All recordings unified chart", icon: Mic },
      { href: "/voice", label: "Voice Analysis", description: "Pitch & volume", icon: Volume2 },
    ],
  },
  {
    id: "extras",
    label: "Extras",
    description: "Bonus tools & reflection",
    icon: LayoutGrid,
    items: [
      { href: "/coach", label: "AI Coach", description: "Chat with your coach", icon: Bot },
      { href: "/journal", label: "Confidence Journal", description: "Mood & reflections", icon: BookOpen },
      { href: "/night-review", label: "Night Review", description: "5-min bedtime recap", icon: Moon },
      { href: "/phrases", label: "Phrasebook", description: "Saved corrections", icon: BookOpen },
      { href: "/whatsapp", label: "WhatsApp Bulk Fix", description: "Correct pasted chats", icon: MessageSquare },
      { href: "/comeback", label: "Comeback Mode", description: "Return after a break", icon: Briefcase },
    ],
  },
];

export const ALL_FEATURES: NavItem[] = FEATURE_GROUPS.flatMap((g) => g.items);

export function searchFeatures(query: string): NavItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_FEATURES;
  const terms = q.split(/\s+/).filter(Boolean);
  return ALL_FEATURES.filter((item) => {
    const haystack = [
      item.label,
      item.description ?? "",
      item.href.replace(/\//g, " "),
      ...(item.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function isPathActive(pathname: string, href: string, hash = ""): boolean {
  if (href.startsWith("/#")) {
    const target = href.slice(2);
    if (pathname !== "/") return false;
    if (target === "dashboard") return hash === "" || hash === "#dashboard";
    return hash === `#${target}`;
  }
  return pathname === href || pathname.startsWith(href + "/");
}
