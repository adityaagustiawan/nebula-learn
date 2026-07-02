-- Add more detailed columns to competitions
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS competition_type TEXT;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS description TEXT;
