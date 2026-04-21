# Grief Support Hub — Brand & Design System

**Project:** Grief Support Hub for Collective for Hope
**Version:** 1.0
**Last updated:** April 2026
**Scope:** This document describes the visual brand foundations — colors, typography, spacing, motion, and design principles — for the Grief Support Hub identity.

---

## 1. Design intent

### 1.1 Tone

The brand exists to support people in active grief. Every visual decision follows three principles:

- **Dignified, not clinical.** No hospital-white backgrounds, no stock medical iconography. The interface should feel like a warm room, not a waiting room.
- **Editorial, not app-like.** Generous whitespace, serif display type, and restrained color. More in common with a thoughtful print magazine than a SaaS dashboard.
- **Quiet confidence.** Animations are subtle. Emphasis is earned by typography and spacing, not by saturation or contrast shock.

### 1.2 Aesthetic direction

A **warm editorial** aesthetic — cream paper background, deep teal primary, soft terracotta accent, and a serif display typeface with optical sizing. The result reads as considered and human. Generic "AI-generated" tells to actively avoid: purple gradients, neon cyans, over-rounded pill everything, emoji-as-iconography, glassmorphism.

---

## 2. Brand foundations

### 2.1 Color tokens

| Token | Hex | Role |
|---|---|---|
| `paper` | `#FDFBF7` | Background. A cream off-white, not pure white. |
| `ink` | `#2B2623` | Primary text. A warm near-black, never `#000`. |
| `muted` | `#6E6862` | Secondary text, labels, metadata. |
| `line` | `#E8E1D7` | Borders, dividers, input outlines. |
| `surface` | `#FFFFFF` | Card and input backgrounds (the only true white in the system). |
| `brand.teal` | `#2F6F6E` | **Primary.** CTAs, active states, focus rings, heading accents. |
| `brand.tealDeep` | `#1F4F4E` | Primary hover/pressed state. |
| `brand.warm` | `#C97B63` | **Accent.** Soft terracotta. Date badges, small emphasis. |
| `brand.warmSoft` | `#F3DFD3` | Accent background tint. Badges, highlights. |
| `brand.sage` | `#A8B5A0` | Reserved (not currently in use). |
| `brand.gold` | `#C89B4A` | Star ratings. |

Semantic status colors borrow from Tailwind defaults:

- Success/confirmed: `emerald-500` (dot), `emerald-50` / `emerald-800` (banners)
- Warning: `amber-400` (dot), `amber-50` / `amber-800` (banners)
- Error: `red-500` (dot), `red-50` / `red-700` (banners)

### 2.2 Typography

Two typefaces, one distinct role each. Loaded from Google Fonts.

| Family | Role | Weights |
|---|---|---|
| **Fraunces** (serif, optical size) | Display — headings, date numerals, brand name | 400, 500, 600, 700; 400 italic |
| **Nunito Sans** (humanist sans) | Body — paragraphs, UI labels, form text, buttons | 400, 500, 600, 700 |

**Usage rules:**

- Anything read as *content* uses Fraunces (headings, hero text, statistic numerals).
- Anything read as *interface* uses Nunito Sans (buttons, labels, metadata, form inputs, navigation).
- Italic Fraunces is reserved for one-word editorial emphasis inside hero headings. Do not italicize body copy.
- Tracking: tight on Fraunces headings (default), wide on Nunito Sans uppercase eyebrow labels (`tracking-[0.18em]` to `tracking-[0.2em]`).
- Uppercase eyebrow/metadata labels are always Nunito Sans 700, size `text-[10px]` or `text-[11px]`, color `muted` or `brand.teal` depending on context.

### 2.3 Spacing & radius

- Base unit follows Tailwind's 4px grid.
- Card padding: `p-4` mobile, `p-5` tablet, `p-6` to `p-8` desktop.
- Section gaps: `gap-4` tight, `gap-5` standard, `gap-6` between major blocks.
- Corner radii form a three-tier system:
  - `rounded-lg` (8px) — inputs, small buttons, badge pills
  - `rounded-xl` (12px) — form field groups, inner containers
  - `rounded-xl2` (20px, custom) — top-level cards, modal sheets, section panels
  - `rounded-full` — primary CTAs, circular icon buttons, status dots

### 2.4 Elevation

Two custom shadows, both warm-tinted (ink-based, not pure black):

- `shadow-soft` — resting state on cards
  `0 1px 2px rgba(43,38,35,0.04), 0 4px 16px rgba(43,38,35,0.06)`
- `shadow-lift` — hover on cards, modals
  `0 8px 28px rgba(43,38,35,0.12)`

Cards transition between these on hover: `hover:shadow-lift transition`.

### 2.5 Motion

- All transitions honor `prefers-reduced-motion: reduce`.
- Durations: 250ms for UI state changes, 320ms for sheet/modal transitions, 350ms for card entrance.
- Easing: `cubic-bezier(.2,.8,.2,1)` for sheet transitions, `ease` default elsewhere.
- **`rise` keyframe** — elements animate in with a 6px upward translate and fade. Stagger by index (40ms per item, capped at 280ms total).
- **`softPulse` keyframe** — a subtle 6px teal ring emitted every 2.4s for highlighted elements.
- Hover: cards lift via shadow only; no scale or translate.
- Tap: primary CTAs `active:scale-[0.99]` for tactile feedback.

### 2.6 Ambient background

Two radial gradient washes behind a `body::before` pseudo-element, fixed in place and pointer-events:none:

- Top-left: soft terracotta, `rgba(201,123,99,0.07)` fading at 60%
- Bottom-right: deep teal, `rgba(47,111,110,0.06)` fading at 60%

This creates depth without being visible as "decoration."

### 2.7 Decorative top bar

A 4px-tall horizontal gradient bar at the very top of the page: `from-brand-warm via-brand-gold to-brand-teal`. This is the only place all three brand hues touch. Acts as a brand signature.

### 2.8 Brand icon

A circular teal-filled dove-ish SVG icon (`w-9 h-9`). Paired with a two-line text lockup:
- Eyebrow: `Collective for Hope` — Nunito Sans 600, `text-[10px]`, `tracking-[0.18em]` uppercase, `brand.teal`
- Title: Fraunces 600, `text-xl` to `text-2xl` depending on context.

---

## 3. Accessibility standards

- All interactive elements reachable by keyboard. Focus-visible states use a 2px `brand.teal` outline with 2px offset and 6px radius.
- Every input has an associated `<label>` with matching `for`/`id`.
- `prefers-reduced-motion: reduce` disables all animations and transitions globally.
- Color contrast: all body text meets WCAG AA against its background; `ink` on `paper` reaches AAA for body sizes.

---

## 4. Anti-patterns

Avoid these when extending the brand:

- **No pure white backgrounds.** The page background is cream (`paper`). True white is reserved for card surfaces as contrast.
- **No saturated accent colors.** The warm hue is a dusty terracotta, not red or orange. The teal is deep and gray-leaning, not tropical.
- **No emoji in UI chrome.** Icons are SVG line drawings at 1.6–2.2 stroke width.
- **No gradients except the 4px top brand bar and the two ambient radial washes.**
- **No drop shadows darker than the ink-tinted soft/lift set.**
- **No heavy borders.** Borders are always 1px and always `line` color.
- **No sentence-case labels for eyebrows and metadata.** Uppercase with wide tracking is the signature.
- **No congratulatory copy.** The tone is quiet and warm: "Thank you for sharing", not "Awesome!" or "Great job!".
