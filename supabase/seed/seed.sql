-- Seed data for initial setup

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
('brandName', '"Gayuu"'),
('tagline', '"Handmade art for spaces, souls & stories."'),
('artistName', '"[Artist Name]"'),
('artistFullName', '"[Artist Full Name]"'),
('contactEmail', '"hello@gayuu.com"'),
('whatsappNumber', '"94771234567"'),
('whatsappDisplay', '"+94 77 123 4567"'),
('location', '"[Your City], Sri Lanka"'),
('currency', '"LKR"'),
('currencySymbol', '"LKR"'),
('freeShippingOver', '25000'),
('deliveryFeeFrom', '750'),
('about', '"A small independent art studio making original paintings, gentle prints & commissioned portraits by hand."'),
('instagram', '"https://www.instagram.com/"'),
('pinterest', '"https://www.pinterest.com/"'),
('tiktok', '"https://www.tiktok.com/"')
ON CONFLICT (key) DO NOTHING;

-- Insert homepage sections
INSERT INTO homepage_sections (section_key, content) VALUES
('hero', '{"heading": "Soft strokes. Quiet beauty. Art that feels like home.", "subheading": "painted by hand", "description": "Original acrylic paintings, signed art prints, mini artworks and custom portraits — made slowly, with care, and from the heart.", "cta1": "Shop the collection", "cta2": "Commission a piece"}'),
('artist', '{"heading": "The hands behind the brush", "description": "I believe art should feel like a breath of fresh air — soft, honest, and made to be lived with. Every piece is painted by hand in my little studio, one stroke at a time."}'),
('behind', '{"heading": "Behind the Canvas", "description": "Slow mornings, clean brushes, and the kind of quiet that lets ideas unfold. Here''s a glimpse into my little studio — where every piece begins."}'),
('instagram', '{"heading": "Follow along on Instagram"}'),
('newsletter', '{"heading": "Stay in the studio loop", "description": "New originals, small drops and behind-the-scenes notes — no spam, just soft updates."}')
ON CONFLICT (section_key) DO NOTHING;

-- Insert about content
INSERT INTO about_content (id, content) VALUES
('main', '{"artistName": "[Artist Name]", "heroHeading": "About the Artist", "heroDescription": "A painter drawn to softness, light and the quiet stories things hold.", "shortBiography": "I paint slowly and intuitively — chasing light, texture, and the feeling of a moment rather than its exact form.", "fullBiography": "I paint slowly and intuitively — chasing light, texture, and the feeling of a moment rather than its exact form. What begins as a wash of colour often grows into something else entirely: a mood, a memory, or a breath of stillness.", "creativeJourney": "My creative journey started with small sketches and grew into full paintings over the years, always leaning towards softness and serenity.", "artisticInspiration": "Inspired by the changing light, quiet mornings, wild gardens and the imperfect beauty of everyday moments.", "paintingPhilosophy": "I believe art should make you exhale. It should feel gentle, lived-in, and bring a little bit of calm into your space.", "location": "[Your City], Sri Lanka", "contactCTA": "Want to work together? Let''s make something beautiful."}')
ON CONFLICT (id) DO NOTHING;

-- Insert default categories
INSERT INTO categories (slug, name, description) VALUES
('original-paintings', 'Original Paintings', 'One-of-one original acrylic paintings'),
('sketches-drawings', 'Sketches & Drawings', 'Hand-drawn studies and originals'),
('custom-portraits', 'Custom Portraits', 'Bespoke portrait commissions'),
('art-prints', 'Art Prints', 'Archival giclée prints'),
('mini-artworks', 'Mini Artworks', 'Small original pieces')
ON CONFLICT (slug) DO NOTHING;

-- Insert testimonials
INSERT INTO testimonials (customer_name, review, visible) VALUES
('Maya R.', 'The painting is even more beautiful in person. It brought so much warmth to my space. Thank you!', true),
('Shanika D.', 'My custom portrait turned out absolutely perfect. The attention to detail and care was incredible.', true),
('Nishan T.', 'Beautiful quality, thoughtfully packed, and arrived so quickly. Will definitely be ordering again!', true)
ON CONFLICT (id) DO NOTHING;

-- Insert commission types
INSERT INTO commission_types (name, description, starting_price, available) VALUES
('Individual Portrait', 'A hand-painted portrait of one person', 35000, true),
('Couple Portrait', 'A custom portrait capturing two people together', 50000, true),
('Pet Portrait', 'A sweet painted portrait of your beloved pet', 30000, true),
('Personalized Painting', 'Custom artwork based on your vision and space', 40000, true)
ON CONFLICT (id) DO NOTHING;