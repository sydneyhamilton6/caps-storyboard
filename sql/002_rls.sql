-- Grief Support Hub — Row Level Security
-- Run after 001_schema.sql

ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_tags  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags               ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_tiers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees          ENABLE ROW LEVEL SECURITY;
ALTER TABLE media              ENABLE ROW LEVEL SECURITY;

-- consent_tiers: read-only
CREATE POLICY "Anyone can read consent tiers"
  ON consent_tiers FOR SELECT USING (true);

-- tags: read + insert (employee tags are created dynamically on submit)
CREATE POLICY "Anyone can read tags"
  ON tags FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tags"
  ON tags FOR INSERT WITH CHECK (true);

-- employees: read-only
CREATE POLICY "Anyone can read employees"
  ON employees FOR SELECT USING (true);

-- testimonials
-- TODO(v2-auth): Replace `true` in SELECT for tier 3 with auth.role() IN ('staff','admin')
CREATE POLICY "Read published testimonials"
  ON testimonials FOR SELECT
  USING (status = 'published' AND (consent_tier_id IN (1, 2) OR true));

-- TODO(v2-auth): Tighten INSERT to require auth
CREATE POLICY "Anyone can submit testimonials"
  ON testimonials FOR INSERT WITH CHECK (true);

-- TODO(v2-auth): Restrict UPDATE to owner or admin
CREATE POLICY "Anyone can update testimonials"
  ON testimonials FOR UPDATE USING (true);

-- TODO(v2-auth): Restrict DELETE to admin role
CREATE POLICY "Anyone can delete testimonials"
  ON testimonials FOR DELETE USING (true);

-- testimonial_tags
CREATE POLICY "Read testimonial tags"
  ON testimonial_tags FOR SELECT USING (true);
CREATE POLICY "Insert testimonial tags"
  ON testimonial_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Delete testimonial tags"
  ON testimonial_tags FOR DELETE USING (true);

-- media
CREATE POLICY "Read media"
  ON media FOR SELECT USING (true);
CREATE POLICY "Insert media"
  ON media FOR INSERT WITH CHECK (true);
CREATE POLICY "Delete media"
  ON media FOR DELETE USING (true);
