-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fixtures table
CREATE TABLE IF NOT EXISTS fixtures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport TEXT NOT NULL,
  team1_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  team2_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  sport TEXT NOT NULL,
  url TEXT NOT NULL,
  youtube_url TEXT,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fixture_id UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  team1_score INTEGER NOT NULL,
  team2_score INTEGER NOT NULL,
  winner_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(fixture_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_clubs_slug ON clubs(slug);
CREATE INDEX IF NOT EXISTS idx_fixtures_date ON fixtures(date);
CREATE INDEX IF NOT EXISTS idx_fixtures_status ON fixtures(status);
CREATE INDEX IF NOT EXISTS idx_media_sport ON media(sport);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_results_fixture ON results(fixture_id);

-- Enable Row Level Security (RLS)
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON clubs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON fixtures FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON media FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON results FOR SELECT USING (true);

-- Create policies for admin write access (you'll need to implement auth)
CREATE POLICY "Enable insert for authenticated users" ON clubs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON clubs FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON clubs FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON fixtures FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON fixtures FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON fixtures FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON media FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON media FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON media FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON results FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON results FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fixtures_updated_at BEFORE UPDATE ON fixtures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage buckets (run these in Supabase dashboard)
-- Storage -> Create new bucket
-- Bucket name: club-logos (public)
-- Bucket name: media-photos (public)

-- Create storage policies
-- For club-logos bucket:
-- Allow public read: storage.objects.select on bucket 'club-logos' for select using (true)
-- Allow authenticated insert: storage.objects.insert on bucket 'club-logos' for insert with check (true)
-- Allow authenticated update: storage.objects.update on bucket 'club-logos' for update using (true)
-- Allow authenticated delete: storage.objects.delete on bucket 'club-logos' for delete using (true)

-- For media-photos bucket:
-- Allow public read: storage.objects.select on bucket 'media-photos' for select using (true)
-- Allow authenticated insert: storage.objects.insert on bucket 'media-photos' for insert with check (true)
-- Allow authenticated update: storage.objects.update on bucket 'media-photos' for update using (true)
-- Allow authenticated delete: storage.objects.delete on bucket 'media-photos' for delete using (true)

