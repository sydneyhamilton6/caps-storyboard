-- Grief Support Hub — Example Story Seed Data
-- Run after 005_indexes.sql
-- Uses subqueries to resolve tag IDs by value so UUIDs don't need to be hardcoded.

-- ─── Insert testimonials ──────────────────────────────────────────────────────

INSERT INTO testimonials (id, title, body, submitter_name, consent_tier_id, status) VALUES

  -- Green (fully public)
  ('00000001-0000-0000-0000-000000000001',
   'My Father''s Long Goodbye',
   'Dad was diagnosed with early-onset Alzheimer''s when he was sixty-two. For three years I watched him disappear in slow motion — the man who taught me to fish, who remembered every joke, who called me by my middle name when he was proud of me. By the time he passed, I had already grieved him a hundred times. I didn''t expect to grieve him again at the funeral, but I did. Anticipatory grief is real, and I wish someone had told me that losing someone while they''re still alive is still loss.',
   'Daniel Okafor', 1, 'published'),

  ('00000001-0000-0000-0000-000000000002',
   'Our Dog Max Taught Me How to Love Fully',
   'I always felt embarrassed saying I was devastated when Max died. He was "just a dog." But Max had been my companion through a divorce, a cross-country move, and two surgeries. He never once left my side. Losing him cracked something open in me. I''ve since started volunteering at the local shelter, because grief can either close you down or pry you open — I chose open.',
   'Rosa Delgado', 1, 'published'),

  ('00000001-0000-0000-0000-000000000003',
   'The Career I Built for Twenty Years',
   'Being laid off at fifty-one felt like a death. I know that sounds dramatic, but my work was my identity, my community, my purpose. The grief of job loss is invisible — no one sends flowers, no one checks in after the first week. I spent months in a fog that I now recognise as genuine mourning. Eventually I rebuilt, but only after I gave myself permission to actually grieve what I''d lost.',
   'James Whitfield', 1, 'published'),

  ('00000001-0000-0000-0000-000000000004',
   'Volunteering Pulled Me Back Into the World',
   'I lost my wife and my mother within eight months of each other. The double weight of it was unbearable. A friend dragged me to a bereavement support group where I eventually started helping facilitate. Helping others name their grief helped me name mine. I don''t think I''d still be here without that community.',
   'Marcus Bell', 1, 'published'),

  -- Yellow (anonymous)
  ('00000001-0000-0000-0000-000000000005',
   'Finding Light After Losing Mum to Suicide',
   'My mother struggled with depression her whole life, and I spent mine waiting for the phone call I always knew might come. When it did, I felt grief and guilt and relief all at once — and then guilt about the relief. It took years of therapy to understand that I could love her completely and still be exhausted by what loving her cost me. She was also my parent and my child all at once, and I''ve had to mourn both.',
   NULL, 2, 'published'),

  ('00000001-0000-0000-0000-000000000006',
   'He Was My Best Friend First',
   'We were married for thirty-one years. People keep saying how lucky I was to have had so long together, and I understand what they mean, but thirty-one years also means thirty-one years of habit, of presence, of a voice in the next room. The silence is the hardest part. I hear him in it constantly.',
   NULL, 2, 'published'),

  ('00000001-0000-0000-0000-000000000007',
   'Grief Has No Timeline',
   'My closest friend died by suicide six years ago. I thought I was "over it" until his birthday last year, when I completely fell apart in the middle of a supermarket. Grief doesn''t follow a schedule. It hides and resurfaces. I still sometimes reach for my phone to text him something funny. I''m learning to let those moments be tender instead of painful.',
   NULL, 2, 'published'),

  ('00000001-0000-0000-0000-000000000008',
   'The Fog of Not Knowing',
   'My father walked out when I was nine and never came back. No explanation. No contact. For years I didn''t have a name for what I felt. He was alive — I knew that from distant relatives — but entirely gone. Learning about ambiguous loss changed everything for me. It gave me permission to grieve someone who was technically still living. That permission was everything.',
   NULL, 2, 'published'),

  -- Red (strictly private)
  ('00000001-0000-0000-0000-000000000009',
   'A Letter to My Daughter',
   'You would have been seven this spring. I still buy a small bunch of flowers on your due date — yellow ones, because that''s the colour I always imagined your bedroom. Your dad and I don''t talk about you as much as we used to, but you are in every quiet moment between us. I am not healed. I am not "moving on." I am just learning to carry you differently.',
   NULL, 3, 'published'),

  ('00000001-0000-0000-0000-000000000010',
   'My Sister''s Addiction Took Her Slowly',
   'Watching someone you love choose a substance over everything — over you, over their kids, over their life — is its own kind of grief. By the time she died, I had already mourned her a dozen times: the sister she used to be, the relationship we might have had, the aunt my children deserved. I feel guilty writing this, but I also felt relief when it was finally over. I think that''s the most honest thing I''ve ever said.',
   NULL, 3, 'published'),

  ('00000001-0000-0000-0000-000000000011',
   'Three Times',
   'Three pregnancies. Three losses before sixteen weeks. Each one smaller than a thumb, each one enormous. My partner and I grieve differently — he moves forward, I turn inward. I resent him for it sometimes, even though I know it''s not fair. We are both just trying to survive the same loss in our own bodies.',
   NULL, 3, 'published'),

  ('00000001-0000-0000-0000-000000000012',
   'When My Brother Left',
   'He called me two days before. I didn''t know it was goodbye — I thought it was just another hard conversation. I replay it constantly, looking for the thing I missed. His addiction had taken so much from him already; by the end, I think he was exhausted. I am angry and heartbroken and I miss him every single day. This is the first time I''ve written any of this down.',
   NULL, 3, 'published');


-- ─── Tag the testimonials ─────────────────────────────────────────────────────

-- Helper: resolve tag UUIDs inline by (category, value)

INSERT INTO testimonial_tags (testimonial_id, tag_id)
SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000001'
  AND tags.category = 'grief_type' AND tags.value IN ('loss_of_parent', 'anticipatory_grief')

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000001'
  AND tags.category = 'tone' AND tags.value = 'sad'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000002'
  AND tags.category = 'grief_type' AND tags.value = 'loss_of_pet'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000002'
  AND tags.category = 'tone' AND tags.value = 'inspirational'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000003'
  AND tags.category = 'grief_type' AND tags.value IN ('job_loss', 'ambiguous_loss')

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000003'
  AND tags.category = 'tone' AND tags.value = 'inspirational'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000004'
  AND tags.category = 'grief_type' AND tags.value IN ('loss_of_spouse', 'loss_of_parent')

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000004'
  AND tags.category = 'tone' AND tags.value = 'volunteer'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000005'
  AND tags.category = 'grief_type' AND tags.value IN ('loss_of_parent', 'loss_to_suicide')

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000005'
  AND tags.category = 'tone' AND tags.value = 'inspirational'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000006'
  AND tags.category = 'grief_type' AND tags.value = 'loss_of_spouse'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000006'
  AND tags.category = 'tone' AND tags.value = 'sad'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000007'
  AND tags.category = 'grief_type' AND tags.value IN ('loss_of_friend', 'loss_to_suicide')

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000007'
  AND tags.category = 'tone' AND tags.value = 'sad'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000008'
  AND tags.category = 'grief_type' AND tags.value = 'ambiguous_loss'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000008'
  AND tags.category = 'tone' AND tags.value = 'sad'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000009'
  AND tags.category = 'grief_type' AND tags.value = 'loss_of_child'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000009'
  AND tags.category = 'tone' AND tags.value = 'sad'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000010'
  AND tags.category = 'grief_type' AND tags.value IN ('loss_of_sibling', 'loss_to_addiction')

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000010'
  AND tags.category = 'tone' AND tags.value = 'sad'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000011'
  AND tags.category = 'grief_type' AND tags.value IN ('pregnancy_loss', 'loss_of_pregnancy_dreams')

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000011'
  AND tags.category = 'tone' AND tags.value = 'sad'

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000012'
  AND tags.category = 'grief_type' AND tags.value IN ('loss_of_sibling', 'loss_to_addiction')

UNION ALL

SELECT t.id, tags.id FROM testimonials t, tags
WHERE t.id = '00000001-0000-0000-0000-000000000012'
  AND tags.category = 'tone' AND tags.value = 'sad';
