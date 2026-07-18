ALTER TABLE user_settings ADD COLUMN weekly_report_email INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_settings ADD COLUMN last_weekly_email_sent TEXT;
