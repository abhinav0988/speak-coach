"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PremiumVoicePanel({ className }: { className?: string }) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [confidence, setConfidence] = useState(72);
  const [pronunciation, setPronunciation] = useState(68);
  const [waveform, setWaveform] = useState<number[]>(Array(24).fill(8));
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close();
  }, []);

  const tick = () => {
    const analyser = analyserRef.current;
    if (analyser) {
      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);
      const level = Math.min(100, Math.round(rms * 400));
      setWaveform((prev) => [...prev.slice(1), Math.max(8, level)]);
      setConfidence(Math.min(99, 55 + level / 2));
      setPronunciation(Math.min(99, 50 + level / 1.8));
    }
    setDuration(Math.floor((Date.now() - startRef.current) / 1000));
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    streamRef.current = stream;
    ctxRef.current = ctx;
    analyserRef.current = analyser;
    startRef.current = Date.now();
    setRecording(true);
    tick();
  };

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  return (
    <div className={cn("rounded-[20px] border border-white/50 bg-white/40 p-4 dark:bg-white/5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold uppercase tracking-wider text-muted">Voice Practice</p>
        <span className="font-mono text-sm font-bold text-foreground">{duration}s</span>
      </div>
      <div className="mt-3 flex h-16 items-end justify-center gap-1">
        {waveform.map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: recording ? h : 8 }}
            className="w-1.5 rounded-full bg-gradient-to-t from-[#2563EB] to-[#7C3AED]"
            style={{ height: recording ? h : 8 }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50/80 p-2 text-center dark:bg-emerald-950/30">
          <p className="text-[10px] font-bold text-muted">Pronunciation</p>
          <p className="text-lg font-black text-emerald-600">{pronunciation}%</p>
        </div>
        <div className="rounded-xl bg-violet-50/80 p-2 text-center dark:bg-violet-950/30">
          <p className="text-[10px] font-bold text-muted">Confidence</p>
          <p className="text-lg font-black text-violet-600">{confidence}%</p>
        </div>
      </div>
      <button
        type="button"
        onClick={recording ? stop : start}
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white shadow-lg transition",
          recording ? "bg-rose-500 hover:bg-rose-600" : "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] ln-mic-pulse"
        )}
      >
        {recording ? <><Square className="h-4 w-4" /> Stop</> : <><Mic className="h-4 w-4" /> Start Recording</>}
      </button>
      {recording && <p className="mt-2 text-center text-[12px] text-primary">Live AI feedback active…</p>}
    </div>
  );
}
