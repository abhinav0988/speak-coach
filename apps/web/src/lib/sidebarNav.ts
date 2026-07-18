import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Brain,
  Flame,
  Headphones,
  HelpCircle,
  Home,
  Languages,
  LayoutGrid,
  Map,
  MessageSquare,
  Mic,
  MoonStar,
  PenLine,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  User,
  Volume2,
  type LucideIcon,
} from "lucide-react";

export type SidebarItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

export type SidebarSection = {
  title: string;
  icon: LucideIcon;
  items: SidebarItem[];
};

const PRACTICE_FEATURE_PATHS = [
  "/live-speak",
  "/shadowing",
  "/roleplay",
  "/challenge",
  "/listen-repeat",
  "/sound-gym",
  "/correct",
  "/vocabulary",
  "/code-switch",
  "/paragraphs",
];

const PROGRESS_PATHS = ["/analytics", "/reports", "/heatmap", "/mistakes", "/voice-timeline", "/voice", "/voice-library"];

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Home",
    icon: Home,
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        match: (p) => p === "/dashboard",
      },
      {
        href: "/",
        label: "Practice Hub",
        icon: Sparkles,
        match: (p) => p === "/" || p === "/explore" || isPracticeFeaturePath(p),
      },
      {
        href: "/rewards",
        label: "Rewards",
        icon: Trophy,
        match: (p) => p === "/rewards" || p.startsWith("/rewards/"),
      },
      {
        href: "/voice-timeline",
        label: "Recent Activity",
        icon: Flame,
        match: (p) => p === "/voice-timeline" || p.startsWith("/voice-timeline/"),
      },
    ],
  },
  {
    title: "Learning",
    icon: BookOpen,
    items: [
      {
        href: "/session",
        label: "Daily Session",
        icon: BookOpen,
        match: (p) =>
          ["/session", "/curriculum", "/homework"].some((r) => p === r || p.startsWith(r + "/")),
      },
      {
        href: "/journey",
        label: "90 Day Journey",
        icon: Map,
        match: (p) => p === "/journey" || p.startsWith("/journey/"),
      },
      {
        href: "/vocabulary",
        label: "Vocabulary",
        icon: BookOpen,
        match: (p) => p === "/vocabulary" || p.startsWith("/vocabulary/"),
      },
      {
        href: "/correct",
        label: "Grammar",
        icon: PenLine,
        match: (p) => p === "/correct" || p.startsWith("/correct/"),
      },
      {
        href: "/sound-gym",
        label: "Pronunciation",
        icon: Volume2,
        match: (p) => p === "/sound-gym" || p.startsWith("/sound-gym/"),
      },
      {
        href: "/shadowing",
        label: "Shadowing",
        icon: Mic,
        match: (p) => p === "/shadowing" || p.startsWith("/shadowing/"),
      },
      {
        href: "/listen-repeat",
        label: "Listening",
        icon: Headphones,
        match: (p) => p === "/listen-repeat" || p.startsWith("/listen-repeat/"),
      },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      {
        href: "/analytics",
        label: "Progress",
        icon: BarChart3,
        match: (p) => PROGRESS_PATHS.some((r) => p === r || p.startsWith(r + "/")),
      },
      {
        href: "/reports",
        label: "Achievements",
        icon: Trophy,
        match: (p) => p === "/reports" || p.startsWith("/reports/"),
      },
      {
        href: "/reports",
        label: "Weekly Report",
        icon: Target,
        match: (p) => p === "/reports" || p.startsWith("/reports/"),
      },
      {
        href: "/heatmap",
        label: "Performance",
        icon: Rocket,
        match: (p) => p === "/heatmap" || p.startsWith("/heatmap/"),
      },
      {
        href: "/mistakes",
        label: "Corrections",
        icon: PenLine,
        match: (p) => p === "/mistakes" || p.startsWith("/mistakes/"),
      },
      {
        href: "/voice-timeline",
        label: "Speaking Score",
        icon: Brain,
        match: (p) => p === "/voice-timeline" || p.startsWith("/voice-timeline/"),
      },
    ],
  },
  {
    title: "AI",
    icon: Bot,
    items: [
      {
        href: "/coach",
        label: "AI Coach",
        icon: Bot,
        match: (p) => p === "/coach" || p.startsWith("/coach/"),
      },
      {
        href: "/correct",
        label: "AI Feedback",
        icon: MessageSquare,
        match: (p) => p === "/correct" || p.startsWith("/correct/"),
      },
      {
        href: "/analytics",
        label: "Speaking Analysis",
        icon: Brain,
        match: (p) => p === "/analytics" || p.startsWith("/analytics/"),
      },
      {
        href: "/",
        label: "Practice Suggestions",
        icon: Sparkles,
        match: (p) => p === "/" || p === "/explore",
      },
      {
        href: "/journey",
        label: "Learning Plan",
        icon: Map,
        match: (p) => p === "/journey" || p.startsWith("/journey/"),
      },
    ],
  },
  {
    title: "Recordings",
    icon: Mic,
    items: [
      {
        href: "/voice-library",
        label: "Voice Library",
        icon: Mic,
        match: (p) => p === "/voice-library" || p.startsWith("/voice-library/"),
      },
      {
        href: "/session",
        label: "Saved Sessions",
        icon: ShieldCheck,
        match: (p) => p === "/session" || p.startsWith("/session/"),
      },
      {
        href: "/voice-library",
        label: "Recordings",
        icon: Timer,
        match: (p) => p === "/voice-library" || p.startsWith("/voice-library/"),
      },
      {
        href: "/voice-library",
        label: "Favorites",
        icon: Star,
        match: (p) => p === "/voice-library" || p.startsWith("/voice-library/"),
      },
    ],
  },
  {
    title: "Account",
    icon: Settings,
    items: [
      {
        href: "/profile",
        label: "Profile",
        icon: User,
        match: (p) => p === "/profile",
      },
      {
        href: "/settings",
        label: "Notifications",
        icon: Bell,
        match: (p) => p === "/settings",
      },
      {
        href: "/settings",
        label: "Appearance",
        icon: MoonStar,
        match: (p) => p === "/settings",
      },
      {
        href: "/settings",
        label: "Language",
        icon: Languages,
        match: (p) => p === "/settings",
      },
      {
        href: "/settings",
        label: "Settings",
        icon: Settings,
        match: (p) => p === "/settings",
      },
      {
        href: "/explore",
        label: "Help",
        icon: HelpCircle,
        match: (p) => p === "/explore",
      },
    ],
  },
];

export function isPracticeFeaturePath(pathname: string): boolean {
  return PRACTICE_FEATURE_PATHS.some((r) => pathname === r || pathname.startsWith(r + "/"));
}
