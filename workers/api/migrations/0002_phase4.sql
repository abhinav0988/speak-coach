-- Homework assignments
CREATE TABLE IF NOT EXISTS homework (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  day_number INTEGER NOT NULL,
  tasks_json TEXT NOT NULL,
  due_date TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Confidence journal
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  mood_before INTEGER,
  mood_after INTEGER,
  reflection TEXT,
  created_at TEXT NOT NULL
);

-- Saved phrase library
CREATE TABLE IF NOT EXISTS phrase_library (
  id TEXT PRIMARY KEY,
  original TEXT NOT NULL,
  corrected TEXT NOT NULL,
  language TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TEXT NOT NULL
);

-- Vocabulary review tracking
ALTER TABLE vocabulary ADD COLUMN status TEXT DEFAULT 'learning';
ALTER TABLE vocabulary ADD COLUMN last_reviewed_at TEXT;
ALTER TABLE vocabulary ADD COLUMN review_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_homework_due ON homework(due_date);
CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries(date);
CREATE INDEX IF NOT EXISTS idx_phrase_category ON phrase_library(category);
