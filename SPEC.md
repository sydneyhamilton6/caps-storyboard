# Grief & Loss Testimonials — Project Specification

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** April 2026  
**Prepared For:** Internal Staff Use Only

---

## Table of Contents

1. [Project Overview & Goals](#1-project-overview--goals)
2. [Scope & Constraints](#2-scope--constraints)
3. [Sitemap & Page List](#3-sitemap--page-list)
4. [Supabase Schema](#4-supabase-schema)
5. [Row Level Security (RLS) Policies](#5-row-level-security-rls-policies)
6. [Tag Taxonomy](#6-tag-taxonomy)
7. [Consent Tier Logic](#7-consent-tier-logic)
8. [Component Breakdown](#8-component-breakdown)
9. [File & Folder Structure](#9-file--folder-structure)
10. [Design System](#10-design-system)
11. [Future-Proofing Notes](#11-future-proofing-notes)
12. [Open Questions & Decisions](#12-open-questions--decisions)

---

## 1. Project Overview & Goals

### 1.1 Summary

This is an internal staff-only web application for collecting, storing, and displaying personal grief and loss testimonials. The platform enables staff members to submit stories from individuals who have experienced significant loss, tag those stories across multiple dimensions (grief type, tone, employee involved, consent tier), and browse the collected testimonials through an organized visual folder system.

### 1.2 Goals

| # | Goal | Priority |
|---|------|----------|
| 1 | Provide a dignified, organized home for grief testimonials | Critical |
| 2 | Protect submitter privacy via explicit consent tiers | Critical |
| 3 | Enable staff to browse and search by any tag combination | High |
| 4 | Make submission simple and intuitive for non-technical users | High |
| 5 | Architect for future auth, video support, and public-facing access | Medium |

### 1.3 Non-Goals (v1)

- No user authentication or login (to be added in v2)
- No image or video upload (schema will be built to support it; UI will not)
- No email notifications on submission
- No public-facing access — internal staff only

---

## 2. Scope & Constraints

### 2.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| Database | Supabase (PostgreSQL) |
| Auth | None in v1 — Supabase Auth to be added in v2 |
| Storage | Supabase Storage (schema ready; not used in v1 UI) |
| Hosting | Supabase-hosted or static host (Netlify / GitHub Pages) |
| Frameworks | None required |

### 2.2 v1 Behavior Decisions

- **Submission:** Any staff member with the URL can submit a story — no login required in v1.
- **Moderation:** Stories go live immediately upon submission. No approval queue in v1.
- **Editing & Deletion:** Any user can edit or delete any story — no account ownership in v1. This will be locked down when auth is added in v2.
- **Attachments:** Text only in v1. The database schema includes a `media` table ready for video and image support in v2.

---

## 3. Sitemap & Page List

```
/
├── index.html             → Home / Folder View (browse by tag category)
├── stories.html           → Story List View (filterable, searchable)
├── story.html             → Single Story Detail View
├── submit.html            → Submission Form
├── admin.html             → Admin Dashboard (all stories, edit/delete)
└── 404.html               → Not Found
```

### 3.1 Page Descriptions

#### `/index.html` — Home / Folder View
The primary landing experience. Displays visual folder-style cards organized by tag category (Grief Type, Tone, Employee). Clicking a folder navigates to the filtered Story List View. Includes a global search bar and top-level stats (total stories, stories by consent tier).

#### `/stories.html` — Story List View
A filterable, searchable grid of story cards. Filters persist in the URL as query parameters (e.g., `?tag=grief-child&tone=inspirational`) so links are shareable. Each card displays: title or excerpt, grief type tag, tone badge, consent tier badge, and employee tag if present.

#### `/story.html` — Single Story Detail View
Full story content. Displays all associated tags, consent tier badge prominently, submitter name (or "Anonymous" based on tier), submission date, and associated employee(s). Includes Edit and Delete buttons (auth-gated in v2; open in v1).

#### `/submit.html` — Submission Form
A multi-section form for submitting a new testimonial. Sections: Story Content, Tag Selection (grief type, tone, employees), and Consent Tier Selection. Consent tier selector includes plain-language explanations of each tier. Submission POSTs directly to Supabase via the JS client. Confirmation screen shown on success.

#### `/admin.html` — Admin Dashboard
A staff-only view (password-protected via Supabase Auth in v2; open in v1). Shows all stories regardless of consent tier, including Strictly Private ones. Displays status badges, quick-edit links, and bulk delete capability. In v1, this page is accessible to anyone with the URL.

---

## 4. Supabase Schema

### 4.1 Table: `consent_tiers`

Lookup table. Seeded with exactly 3 rows. Not editable by users.

```sql
CREATE TABLE consent_tiers (
  id          SMALLINT PRIMARY KEY,
  name        TEXT        NOT NULL UNIQUE,  -- 'fully_public', 'anonymous', 'strictly_private'
  label       TEXT        NOT NULL,         -- 'Fully Public', 'Anonymous', 'Strictly Private'
  color_code  TEXT        NOT NULL,         -- '#22c55e', '#eab308', '#ef4444'
  description TEXT        NOT NULL          -- Plain-language explanation for submitters
);
```

**Seed data:**

| id | name | label | color_code | description |
|----|------|-------|------------|-------------|
| 1 | `fully_public` | Fully Public | `#22c55e` | Your name and story may be shared publicly |
| 2 | `anonymous` | Anonymous | `#eab308` | Your story is visible; your name is hidden |
| 3 | `strictly_private` | Strictly Private | `#ef4444` | Seen only by internal staff; never shared externally |

---

### 4.2 Table: `tags`

All tags across all dimensions live in a single normalized table. The `category` column differentiates them.

```sql
CREATE TABLE tags (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category    TEXT        NOT NULL,  -- 'grief_type', 'tone', 'employee'
  value       TEXT        NOT NULL,  -- machine-readable slug, e.g. 'loss_of_spouse'
  label       TEXT        NOT NULL,  -- display label, e.g. 'Loss of Spouse'
  icon        TEXT,                  -- optional emoji or icon identifier
  sort_order  SMALLINT    DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category, value)
);
```

---

### 4.3 Table: `testimonials`

Core content table.

```sql
CREATE TABLE testimonials (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT,                    -- optional; auto-generated from excerpt if blank
  body              TEXT        NOT NULL,    -- full story text
  submitter_name    TEXT,                    -- null if anonymous or strictly private
  submitter_email   TEXT,                    -- optional; internal contact only; never displayed
  consent_tier_id   SMALLINT    NOT NULL REFERENCES consent_tiers(id),
  status            TEXT        NOT NULL DEFAULT 'published'
                                CHECK (status IN ('published', 'archived')),

  -- Future auth hook (v2)
  submitted_by_user_id UUID,               -- FK to auth.users; null in v1

  -- Future media hook (v2)
  -- media is stored in separate table; see section 4.6

  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
```

---

### 4.4 Table: `testimonial_tags`

Junction table linking testimonials to tags (many-to-many).

```sql
CREATE TABLE testimonial_tags (
  id               UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id   UUID  NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
  tag_id           UUID  NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(testimonial_id, tag_id)
);
```

---

### 4.5 Table: `employees`

Separate lookup table for employees, distinct from generic tags, to allow for richer metadata later (photo, bio, department).

```sql
CREATE TABLE employees (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT  NOT NULL,
  department  TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

> **Note:** Employee tags in the `tags` table reference employee records by slug. In v2, this table can be joined directly for richer employee profile pages.

---

### 4.6 Table: `media` *(schema-ready; not used in v1 UI)*

Prepared for v2 video and image support via Supabase Storage.

```sql
CREATE TABLE media (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id   UUID        NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
  media_type       TEXT        NOT NULL CHECK (media_type IN ('image', 'video', 'document')),
  storage_path     TEXT        NOT NULL,   -- Supabase Storage object path
  file_name        TEXT,
  file_size_bytes  BIGINT,
  duration_seconds INTEGER,               -- for video
  thumbnail_path   TEXT,                  -- for video thumbnails
  caption          TEXT,
  sort_order       SMALLINT    DEFAULT 0,
  uploaded_at      TIMESTAMPTZ DEFAULT now()
);
```

---

### 4.7 Indexes

```sql
-- Fast filtering by consent tier
CREATE INDEX idx_testimonials_consent_tier ON testimonials(consent_tier_id);

-- Fast filtering by status
CREATE INDEX idx_testimonials_status ON testimonials(status);

-- Fast tag lookups
CREATE INDEX idx_testimonial_tags_testimonial ON testimonial_tags(testimonial_id);
CREATE INDEX idx_testimonial_tags_tag ON testimonial_tags(tag_id);
CREATE INDEX idx_tags_category ON tags(category);

-- Fast future auth lookups
CREATE INDEX idx_testimonials_user ON testimonials(submitted_by_user_id);
```

---

### 4.8 Updated-at Trigger

```sql
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
```

---

## 5. Row Level Security (RLS) Policies

> **v1 Note:** RLS is configured now so the schema is secure by default when auth is added. In v1 (no auth), the Supabase anon key is used. Policies are designed to be non-breaking when Supabase Auth roles are introduced in v2.

### 5.1 Enable RLS

```sql
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_tags  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags               ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_tiers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees          ENABLE ROW LEVEL SECURITY;
ALTER TABLE media              ENABLE ROW LEVEL SECURITY;
```

---

### 5.2 `consent_tiers` — Read-only for all

```sql
CREATE POLICY "Anyone can read consent tiers"
  ON consent_tiers FOR SELECT
  USING (true);
```

---

### 5.3 `tags` — Read-only for all

```sql
CREATE POLICY "Anyone can read tags"
  ON tags FOR SELECT
  USING (true);
```

---

### 5.4 `employees` — Read-only for all

```sql
CREATE POLICY "Anyone can read employees"
  ON employees FOR SELECT
  USING (true);
```

---

### 5.5 `testimonials` — Core visibility logic

```sql
-- SELECT: Public and anonymous stories are visible to everyone.
-- Strictly private stories are visible to all in v1.
-- In v2, replace `true` with `auth.role() = 'staff'` for the private tier.
CREATE POLICY "Read published testimonials"
  ON testimonials FOR SELECT
  USING (
    status = 'published'
    AND (
      consent_tier_id IN (1, 2)  -- fully_public, anonymous
      OR true                    -- v1: allow all; v2: replace with staff check
    )
  );

-- INSERT: Anyone can submit in v1
CREATE POLICY "Anyone can submit testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (true);

-- UPDATE: Anyone can edit in v1
-- v2: Replace with auth.uid() = submitted_by_user_id OR auth.role() = 'admin'
CREATE POLICY "Anyone can update testimonials"
  ON testimonials FOR UPDATE
  USING (true);

-- DELETE: Anyone can delete in v1
-- v2: Replace with auth.role() = 'admin'
CREATE POLICY "Anyone can delete testimonials"
  ON testimonials FOR DELETE
  USING (true);
```

---

### 5.6 `testimonial_tags` — Mirror testimonials access

```sql
CREATE POLICY "Read testimonial tags"
  ON testimonial_tags FOR SELECT
  USING (true);

CREATE POLICY "Insert testimonial tags"
  ON testimonial_tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Delete testimonial tags"
  ON testimonial_tags FOR DELETE
  USING (true);
```

---

### 5.7 `media` — Mirror testimonials access

```sql
CREATE POLICY "Read media"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Insert media"
  ON media FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Delete media"
  ON media FOR DELETE
  USING (true);
```

---

## 6. Tag Taxonomy

### 6.1 Grief Type Tags (`category = 'grief_type'`)

| value | label | icon |
|-------|-------|------|
| `loss_of_spouse` | Loss of Spouse / Partner | 💑 |
| `loss_of_parent` | Loss of Parent | 🧑‍🦳 |
| `loss_of_child` | Loss of Child | 👶 |
| `loss_of_sibling` | Loss of Sibling | 👫 |
| `loss_of_friend` | Loss of Friend | 🤝 |
| `loss_of_pet` | Loss of Pet | 🐾 |
| `pregnancy_loss` | Pregnancy Loss / Miscarriage | 🌸 |
| `loss_of_pregnancy_dreams` | Loss of Pregnancy Dreams | 🌿 |
| `loss_to_suicide` | Loss to Suicide | 🕊️ |
| `loss_to_addiction` | Loss to Addiction | 🫂 |
| `anticipatory_grief` | Anticipatory Grief | ⏳ |
| `ambiguous_loss` | Ambiguous Loss | 🌫️ |
| `job_loss` | Job / Career Loss | 💼 |
| `other` | Other | ✦ |

---

### 6.2 Tone Tags (`category = 'tone'`)

Exactly 3 values. Every testimonial must have exactly one tone tag.

| value | label | icon | Visual Treatment |
|-------|-------|------|-----------------|
| `inspirational` | Inspirational | ✨ | Gold label, warm background |
| `volunteer` | Volunteer | 🤲 | Blue label, calm background |
| `sad` | Sad | 🩶 | Muted gray label, soft background |

---

### 6.3 Employee Tags (`category = 'employee'`)

Employee tags are populated from the `employees` table and mirrored into the `tags` table with `category = 'employee'`. Values use the format `employee_{uuid_short}` or a name slug. These are managed by admins, not hardcoded.

Example:

| value | label |
|-------|-------|
| `employee_jane_doe` | Jane Doe |
| `employee_john_smith` | John Smith |

---

## 7. Consent Tier Logic

### 7.1 Visibility Rules

| Tier | Label | Who Can See It | Name Shown | Story Shown |
|------|-------|----------------|------------|-------------|
| 1 | 🟢 Fully Public | Everyone (v1: all staff) | ✅ Full name | ✅ Full text |
| 2 | 🟡 Anonymous | Everyone (v1: all staff) | ❌ Hidden — shows "Anonymous" | ✅ Full text |
| 3 | 🔴 Strictly Private | Internal staff only | ❌ Hidden | ✅ Full text |

### 7.2 Display Rules by Context

| Context | Tier 1 | Tier 2 | Tier 3 |
|---------|--------|--------|--------|
| Folder View card | ✅ Visible | ✅ Visible, name hidden | ✅ Visible to staff (v1 all) |
| Story List | ✅ | ✅ name hidden | ✅ staff only |
| Story Detail | Full content | Full content, "Anonymous" | Full content, "Anonymous", red badge |
| Admin Dashboard | Full content | Full content | Full content + private badge |
| Search results | ✅ | ✅ | ✅ staff only |

### 7.3 Submitter-Facing Language

The submission form must display plain-language consent descriptions:

- **🟢 Fully Public** — "I give permission for my name and story to be shared publicly, including in materials, presentations, or online."
- **🟡 Anonymous** — "My story can be shared and viewed, but please remove or hide my name. I understand my identity may still be known to staff."
- **🔴 Strictly Private** — "This story is for internal staff reference only. It should never be shared outside the organization in any form."

---

## 8. Component Breakdown

### 8.1 Shared Components (`/js/components/`)

| Component | File | Description |
|-----------|------|-------------|
| Nav Bar | `nav.js` | Top navigation with links and search bar |
| Story Card | `story-card.js` | Reusable card: title, excerpt, tone badge, grief tag, consent tier badge, employee chip |
| Tag Badge | `tag-badge.js` | Inline badge for any tag; color/icon driven by category |
| Consent Badge | `consent-badge.js` | Color-coded pill: green / yellow / red with label |
| Folder Card | `folder-card.js` | Visual folder tile showing category name, icon, and story count |
| Filter Bar | `filter-bar.js` | Horizontal multi-select tag filter with active state indicators |
| Search Input | `search-input.js` | Debounced full-text search box |
| Toast | `toast.js` | Success / error notification pop-up |
| Modal | `modal.js` | Confirm dialog for delete actions |

---

### 8.2 Page: Home / Folder View (`index.html`)

**Purpose:** Entry point. Visual browsing by tag category.

**Components:**
- Hero header with site title and brief description
- Global search bar (routes to `/stories.html?q=...`)
- Stats bar: total stories, breakdown by tone
- **Folder Grid** — 3 columns of `<FolderCard>` components, one per category:
  - Grief Type folders (one card per grief type with story count)
  - Tone folders (Inspirational / Volunteer / Sad)
  - Employee folders (dynamically loaded)
- Footer

**Data Needed:**
- `GET /tags` grouped by category
- Story counts per tag via `testimonial_tags` join

---

### 8.3 Page: Story List (`stories.html`)

**Purpose:** Browsable, filterable list of all published stories.

**Components:**
- Filter Bar (tag multi-select, synced to URL params)
- Active filter chips (dismissible)
- Sort control (newest / oldest / grief type)
- Story Card grid (responsive: 3 col desktop, 2 col tablet, 1 col mobile)
- Pagination or infinite scroll (TBD — see Open Questions)
- Empty state illustration when no results

**URL Params Supported:**
```
?grief_type=loss_of_spouse
?tone=inspirational
?employee=employee_jane_doe
?consent=fully_public
?q=search+text
?sort=newest
```

---

### 8.4 Page: Story Detail (`story.html?id={uuid}`)

**Purpose:** Full story content view.

**Components:**
- Back button
- Consent tier badge (prominent, top of page)
- Story title
- Submitter name or "Anonymous"
- Submission date
- Body text (rendered with basic paragraph formatting)
- Tags section (grief type, tone, employee chips)
- Edit button → links to `/submit.html?id={uuid}&edit=true`
- Delete button → confirmation modal → deletes and redirects

---

### 8.5 Page: Submission Form (`submit.html`)

**Purpose:** Collect a new testimonial (or edit an existing one).

**Sections:**

1. **Story Content**
   - Title (optional, text input)
   - Body (required, textarea with character count)
   - Submitter Name (optional)
   - Submitter Email (optional, internal only, not displayed)

2. **Tag Selection**
   - Grief Type: multi-select checkbox list
   - Tone: radio button group (select exactly one)
   - Employee: multi-select checkbox list (loaded from Supabase)

3. **Consent Tier**
   - Radio card group — each card shows tier label, color indicator, and plain-language description

4. **Confirmation Screen**
   - Displayed after successful submission
   - Shows: "Your story has been submitted. Thank you."
   - Links to view the story and submit another

**Validation:**
- Body is required (min 20 characters)
- Tone is required (exactly one)
- Consent tier is required (exactly one)
- All other fields optional

---

### 8.6 Page: Admin Dashboard (`admin.html`)

**Purpose:** Staff view of all stories including Strictly Private ones.

**Components:**
- Sortable data table: ID, title excerpt, submitter name, consent tier badge, grief type, tone, submitted date, status
- Filter/search bar (same as story list)
- Row actions: View, Edit, Delete
- Bulk select + delete
- Stats summary cards: total stories, breakdown by tier, recent submissions

> **v2 Note:** This page will be protected by Supabase Auth. In v1, it is accessible to anyone with the URL. A comment block in the HTML will mark exactly where the auth check should be inserted.

---

## 9. File & Folder Structure

```
/project-root
│
├── index.html
├── stories.html
├── story.html
├── submit.html
├── admin.html
├── 404.html
│
├── /css
│   ├── reset.css           → Minimal CSS reset
│   ├── variables.css       → CSS custom properties (colors, spacing, type)
│   ├── global.css          → Base styles, typography, utility classes
│   ├── components.css      → Shared component styles (cards, badges, buttons)
│   ├── layout.css          → Grid, nav, footer, page containers
│   └── pages/
│       ├── home.css
│       ├── stories.css
│       ├── story.css
│       ├── submit.css
│       └── admin.css
│
├── /js
│   ├── supabase.js         → Supabase client initialization (import from CDN)
│   ├── utils.js            → Shared helper functions
│   ├── tags.js             → Tag loading, filtering, URL param helpers
│   │
│   ├── /components
│   │   ├── nav.js
│   │   ├── story-card.js
│   │   ├── folder-card.js
│   │   ├── tag-badge.js
│   │   ├── consent-badge.js
│   │   ├── filter-bar.js
│   │   ├── search-input.js
│   │   ├── toast.js
│   │   └── modal.js
│   │
│   └── /pages
│       ├── home.js
│       ├── stories.js
│       ├── story.js
│       ├── submit.js
│       └── admin.js
│
├── /assets
│   ├── /icons              → SVG icons for tone, grief types, UI chrome
│   ├── /images             → Logo, empty states, illustrated folder visuals
│   └── favicon.ico
│
├── /sql
│   ├── 001_schema.sql      → Full table creation script
│   ├── 002_rls.sql         → All RLS policies
│   ├── 003_seed_tiers.sql  → Consent tier seed data
│   ├── 004_seed_tags.sql   → Default tag seed data
│   └── 005_indexes.sql     → All indexes
│
└── README.md
```

---

## 10. Design System

### 10.1 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0f0e0d` | Page background |
| `--color-surface` | `#1a1917` | Card / panel background |
| `--color-surface-raised` | `#232220` | Elevated elements |
| `--color-border` | `#2e2c2a` | Borders, dividers |
| `--color-text-primary` | `#f0ece6` | Headlines, body |
| `--color-text-secondary` | `#8c8780` | Labels, metadata |
| `--color-accent` | `#c9a96e` | CTA, links, highlights — warm gold |
| `--color-consent-public` | `#22c55e` | 🟢 Fully Public |
| `--color-consent-anonymous` | `#eab308` | 🟡 Anonymous |
| `--color-consent-private` | `#ef4444` | 🔴 Strictly Private |
| `--color-tone-inspirational` | `#f59e0b` | Inspirational tone |
| `--color-tone-volunteer` | `#60a5fa` | Volunteer tone |
| `--color-tone-sad` | `#94a3b8` | Sad tone |

### 10.2 Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display | `Playfair Display` (serif) | 700 | `2.5rem–4rem` |
| Body | `Source Serif 4` (serif) | 400 | `1rem` |
| UI / Labels | `DM Mono` (monospace) | 400–500 | `0.75rem–0.875rem` |

> Fonts loaded via Google Fonts CDN. Chosen to evoke warmth, gravity, and care — appropriate for a grief-context application.

### 10.3 Spacing Scale

Based on a 4px base unit. Use multiples: `4, 8, 12, 16, 24, 32, 48, 64, 96px`.

### 10.4 Responsive Breakpoints

| Name | Width |
|------|-------|
| Mobile | `< 640px` |
| Tablet | `640px – 1024px` |
| Desktop | `> 1024px` |

---

## 11. Future-Proofing Notes

### 11.1 Authentication (v2)

- Add `supabase.auth.signIn()` flow on `/admin.html`
- Replace `true` in RLS DELETE/UPDATE policies with `auth.uid() = submitted_by_user_id OR auth.role() = 'admin'`
- Replace `true` in SELECT policy for `consent_tier_id = 3` with `auth.role() IN ('staff', 'admin')`
- Add a `profiles` table extending `auth.users` with `role TEXT CHECK (role IN ('staff', 'admin'))`
- Every file that needs to change is marked with `// TODO(v2-auth):` comment

### 11.2 Video & Media (v2)

- `media` table is already in the schema with `media_type`, `storage_path`, `duration_seconds`, and `thumbnail_path` columns
- Supabase Storage bucket `testimonial-media` should be created now with appropriate access policies
- In v2, add a file upload step to the submission form and a media gallery to the story detail page
- Video playback component: native `<video>` element pointing to signed Supabase Storage URL

### 11.3 Public-Facing Mode (v3)

- The consent tier system is already built for this
- In v3, deploy a second read-only frontend that queries only `consent_tier_id IN (1, 2)`
- No schema changes required

---

## 12. Open Questions & Decisions

| # | Question | Current Decision | Revisit When |
|---|----------|-----------------|--------------|
| 1 | **Pagination vs. infinite scroll** on `/stories.html`? | Undecided — recommend pagination for accessibility | Before stories list is built |
| 2 | **Employee tag management** — who adds new employees? | Manual via admin dashboard or Supabase Studio in v1 | When admin auth is added in v2 |
| 3 | **Full-text search** — client-side filter or Postgres `tsvector`? | Recommend Postgres full-text search for accuracy | Before search is implemented |
| 4 | **Title auto-generation** — if title is blank, show first N characters of body? | Yes, truncate at 80 chars with ellipsis | Implement in `story-card.js` |
| 5 | **Archiving vs. deleting** — should deletion be soft (status = 'archived') or hard delete? | Recommend soft delete (status column already exists) | Before delete is implemented |
| 6 | **Employee photos** — will employee cards eventually show headshots? | Schema has no photo column yet on `employees` | When employee profiles are specced for v2 |
| 7 | **Audit log** — should edits and deletes be logged? | Not in v1; recommend a `testimonial_audit_log` table in v2 | When auth roles are added |
| 8 | **Supabase Storage bucket name and policy** for future media | Create bucket `testimonial-media` now, restricted to authenticated users | Before v2 media upload is built |

---

*End of Specification — v1.0*
