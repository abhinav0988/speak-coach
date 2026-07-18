"use client";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  size: 2 + (i % 3),
  delay: `${(i * 0.7) % 5}s`,
  duration: `${8 + (i % 4)}s`,
}));

export function AuthAmbientBackground({ variant = "form" }: { variant?: "form" | "marketing" }) {
  const isMarketing = variant === "marketing";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {isMarketing ? (
        <>
          <div className="auth-marketing-gradient absolute inset-0" />
          <div className="auth-aurora absolute inset-0 opacity-60" />
        </>
      ) : (
        <div className="auth-aurora absolute inset-0" />
      )}
      <div className="auth-noise absolute inset-0" />
      <div
        className="auth-blob h-72 w-72 bg-violet-400/25"
        style={{ top: "-10%", left: "-5%", animationDelay: "0s" }}
      />
      <div
        className="auth-blob h-64 w-64 bg-blue-400/20"
        style={{ bottom: "5%", right: "-8%", animationDelay: "-4s" }}
      />
      <div
        className="auth-blob h-48 w-48 bg-pink-400/15"
        style={{ top: "40%", right: "20%", animationDelay: "-8s" }}
      />
      <div className="auth-glass-circle h-32 w-32" style={{ top: "12%", right: "15%" }} />
      <div className="auth-glass-circle h-20 w-20" style={{ bottom: "25%", left: "10%" }} />
      <div className="auth-glass-circle h-14 w-14" style={{ top: "55%", left: "25%" }} />
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="auth-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
