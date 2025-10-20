-- Ultra-Simplified Database Migration Script
-- This script completely restructures your database to be ultra-simple
-- Run this in your Supabase SQL Editor

-- WARNING: This will delete all existing fixtures and results data!
-- Backup your data first if needed.

-- Step 1: Drop existing fixtures and results tables
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS fixtures CASCADE;

-- Step 2: Create ultra-simplified fixtures table
CREATE TABLE fixtures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport TEXT NOT NULL,
  fixture_image TEXT NOT NULL, -- URL to uploaded fixture image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create ultra-simplified results table
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport TEXT NOT NULL,
  winner_id UUID REFERENCES clubs(id) ON DELETE SET NULL, -- Winner club
  loser_id UUID REFERENCES clubs(id) ON DELETE SET NULL,  -- Loser club
  notes TEXT, -- Additional notes about the result
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create new indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fixtures_sport ON fixtures(sport);
CREATE INDEX IF NOT EXISTS idx_results_sport ON results(sport);
CREATE INDEX IF NOT EXISTS idx_results_winner ON results(winner_id);
CREATE INDEX IF NOT EXISTS idx_results_loser ON results(loser_id);

-- Step 5: Create new storage bucket for fixture images
-- Run this in Supabase Dashboard -> Storage -> Create new bucket
-- Bucket name: fixture-images
-- Public: Yes

-- Step 6: Create storage policies for fixture-images bucket
-- Run these in Supabase Dashboard -> Storage -> Policies

-- Allow public read access to fixture images:
-- CREATE POLICY "Allow public read access to fixture images" ON storage.objects 
-- FOR SELECT USING (bucket_id = 'fixture-images');

-- Allow authenticated users to upload fixture images:
-- CREATE POLICY "Allow authenticated upload of fixture images" ON storage.objects 
-- FOR INSERT WITH CHECK (bucket_id = 'fixture-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update fixture images:
-- CREATE POLICY "Allow authenticated update of fixture images" ON storage.objects 
-- FOR UPDATE USING (bucket_id = 'fixture-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete fixture images:
-- CREATE POLICY "Allow authenticated delete of fixture images" ON storage.objects 
-- FOR DELETE USING (bucket_id = 'fixture-images' AND auth.role() = 'authenticated');

-- Step 7: Update any existing results to use the new schema
-- This will set loser_id based on the existing winner_id
-- You may need to manually update this based on your data
UPDATE results 
SET loser_id = (
  SELECT CASE 
    WHEN results.winner_id = fixtures.team1_id THEN fixtures.team2_id
    WHEN results.winner_id = fixtures.team2_id THEN fixtures.team1_id
    ELSE NULL
  END
  FROM fixtures 
  WHERE fixtures.id = results.fixture_id
)
WHERE winner_id IS NOT NULL;

-- Step 8: Verify the migration
-- Check that all tables have the correct structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('fixtures', 'results', 'clubs', 'media')
ORDER BY table_name, ordinal_position;
