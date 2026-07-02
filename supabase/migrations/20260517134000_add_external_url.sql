-- Add external_url column to courses, competitions, and webinars
ALTER TABLE courses ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS external_url TEXT;
