"use client";

export function AmbientScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ph-blob ph-blob-1 absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="ph-blob ph-blob-2 absolute right-0 top-1/4 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="ph-blob ph-blob-3 absolute bottom-20 left-1/4 h-48 w-48 rounded-full bg-pink-400/10 blur-3xl" />
      <div className="ph-blob ph-blob-4 absolute bottom-40 right-1/3 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="ph-particle absolute h-1 w-1 rounded-full bg-white/80 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
          style={{
            left: `${8 + (i * 7) % 88}%`,
            top: `${10 + (i * 11) % 80}%`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
