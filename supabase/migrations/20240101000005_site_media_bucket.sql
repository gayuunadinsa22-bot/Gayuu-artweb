-- Public site imagery bucket with strict admin-only writes.
-- Public can read images; only allow-listed admins (via is_admin()) can
-- upload, update or delete. Bucket-level constraints mirror the client-side
-- validation (JPG/PNG/WEBP, max 10 MB).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop policies if they exist from a previous run (idempotent).
DROP POLICY IF EXISTS "Admins can upload site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view site media" ON storage.objects;

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload site media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'site-media'
    AND auth.role() = 'authenticated'
    AND public.is_admin(auth.uid())
  );

-- Allow authenticated admins to update
CREATE POLICY "Admins can update site media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'site-media'
    AND auth.role() = 'authenticated'
    AND public.is_admin(auth.uid())
  ) WITH CHECK (
    bucket_id = 'site-media'
    AND auth.role() = 'authenticated'
    AND public.is_admin(auth.uid())
  );

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete site media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'site-media'
    AND auth.role() = 'authenticated'
    AND public.is_admin(auth.uid())
  );

-- Allow public to view images
CREATE POLICY "Anyone can view site media" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-media');
