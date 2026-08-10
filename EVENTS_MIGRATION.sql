-- Multi-year Olympiad support
-- Run this once in the Supabase SQL editor

-- 1. Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('draft', 'live', 'archived')),
  logo_url TEXT,
  registration_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS events_one_current
  ON events (is_current)
  WHERE is_current = true;

CREATE INDEX IF NOT EXISTS idx_events_year ON events(year);

-- 2. Seed 2025 (archive) and 2026 (current)
INSERT INTO events (year, slug, name, is_current, status)
VALUES
  (2025, '2025', 'Olympiad 2025', false, 'archived'),
  (2026, '2026', 'Olympiad 2026', true, 'live')
ON CONFLICT (year) DO NOTHING;

-- 3. Add event_id to content tables
ALTER TABLE fixtures ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE results ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE media ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE press ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE CASCADE;

-- 4. Backfill existing rows to 2025
UPDATE fixtures
SET event_id = (SELECT id FROM events WHERE year = 2025)
WHERE event_id IS NULL;

UPDATE results
SET event_id = (SELECT id FROM events WHERE year = 2025)
WHERE event_id IS NULL;

UPDATE media
SET event_id = (SELECT id FROM events WHERE year = 2025)
WHERE event_id IS NULL;

UPDATE press
SET event_id = (SELECT id FROM events WHERE year = 2025)
WHERE event_id IS NULL;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_fixtures_event_id ON fixtures(event_id);
CREATE INDEX IF NOT EXISTS idx_results_event_id ON results(event_id);
CREATE INDEX IF NOT EXISTS idx_media_event_id ON media(event_id);
CREATE INDEX IF NOT EXISTS idx_press_event_id ON press(event_id);

-- 6. RLS for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON events;
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON events;
CREATE POLICY "Enable insert for authenticated users" ON events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated users" ON events;
CREATE POLICY "Enable update for authenticated users" ON events FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON events;
CREATE POLICY "Enable delete for authenticated users" ON events FOR DELETE USING (true);

-- 7. updated_at trigger
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
