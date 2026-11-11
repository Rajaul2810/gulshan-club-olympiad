-- Allow 'friend' (Member's Friend) as a member type, used for Basketball Women's
-- Run this once in the Supabase SQL editor (after REGISTRATION_CHILD_MIGRATION.sql)

ALTER TABLE players DROP CONSTRAINT IF EXISTS players_member_type_check;
ALTER TABLE players ADD CONSTRAINT players_member_type_check
  CHECK (member_type IN ('member', 'spouse', 'child', 'friend'));
