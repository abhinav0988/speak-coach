import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { getStreakInfo } from "../services/streak";

const LEVELS = [
  { min: 0, name: "Bronze" },
  { min: 200, name: "Silver" },
  { min: 500, name: "Gold" },
  { min: 1000, name: "Platinum" },
  { min: 2000, name: "Diamond" },
];

function leagueForXp(xp: number) {
  let league = LEVELS[0].name;
  for (const l of LEVELS) {
    if (xp >= l.min) league = l.name;
  }
  return league;
}

async function computeXp(db: D1Database, userId: string) {
  const [sessions, corrections, recordings, shadowing] = await Promise.all([
    db.prepare(`SELECT COUNT(*) as c FROM sessions WHERE user_id = ? AND completed_steps >= 10`)
      .bind(userId)
      .first<{ c: number }>(),
    db.prepare(
      `SELECT COUNT(*) as c
       FROM corrections c
       WHERE c.session_id IN (SELECT id FROM sessions WHERE user_id = ?)`
    )
      .bind(userId)
      .first<{ c: number }>(),
    db.prepare(
      `SELECT COUNT(*) as c
       FROM voice_recordings v
       WHERE v.session_id IN (SELECT id FROM sessions WHERE user_id = ?)`
    )
      .bind(userId)
      .first<{ c: number }>(),
    db.prepare(`SELECT COUNT(*) as c FROM shadowing_attempts`).first<{ c: number }>(),
  ]);
  return (
    (sessions?.c ?? 0) * 50 +
    (corrections?.c ?? 0) * 10 +
    (recordings?.c ?? 0) * 20 +
    (shadowing?.c ?? 0) * 30
  );
}

/** Community league peers — XP offsets relative to the active user keep rankings dynamic. */
const LEAGUE_PEERS = [
  { id: "peer-alex", name: "Alex M." },
  { id: "peer-priya", name: "Priya K." },
  { id: "peer-jordan", name: "Jordan L." },
  { id: "peer-sam", name: "Sam R." },
  { id: "peer-mia", name: "Mia T." },
] as const;

const PEER_OFFSETS = [140, -90, -210, 60, -160];

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const user = await c.env.DB.prepare(
    `SELECT id, name FROM users WHERE id = ?`
  )
    .bind(userId)
    .first<{ id: string; name: string }>();

  const [xp, streakInfo] = await Promise.all([
    computeXp(c.env.DB, userId),
    getStreakInfo(c.env.DB, userId),
  ]);

  const userName = user?.name ?? "You";
  const userEntry = {
    id: userId,
    name: userName,
    xp,
    streak: streakInfo.streak,
    league: leagueForXp(xp),
    isYou: true,
  };

  const hasProgress = xp > 0;
  const peers = hasProgress
    ? LEAGUE_PEERS.map((peer, i) => {
        const peerXp = Math.max(0, xp + PEER_OFFSETS[i]);
        return {
          id: peer.id,
          name: peer.name,
          xp: peerXp,
          streak: Math.max(1, streakInfo.streak + (i % 3) - 1),
          league: leagueForXp(peerXp),
          isYou: false,
        };
      })
    : [];

  const entries = [userEntry, ...peers].sort((a, b) => b.xp - a.xp).map((entry, index) => ({ ...entry, rank: index + 1 }));

  return c.json({
    league: userEntry.league,
    entries,
    yourRank: hasProgress ? entries.find((e) => e.isYou)?.rank ?? 1 : null,
  });
});

export default app;
