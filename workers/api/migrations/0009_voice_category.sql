ALTER TABLE voice_recordings ADD COLUMN category TEXT NOT NULL DEFAULT 'general';

CREATE INDEX IF NOT EXISTS idx_voice_recordings_category ON voice_recordings(category);
