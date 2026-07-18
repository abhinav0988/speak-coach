import {
  BarChart3,
  BookOpen,
  Bot,
  LayoutGrid,
  Settings,
  Sparkles,
  Target,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";
import { isPracticeFeaturePath } from "@/lib/sidebarNav";

export type PrimaryNavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

const LEARN_PATHS = ["/session", "/journey", "/curriculum", "/homework"] as const;
const PROGRESS_PATHS = [
  "/analytics",
  "/reports",
  "/heatmap",
  "/mistakes",
  "/voice-timeline",
  "/voice",
  "/voice-library",
] as const;

export function matchPracticeHub(pathname: string): boolean {
  return pathname === "/" || pathname === "/explore" || isPracticeFeaturePath(pathname);
}

export function matchLearn(pathname: string): boolean {
  return LEARN_PATHS.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export function matchProgress(pathname: string): boolean {
  return PROGRESS_PATHS.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export function matchCoach(pathname: string): boolean {
  return pathname === "/coach" || pathname.startsWith("/coach/");
}

export function matchRewards(pathname: string): boolean {
  return pathname === "/rewards" || pathname.startsWith("/rewards/");
}

/** Top bar + mobile bottom nav */
export const PRIMARY_NAV: PrimaryNavItem[] = [
  {
    href: "/",
    label: "Practice Hub",
    shortLabel: "Practice",
    icon: Sparkles,
    match: matchPracticeHub,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Target,
    match: (p) => p === "/dashboard",
  },
  {
    href: "/session",
    label: "Learn",
    icon: BookOpen,
    match: matchLearn,
  },
  {
    href: "/analytics",
    label: "Progress",
    icon: BarChart3,
    match: matchProgress,
  },
  {
    href: "/coach",
    label: "Coach",
    icon: Bot,
    match: matchCoach,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    match: (p) => p === "/profile",
  },
];

/** Permanent desktop dashboard sidebar (≥1024px on /dashboard) */
export const DESKTOP_SIDEBAR_NAV: PrimaryNavItem[] = [
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
    match: matchPracticeHub,
  },
  {
    href: "/session",
    label: "Learn",
    icon: BookOpen,
    match: matchLearn,
  },
  {
    href: "/analytics",
    label: "Progress",
    icon: BarChart3,
    match: matchProgress,
  },
  {
    href: "/coach",
    label: "Coach",
    icon: Bot,
    match: matchCoach,
  },
  {
    href: "/rewards",
    label: "Rewards",
    icon: Trophy,
    match: matchRewards,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    match: (p) => p === "/settings",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    match: (p) => p === "/profile",
  },
];

/** Mobile bottom nav — subset of primary routes */
export const MOBILE_BOTTOM_NAV: PrimaryNavItem[] = [
  PRIMARY_NAV[0],
  PRIMARY_NAV[1],
  PRIMARY_NAV[2],
  PRIMARY_NAV[3],
  PRIMARY_NAV[4],
];
