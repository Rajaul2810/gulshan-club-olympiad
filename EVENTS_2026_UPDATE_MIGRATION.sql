-- 2026 event list update: Male/Female arm wrestling names, Power Lifting replaces Weight Lifting,
-- Basketball Men's removed. Safe to run more than once.
BEGIN;

CREATE TEMP TABLE event_renames (old_name TEXT PRIMARY KEY, new_name TEXT NOT NULL) ON COMMIT DROP;
INSERT INTO event_renames (old_name, new_name) VALUES
  ('Arm Wrestling 55-60 KG Women', 'Arm Wrestling 55-65kg Female'),
  ('Arm Wrestling 60-65kg Women',  'Arm Wrestling 55-65kg Female'),
  ('Arm Wrestling 65-75kg Women',  'Arm Wrestling 65-75kg Female'),
  ('Arm Wrestling 75-80 kg Women', 'Arm Wrestling Over 75kg Female'),
  ('Arm Wrestling 65-70kg Men',    'Arm Wrestling 65-70kg Male'),
  ('Arm Wrestling 70-75kg Men',    'Arm Wrestling 70-75kg Male'),
  ('Arm Wrestling 75-80kg Men',    'Arm Wrestling 75-80kg Male'),
  ('Arm Wrestling 80-85kg Men',    'Arm Wrestling 80-85kg Male'),
  ('Arm Wrestling 85-90kg Men',    'Arm Wrestling 85-90kg Male');

-- Registered players: two old events can merge into one, so insert-then-delete avoids duplicate keys
INSERT INTO player_games (player_id, game)
SELECT pg.player_id, r.new_name
FROM player_games pg JOIN event_renames r ON r.old_name = pg.game
ON CONFLICT DO NOTHING;

DELETE FROM player_games WHERE game IN (SELECT old_name FROM event_renames);

-- Events that no longer exist; affected players must pick a new event (e.g. a Power Lifting class)
DELETE FROM player_games
WHERE game IN ('Basketball Men''s', 'Weight Lifting Regular', 'Weight Lifting Squat');

-- Fixtures, results and media keep showing on the renamed sport pages
UPDATE fixtures f SET sport = r.new_name FROM event_renames r WHERE f.sport = r.old_name;
UPDATE results  s SET sport = r.new_name FROM event_renames r WHERE s.sport = r.old_name;
UPDATE media    m SET sport = r.new_name FROM event_renames r WHERE m.sport = r.old_name;

COMMIT;
