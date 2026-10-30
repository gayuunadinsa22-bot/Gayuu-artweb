-- Add editable homepage imagery fields.
-- Additive, non-destructive; existing rows keep their current values.

ALTER TABLE public.homepage_sections
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_floating_image_url TEXT,
  ADD COLUMN IF NOT EXISTS artist_intro_image_url TEXT;
