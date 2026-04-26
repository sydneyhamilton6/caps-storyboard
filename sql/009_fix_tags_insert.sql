-- Fix: guarantee the anon role can insert into tags
-- 002 and 007 both define "Anyone can insert tags" — drop first to avoid conflicts.
DROP POLICY IF EXISTS "Anyone can insert tags" ON tags;
CREATE POLICY "Anyone can insert tags"
  ON tags FOR INSERT WITH CHECK (true);

-- Belt-and-suspenders: grant table-level privileges to anon
GRANT SELECT, INSERT ON tags TO anon;
