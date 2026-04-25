-- Add 'Other' tone tag so submitters can specify a custom tone
INSERT INTO tags (category, value, label, sort_order)
VALUES ('tone', 'other', 'Other', 40)
ON CONFLICT (category, value) DO NOTHING;
