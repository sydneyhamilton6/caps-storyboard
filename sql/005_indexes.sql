-- Grief Support Hub — Indexes
-- Run after 004_seed_tags.sql

CREATE INDEX idx_testimonials_consent_tier ON testimonials(consent_tier_id);
CREATE INDEX idx_testimonials_status       ON testimonials(status);
CREATE INDEX idx_testimonial_tags_testimonial ON testimonial_tags(testimonial_id);
CREATE INDEX idx_testimonial_tags_tag      ON testimonial_tags(tag_id);
CREATE INDEX idx_tags_category             ON tags(category);
CREATE INDEX idx_testimonials_user         ON testimonials(submitted_by_user_id);
