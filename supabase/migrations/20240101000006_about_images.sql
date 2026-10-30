-- Add editable About page images.
-- Additive, non-destructive; existing rows keep their current values.

ALTER TABLE public.about_content
  ADD COLUMN IF NOT EXISTS "heroImageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "portraitImageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "studioImage1Url" TEXT,
  ADD COLUMN IF NOT EXISTS "studioImage2Url" TEXT,
  ADD COLUMN IF NOT EXISTS "studioImage3Url" TEXT;
