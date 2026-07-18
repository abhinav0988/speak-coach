"use client";

export function AuroraBackground() {
  return (
    <div aria-hidden className="ld-aurora pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ld-aurora-base absolute inset-0" />
      <div className="ld-blob ld-blob-blue absolute -left-24 top-0 h-80 w-80 rounded-full" />
      <div className="ld-blob ld-blob-purple absolute right-0 top-1/4 h-96 w-96 rounded-full" />
      <div className="ld-blob ld-blob-pink absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full" />
      <div className="ld-blob ld-blob-cyan absolute -bottom-20 right-1/4 h-64 w-64 rounded-full" />
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="ld-particle absolute h-1 w-1 rounded-full"
          style={{
            left: `${5 + (i * 5.5) % 92}%`,
            top: `${8 + (i * 7.3) % 85}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
