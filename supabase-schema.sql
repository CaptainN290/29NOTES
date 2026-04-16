-- ─────────────────────────────────────────────────────────────────
--  29NOTES — Full schema (run this in the Supabase SQL editor)
--  Safe to re-run: uses IF NOT EXISTS / IF NOT EXISTS guards
-- ─────────────────────────────────────────────────────────────────

-- 1. Create the notes table
CREATE TABLE IF NOT EXISTS notes (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL DEFAULT 'Untitled',
  content     TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  order_index INTEGER     NOT NULL DEFAULT 0,
  pinned      BOOLEAN     NOT NULL DEFAULT false,
  color       TEXT        DEFAULT NULL
);

-- 2. Add new columns to an existing table (safe if already present)
ALTER TABLE notes ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS color  TEXT    DEFAULT NULL;

-- 3. Index for ordering
CREATE INDEX IF NOT EXISTS notes_order_idx  ON notes(order_index ASC);
CREATE INDEX IF NOT EXISTS notes_pinned_idx ON notes(pinned DESC, order_index ASC);

-- 4. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
