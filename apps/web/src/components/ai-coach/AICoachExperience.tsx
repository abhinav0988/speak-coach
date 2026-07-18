"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Bot,
  Briefcase,
  Copy,
  Globe,
  Image as ImageIcon,
  Menu,
  Mic,
  Moon,
  Paperclip,
  Plane,
  RotateCcw,
  Search,
  Send,
  Smile,
  Sparkles,
  Sun,
  Target,
  Volume2,
  Wand2,
  Zap,
} from "lucide-react";
import type { CoachMessage } from "@speak-coach/shared";
import { useAuthOptional, getInitials } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { getDayPeriod, getTimeGreeting } from "@/lib/greeting";
import { useCoachChat } from "@/hooks/useCoachChat";
import { useCoachPageData } from "@/hooks/useCoachPageData";
import { USER_NAME } from "@/components/dashboard/constants";
import { cn } from "@/lib/utils";
import {
  AIOrb,
  AcButton,
  AcGlass,
  AcLinkButton,
  CoachAurora,
  LiveScoreStrip,
  MarkdownLite,
  TypingIndicator,
} from "./design-system";

const SUGGESTION_CARDS = [
  { title: "How do I say…", subtitle: "Translate & phrase help", time: "2 min", diff: "Easy", icon: Globe, gradient: "from-blue-500 to-indigo-600", prompt: "How do I say 'I reached home' in Hindi?" },
  { title: "Fix my grammar", subtitle: "Instant corrections", time: "3 min", diff: "Medium", icon: Wand2, gradient: "from-orange-500 to-amber-600", prompt: "Correct this: main ghar pohach gya hu" },
  { title: "Pronunciation", subtitle: "Sound & clarity", time: "5 min", diff: "Medium", icon: Volume2, gradient: "from-emerald-500 to-teal-600", prompt: "How can I speak louder and clearer?" },
  { title: "Shadowing", subtitle: "Mirror native speech", time: "8 min", diff: "Hard", icon: Mic, gradient: "from-violet-500 to-purple-600", prompt: "Give me a shadowing exercise for today" },
  { title: "Vocabulary", subtitle: "Words & usage", time: "5 min", diff: "Easy", icon: Sparkles, gradient: "from-pink-500 to-rose-600", prompt: "Teach me 5 business English words" },
  { title: "Interview Practice", subtitle: "Mock Q&A", time: "10 min", diff: "Hard", icon: Briefcase, gradient: "from-indigo-500 to-violet-600", prompt: "Mock interview me for a software job" },
  { title: "Roleplay", subtitle: "Real scenarios", time: "8 min", diff: "Medium", icon: Bot, gradient: "from-cyan-500 to-blue-600", prompt: "Let's roleplay ordering at a restaurant" },
  { title: "Travel English", subtitle: "Airport & hotel", time: "6 min", diff: "Easy", icon: Plane, gradient: "from-sky-500 to-cyan-600", prompt: "Help me with travel English phrases" },
];

const QUICK_CHIPS = [
  { emoji: "🎤", label: "Practice Speaking", prompt: "Let's practice speaking for 5 minutes" },
  { emoji: "🧠", label: "AI Feedback", prompt: "Give me feedback on my last message" },
  { emoji: "📝", label: "Fix Grammar", prompt: "Check grammar in my sentences" },
  { emoji: "🔊", label: "Pronunciation", prompt: "Help with pronunciation" },
  { emoji: "🎯", label: "Daily Challenge", prompt: "Give me today's speaking challenge" },
  { emoji: "📚", label: "Vocabulary", prompt: "Teach me new vocabulary" },
  { emoji: "🗣", label: "Conversation", prompt: "Let's have a casual conversation" },
  { emoji: "💼", label: "Interview", prompt: "Mock interview practice" },
];

function deriveLiveScores(messages: CoachMessage[]) {
  const last = messages.filter((m) => m.role === "user").pop()?.content ?? "";
  const len = last.length;
  const hasQuestion = last.includes("?");
  return [
    { label: "Grammar", value: Math.min(99, 55 + Math.min(len, 80)), color: "text-orange-600" },
    { label: "Pronunciation", value: Math.min(99, 50 + len % 40), color: "text-emerald-600" },
    { label: "Confidence", value: Math.min(99, 45 + messages.length * 4), color: "text-violet-600" },
    { label: "Fluency", value: Math.min(99, 40 + (hasQuestion ? 15 : 25) + len % 30), color: "text-blue-600" },
  ];
}

export function AICoachExperience() {
  const searchParams = useSearchParams();
  const auth = useAuthOptional();
  const { theme, toggle } = useTheme();
  const firstName = auth?.user?.name?.split(" ")[0] ?? USER_NAME;
  const greeting = getTimeGreeting(getDayPeriod());
  const { dashboard, analytics, insights } = useCoachPageData();
  const chat = useCoachChat();
  const { messages, loading, streamingText, send, newChat, regenerate, streamMode, setStreamMode, wsMode, setWsMode } = chat;

  const [input, setInput] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(8));
  const [pinned, setPinned] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listeningRef = useRef(false);
  const voiceCleanupRef = useRef<(() => void) | null>(null);

  const fromParam = searchParams.get("from");
  const backHref = fromParam?.startsWith("/") ? fromParam : "/";

  const streak = dashboard?.streak ?? 0;
  const xp = dashboard?.gamification?.xp ?? 0;
  const level = dashboard?.gamification?.level ?? 1;
  const goalPct = analytics?.goalProgressPct ?? 0;
  const aiTip = insights[0] ?? "Practice pronunciation for 8 minutes today.";
  const orbState = loading && !streamingText ? "thinking" : voiceMode && listening ? "listening" : streamingText ? "speaking" : "idle";
  const liveScores = deriveLiveScores(messages);
  const isEmpty = messages.length === 0 && !streamingText;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    void send(input);
    setInput("");
  };

  const copyMessage = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  const stopVoiceCapture = () => {
    listeningRef.current = false;
    setListening(false);
    voiceCleanupRef.current?.();
    voiceCleanupRef.current = null;
  };

  const toggleVoice = async () => {
    if (!voiceMode) {
      setVoiceMode(true);
      return;
    }
    if (listeningRef.current) {
      stopVoiceCapture();
      void send("I just practiced speaking — give me feedback on clarity and confidence.");
      setVoiceMode(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      listeningRef.current = true;
      setListening(true);
      let raf = 0;
      const tick = () => {
        if (!listeningRef.current) return;
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const level = Math.min(100, Math.sqrt(sum / buf.length) * 400);
        setWaveform((prev) => [...prev.slice(1), Math.max(8, level)]);
        raf = requestAnimationFrame(tick);
      };
      tick();
      voiceCleanupRef.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
      };
      window.setTimeout(() => {
        if (!listeningRef.current) return;
        stopVoiceCapture();
        void send("I just practiced speaking — give me feedback on clarity and confidence.");
        setVoiceMode(false);
      }, 5000);
    } catch {
      stopVoiceCapture();
      setVoiceMode(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh w-full min-w-0 flex-col overflow-x-hidden">
      <CoachAurora />

      {/* TOP BAR — mobile only; desktop uses AppShell DesktopTopBar */}
      <div className="sticky top-0 z-50 px-2 pb-3 pt-[max(0.25rem,env(safe-area-inset-top))] sm:px-4 lg:hidden">
        <AcGlass className="ac-topbar mx-auto flex w-full min-w-0 max-w-content items-center justify-between gap-2 rounded-[24px] px-3 py-2.5" glow="purple">
          <div className="flex items-center gap-2">
            <Link href={backHref} className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition hover:bg-white/50 hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-xl text-muted sm:flex" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
            <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-xl text-muted sm:flex" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="ac-online-badge hidden items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-700 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              AI Online
            </span>
            <button type="button" onClick={toggle} className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition hover:bg-white/50" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl text-muted" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-xs font-bold text-white">
              {getInitials(auth?.user?.name ?? firstName)}
            </Link>
          </div>
        </AcGlass>
      </div>

      {/* MAIN */}
      <div className="mx-auto flex w-full min-w-0 max-w-content flex-1 flex-col gap-4 px-2 pb-[calc(9rem+env(safe-area-inset-bottom))] sm:gap-5 sm:px-4 md:pb-40 lg:pb-36">
        {/* HERO - show when empty or compact when chatting */}
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div key="welcome" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="ac-gradient-border rounded-[28px] p-[1.5px]">
                <AcGlass className="p-6 sm:p-8" glow="blue">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <AIOrb state={orbState} />
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-[13px] font-bold uppercase tracking-widest text-primary">AI Coach · Online</p>
                      <h1 className="mt-1 bg-gradient-to-br from-slate-900 to-violet-900 bg-clip-text text-3xl font-black leading-none text-transparent dark:from-slate-100 dark:to-violet-200 md:text-4xl xl:text-5xl">
                        {greeting}, {firstName} 👋
                      </h1>
                      <p className="mt-2 text-[16px] text-muted">Your personal AI speaking coach is ready.</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                        <span className="rounded-full bg-white/50 px-2.5 py-1 text-[11px] font-bold dark:bg-white/5">GPT Powered</span>
                        <span className="rounded-full bg-white/50 px-2.5 py-1 text-[11px] font-bold dark:bg-white/5">~1s response</span>
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Quality: High</span>
                      </div>
                      <AcLinkButton href="/session" className="mt-5">
                        <Zap className="h-4 w-4" /> Continue Learning
                      </AcLinkButton>
                    </div>
                  </div>
                </AcGlass>
              </div>

              {/* Welcome stat cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { label: "Today's Goal", value: `${goalPct}%` },
                  { label: "Streak", value: `${streak}d` },
                  { label: "XP", value: String(xp) },
                  { label: "Level", value: String(level) },
                  { label: "Est. Practice", value: "8 min" },
                  { label: "Focus", value: aiTip.slice(0, 12) + "…" },
                ].map((c) => (
                  <AcGlass key={c.label} className="p-3 text-center">
                    <p className="text-[9px] font-bold uppercase text-muted">{c.label}</p>
                    <p className="mt-1 text-lg font-black">{c.value}</p>
                  </AcGlass>
                ))}
              </div>

              {/* Suggestion cards */}
              <div>
                <p className="mb-3 text-[22px] font-black">Suggested for you</p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {SUGGESTION_CARDS.map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.button key={card.title} whileHover={{ y: -4 }} type="button" onClick={() => void send(card.prompt)}
                        className="ac-suggestion shrink-0 w-[180px] rounded-[24px] border border-white/55 bg-white/55 p-4 text-left backdrop-blur-xl dark:bg-slate-900/50">
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", card.gradient)}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <p className="mt-3 text-[16px] font-extrabold">{card.title}</p>
                        <p className="text-[12px] text-muted">{card.subtitle}</p>
                        <p className="mt-2 text-[10px] font-bold text-primary">{card.time} · {card.diff}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Quick chips */}
              <div className="flex flex-wrap gap-2">
                {QUICK_CHIPS.map((chip) => (
                  <motion.button key={chip.label} whileHover={{ scale: 1.03 }} type="button" onClick={() => void send(chip.prompt)}
                    className="ac-chip rounded-full border border-white/50 bg-gradient-to-r from-white/60 to-white/40 px-4 py-2 text-[13px] font-bold backdrop-blur dark:from-slate-800/60 dark:to-slate-900/40">
                    {chip.emoji} {chip.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="compact-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AIOrb state={orbState} />
                <div>
                  <p className="text-sm font-bold">AI Coach</p>
                  <p className="text-[11px] text-muted">{loading ? "Thinking…" : "Ready"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <AcButton variant="ghost" onClick={() => setShowSettings((s) => !s)} className="!px-3 !py-2 text-xs">
                  <Target className="h-3.5 w-3.5" />
                </AcButton>
                <AcButton variant="ghost" onClick={newChat} className="!px-3 !py-2 text-xs">
                  <RotateCcw className="h-3.5 w-3.5" /> New
                </AcButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showSettings && (
          <AcGlass className="p-4">
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wsMode} onChange={(e) => setWsMode(e.target.checked)} className="accent-violet-600" />
                WebSocket
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={streamMode} onChange={(e) => setStreamMode(e.target.checked)} disabled={wsMode} className="accent-violet-600" />
                Stream
              </label>
            </div>
          </AcGlass>
        )}

        {/* Live feedback */}
        {messages.length > 0 && (
          <LiveScoreStrip scores={liveScores} />
        )}

        {/* AI Insights strip */}
        {isEmpty && insights.length > 0 && (
          <AcGlass className="p-4" glow="pink">
            <p className="text-[10px] font-bold uppercase text-muted">AI Insight</p>
            <p className="mt-1 text-[14px] font-medium">{aiTip}</p>
          </AcGlass>
        )}

        {/* CHAT */}
        <div className="flex-1 space-y-4">
          {messages.map((m, i) => (
            <motion.div key={`${i}-${m.timestamp}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("group relative max-w-[88%] sm:max-w-[75%]",
                m.role === "user"
                  ? "rounded-[24px] rounded-br-md bg-gradient-to-br from-[#2563EB] to-[#7C3AED] px-4 py-3 text-white shadow-[0_12px_32px_rgba(37,99,235,0.25)]"
                  : "ac-msg-ai rounded-[24px] rounded-bl-md border border-white/50 bg-white/60 px-4 py-3 backdrop-blur-xl dark:bg-slate-900/60")}>
                {m.role === "assistant" ? <MarkdownLite content={m.content} /> : <p className="text-[15px] leading-relaxed">{m.content}</p>}
                <div className={cn("mt-2 flex gap-1 opacity-0 transition group-hover:opacity-100", m.role === "user" && "justify-end")}>
                  <button type="button" onClick={() => copyMessage(m.content)} className="rounded-lg p-1.5 hover:bg-white/20" aria-label="Copy">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {m.role === "assistant" && i === messages.length - 1 && (
                    <button type="button" onClick={() => void regenerate()} className="rounded-lg p-1.5 hover:bg-white/20" aria-label="Regenerate">
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button type="button" onClick={() => setBookmarked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                    className="rounded-lg p-1.5 hover:bg-white/20" aria-label="Bookmark">
                    <Bookmark className={cn("h-3.5 w-3.5", bookmarked.has(i) && "fill-primary text-primary")} />
                  </button>
                  <button type="button" onClick={() => setPinned((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                    className="rounded-lg p-1.5 hover:bg-white/20" aria-label="Pin">
                    <Sparkles className={cn("h-3.5 w-3.5", pinned.has(i) && "text-amber-500")} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {streamingText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="ac-msg-ai max-w-[88%] rounded-[24px] rounded-bl-md border border-white/50 bg-white/60 px-4 py-3 backdrop-blur-xl sm:max-w-[75%] dark:bg-slate-900/60">
                <MarkdownLite content={streamingText} />
                <span className="animate-pulse text-violet-500">▌</span>
              </div>
            </motion.div>
          )}

          {loading && !streamingText && (
            <div className="flex justify-start"><TypingIndicator /></div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* VOICE MODE OVERLAY */}
      <AnimatePresence>
        {voiceMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/50 backdrop-blur-md">
            <AIOrb state={listening ? "listening" : "idle"} />
            <p className="mt-6 text-xl font-bold text-white">{listening ? "Listening…" : "Voice Mode"}</p>
            <div className="mt-6 flex h-16 items-end gap-1">
              {waveform.map((h, i) => (
                <motion.div key={i} animate={{ height: h }} className="w-1.5 rounded-full bg-gradient-to-t from-[#2563EB] to-[#EC4899]" style={{ height: h }} />
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <AcButton variant="ghost" onClick={() => { stopVoiceCapture(); setVoiceMode(false); }}>Cancel</AcButton>
              <AcButton onClick={() => void toggleVoice()}>{listening ? "Stop" : "Start"}</AcButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING INPUT BAR */}
      <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 px-3 sm:bottom-6 lg:bottom-8">
        <div className="ac-input-bar mx-auto flex w-full min-w-0 max-w-content items-end gap-2 rounded-[30px] border border-white/60 bg-white/70 p-2 shadow-glass backdrop-blur-[30px] dark:bg-slate-900/70">
          <button type="button" onClick={() => void toggleVoice()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-violet-600 transition hover:bg-violet-500/10" aria-label="Voice">
            <Mic className="h-5 w-5" />
          </button>
          <button type="button" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted sm:flex" aria-label="Attach">
            <Paperclip className="h-5 w-5" />
          </button>
          <button type="button" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted sm:flex" aria-label="Image">
            <ImageIcon className="h-5 w-5" />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask anything about English, Hindi, or pronunciation…"
            className="max-h-[120px] min-h-[44px] flex-1 resize-none bg-transparent px-2 py-3 text-[15px] text-foreground placeholder:text-muted focus:outline-none"
          />
          <button type="button" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted sm:flex" aria-label="Emoji">
            <Smile className="h-5 w-5" />
          </button>
          <AcButton variant="send" onClick={handleSend} disabled={loading || !input.trim()} className="shrink-0">
            <Send className="h-5 w-5" />
          </AcButton>
        </div>
      </div>
    </div>
  );
}
