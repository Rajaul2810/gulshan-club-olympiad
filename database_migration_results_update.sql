-- Migration: Update results table to remove loser_id and add winner_type
-- Run this in your Supabase SQL Editor

-- Step 1: Add winner_type column
ALTER TABLE results ADD COLUMN IF NOT EXISTS winner_type TEXT;

-- Step 2: Drop loser_id column and its foreign key constraint
-- First, drop the foreign key constraint if it exists
ALTER TABLE results DROP CONSTRAINT IF EXISTS results_loser_id_fkey;

-- Then drop the column
ALTER TABLE results DROP COLUMN IF EXISTS loser_id;

-- Step 3: Drop index if it exists
DROP INDEX IF EXISTS idx_results_loser;

-- Step 4: Create index for winner_type if needed
CREATE INDEX IF NOT EXISTS idx_results_winner_type ON results(winner_type);

