-- Run this SQL in your Supabase SQL Editor to create the site_settings table
-- Go to: Supabase Dashboard > SQL Editor > New Query

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial cache version
INSERT INTO site_settings (key, value) 
VALUES ('cache_version', '1')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (needed for cache check on app load)
CREATE POLICY "Allow public read" ON site_settings
  FOR SELECT USING (true);

-- Allow authenticated users to update (admin)
CREATE POLICY "Allow authenticated update" ON site_settings
  FOR UPDATE USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON site_settings
  FOR INSERT WITH CHECK (true);
