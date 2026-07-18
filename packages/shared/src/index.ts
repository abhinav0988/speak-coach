export type Language = "english" | "roman_hindi";

export interface MistakeItem {
  wrong: string;
  correct: string;
  line?: number;
  category: "spelling" | "grammar" | "roman_hindi" | "punctuation" | "pronunciation";
  explanation?: string;
}

export interface DiffToken {
  word: string;
  status: "same" | "wrong" | "missing" | "added";
  fix?: string;
}

export interface RomanHindiCorrection {
  myVersion: string;
  correctRomanHindi: string;
  hindiScript: string;
  englishMeaning: string;
  corrections: MistakeItem[];
}

export interface EnglishCorrection {
  original: string;
  corrected: string;
  natural: string;
  explanation: string;
  pronunciationNote?: string;
}

export interface ParagraphWriteResult {
  id: string;
  totalWords: number;
  mistakeCount: number;
  spellingErrors: number;
  grammarErrors: number;
  romanHindiErrors: number;
  accuracyPct: number;
  repeatedMistakes: string[];
  mistakes: MistakeItem[];
  correctedText: string;
  hindiScript?: string;
  englishMeaning?: string;
  diff: DiffToken[];
}

export interface WordAlignment {
  word: string;
  status: "correct" | "wrong" | "skipped" | "extra";
  spoken?: string;
}

export interface SentenceVoiceMetric {
  sentenceIndex: number;
  sentenceText: string;
  speakingTimeMs: number;
  pauseBeforeMs: number;
  volumeAvgDbfs: number;
  volumePeakDbfs: number;
  pitchAvgHz: number;
  pitchStdHz: number;
  loudnessScore: number;
  clarityScore: number;
  paceWpm: number;
  tips: string[];
}

export interface VoiceAnalytics {
  loudnessScore: number;
  clarityScore: number;
  paceWpm: number;
  pitchAvgHz: number;
  pitchVarietyScore: number;
  fillerCount: number;
  speakingTimeMs: number;
  waveformSamples?: number[];
  sentences: SentenceVoiceMetric[];
}

export interface ParagraphReadResult {
  id: string;
  totalWords: number;
  correctWords: number;
  wrongWords: number;
  skippedWords: number;
  extraWords: number;
  pronunciationAccuracyPct: number;
  grammarErrorCount: number;
  fillerWordCount: number;
  wordsPerMinute: number;
  alignment: WordAlignment[];
  grammarFixes: MistakeItem[];
  suggestedCorrection: string;
  transcript: string;
  voiceAnalytics?: VoiceAnalytics;
}

export interface SessionStep {
  stepNumber: number;
  status: "pending" | "done" | "skipped";
  durationSec?: number;
}

export interface ParagraphWriteDetail {
  id: string;
  language: string;
  inputText: string;
  correctedText: string;
  totalWords: number;
  mistakeCount: number;
  spellingErrors: number;
  grammarErrors: number;
  romanHindiErrors: number;
  accuracyPct: number;
  diff: DiffToken[];
  mistakes: MistakeItem[];
  createdAt: string;
}

export interface ParagraphReadDetail {
  id: string;
  sourceText: string;
  sourceLanguage: string;
  transcript: string;
  totalWords: number;
  correctWords: number;
  wrongWords: number;
  skippedWords: number;
  extraWords: number;
  pronunciationAccuracyPct: number;
  fillerWordCount: number;
  wordsPerMinute: number;
  loudnessScore: number | null;
  clarityScore: number | null;
  alignment: WordAlignment[];
  createdAt: string;
}

export interface DashboardData {
  streak: number;
  practicedToday?: boolean;
  freezesAvailable?: number;
  totalPracticeDays?: number;
  dayNumber: number;
  todaySessionComplete: boolean;
  fluencyScore: number;
  recentScores: {
    date: string;
    pronunciation: number;
    romanHindi: number;
    spokenEn: number;
    spokenHi: number;
    loudness: number;
  }[];
  topMistakes: { wrong: string; correct: string; repeatCount: number }[];
  totalSessions: number;
  correctionsToday?: number;
}

export const DEFAULT_MISTAKE_RULES: Record<string, string> = {
  pohach: "pahunch",
  pahuch: "pahunch",
  gye: "gaye",
  gya: "gaya",
  rha: "raha",
  rhe: "rahe",
  rhi: "rahi",
  hu: "hoon",
  he: "hain",
  hainn: "hain",
  nhi: "nahi",
  nhin: "nahi",
  bajah: "wajah",
  kr: "kar",
  kro: "karo",
  mje: "mujhe",
  hmesha: "hamesha",
  chalrahehain: "chal rahe hain",
  jaunga: "jaunga",
  bolunga: "bolunga",
};

export const SESSION_STEPS = [
  "Voice Warm-up",
  "English Pronunciation",
  "Hindi Pronunciation",
  "Roman Hindi Correction",
  "Mistake Dictionary",
  "Conversation Practice",
  "English Correction",
  "Hindi Sentences",
  "Daily Vocabulary",
  "Confidence Coach",
] as const;

export * from "./content";

export interface ShadowingResult {
  id: string;
  referenceText: string;
  transcript: string;
  wordAccuracyPct: number;
  paceMatchPct: number;
  volumeMatchPct: number;
  clarityScore: number;
  overallScore: number;
  mismatchedWords: { expected: string; spoken: string }[];
}

export interface RoleplayScenario {
  id: string;
  title: string;
  description: string;
  language: string;
  turns: { role: string; text: string }[];
}

export interface WeeklyReportDay {
  date: string;
  minutes: number;
  recordings: number;
  sessionDone: boolean;
  goalMet: boolean;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  sessionsCompleted: number;
  correctionsMade: number;
  recordingsMade: number;
  speakingMinutes: number;
  avgLoudness: number;
  avgClarity: number;
  avgAccuracy: number;
  streakDays: number;
  daysGoalMet: number;
  dailyGoalMinutes: number;
  dailyActivity: WeeklyReportDay[];
  topMistakes: { wrong: string; correct: string; count: number }[];
  improvements: string[];
  focusAreas: string[];
  fluencyScore: number;
}

export interface GamificationData {
  xp: number;
  level: number;
  levelName: string;
  badges: { id: string; name: string; earned: boolean }[];
  voiceTrend: { date: string; loudness: number; clarity: number }[];
}

export interface ExtendedDashboard extends DashboardData {
  gamification: GamificationData;
}

export interface JourneyDay {
  day: number;
  date: string;
  status: "completed" | "partial" | "missed" | "upcoming";
  isMilestone: boolean;
  milestoneLabel: string | null;
  completedSteps: number;
}

export interface JourneyData {
  dayNumber: number;
  targetDays: number;
  progressPct: number;
  completedDays: number;
  currentMilestone: number;
  days: JourneyDay[];
  milestones: Array<{ day: number; label: string; reached: boolean; completed: boolean }>;
}

export interface HeatmapDay {
  date: string;
  level: "none" | "low" | "medium" | "high" | "clean";
  mistakeCount: number;
  sessionDone: boolean;
  accuracy: number | null;
}

export interface PracticeHeatmapDay {
  date: string;
  level: "none" | "light" | "moderate" | "active" | "intense";
  minutes: number;
  recordings: number;
  sessionDone: boolean;
  goalMet: boolean;
}

export interface PracticeHeatmapData {
  heatmap: PracticeHeatmapDay[];
  goalMinutes: number;
  summary: {
    activeDays: number;
    goalMetDays: number;
    totalMinutes: number;
    weeks: number;
  };
}

export interface NightReviewData {
  topMistakes: Array<{ wrong: string; correct: string; count: number }>;
  shortestRecording: unknown;
  reviewSentences: Array<{ roman_hindi: string; hindi_script: string; english: string }>;
  homework: { tasks: string[]; completed: boolean } | null;
  steps: string[];
}

export interface BulkLineResult {
  lineNumber: number;
  original: string;
  corrected: string;
  language: "english" | "roman_hindi" | "hindi_script" | "mixed";
  mistakes: MistakeItem[];
  hinglishNote?: string;
}

export interface BulkCorrectResult {
  lines: BulkLineResult[];
  totalMistakes: number;
  summary: string;
}

export interface VoiceTimelineData {
  total: number;
  first: VoiceRecordingSummary | null;
  latest: VoiceRecordingSummary | null;
  delta: {
    loudness: number;
    clarity: number;
    pace: number;
    fillers: number;
  } | null;
  recordings: VoiceRecordingSummary[];
  trendByDay: VoiceTimelineDayStat[];
  byCategory: Record<string, number>;
}

export interface VoiceTimelineDayStat {
  date: string;
  count: number;
  avgLoudness: number;
  avgClarity: number;
}

export interface CorrectionHistoryItem {
  id: string;
  type: string;
  inputText: string;
  correctedPreview: string;
  mistakeCount: number;
  createdAt: string;
}

export interface CorrectionHistoryData {
  items: CorrectionHistoryItem[];
  stats: Record<string, number>;
  total: number;
}

export interface SoundGymProgressData {
  completed: Array<{
    drillId: string;
    completedAt: string;
    loudnessScore: number | null;
    clarityScore: number | null;
  }>;
  completedIds: string[];
  totalCompleted: number;
}

export interface VoiceRecordingSummary {
  id: string;
  source?: VoiceLibrarySource;
  durationSec: number;
  transcript: string;
  language: string;
  loudnessScore: number;
  clarityScore: number;
  paceWpm: number;
  fillerCount: number;
  waveformSamples?: number[];
  createdAt: string;
  category?: VoiceRecordingCategory;
  label?: string;
}

export type VoiceRecordingCategory =
  | "general"
  | "live_speak"
  | "challenge"
  | "practice"
  | "session"
  | "shadowing"
  | "paragraph_read"
  | "roleplay";

export type VoiceLibrarySource = "voice" | "shadowing" | "paragraph";

export interface VoiceLibraryItem {
  id: string;
  source: VoiceLibrarySource;
  category: VoiceRecordingCategory;
  r2Key: string | null;
  transcript: string;
  durationSec: number | null;
  loudnessScore: number | null;
  clarityScore: number | null;
  createdAt: string;
  canDownload: boolean;
  label?: string;
}

export interface VoiceLibraryData {
  total: number;
  counts: Record<VoiceRecordingCategory, number>;
  recordings: VoiceLibraryItem[];
}

export interface UserSettings {
  reminder_enabled: number;
  reminder_time: string;
  devanagari_preferred: number;
  daily_goal_minutes?: number;
  streak_freezes?: number;
  weekly_report_email?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  startDate: string;
  targetDays: number;
  signedInAt?: string;
}

export interface UserProfileStats {
  dayNumber: number;
  streak: number;
  totalSessions: number;
  fluencyScore: number;
  totalPracticeDays: number;
}

export interface StreakInfo {
  streak: number;
  practicedToday: boolean;
  freezesAvailable: number;
  longestStreak: number;
  totalPracticeDays: number;
}

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface CodeSwitchAnalysis {
  id?: string;
  englishRatio: number;
  hindiRatio: number;
  mixedScore: number;
  wordCount: number;
  englishWords: string[];
  hindiWords: string[];
  mixedWords: string[];
  tip: string;
}

export interface CodeSwitchLog {
  id: string;
  textSample: string;
  englishRatio: number;
  hindiRatio: number;
  mixedScore: number;
  wordCount: number;
  createdAt: string;
}

export interface CodeSwitchStats {
  totalSamples: number;
  avgEnglishRatio: number;
  avgHindiRatio: number;
  avgMixedScore: number;
}

export interface CurriculumOverview {
  dayNumber: number;
  targetDays: number;
  weeks: Array<{ week: number; days: string; theme: string; focus: string }>;
}

export interface HealthStatus {
  status: "ok" | "degraded";
  service: string;
  version: string;
  phase: number;
  checks: {
    database: boolean;
    authTables: boolean;
    tableCount: number;
    jwtConfigured: boolean;
    durableObjects: boolean;
    aiBinding: boolean;
    voiceBucket: boolean;
    emailConfigured: boolean;
  };
  timestamp: string;
}

export interface AuthUserPublic {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar: string | null;
  status: string;
  startDate: string;
  targetDays: number;
  learningGoal: string | null;
  profileComplete: boolean;
}

export interface LaunchCheck {
  id: string;
  label: string;
  status: "pass" | "fail" | "pending" | "skip";
  detail?: string;
}

export interface AnalyticsData {
  dayNumber: number;
  goalMinutes: number;
  todayMinutes: number;
  goalProgressPct: number;
  totals: {
    sessions: number;
    corrections: number;
    recordings: number;
    shadowing: number;
    paragraphWrites: number;
    paragraphReads: number;
    speakingMinutes: number;
    mistakesMastered: number;
  };
  averages: {
    loudness: number;
    clarity: number;
    paceWpm: number;
  };
  fluencyTrend: Array<{
    date: string;
    pronunciation: number;
    romanHindi: number;
    loudness: number;
  }>;
  activityByDay: Array<{ date: string; recordings: number }>;
  correctionsByType: Array<{ type: string; count: number }>;
  topMistakes: Array<{ wrong: string; correct: string; count: number }>;
  weeklyStats: AnalyticsPeriodStat[];
  monthlyStats: AnalyticsPeriodStat[];
  practiceMix: AnalyticsMixSlice[];
  scoreTrendWeekly: AnalyticsScorePoint[];
}

export interface AnalyticsPeriodStat {
  label: string;
  periodKey: string;
  sessions: number;
  recordings: number;
  minutes: number;
  corrections: number;
  avgPronunciation: number;
  avgClarity: number;
  avgLoudness?: number;
}

export interface AnalyticsMixSlice {
  id: string;
  label: string;
  value: number;
}

export interface AnalyticsScorePoint {
  label: string;
  pronunciation: number;
  clarity: number;
  loudness: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  streak: number;
  league: string;
  isYou: boolean;
  rank: number;
}

export interface LeaderboardData {
  league: string;
  entries: LeaderboardEntry[];
  yourRank: number | null;
}
