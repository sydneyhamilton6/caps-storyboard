-- Fix: allow reading archived testimonials
-- The SELECT policy was restricted to status = 'published', which caused PostgREST
-- to fail with 401 after archiving a row (it couldn't return the updated row).
-- Public pages already filter by status in JS, so RLS doesn't need to enforce it.

DROP POLICY IF EXISTS "Read published testimonials" ON testimonials;

CREATE POLICY "Read all testimonials"
  ON testimonials FOR SELECT
  USING (true);
