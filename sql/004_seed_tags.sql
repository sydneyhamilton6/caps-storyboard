-- Grief Support Hub — Tag Seed Data
-- Run after 003_seed_tiers.sql

INSERT INTO tags (category, value, label, sort_order) VALUES
  -- Grief types
  ('grief_type', 'loss_of_spouse',            'Loss of Spouse / Partner',    10),
  ('grief_type', 'loss_of_parent',            'Loss of Parent',              20),
  ('grief_type', 'loss_of_child',             'Loss of Child',               30),
  ('grief_type', 'loss_of_sibling',           'Loss of Sibling',             40),
  ('grief_type', 'loss_of_friend',            'Loss of Friend',              50),
  ('grief_type', 'loss_of_pet',               'Loss of Pet',                 60),
  ('grief_type', 'pregnancy_loss',            'Pregnancy Loss / Miscarriage', 70),
  ('grief_type', 'loss_of_pregnancy_dreams',  'Loss of Pregnancy Dreams',    80),
  ('grief_type', 'loss_to_suicide',           'Loss to Suicide',             90),
  ('grief_type', 'loss_to_addiction',         'Loss to Addiction',           100),
  ('grief_type', 'anticipatory_grief',        'Anticipatory Grief',          110),
  ('grief_type', 'ambiguous_loss',            'Ambiguous Loss',              120),
  ('grief_type', 'job_loss',                  'Job / Career Loss',           130),
  ('grief_type', 'other',                     'Other',                       140),

  -- Tones
  ('tone', 'inspirational', 'Inspirational', 10),
  ('tone', 'volunteer',     'Volunteer',     20),
  ('tone', 'sad',           'Sad',           30),
  ('tone', 'hopeful',       'Hopeful',       40),
  ('tone', 'reflective',    'Reflective',    50),
  ('tone', 'celebratory',   'Celebratory',   60),
  ('tone', 'grateful',      'Grateful',      70),
  ('tone', 'raw',           'Raw',           80),
  ('tone', 'bittersweet',   'Bittersweet',   90),
  ('tone', 'peaceful',      'Peaceful',      100),
  ('tone', 'other',         'Other',         110);
