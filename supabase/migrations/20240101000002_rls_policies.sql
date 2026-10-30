-- RLS Policies

-- Admin roles: only admins can read/write
CREATE POLICY "Admins can manage admin_roles" ON admin_roles
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Artworks: public read, only admins write
CREATE POLICY "Anyone can view artworks" ON artworks
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage artworks" ON artworks
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Artwork images: public read, only admins write
CREATE POLICY "Anyone can view artwork_images" ON artwork_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage artwork_images" ON artwork_images
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Categories: public read, only admins write
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Site settings: public read, only admins write
CREATE POLICY "Anyone can view site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site_settings" ON site_settings
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Homepage sections: public read, only admins write
CREATE POLICY "Anyone can view homepage_sections" ON homepage_sections
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage homepage_sections" ON homepage_sections
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- About content: public read, only admins write
CREATE POLICY "Anyone can view about_content" ON about_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage about_content" ON about_content
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Gallery items: public read, only admins write
CREATE POLICY "Anyone can view gallery_items" ON gallery_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery_items" ON gallery_items
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Commission types: public read, only admins write
CREATE POLICY "Anyone can view commission_types" ON commission_types
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage commission_types" ON commission_types
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Testimonials: public read, only admins write
CREATE POLICY "Anyone can view testimonials" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Orders: only admins can read/write (private)
CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Order items: only admins can read/write (private)
CREATE POLICY "Admins can manage order_items" ON order_items
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));