export function rmsToDbfs(rms: number): number {
  if (rms <= 0) return -60;
  return 20 * Math.log10(rms);
}

export function loudnessScore(dbfs: number): number {
  return Math.round(Math.min(100, Math.max(0, ((dbfs - -30) / (-12 - -30)) * 100)));
}

export function autoCorrelatePitch(buffer: Float32Array, sampleRate: number): number {
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.01) return 0;

  let bestOffset = -1;
  let bestCorrelation = 0;
  const minOffset = Math.floor(sampleRate / 500);
  const maxOffset = Math.floor(sampleRate / 80);

  for (let offset = minOffset; offset < maxOffset; offset++) {
    let correlation = 0;
    for (let i = 0; i < buffer.length - offset; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - correlation / (buffer.length - offset);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestOffset === -1 || bestCorrelation < 0.9) return 0;
  return sampleRate / bestOffset;
}

export function generateVoiceTips(dbfs: number, pitchHz: number, wpm: number): string[] {
  const tips: string[] = [];
  if (dbfs < -24) tips.push("Speak louder — your volume is too soft. Push from your belly.");
  if (dbfs > -6) tips.push("You are speaking too loud — ease back slightly.");
  if (wpm > 170) tips.push("Slow down — you are rushing. Finish every word.");
  if (wpm > 0 && wpm < 100) tips.push("Pick up pace slightly while staying clear.");
  if (pitchHz > 0 && pitchHz < 100) tips.push("Open your mouth more for clearer vowels.");
  if (tips.length === 0) tips.push("Good volume and pace. Keep it up!");
  return tips;
}
