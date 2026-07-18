import {
  Bot,
  BookOpen,
  Headphones,
  Layers,
  Mic,
  PenLine,
  Sparkles,
  Timer,
  Volume2,
  MessageSquare,
  BookOpen as SessionIcon,
  type LucideIcon,
} from "lucide-react";

export const USER_NAME = "Abhinav";
export const TOTAL_DAYS = 90;
export const MISSION_XP_REWARD = 80;

export type PracticeModule = {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  time: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
  cardGradient: string;
  iconGradient: string;
  category: "speaking" | "skills" | "quick" | "coach";
  badge?: "new" | "ai" | "trending" | "recommended";
  completionKey?: string;
};

export const PRACTICE_CATEGORIES = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "speaking", label: "Speaking", icon: Mic },
  { id: "skills", label: "Skills", icon: BookOpen },
  { id: "quick", label: "Quick", icon: Timer },
  { id: "coach", label: "AI", icon: Bot },
] as const;

export const QUICK_ACTION_MODULES = [
  "session",
  "coach",
  "live",
  "challenge",
  "grammar",
  "vocabulary",
] as const;

export const PRACTICE_MODULES: PracticeModule[] = [
  {
    id: "session",
    href: "/session",
    icon: SessionIcon,
    title: "Daily Session",
    subtitle: "10-step guided speaking routine",
    time: "10 min",
    difficulty: "Medium",
    xpReward: 80,
    cardGradient: "from-blue-50/95 via-sky-50/90 to-indigo-50/85",
    iconGradient: "from-[#2563EB] via-[#3B82F6] to-[#60A5FA]",
    category: "speaking",
    badge: "recommended",
  },
  {
    id: "coach",
    href: "/coach",
    icon: Bot,
    title: "AI Coach",
    subtitle: "Personalized feedback & conversation",
    time: "5 min",
    difficulty: "Easy",
    xpReward: 45,
    cardGradient: "from-violet-50/95 via-purple-50/90 to-fuchsia-50/85",
    iconGradient: "from-[#7C3AED] via-[#A855F7] to-[#EC4899]",
    category: "coach",
    badge: "ai",
  },
  {
    id: "live",
    href: "/live-speak",
    icon: Mic,
    title: "Live Speaking",
    subtitle: "Real-time conversation practice",
    time: "8 min",
    difficulty: "Medium",
    xpReward: 60,
    cardGradient: "from-rose-50/95 via-pink-50/90 to-orange-50/85",
    iconGradient: "from-[#EC4899] via-[#F43F5E] to-[#FB7185]",
    category: "speaking",
    badge: "trending",
  },
  {
    id: "shadow",
    href: "/shadowing",
    icon: Layers,
    title: "Shadowing",
    subtitle: "Mirror native pronunciation",
    time: "6 min",
    difficulty: "Medium",
    xpReward: 55,
    cardGradient: "from-violet-50/95 via-purple-50/90 to-indigo-50/85",
    iconGradient: "from-[#8B5CF6] via-[#A855F7] to-[#C084FC]",
    category: "speaking",
  },
  {
    id: "roleplay",
    href: "/roleplay",
    icon: Sparkles,
    title: "Roleplay",
    subtitle: "Real-world scenario practice",
    time: "10 min",
    difficulty: "Hard",
    xpReward: 75,
    cardGradient: "from-fuchsia-50/95 via-pink-50/90 to-rose-50/85",
    iconGradient: "from-[#EC4899] via-[#D946EF] to-[#F0ABFC]",
    category: "speaking",
    badge: "new",
  },
  {
    id: "pronunciation",
    href: "/sound-gym",
    icon: Volume2,
    title: "Pronunciation",
    subtitle: "Train difficult sounds & clarity",
    time: "7 min",
    difficulty: "Medium",
    xpReward: 50,
    cardGradient: "from-emerald-50/95 via-green-50/90 to-teal-50/85",
    iconGradient: "from-[#10B981] via-[#22C55E] to-[#6EE7B7]",
    category: "skills",
  },
  {
    id: "grammar",
    href: "/correct",
    icon: PenLine,
    title: "Grammar",
    subtitle: "Fix sentences with AI corrections",
    time: "5 min",
    difficulty: "Easy",
    xpReward: 40,
    cardGradient: "from-orange-50/95 via-amber-50/90 to-yellow-50/85",
    iconGradient: "from-[#F59E0B] via-[#F97316] to-[#FB923C]",
    category: "skills",
  },
  {
    id: "vocabulary",
    href: "/vocabulary",
    icon: BookOpen,
    title: "Vocabulary",
    subtitle: "Learn & review new words daily",
    time: "6 min",
    difficulty: "Easy",
    xpReward: 42,
    cardGradient: "from-indigo-50/95 via-violet-50/90 to-purple-50/85",
    iconGradient: "from-[#6366F1] via-[#8B5CF6] to-[#A78BFA]",
    category: "skills",
  },
  {
    id: "listening",
    href: "/listen-repeat",
    icon: Headphones,
    title: "Listening",
    subtitle: "Comprehend & respond naturally",
    time: "8 min",
    difficulty: "Medium",
    xpReward: 48,
    cardGradient: "from-cyan-50/95 via-sky-50/90 to-teal-50/85",
    iconGradient: "from-[#06B6D4] via-[#14B8A6] to-[#67E8F9]",
    category: "speaking",
  },
  {
    id: "challenge",
    href: "/challenge",
    icon: Timer,
    title: "Quick Challenge",
    subtitle: "60-second fluency burst",
    time: "1 min",
    difficulty: "Hard",
    xpReward: 35,
    cardGradient: "from-orange-50/95 via-red-50/90 to-rose-50/85",
    iconGradient: "from-[#F97316] via-[#EF4444] to-[#FB7185]",
    category: "quick",
  },
  {
    id: "fillers",
    href: "/live-speak",
    icon: MessageSquare,
    title: "Filler Word Drill",
    subtitle: "Cut um, uh, matlab & toh",
    time: "5 min",
    difficulty: "Medium",
    xpReward: 38,
    cardGradient: "from-amber-50/95 via-orange-50/90 to-yellow-50/85",
    iconGradient: "from-[#FBBF24] via-[#F59E0B] to-[#F97316]",
    category: "quick",
  },
];

export const MOTIVATION_QUOTES = [
  "You're only minutes away from today's goal.",
  "Every sentence you speak is a step toward fluency.",
  "Small daily practice beats occasional marathon sessions.",
  "Confidence grows when you show up — even for five minutes.",
  "Your future fluent self is built one session at a time.",
  "Mistakes mean you're learning. Keep going.",
];

export const ACHIEVEMENT_DEFS = [
  { id: "first_session", name: "First Session", icon: "🏅", xp: 50, threshold: (d: { sessions: number }) => d.sessions >= 1 },
  { id: "streak_7", name: "7 Day Streak", icon: "🔥", xp: 100, threshold: (d: { streak: number }) => d.streak >= 7 },
  { id: "xp_500", name: "500 XP Club", icon: "⭐", xp: 150, threshold: (d: { xp: number }) => d.xp >= 500 },
  { id: "live_practice", name: "Live Speaker", icon: "🎤", xp: 75, threshold: () => false },
  { id: "day_30", name: "30 Day Milestone", icon: "🎯", xp: 200, threshold: (d: { day: number }) => d.day >= 30 },
  { id: "fluency_70", name: "Fluency Pro", icon: "💎", xp: 250, threshold: (d: { fluency: number }) => d.fluency >= 70 },
];
