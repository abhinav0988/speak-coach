-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  reminder_enabled INTEGER NOT NULL DEFAULT 0,
  reminder_time TEXT DEFAULT '09:00',
  streak_freezes INTEGER NOT NULL DEFAULT 1,
  last_freeze_week TEXT,
  devanagari_preferred INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);

INSERT OR IGNORE INTO user_settings (user_id, reminder_enabled, reminder_time, streak_freezes)
VALUES ('user-1', 0, '09:00', 1);
