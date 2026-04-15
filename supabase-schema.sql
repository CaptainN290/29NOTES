-- Run this in your Supabase SQL editor to set up the notes table

CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security (optional for single-user app)
-- ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create index for ordering
CREATE INDEX IF NOT EXISTS notes_order_idx ON notes(order_index ASC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
