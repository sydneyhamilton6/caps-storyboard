# Grief Support Hub — UI Specification

**Project:** Grief Support Hub for Collective for Hope
**Version:** 1.0
**Last updated:** April 2026
**Scope:** This document describes the exact visual, spatial, and interactive design of the web application. It is the canonical reference for reproducing, extending, or rebuilding the UI.

---

## 1. Design intent

### 1.1 Tone

The app exists to support people in active grief. Every visual decision follows three principles:

- **Dignified, not clinical.** No hospital-white backgrounds, no stock medical iconography. The interface should feel like a warm room, not a waiting room.
- **Editorial, not app-like.** Generous whitespace, serif display type, and restrained color. More in common with a thoughtful print magazine than a SaaS dashboard.
- **Quiet confidence.** Animations are subtle. Emphasis is earned by typography and spacing, not by saturation or contrast shock.

### 1.2 Aesthetic direction

A **warm editorial** aesthetic — cream paper background, deep teal primary, soft terracotta accent, and a serif display typeface with optical sizing. The result reads as considered and human. Generic "AI-generated" tells to actively avoid: purple gradients, neon cyans, over-rounded pill everything, emoji-as-iconography, glassmorphism.

---

## 2. Brand foundations

### 2.1 Color tokens

All colors are defined under the Tailwind `theme.extend.colors` namespace. Use semantic names in markup; never hardcode hex values.

| Token | Hex | Role |
|---|---|---|
| `paper` | `#FDFBF7` | App background. A cream off-white, not pure white. |
| `ink` | `#2B2623` | Primary text. A warm near-black, never `#000`. |
| `muted` | `#6E6862` | Secondary text, labels, metadata. |
| `line` | `#E8E1D7` | Borders, dividers, input outlines. |
| `surface` | `#FFFFFF` | Card and input backgrounds (the only true white in the system). |
| `brand.teal` | `#2F6F6E` | **Primary.** CTAs, active tab states, focus rings, headings accents. |
| `brand.tealDeep` | `#1F4F4E` | Primary hover/pressed state. |
| `brand.warm` | `#C97B63` | **Accent.** Soft terracotta. Date badges, registration-present indicator, small emphasis. |
| `brand.warmSoft` | `#F3DFD3` | Accent background tint. Badges, calendar day-with-events, feedback hero icon bg. |
| `brand.sage` | `#A8B5A0` | Reserved (not currently rendered). |
| `brand.gold` | `#C89B4A` | Star ratings in admin dashboard only. |

Semantic status colors borrow from Tailwind defaults:

- Success/confirmed: `emerald-500` (dot), `emerald-50` / `emerald-800` (toast/banner)
- Warning/demo mode: `amber-400` (dot), `amber-50` / `amber-800` (banner)
- Error: `red-500` (dot), `red-50` / `red-700` (banner)

### 2.2 Typography

Two typefaces, one distinct role each. Loaded from Google Fonts.

| Family | Role | Weights |
|---|---|---|
| **Fraunces** (serif, optical size) | Display — headings, date numerals, rating numerals, brand name | 400, 500, 600, 700; 400 italic |
| **Nunito Sans** (humanist sans) | Body — paragraphs, UI labels, form text, buttons | 400, 500, 600, 700 |

**Usage rules:**

- Anything the user reads as *prose or content* is Fraunces (h1–h3, hero headlines, event names, modal titles, statistic numerals).
- Anything the user reads as *interface* is Nunito Sans (buttons, labels, metadata, form inputs, navigation).
- Italic Fraunces is reserved for one-word editorial emphasis inside hero headings (e.g. "Upcoming _gatherings_"). Do not italicize body copy.
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
  - `rounded-full` — primary CTAs, circular icon buttons, status dots, day cells

### 2.4 Elevation

Two custom shadows, both warm-tinted (ink-based, not pure black):

- `shadow-soft` — resting state on cards
  `0 1px 2px rgba(43,38,35,0.04), 0 4px 16px rgba(43,38,35,0.06)`
- `shadow-lift` — hover on cards, modal sheets
  `0 8px 28px rgba(43,38,35,0.12)`

Cards transition between these on hover: `hover:shadow-lift transition`.

### 2.5 Motion

- All transitions honor `prefers-reduced-motion: reduce`.
- Durations: 250ms for UI state changes, 320ms for sheet/modal transitions, 350ms for card entrance.
- Easing: `cubic-bezier(.2,.8,.2,1)` for sheet transitions (slight overshoot-less ease-out), `ease` default elsewhere.
- **`rise` keyframe** — event cards animate in with a 6px upward translate and fade. Staggered by index (40ms per card, capped at 280ms total).
- **`softPulse` keyframe** — today's calendar cell emits a subtle 6px teal ring every 2.4s.
- Hover: cards lift via shadow only; no scale or translate.
- Tap: primary CTAs `active:scale-[0.99]` for tactile feedback (subtle, not bouncy).

### 2.6 Ambient background

Two radial gradient washes behind a `body::before` pseudo-element, fixed in place and pointer-events:none:

- Top-left: soft terracotta, `rgba(201,123,99,0.07)` fading at 60%
- Bottom-right: deep teal, `rgba(47,111,110,0.06)` fading at 60%

This creates depth without being visible as "decoration." If removed, the page feels noticeably flatter.

### 2.7 Decorative top bar

A 4px-tall horizontal gradient bar at the very top of the page: `from-brand-warm via-brand-gold to-brand-teal`. This is the only place all three brand hues touch. Acts as a brand signature visible on every page without any other decoration in the header.

---

## 3. Global layout

### 3.1 Page container

Content is constrained to `max-w-content` (1200px) and centered with horizontal padding of `px-4` / `sm:px-6` / `lg:px-8`. The header, main content, and footer all share this container so brand and content align vertically.

### 3.2 Vertical rhythm

- Header: `h-16` mobile, `h-20` desktop
- Main content top padding: `py-6` mobile, `py-10` desktop
- Footer: `py-8` with `mt-10` above
- Between major sections within a tab: `mb-6 sm:mb-8`

### 3.3 Responsive breakpoints

Tailwind defaults, used at these inflection points:

| Breakpoint | Width | Key changes |
|---|---|---|
| base | <640px | Single-column event list, bottom sheet modal, pill-strip tabs |
| `sm` | ≥640px | Two-column event grid, centered modal (no longer bottom sheet) |
| `md` | ≥768px | Desktop horizontal nav appears; mobile pill tabs hide |
| `lg` | ≥1024px | Three-column event grid; calendar + month-list side-by-side |

### 3.4 Safe areas

`.safe-pt` and `.safe-pb` utilities use `env(safe-area-inset-*)` for iOS notch / home indicator clearance. Applied to the bottom-sheet modal.

---

## 4. Header

### 4.1 Structure

A sticky, `z-10` header with `bg-paper/85 backdrop-blur` and a `border-b border-line`. Sits directly below the 4px gradient bar.

Three regions, horizontal on all viewports:

1. **Brand** (left) — circular teal-filled dove-ish SVG icon (`w-9 h-9`), followed by a two-line lockup:
   - Eyebrow: `Collective for Hope` — Nunito Sans 600, `text-[10px]`, `tracking-[0.18em]` uppercase, `brand.teal`
   - Title: `#nav-title` element — Fraunces 600, `text-xl` mobile / `text-2xl` desktop. Dynamic: reads "Gatherings", "Calendar", "Feedback", or "Admin" based on active tab.
   - The full lockup is a link to `collectiveforhope.org` (opens new tab).

2. **Desktop nav** (center) — hidden on <md, visible on ≥md. Four text buttons (`Events`, `Calendar`, `Feedback`, `Admin`) with `text-sm font-medium text-ink/80`. The active tab gets a 2px teal underline `::after` offset 6px below the text.

3. **Action** (right) — the "New Event" button.
   - Desktop: pill button with plus-icon + "New Event" label. `bg-brand-teal hover:bg-brand-tealDeep text-white font-semibold px-4 py-2 rounded-full shadow-soft`.
   - Mobile: circular icon-only button (`w-10 h-10 grid place-items-center bg-brand-teal text-white rounded-full`).
   - **Critical:** The button is present on all tabs. On Calendar and Feedback tabs it becomes `invisible` + `pointer-events-none` + `aria-hidden="true"` + `tabIndex=-1`. It must never use `hidden` (which would collapse layout and shift the header). This preserves the header's visual stability across tab switches.

### 4.2 Mobile tab strip

On <md viewports, a second row inside the header shows four horizontally-scrolling pill buttons. The active pill is `bg-brand-teal text-white`; inactive pills are `bg-surface border border-line text-ink/75`. The strip uses `overflow-x-auto no-scrollbar` so it scrolls cleanly if the viewport is too narrow for all four pills.

---

## 5. Connection status strip

Just below the header, always visible: a thin capsule showing connection state.

- Container: `bg-surface/70 border border-line rounded-full px-4 py-2 text-xs text-muted`
- Layout: flex, space-between. Left side has a 2×2px dot + status label. Right side shows a truncated user ID in monospace at reduced opacity.
- Dot colors: `amber-400` (connecting/demo), `emerald-500` (connected), `red-500` (error).
- Status text: "Connecting…", "Demo mode — data is local only", "Connected", "Sign-in failed", "Connection error".

---

## 6. Tab: Events

### 6.1 Hero block

Above the card grid:

- Eyebrow: "Honoring grief together" — uppercase, `tracking-[0.2em]`, `text-brand-warm font-semibold text-xs`
- Headline: "Upcoming _gatherings_" — Fraunces 600, `text-3xl sm:text-4xl lg:text-5xl`, ink color. The word "gatherings" is italic and `text-brand-teal`.
- Subtitle: One-paragraph description of the program — `text-muted max-w-2xl leading-relaxed`.

### 6.2 Event card grid

Responsive grid: 1 column base, 2 columns `sm`, 3 columns `lg`. Gap `4` mobile, `5` desktop.

### 6.3 Event card anatomy

Each card is `bg-surface border border-line rounded-xl2 p-5 shadow-soft hover:shadow-lift transition flex flex-col`. Past events receive `opacity-75`.

From top to bottom:

1. **Header row** — flex space-between, `mb-3`:
   - **Left:** date badge. For upcoming events: `bg-brand-warmSoft text-brand-warm` pill with `text-[10px] uppercase tracking-wider font-bold`, content is the formatted datetime. For past events: `bg-line text-muted` pill reading "Past".
   - **Right:** large date block — Fraunces 600 `text-2xl` day numeral in `brand.teal`, with abbreviated month below in `text-[10px]` uppercase muted.

2. **Event name** — Fraunces 600 `text-xl leading-snug mb-2`.

3. **Description** — `text-sm text-muted leading-relaxed line-clamp-3 mb-4`. The `line-clamp-3` uses `-webkit-line-clamp` so descriptions never exceed three lines in the card; full text is available in the Details modal.

4. **Action row** — `mt-auto` pushes to bottom of card, `flex gap-2`:
   - **Register button** (present only if event has a valid `signupUrl`): flex-1, `bg-brand-teal hover:bg-brand-tealDeep text-white font-semibold py-2.5 rounded-lg`. Opens URL in a new tab with `rel="noopener noreferrer"`.
   - **Details button** (always present): flex-1, `bg-paper hover:bg-line text-ink font-semibold py-2.5 rounded-lg border border-line`. Opens the Day Details modal with full description.

### 6.4 Empty state

When `allEvents.length === 0`, a dashed-border placeholder spans all columns:
- `bg-surface border border-dashed border-line rounded-xl2 py-14 text-center`
- Heading: Fraunces `text-xl text-ink/80` — "No gatherings yet."
- Subtitle: `text-muted text-sm` — "New events will appear here as they are scheduled."

### 6.5 Loading state

Centered teal spinner (`animate-spin h-7 w-7 text-brand-teal`) with "Loading gatherings…" below in muted text. Spans all grid columns.

### 6.6 Sort order

Upcoming events first (soonest first), then past events (most recent first). Implemented client-side after fetching from Firestore.

---

## 7. Tab: Calendar

### 7.1 Layout

Two-pane on `lg` and up (`grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6`); stacks vertically below.

### 7.2 Calendar panel (left)

- Container: `bg-surface rounded-xl2 shadow-soft border border-line overflow-hidden`.
- **Header strip:** `px-5 py-4 border-b border-line`, flex space-between.
  - Prev/next arrows: `w-9 h-9 rounded-full hover:bg-paper text-brand-teal` circular buttons with chevron SVGs.
  - Center: month + year — Fraunces 600 `text-lg sm:text-xl`.
- **Weekday header:** 7-column grid with three-letter abbreviations (`Sun Mon Tue Wed Thu Fri Sat`), `text-[11px] uppercase tracking-wider text-muted font-semibold`.
- **Day grid:** 7-column grid with `gap-1 sm:gap-2`. Leading blank cells (before month start) are empty divs sized `h-10`.

### 7.3 Day cell states

Each day is a `<button>` at `h-10 sm:h-12 rounded-lg text-sm font-medium grid place-items-center`.

| State | Styling |
|---|---|
| Regular | `text-ink/80 hover:bg-paper` |
| Has events | `bg-brand-warmSoft text-brand-warm font-bold hover:bg-brand-warm hover:text-white`, with a small `1.5×1.5px brand-warm` dot centered `bottom-1` |
| Today | `bg-brand-teal text-white today-dot` (pulsing ring animation) |
| Today + has events | Today styling wins; the warm dot is omitted |

Clicking any day opens the Day Details modal. Hover transitions via `transition`.

### 7.4 Month list (right)

- Container: `bg-surface rounded-xl2 p-5 shadow-soft border border-line`.
- Heading: "This Month" — `text-xs font-bold text-muted uppercase tracking-wider mb-3`.
- List: `divide-y divide-line`. Each item: flex with 10×10 square date tile (`bg-brand-warmSoft text-brand-warm`, Fraunces bold, day numeral only) on the left, event name (truncated) and datetime below it on the right.
- Empty state: centered muted text "No events this month."

---

## 8. Tab: Feedback

### 8.1 Layout

Single centered card, `max-w-2xl mx-auto`. No multi-column layout regardless of viewport — this page is intentionally quiet.

### 8.2 Form card

- Container: `bg-surface rounded-xl2 shadow-soft border border-line p-6 sm:p-8`.
- **Hero:** centered block.
  - 56×56px circle, `bg-brand-warmSoft text-brand-warm`, with a heart SVG.
  - Title: Fraunces 600 `text-2xl sm:text-3xl` — "We value your heart."
  - Subtitle: muted — "Please share how the session impacted you."

### 8.3 Form fields

All three fields share the same pattern: a tiny uppercase label above, and a field with `bg-paper border border-line rounded-lg` that becomes `bg-surface border-brand-teal` on focus.

Labels: `text-[11px] font-bold text-muted uppercase tracking-wider`.

1. **Event select** — native `<select>` with a custom down-chevron icon absolutely positioned on the right. Options are filtered to events within the last 60 days plus upcoming, sorted by most recent first. Format: `"{Event name} — {formatted datetime}"`.

2. **Rating slider** — inside a `bg-paper border border-line rounded-lg p-4` container:
   - Flex row: "1" (muted) / `<input type="range" min=1 max=5>` (flex-grow) / "5" (muted) / live value display (`#rating-display`, Fraunces bold `text-xl text-brand-teal`, `w-6 text-right`).
   - Slider track: `h-2 bg-line rounded-full`. Thumb: `20×20px bg-brand-teal rounded-full` with a `0 1px 3px rgba(0,0,0,.15)` shadow. Styled explicitly for WebKit and Moz to stay consistent across browsers.
   - Default value: 5.

3. **Feedback textarea** — 4 rows, `max-length="2000"`, resize disabled, placeholder "I felt…".

### 8.4 Submit button

Full-width, `bg-brand-teal hover:bg-brand-tealDeep text-white font-semibold py-3.5 rounded-xl shadow-soft active:scale-[0.99]`. Label: "Submit feedback".

### 8.5 Result banner

Appears below the form after submit, role="status" aria-live="polite":

- Success: `bg-emerald-50 text-emerald-800` — "Thank you for sharing."
- Validation: `bg-amber-50 text-amber-800` — "Please select an event."
- Error: `bg-red-50 text-red-700` — "Sorry, something went wrong. Please try again."

All use `mt-4 text-center text-sm font-medium p-3 rounded-lg`.

---

## 9. Tab: Admin

### 9.1 Stat cards

A grid of three summary cards: 2 columns mobile, 3 columns sm+. Each card is `bg-surface border border-line rounded-xl2 p-5 shadow-soft`.

Structure per card:
- Label: `text-[11px] font-bold text-muted uppercase tracking-wider`
- Value: Fraunces 600 `text-3xl text-brand-teal mt-1`

Cards: **Responses**, **Avg rating** (one decimal, or `—` if no data), **Events**. On mobile the third spans both columns.

### 9.2 Recent feedback grid

Heading: "Recent feedback" — `text-xs font-bold text-muted uppercase tracking-wider mb-3`.

Grid: 1 column mobile, 2 columns sm+, `gap-3 sm:gap-4`.

Each feedback card is `bg-surface rounded-xl2 p-4 border border-line shadow-soft` and contains:

1. Top row (flex space-between): event name (uppercase bold muted) + date (muted, smaller).
2. Rating stars: `★★★★☆` style, `text-brand-gold text-base`. Filled/empty rendered via Unicode glyph repetition. Aria-label explicitly reads "{n} out of 5 stars" for screen readers.
3. Feedback text: `text-sm text-ink/80 leading-relaxed`, wrapped in curly quotes `&ldquo;…&rdquo;`. If empty, shows muted italic "No written comment" instead.

### 9.3 Empty state

Single centered line spanning both columns: "No feedback collected yet." in `text-muted text-sm`.

---

## 10. Create Event sheet

### 10.1 Behavior

A modal that slides up from the bottom on mobile and centers on desktop. Triggered by the header's "New Event" button (desktop pill or mobile circular). Dismissed via Cancel button, backdrop tap, or Escape key.

### 10.2 Structure

- Wrapper: `fixed inset-0 z-50`, hidden by default. Uses `.sheet-panel` / `.sheet-hidden` classes for transform-based entrance.
- Backdrop: `absolute inset-0 bg-ink/40 backdrop-blur-sm`, fades in.
- Panel: `bg-paper w-full sm:max-w-lg sm:rounded-xl2 rounded-t-xl2 shadow-lift overflow-hidden safe-pb`. Full-width on mobile (rounded top only); centered max-w-lg card on sm+ (fully rounded).

### 10.3 Sheet header bar

`px-5 py-4 bg-surface border-b border-line` with three regions:
- **Left:** "Cancel" — `text-brand-teal font-medium` text button.
- **Center:** "New Event" — Fraunces 600 `text-lg`.
- **Right:** "Add" — `text-brand-teal font-bold`. Starts at `opacity-40 pointer-events-none`. Becomes active only when both Name and Date fields are non-empty.

### 10.4 Form body

`p-5 space-y-4 max-h-[75vh] overflow-y-auto`. Three field groups, each in a `bg-surface border border-line rounded-xl` container:

1. **Name + Date** — two inputs stacked inside one container, separated by `divide-y divide-line`. Name is a text input (120 char max), Date is a `datetime-local` input.
2. **Description** — `<textarea>` (2000 char max, 4 rows, resize disabled).
3. **Registration URL** — text input, styled in `text-brand-teal` to suggest it's a link. URLs are sanitized on submit (must be http/https, otherwise stripped).

Below the form, a small note: `text-xs text-muted text-center px-4 leading-relaxed` — "Events appear immediately for all members. Please double-check details before submitting."

### 10.5 Validation

Live validation: as Name and Date are typed, the Add button's opacity and pointer-events update. No inline error states; invalid URLs are silently sanitized rather than blocking submission.

---

## 11. Generic modal

Used for event details (clicked from card or calendar day).

- Wrapper: `fixed inset-0 z-[70]`.
- Backdrop: `bg-ink/40 backdrop-blur-sm`, click to dismiss.
- Panel: `bg-surface rounded-xl2 p-6 w-full max-w-md shadow-lift`.
- **Header:** flex justify-between — title (Fraunces 600 `text-xl`) on the left, close button on the right. Close is `w-8 h-8 bg-paper hover:bg-line rounded-full text-muted` with a small × icon.
- **Body:** `text-ink/80 text-sm max-h-[60vh] overflow-y-auto`. Contents vary by caller.

**Day details body format:**
- Date label (eyebrow style, warm)
- Description paragraph, whitespace preserved
- If `signupUrl` present: a teal button labeled "Open registration ↗" below the description.

---

## 12. Toast

Transient confirmation for background actions (e.g., "Event added", "Could not add event").

- Position: `fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]`.
- Styling: `bg-ink text-paper px-4 py-2.5 rounded-full shadow-lift text-sm`.
- Duration: auto-dismisses after 2.4s.

---

## 13. Footer

- Border-top `border-line`, `bg-paper/60 mt-10 py-8`.
- Container matches main content max-width.
- Layout: flex, stacks on mobile, row on sm+, space-between.
- **Left:** copyright line — "© {year} Collective for Hope · Honoring grief together." in muted `text-xs`.
- **Right:** three text links — "Main site", "Official calendar", "Donate". All open the live collectiveforhope.org pages in new tabs. Muted by default, `hover:text-brand-teal`.

---

## 14. Accessibility

- All interactive elements reachable by keyboard. Focus-visible states use a 2px `brand.teal` outline with 2px offset and 6px radius.
- The header "New Event" button receives `aria-hidden` and `tabIndex=-1` when invisible on Calendar/Feedback tabs.
- Every input has an associated `<label>` with matching `for`/`id`.
- Modal and sheet wrappers carry `aria-modal="true"` and `role="dialog"`; the sheet is labelled by `aria-labelledby="sheet-title"`.
- Rating stars carry an `aria-label` describing the numeric rating.
- Status banner uses `role="status" aria-live="polite"`.
- `prefers-reduced-motion: reduce` disables all animations and transitions globally.
- Color contrast: all body text meets WCAG AA against its background; `ink` on `paper` reaches AAA for body sizes.

---

## 15. Data model (reference)

Two Firestore collections, both under `artifacts/{appId}/public/data/`:

**events**
```
{
  name: string (max 120),
  date: string (ISO datetime-local),
  description: string (max 2000),
  signupUrl: string | null  (http/https only, sanitized),
  createdBy: string (uid),
  createdAt: string (ISO),
  serverCreatedAt: Timestamp
}
```

**surveys**
```
{
  eventId: string (references events.id),
  userId: string (uid or 'anonymous'),
  rating: integer 1–5,
  feedback: string (max 2000),
  timestamp: string (ISO),
  createdAt: Timestamp
}
```

In **Demo mode** (empty `firebaseConfig`), both collections live in an in-memory `demoStore` object, seeded with three example events so the UI is never empty during preview.

---

## 16. Anti-patterns (what this design is NOT)

Avoid these tendencies when extending the UI:

- **No pure white backgrounds.** The page background is cream (`paper`), not `#FFF`. True white is reserved for card surfaces as contrast.
- **No saturated accent colors.** The warm hue is a dusty terracotta, not red or orange. The teal is deep and gray-leaning, not tropical.
- **No emoji in UI chrome.** Icons are SVG line drawings at 1.6–2.2 stroke width.
- **No gradients except the 4px top brand bar and the two ambient radial washes.** Buttons, cards, and headings are flat fills.
- **No drop shadows darker than the ink-tinted soft/lift set.** Never `shadow-xl` or `shadow-2xl` from Tailwind defaults — they read as generic.
- **No heavy borders.** Borders are always 1px and always `line` color, never darker.
- **No sentence-case labels for eyebrows and metadata.** Uppercase with wide tracking is the signature.
- **No loading skeletons.** A small centered spinner is the established pattern; skeletons would feel too "app-like" for this tone.
- **No congratulatory copy.** The tone is quiet and warm: "Thank you for sharing", not "Awesome!" or "Great job!".

---

## 17. File structure

The entire application is a single `index.html` file containing HTML, a Tailwind config block, a `<style>` block for custom CSS, and a single `<script type="module">` for logic. Firebase is loaded via CDN ES modules. There is no build step. If the project later migrates to a framework, this specification should translate component-by-component: Header, ConnectionStrip, EventsGrid, EventCard, CalendarPanel, MonthList, FeedbackForm, AdminDashboard, CreateEventSheet, Modal, Toast, Footer.
