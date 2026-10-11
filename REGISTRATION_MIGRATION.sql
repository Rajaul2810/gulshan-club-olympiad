-- Club player registration
-- Run this once in the Supabase SQL editor (after EVENTS_MIGRATION.sql)

-- 1. Players: one row per person per event
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  member_type TEXT NOT NULL CHECK (member_type IN ('member', 'spouse')),
  birthday DATE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('player', 'team_manager')),
  account_no TEXT NOT NULL,
  tshirt_size TEXT NOT NULL CHECK (tshirt_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL')),
  photo_url TEXT,
  declaration_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- A person (phone) can belong to only one club per event
  CONSTRAINT players_event_phone_unique UNIQUE (event_id, phone)
);

CREATE INDEX IF NOT EXISTS idx_players_event_club ON players(event_id, club_id);

-- 2. Games a player entered (many games per player)
CREATE TABLE IF NOT EXISTS player_games (
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game TEXT NOT NULL,
  PRIMARY KEY (player_id, game)
);

CREATE INDEX IF NOT EXISTS idx_player_games_game ON player_games(game);

-- 3. RLS on, no public policies: only the server (service role key) can read/write
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_games ENABLE ROW LEVEL SECURITY;

-- 4. updated_at trigger
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Public bucket for player photos (uploads go through the server)
INSERT INTO storage.buckets (id, name, public)
VALUES ('player-photos', 'player-photos', true)
ON CONFLICT (id) DO NOTHING;
