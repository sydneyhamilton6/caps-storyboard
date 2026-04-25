-- Add additional tone tags and push Other to the end
INSERT INTO tags (category, value, label, sort_order) VALUES
  ('tone', 'hopeful',     'Hopeful',     40),
  ('tone', 'reflective',  'Reflective',  50),
  ('tone', 'celebratory', 'Celebratory', 60),
  ('tone', 'grateful',    'Grateful',    70),
  ('tone', 'raw',         'Raw',         80),
  ('tone', 'bittersweet', 'Bittersweet', 90),
  ('tone', 'peaceful',    'Peaceful',    100)
ON CONFLICT (category, value) DO NOTHING;

UPDATE tags SET sort_order = 110 WHERE category = 'tone' AND value = 'other';
