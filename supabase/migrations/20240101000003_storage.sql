-- Create storage bucket for artwork images
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork-images', 'artwork-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for artwork images bucket
-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'artwork-images'
    AND auth.role() = 'authenticated'
    AND is_admin(auth.uid())
  );

-- Allow authenticated admins to update
CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'artwork-images'
    AND auth.role() = 'authenticated'
    AND is_admin(auth.uid())
  ) WITH CHECK (
    bucket_id = 'artwork-images'
    AND auth.role() = 'authenticated'
    AND is_admin(auth.uid())
  );

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'artwork-images'
    AND auth.role() = 'authenticated'
    AND is_admin(auth.uid())
  );

-- Allow public to view images
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'artwork-images');