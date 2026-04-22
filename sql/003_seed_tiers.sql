-- Grief Support Hub — Consent Tier Seed Data
-- Run after 002_rls.sql

INSERT INTO consent_tiers (id, name, label, color_code, description) VALUES
  (1, 'fully_public',    'Fully Public',     '#22c55e',
   'I give permission for my name and story to be shared publicly, including in materials, presentations, or online.'),
  (2, 'anonymous',       'Anonymous',        '#eab308',
   'My story can be shared and viewed, but please remove or hide my name. I understand my identity may still be known to staff.'),
  (3, 'strictly_private','Strictly Private', '#ef4444',
   'This story is for internal staff reference only. It should never be shared outside the organisation in any form.');
