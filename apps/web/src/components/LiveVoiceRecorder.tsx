"use client";

import { useEffect, useRef, useState } from "react";
import {
  autoCorrelatePitch,
  generateVoiceTips,
  loudnessScore,
  rmsToDbfs,
} from "@/lib/voiceAnalytics";
import type { VoiceAnalytics } from "@speak-coach/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";
const CHUNK_MS = 4000;

interface LiveVoiceRecorderProps {
  onComplete?: (blob: Blob, analytics: VoiceAnalytics, transcript: string) => void;
  label?: string;
}

export function LiveVoiceRecorder({ onComplete, label = "Start Live Recording" }: LiveVoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volumeDb, setVolumeDb] = useState(-60);
  const [pitchHz, setPitchHz] = useState(0);
  const [tip, setTip] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [transcribing, setTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunkRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const volumeSamplesRef = useRef<number[]>([]);
  const pitchSamplesRef = useRef<number[]>([]);
  const chunkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);
      audioContextRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const uploadChunk = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "chunk.webm");
      const res = await fetch(`${API_URL}/api/voice/transcribe-chunk`, { method: "POST", body: formData });
      const data = await res.json() as { transcript: string };
      if (data.transcript) {
        setLiveTranscript((prev) => (prev ? `${prev} ${data.transcript}` : data.transcript));
      }
    } catch {
      // whisper may fail on very short chunks
    } finally {
      setTranscribing(false);
    }
  };

  const startChunkCapture = (stream: MediaStream) => {
    const captureChunk = () => {
      const chunkRec = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunkBlobs: Blob[] = [];
      chunkRec.ondataavailable = (e) => {
        if (e.data.size > 0) chunkBlobs.push(e.data);
      };
      chunkRec.onstop = () => {
        const blob = new Blob(chunkBlobs, { type: "audio/webm" });
        if (blob.size > 1000) uploadChunk(blob);
      };
      chunkRec.start();
      setTimeout(() => {
        if (chunkRec.state === "recording") chunkRec.stop();
      }, CHUNK_MS - 200);
    };

    chunkIntervalRef.current = setInterval(captureChunk, CHUNK_MS);
    captureChunk();
  };

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
    if (pitch > 0) pitchSamplesRef.current.push(pitch);

    if (db < -24) setTip("Speak louder — open your mouth!");
    else if (db > -6) setTip("Too loud — ease back");
    else setTip("Good volume!");

    setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    rafRef.current = requestAnimationFrame(monitor);
  };

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    volumeSamplesRef.current = [];
    pitchSamplesRef.current = [];
    startTimeRef.current = Date.now();
    setLiveTranscript("");

    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);
      stream.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(rafRef.current);

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const speakingTimeMs = Date.now() - startTimeRef.current;
      const avgDb = volumeSamplesRef.current.reduce((a, b) => a + b, 0) / (volumeSamplesRef.current.length || 1);
      const avgPitch = pitchSamplesRef.current.reduce((a, b) => a + b, 0) / (pitchSamplesRef.current.length || 1);

      const analytics: VoiceAnalytics = {
        loudnessScore: loudnessScore(avgDb),
        clarityScore: avgDb > -24 ? 75 : 45,
        paceWpm: 0,
        pitchAvgHz: avgPitch,
        pitchVarietyScore: 50,
        fillerCount: 0,
        speakingTimeMs,
        sentences: generateVoiceTips(avgDb, avgPitch, 0).map((t, i) => ({
          sentenceIndex: i,
          sentenceText: t,
          speakingTimeMs,
          pauseBeforeMs: 0,
          volumeAvgDbfs: avgDb,
          volumePeakDbfs: Math.max(...volumeSamplesRef.current, avgDb),
          pitchAvgHz: avgPitch,
          pitchStdHz: 0,
          loudnessScore: loudnessScore(avgDb),
          clarityScore: avgDb > -24 ? 75 : 45,
          paceWpm: 0,
          tips: [t],
        })),
      };

      onComplete?.(blob, analytics, liveTranscript);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(250);
    startChunkCapture(stream);
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

      <div className="h-4 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full transition-all ${volumeColor}`} style={{ width: `${volumePct}%` }} />
      </div>

      {tip && <p className={`text-sm font-medium ${volumeDb < -24 ? "text-red-600" : "text-green-700"}`}>{tip}</p>}

      <div className="rounded-xl bg-slate-50 p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">Live Transcript</p>
          {transcribing && <span className="text-xs text-brand-600 animate-pulse">transcribing...</span>}
        </div>
        <p className="min-h-[60px] text-sm leading-relaxed text-slate-800">
          {liveTranscript || (recording ? "Listening... speak now" : "Transcript appears here while you speak")}
        </p>
      </div>

      {!recording ? (
        <button onClick={start} className="btn-primary w-full">{label}</button>
      ) : (
        <button onClick={stop} className="w-full rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
          Stop Recording
        </button>
      )}
    </div>
  );
}
