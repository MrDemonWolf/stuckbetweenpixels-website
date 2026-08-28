# Stuck Between Pixels — Design System

Direction: **late-night broadcast**. Warm ember on charcoal, heavy condensed
display type set like a broadcast lower-third, mono for anything that's data.
Studio-at-midnight, not minimal-blog. The earlier "editorial zine meets terminal"
direction (Fraunces / Work Sans / IBM Plex Mono, purple + cream) is retired.

Live preview: `/design-system`. If a token here and that page ever disagree,
the page is stale — fix it, don't trust memory of what it used to show.

## Color

Dark-first — this is a night show. Both schemes are AA-checked; the ratios below
were measured, not estimated.

| Token | Dark | Light | Use | Contrast on `bg` |
|---|---|---|---|---|
| `--color-bg` | `#0E0B0A` | `#FAF6EF` | page background | — |
| `--color-surface` | `#1A1512` | `#FFFFFF` | cards, ink bands, footer | — |
| `--color-border` | `#2E2621` | `#E3DACD` | **decorative dividers only** | 1.3:1 — see rule 2 |
| `--color-border-strong` | `#786658` | `#8A7A66` | real input borders, outlined numerals | 3.6:1 / 3.9:1 ✅ |
| `--color-fg` | `#F5EFE6` | `#17120F` | body text | 17.2:1 ✅ |
| `--color-fg-muted` | `#B0A69C` | `#5C534B` | secondary text, metadata | 8.2:1 / 7.0:1 ✅ |
| `--color-ember` | `#FF5C29` | `#C43D14` | brand: links, kickers, fills, focus ring | 6.4:1 / 4.8:1 ✅ |
| `--color-amber` | `#F5A524` | `#8A5A00` | secondary accent, glitch pixels in the mark | 9.6:1 / 5.5:1 ✅ |
| `--color-on-ember` | `#0E0B0A` | `#FAF6EF` | text/icons on an ember or amber fill | 6.4:1 / 4.8:1 ✅ |
| `--color-danger` | `#FF8A8A` | `#B3261E` | error states only | 8.6:1 / 6.1:1 ✅ |

Two rules, both forced by the measurements:

1. **Text on an ember or amber fill is always `--color-on-ember` — and that
   token flips.** Ember is *bright* on dark (`#FF5C29`) but *dark* on light
   (`#C43D14`), so the text on it must invert too: ink on dark (6.36:1), bone on
   light (4.84:1). Hardcoding either one fails AA in the other scheme — ink on
   light-mode ember is only 3.76:1. Never put `text-fg` on an ember fill.
2. **`--color-border` is decorative only.** No warm-dark border reaches the 3:1
   that WCAG 1.4.11 wants for interactive boundaries without washing out to grey.
   So the **focus ring is ember** (6.36:1, set globally on `:focus-visible` in
   `global.css`), and real inputs use `--color-border-strong`.

Theming machinery: `@theme` maps `--color-*` to `--sbp-*` indirection variables,
and only those flip — a plain `@theme` block can't be conditional in Tailwind v4.
Follows `prefers-color-scheme` by default; the header toggle writes
`localStorage["sbp-theme"]` and `<html data-theme>`, resolved before first paint
by an inline script in `Layout.astro`. `dark:` is rebound via `@custom-variant`
to match `[data-theme="dark"]`, so it agrees with the toggle rather than the OS.

## Type

Three roles, one variable font each.

- **Display — Archivo Variable** (`@fontsource-variable/archivo/wdth.css`). The
  `wdth` axis (62–125) is why this build is imported: `.display` uses
  `font-stretch: 125%` + `font-weight: 800`, leading `0.95`, tracking `-0.02em`,
  uppercase. This is the whole look — **only ever use it large.**
  `.display-tight` is the same face at `font-stretch: 100%` and mixed case, for
  headlines that would otherwise wrap badly (episode titles, host names).
- **Body — Instrument Sans Variable**, 400/500.
- **Metadata — JetBrains Mono Variable** via `.kicker` (uppercase, 0.16em
  tracking, 0.75rem, 600): dates, durations, episode numbers, nav, tags, buttons.
  Replaces the old `.eyebrow`.
- Scale: `--text-display: clamp(2.75rem, 6.5vw, 5.25rem)` for page headlines,
  `--text-section: 2.5rem` for section headings. Body 1rem/1.125rem.

Editorial pattern: a mono **kicker** sits above a large display **heading**.
`Section.astro` renders that pairing so it stays consistent.

## Layout

`Section.astro` owns page rhythm — sections are not hand-rolled `max-w-3xl py-16`
copies. Props:

- `variant`: `paper` (default) or `ink` (full-bleed `--color-surface` band with
  top/bottom rules). Alternating them is what breaks the page into movements and
  is the main fix for the old one-width-all-the-way-down layout.
- `width`: `prose` (2xl) / `wide` (5xl, default) / `full`.
- `kicker` + `heading` render the editorial pairing above the slot.

Grid-breaking is deliberate and used sparingly: the hero image bleeds off the
right viewport edge, and `FeaturedEpisode`'s outlined `EP.NN` numeral hangs
outside its artwork column.

## Texture

A CSS-only grain sits behind every page (`body::before`, inline `feTurbulence`
data URI). Blend mode and opacity flip per scheme via `--sbp-grain-*` —
`overlay` at 0.45 on dark, `multiply` at 0.30 on light, because `overlay`
inverts visually on a light base. This is the one atmosphere element; don't
stack more on top of it.

## Space & shape

- Standard Tailwind 4px scale — don't reinvent it.
- Corners: `rounded-full` for pills/buttons, `rounded-xl` for thumbnails,
  `rounded-2xl` for cards and artwork.
- One elevation: `--shadow-card`.

## Motion

- Transitions ≤300ms, `ease-out` / `cubic-bezier(0.16, 1, 0.3, 1)`.
- `.reveal` + an `IntersectionObserver` in `Layout.astro` fades sections in on
  scroll, staggered by sibling index. The hidden state is scoped to `.js`
  (added by the inline head script) so **with JavaScript disabled the content is
  simply visible** rather than stuck at `opacity: 0`.
- `.on-air-dot` pulses in the hero kicker.
- Everything is neutralised by the global `prefers-reduced-motion` reset.

## Voice

Direct, a little wry, never corporate-marketing ("unlock expert insights",
"actionable strategies" — the old WordPress copy — is the tone to avoid).
Episode titles and descriptions come verbatim from the feed; only hand-written
copy (hero, about, host bios) needs to hit this tone.

## Components (see `/design-system` for live states)

- **Section** — page rhythm primitive; see Layout above.
- **Hero** — `● ON AIR` kicker, `.display` headline, CTA + host avatars, stats
  strip, subscribe row. Image bleeds off the right edge.
- **StatsStrip** — mono episode count / runtime / hosts / cadence, hairline
  separated. Runtime sums `itunes.duration` and hides below one hour.
- **FeaturedEpisode** — the centrepiece. Large artwork, outlined `EP.NN` numeral
  breaking the grid, tag chips, ink-on-ember play button. `flip` reverses the
  columns so "Latest" and "Start here" don't mirror each other.
- **EpisodeCard** — editorial row: outlined numeral, artwork with hover play
  overlay, `.display-tight` title, mono date/duration, tag chips, bottom rule.
  The title carries a stretched link so the whole row is clickable without
  nesting the play button inside an anchor.
- **StickyPlayer** — fixed bottom bar, `transition:persist` so one `<audio>`
  survives navigation. Any `[data-play-episode]` element starts it.
- **HostStrip** — compact host row linking to `/about#<slug>`.
- **SubscribeRow** — mono pills with platform glyphs.
- **Header** — sticky, blurred. The mark's linework is ink on paper and bone on
  charcoal, so both variants ship and swap with `dark:` rather than letting one
  vanish. A single fixed-colour logo that assumes a background is the bug to
  watch for here.
- **Footer** — brand block + nav columns + subscribe on a surface band. Carries
  extra bottom padding so the StickyPlayer can't cover the last row.

## Brand mark

`logo-mark.svg` (ink linework, for light backgrounds) and `logo-mark-dark.svg`
(bone linework, for dark) are layered vector — one path per colour — traced from
the source art with potrace. Recolouring is a value swap, not a re-trace.
Palette: ink or bone linework, `#FF5C29` body, `#F5A524` glitch pixels.
