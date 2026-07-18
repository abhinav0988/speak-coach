-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Learner',
  start_date TEXT NOT NULL,
  target_days INTEGER NOT NULL DEFAULT 90,
  voice_baseline_json TEXT
);

-- Daily sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  date TEXT NOT NULL,
  completed_steps INTEGER NOT NULL DEFAULT 0,
  motivation_score INTEGER,
  pronunciation_score INTEGER,
  roman_hindi_score INTEGER,
  spoken_en_score INTEGER,
  spoken_hi_score INTEGER,
  loudness_score INTEGER,
  clarity_score INTEGER,
  notes TEXT,
  created_at TEXT NOT NULL
);

-- Session steps
CREATE TABLE IF NOT EXISTS session_steps (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  duration_sec INTEGER,
  data_json TEXT
);

-- Corrections
CREATE TABLE IF NOT EXISTS corrections (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  type TEXT NOT NULL,
  input_text TEXT NOT NULL,
  output_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Mistake dictionary
CREATE TABLE IF NOT EXISTS mistakes (
  id TEXT PRIMARY KEY,
  wrong_form TEXT NOT NULL UNIQUE,
  correct_form TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'roman_hindi',
  repeat_count INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT,
  mastered_at TEXT
);

-- Voice recordings
CREATE TABLE IF NOT EXISTS voice_recordings (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  r2_key TEXT,
  duration_sec INTEGER,
  transcript TEXT,
  language TEXT,
  loudness_score REAL,
  clarity_score REAL,
  pace_wpm REAL,
  pitch_avg_hz REAL,
  filler_count INTEGER,
  analytics_json TEXT,
  created_at TEXT NOT NULL
);

-- Sentence voice metrics
CREATE TABLE IF NOT EXISTS sentence_voice_metrics (
  id TEXT PRIMARY KEY,
  recording_id TEXT NOT NULL,
  sentence_index INTEGER NOT NULL,
  sentence_text TEXT NOT NULL,
  speaking_time_ms INTEGER,
  pause_before_ms INTEGER,
  volume_avg_dbfs REAL,
  volume_peak_dbfs REAL,
  pitch_avg_hz REAL,
  pitch_std_hz REAL,
  loudness_score REAL,
  clarity_score REAL,
  pace_wpm REAL,
  tips_json TEXT,
  created_at TEXT NOT NULL
);

-- Paragraph writes
CREATE TABLE IF NOT EXISTS paragraph_writes (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  language TEXT NOT NULL,
  input_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  hindi_script TEXT,
  english_meaning TEXT,
  total_words INTEGER NOT NULL,
  mistake_count INTEGER NOT NULL,
  spelling_errors INTEGER NOT NULL DEFAULT 0,
  grammar_errors INTEGER NOT NULL DEFAULT 0,
  roman_hindi_errors INTEGER NOT NULL DEFAULT 0,
  accuracy_pct REAL NOT NULL,
  mistakes_json TEXT NOT NULL,
  diff_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Paragraph reads
CREATE TABLE IF NOT EXISTS paragraph_reads (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  source_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  r2_key TEXT,
  transcript TEXT,
  total_words INTEGER NOT NULL,
  correct_words INTEGER NOT NULL,
  wrong_words INTEGER NOT NULL,
  skipped_words INTEGER NOT NULL,
  extra_words INTEGER NOT NULL,
  pronunciation_accuracy_pct REAL NOT NULL,
  grammar_error_count INTEGER NOT NULL DEFAULT 0,
  filler_word_count INTEGER NOT NULL DEFAULT 0,
  words_per_minute REAL,
  loudness_score REAL,
  clarity_score REAL,
  pitch_variety_score REAL,
  alignment_json TEXT NOT NULL,
  grammar_fixes_json TEXT,
  voice_analytics_json TEXT,
  suggested_correction TEXT,
  created_at TEXT NOT NULL
);

-- Shadowing attempts
CREATE TABLE IF NOT EXISTS shadowing_attempts (
  id TEXT PRIMARY KEY,
  reference_text TEXT NOT NULL,
  r2_key TEXT,
  transcript TEXT,
  word_accuracy_pct REAL,
  pace_match_pct REAL,
  volume_match_pct REAL,
  clarity_score REAL,
  overall_score REAL,
  mismatched_words_json TEXT,
  analytics_json TEXT,
  created_at TEXT NOT NULL
);

-- Roleplay sessions
CREATE TABLE IF NOT EXISTS roleplay_sessions (
  id TEXT PRIMARY KEY,
  scenario TEXT NOT NULL,
  turns_json TEXT NOT NULL,
  avg_loudness_score REAL,
  avg_grammar_score REAL,
  filler_total INTEGER DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Vocabulary
CREATE TABLE IF NOT EXISTS vocabulary (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  language TEXT NOT NULL,
  meaning TEXT NOT NULL,
  pronunciation TEXT,
  example TEXT,
  day_number INTEGER NOT NULL,
  next_review_at TEXT,
  ease_factor REAL NOT NULL DEFAULT 2.5
);

-- Daily sentences
CREATE TABLE IF NOT EXISTS daily_sentences (
  id TEXT PRIMARY KEY,
  day_number INTEGER NOT NULL,
  roman_hindi TEXT NOT NULL,
  hindi_script TEXT NOT NULL,
  english TEXT NOT NULL,
  practiced INTEGER NOT NULL DEFAULT 0
);

-- Daily paragraphs
CREATE TABLE IF NOT EXISTS daily_paragraphs (
  id TEXT PRIMARY KEY,
  day_number INTEGER NOT NULL,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  hindi_script TEXT,
  difficulty TEXT NOT NULL DEFAULT 'easy'
);

CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_mistakes_repeat ON mistakes(repeat_count DESC);
CREATE INDEX IF NOT EXISTS idx_paragraph_writes_created ON paragraph_writes(created_at);
