-- Grief Support Hub — Schema
-- Run this first in your Supabase SQL editor.

CREATE TABLE consent_tiers (
  id          SMALLINT    PRIMARY KEY,
  name        TEXT        NOT NULL UNIQUE,
  label       TEXT        NOT NULL,
  color_code  TEXT        NOT NULL,
  description TEXT        NOT NULL
);

CREATE TABLE tags (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category    TEXT        NOT NULL,
  value       TEXT        NOT NULL,
  label       TEXT        NOT NULL,
  icon        TEXT,
  sort_order  SMALLINT    DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category, value)
);

CREATE TABLE employees (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  department  TEXT,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE testimonials (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT,
  body              TEXT        NOT NULL,
  submitter_name    TEXT,
  submitter_email   TEXT,
  consent_tier_id   SMALLINT    NOT NULL REFERENCES consent_tiers(id),
  status            TEXT        NOT NULL DEFAULT 'published'
                                CHECK (status IN ('published', 'archived')),
  submitted_by_user_id UUID,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE testimonial_tags (
  id               UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id   UUID  NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
  tag_id           UUID  NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(testimonial_id, tag_id)
);

-- Schema-ready for v2 media support; not used in v1 UI
CREATE TABLE media (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id   UUID        NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
  media_type       TEXT        NOT NULL CHECK (media_type IN ('image', 'video', 'document')),
  storage_path     TEXT        NOT NULL,
  file_name        TEXT,
  file_size_bytes  BIGINT,
  duration_seconds INTEGER,
  thumbnail_path   TEXT,
  caption          TEXT,
  sort_order       SMALLINT    DEFAULT 0,
  uploaded_at      TIMESTAMPTZ DEFAULT now()
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
