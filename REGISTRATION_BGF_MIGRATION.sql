-- BGF (Bangladesh Golf Federation) ID, required by the app when a Golf event is selected
-- Run this once in the Supabase SQL editor

ALTER TABLE players ADD COLUMN IF NOT EXISTS bgf_id TEXT;
