-- Split Mini Marathon into Men's and Women's. Existing entries become Men's.
-- Safe to run more than once.
BEGIN;

UPDATE player_games SET game = 'Mini Marathon Men''s' WHERE game = 'Mini Marathon';
UPDATE fixtures SET sport = 'Mini Marathon Men''s' WHERE sport = 'Mini Marathon';
UPDATE results SET sport = 'Mini Marathon Men''s' WHERE sport = 'Mini Marathon';
UPDATE media SET sport = 'Mini Marathon Men''s' WHERE sport = 'Mini Marathon';

COMMIT;
