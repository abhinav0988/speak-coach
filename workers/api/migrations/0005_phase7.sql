-- Code-switch / Hinglish tracking
CREATE TABLE IF NOT EXISTS code_switch_logs (
  id TEXT PRIMARY KEY,
  text_sample TEXT NOT NULL,
  english_ratio REAL NOT NULL,
  hindi_ratio REAL NOT NULL,
  mixed_score REAL NOT NULL,
  word_count INTEGER NOT NULL,
  session_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_code_switch_created ON code_switch_logs(created_at);
