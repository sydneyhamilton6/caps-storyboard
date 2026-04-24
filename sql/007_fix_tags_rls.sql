-- Fix: allow anonymous inserts to tags table so employee tags can be created on submit
CREATE POLICY "Anyone can insert tags"
  ON tags FOR INSERT WITH CHECK (true);
