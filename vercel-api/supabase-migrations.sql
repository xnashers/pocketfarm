-- ═══════════════════════════════════════════
-- Pocket Farm — Supabase Migrations
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════

-- 1. Tables (already created)
-- CREATE TABLE players (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   username TEXT UNIQUE NOT NULL,
--   password_hash TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT now()
-- );
-- CREATE TABLE game_saves (
--   player_id UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
--   save_data JSONB NOT NULL DEFAULT '{}',
--   updated_at TIMESTAMPTZ DEFAULT now()
-- );

-- 2. Leaderboard view (run this!)
-- NOTE: farmName is nested under player object in save_data
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id AS player_id,
  p.username,
  COALESCE(gs.save_data -> 'player' ->> 'farmName', p.username || '''s Farm') AS farm_name,
  COALESCE((gs.save_data -> 'player' ->> 'level')::int, 1)  AS level,
  COALESCE((gs.save_data -> 'player' ->> 'xp')::int, 0)     AS xp,
  COALESCE((gs.save_data -> 'player' ->> 'peso')::int, 0)   AS peso,
  gs.updated_at
FROM players p
JOIN game_saves gs ON p.id = gs.player_id
ORDER BY level DESC, xp DESC, peso DESC;

-- 3. Index for username lookups (login speed)
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
