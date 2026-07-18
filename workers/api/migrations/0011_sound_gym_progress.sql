CREATE TABLE IF NOT EXISTS sound_gym_progress (
  user_id TEXT NOT NULL DEFAULT 'user-1',
  drill_id TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  loudness_score INTEGER,
  clarity_score INTEGER,
  PRIMARY KEY (user_id, drill_id)
);

CREATE INDEX IF NOT EXISTS idx_sound_gym_user ON sound_gym_progress(user_id);
