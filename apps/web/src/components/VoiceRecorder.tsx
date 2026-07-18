"use client";

import { useEffect, useRef, useState } from "react";
import {
  autoCorrelatePitch,
  generateVoiceTips,
  loudnessScore,
  rmsToDbfs,
} from "@/lib/voiceAnalytics";
import { countFillerWords } from "@/lib/fillerWords";
import type { VoiceAnalytics } from "@speak-coach/shared";

interface VoiceRecorderProps {
  onComplete: (blob: Blob, analytics: VoiceAnalytics, transcript: string) => void;
  label?: string;
  transcript?: string;
}

export function VoiceRecorder({ onComplete, label = "Start Recording", transcript = "" }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volumeDb, setVolumeDb] = useState(-60);
  const [pitchHz, setPitchHz] = useState(0);
  const [tip, setTip] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const volumeSamplesRef = useRef<number[]>([]);
  const pitchSamplesRef = useRef<number[]>([]);
  const waveformSamplesRef = useRef<number[]>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  const monitor = () => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;
    if (!analyser || !audioContext) return;

    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    let sum = 0;
    for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
    const rms = Math.sqrt(sum / buffer.length);
    const db = rmsToDbfs(rms);
    const pitch = autoCorrelatePitch(buffer, audioContext.sampleRate);

    setVolumeDb(Math.round(db));
    if (pitch > 0) setPitchHz(Math.round(pitch));
    volumeSamplesRef.current.push(db);
    frameCountRef.current += 1;
    if (frameCountRef.current % 4 === 0 && waveformSamplesRef.current.length < 160) {
      const normalized = Math.max(0, Math.min(100, Math.round(((db + 60) / 60) * 100)));
      waveformSamplesRef.current.push(normalized);
    }
    if (pitch > 0) pitchSamplesRef.current.push(pitch);

    if (db < -24) setTip("Speak louder — open your mouth!");
    else if (db > -6) setTip("Too loud — ease back slightly");
    else setTip("Good volume — keep going!");

    setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    rafRef.current = requestAnimationFrame(monitor);
  };

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    volumeSamplesRef.current = [];
    pitchSamplesRef.current = [];
    waveformSamplesRef.current = [];
    frameCountRef.current = 0;
    startTimeRef.current = Date.now();

    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(rafRef.current);

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const speakingTimeMs = Date.now() - startTimeRef.current;
      const avgDb =
        volumeSamplesRef.current.reduce((a, b) => a + b, 0) /
        (volumeSamplesRef.current.length || 1);
      const avgPitch =
        pitchSamplesRef.current.reduce((a, b) => a + b, 0) /
        (pitchSamplesRef.current.length || 1);
      const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
      const durationSec = Math.max(speakingTimeMs / 1000, 1);
      const wpm = wordCount > 0 ? Math.round(wordCount / (durationSec / 60)) : 0;
      const pitchStd =
        pitchSamplesRef.current.length > 1
          ? Math.sqrt(
              pitchSamplesRef.current.reduce((n, p) => n + (p - avgPitch) ** 2, 0) /
                pitchSamplesRef.current.length
            )
          : 0;
      const pitchVariety = Math.round(Math.min(100, Math.max(20, (pitchStd / (avgPitch || 1)) * 200)));

      let clarityScore = loudnessScore(avgDb);
      if (wpm > 0) {
        if (wpm < 80) clarityScore -= 10;
        else if (wpm > 180) clarityScore -= 8;
        else clarityScore += 5;
      }
      if (wordCount > 5) clarityScore += 5;
      const fillerCount = transcript.trim() ? countFillerWords(transcript) : 0;
      if (fillerCount > 0) clarityScore -= Math.min(20, fillerCount * 4);
      clarityScore = Math.round(Math.min(100, Math.max(20, clarityScore)));

      const analytics: VoiceAnalytics = {
        loudnessScore: loudnessScore(avgDb),
        clarityScore,
        paceWpm: wpm,
        pitchAvgHz: avgPitch,
        pitchVarietyScore: pitchVariety,
        fillerCount,
        speakingTimeMs,
        waveformSamples: waveformSamplesRef.current,
        sentences: [],
      };

      analytics.sentences = generateVoiceTips(avgDb, avgPitch, wpm).map((t, i) => ({
        sentenceIndex: i,
        sentenceText: t,
        speakingTimeMs,
        pauseBeforeMs: 0,
        volumeAvgDbfs: avgDb,
        volumePeakDbfs: Math.max(...volumeSamplesRef.current, avgDb),
        pitchAvgHz: avgPitch,
        pitchStdHz: 0,
        loudnessScore: analytics.loudnessScore,
        clarityScore: analytics.clarityScore,
        paceWpm: wpm,
        tips: [t],
      }));

      onComplete(blob, analytics, transcript);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(250);
    setRecording(true);
    monitor();
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const volumePct = Math.min(100, Math.max(0, ((volumeDb - -40) / 30) * 100));
  const volumeColor = volumeDb < -24 ? "bg-red-500" : volumeDb < -12 ? "bg-green-500" : "bg-yellow-500";

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Duration</p>
          <p className="text-2xl font-bold">{duration}s</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Pitch</p>
          <p className="text-2xl font-bold">{pitchHz || "—"} Hz</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Volume</p>
          <p className="text-2xl font-bold">{volumeDb} dB</p>
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Too quiet</span>
          <span>Good</span>
          <span>Too loud</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full transition-all ${volumeColor}`} style={{ width: `${volumePct}%` }} />
        </div>
      </div>

      {tip && (
        <p className={`text-sm font-medium ${volumeDb < -24 ? "text-red-600" : "text-green-700"}`}>
          {tip}
        </p>
      )}

      {!recording ? (
        <button onClick={start} className="btn-primary w-full">
          {label}
        </button>
      ) : (
        <button onClick={stop} className="w-full rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
          Stop Recording
        </button>
      )}
    </div>
  );
}
