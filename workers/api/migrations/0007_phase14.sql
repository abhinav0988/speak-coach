-- Phase 14: server push reminders
CREATE TABLE IF NOT EXISTS push_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  platform TEXT,
  created_at TEXT,
  updated_at TEXT
);

ALTER TABLE user_settings ADD COLUMN last_reminder_sent_date TEXT;
