# Stuck Between Pixels — Design System

Source of truth is the existing brand mark (`assets/brand/logo-text-brand.svg`):
a purple mic-on-monitor icon + wordmark, flat illustrated style, friendly not
corporate. Direction: **editorial zine meets terminal** — a warm serif for
voice and personality, a monospace for metadata (dates, durations, episode
numbers), tying the "pixels" in the name to something more textured than a
literal CRT/pixel-art treatment (that earlier direction is dropped).

Live preview: `/design-system` route. If a token here and that page ever disagree,
the page is stale — fix it, don't trust memory of what it used to show.

## Color

Sampled directly from the wordmark SVG (`#412871`, the most frequent fill), then
built out into a dark-first, warm-toned palette (dark base leans purple-black,
light base leans warm paper rather than clinical white — both pair with the
serif/mono type below better than a cool grey would).

| Token | Dark | Light | Use | Contrast |
|---|---|---|---|---|
| `--color-bg` | `#120c1f` | `#f7f1e6` | page background | — |
| `--color-surface` | `#1c1430` | `#fffdf8` | cards | — |
| `--color-border` | `#382d54` | `#e1d5c0` | 1px hairlines | — |
| `--color-fg` | `#f3efe4` | `#1c1430` | body text | ≥14:1 on `--color-bg` ✅ |
| `--color-fg-muted` | `#b3a8cc` | `#665c7a` | secondary text, captions | ≥6.5:1 on `--color-bg` ✅ |
| `--color-brand` | `#a68af0` | `#412871` | links, icons, small accents | ≥5:1 on `--color-bg` ✅ |
| `--color-brand-strong` | `#412871` | `#412871` | large fills only (hero panel behind the host illustration) — text on it uses `--color-on-brand`, never `--color-fg` (that one flips with the scheme and would fail against a fixed-purple fill) | 1.9:1 — fill only |
| `--color-on-brand` / `-muted` | `#f3efe4` / `#cabfe6` | same | text/icons sitting on `--color-brand-strong` — fixed, does not flip with color scheme | ≥6:1 on `--color-brand-strong` ✅ |
| `--color-accent` | `#e8a33d` | `#b5701a` | eyebrow labels, hover states, the underline squiggle | ≥4.6:1 on `--color-bg` ✅ |
| `--color-danger` | `#ef7e8f` | `#b23a4c` | error states only | ≥4.5:1 on `--color-bg` ✅ |

Follows `prefers-color-scheme` by default; a sun/moon toggle in the header
(`ThemeToggle.astro`) lets a visitor override it explicitly. The choice is
stored in `localStorage["sbp-theme"]` and written to `<html data-theme="…">`
by an inline no-flash script in `Layout.astro`'s `<head>` (runs before first
paint). Tailwind's `dark:` variant is redefined in `global.css` via
`@custom-variant dark` to match on `[data-theme="dark"]` rather than the media
query, so it agrees with the toggle instead of only the OS.

The actual color values live one level of indirection down: `@theme` maps
Tailwind's `--color-*` names to `--sbp-*` variables, and only the `--sbp-*`
values flip — a plain `@theme` block can't itself be conditional in Tailwind
v4. The paper grain's blend mode/opacity (`--sbp-grain-blend`,
`--sbp-grain-opacity`) flip the same way — `overlay` inverts visually on a
light base, so light mode uses `multiply` at lower opacity instead.

Rule: `--color-brand-strong` is a **fill color**, never a text color.

## Type

Two-face pairing, deliberately not the Inter/Space-Grotesk default: a warm
variable serif carries voice and personality, a monospace marks anything that's
data (dates, durations, episode numbers) — literal nod to "pixels" without
going full retro-CRT.

- **Display: Fraunces Variable** (`@fontsource-variable/fraunces`) — high-contrast,
  a little eccentric, has a real italic. Headlines use `font-medium`; the
  wordplay word in the hero uses the italic. `font-display: swap`.
- **Metadata/eyebrow: IBM Plex Mono** (`@fontsource/ibm-plex-mono`, 500/600) — the
  `.eyebrow` utility class (uppercase, tracked-out, 0.75rem) used for nav, dates,
  durations, episode numbers (`EP.03`), and footer text.
- **Body: Work Sans** (`@fontsource/work-sans`, 400/500) — humanist, reads well
  at length, doesn't compete with the serif.
- Scale (rem, 1rem=16px): `--text-xs .75` `--text-sm .875` `--text-base 1`
  `--text-lg 1.125` `--text-xl 1.5` `--text-2xl 2` `--text-3xl 3` `--text-4xl 4`.
- Line-height: ~1.05–1.2 for display headings, 1.6 for body copy.

## Texture

A subtle CSS-only paper/film grain sits behind every page (`body::before`, an
inline SVG `feTurbulence` data URI, `mix-blend-mode: overlay`, `opacity: 0.5`,
`z-index: 0`) — page content sits in `#page` at `z-index: 1` above it. No image
asset, no added weight. This is the one "atmosphere" element; don't stack more
texture on top of it.

## Space & shape

- 4px base unit: `--space-1 .25rem` … `--space-16 4rem` (standard Tailwind scale,
  don't reinvent it).
- Corners: `--radius-sm .375rem` (buttons, badges), `--radius-lg 1rem` (cards,
  matching the rounded-rect monitor in the mark). No fully-square edges — that
  was the old pixel-retro call, dropped.
- Shadow: one soft elevation, `--shadow-card: 0 8px 24px -8px rgb(15 10 26 / 0.4)`.

## Motion

- Transitions ≤200ms, `ease-out`.
- Everything wrapped in `@media (prefers-reduced-motion: reduce) { transition: none }`.
- No CRT/scanline decoration — dropped with the pixel-retro direction.

## Voice

Direct, a little wry, never corporate-marketing ("unlock expert insights",
"actionable strategies" — the old WordPress copy — is the tone to avoid). Episode
titles and descriptions come verbatim from the RSS feed; only hand-written copy
(hero, about, host bios) needs to hit this tone.

## Components (see `/design-system` for live states)

- **EpisodeCard** — editorial row, not a boxed card: `EP.03` in mono on the left,
  Fraunces title + eyebrow date/duration + description on the right, bottom
  hairline divider. Used identically on the homepage's "Latest episodes" and the
  full `/episodes` archive.
- **SubscribeRow** — pill-shaped mono links (Spotify, Apple Podcasts, RSS),
  border → accent-color border+text on hover.
- **Player** — Spotify iframe embed when an episode ID exists; plain `<audio>`
  fallback otherwise. Bordered container matching the surface color.
- **Hero** — asymmetric two-column split (not a full-bleed banner): serif
  headline + italic accent phrase with a hand-drawn SVG underline on the left,
  the host illustration (`assets/brand/hero-podcast-hosts.png`) sitting on a
  rounded `--color-brand-strong` panel on the right. Both sides fade/rise in on
  load (`prefers-reduced-motion` respected).
- **Header logo** — the brand wordmark SVG is a fixed color (`logo-text-brand.svg`
  purple / `logo-text-white.svg` white); the header itself flips with the color
  scheme, so both are rendered and toggled with `dark:hidden` / `dark:block`
  rather than picking one. A single fixed-color logo image that assumes a
  particular background is the bug to watch for here.
- **ThemeToggle** — sun/moon icon button in the header nav, `dark:hidden` /
  `dark:block` swap like the logo. Persists an explicit choice to
  `localStorage["sbp-theme"]`; with no stored choice it keeps following the OS
  live via a `matchMedia` change listener.
- **StickyPlayer** — fixed bottom bar, `transition:persist` so the single
  `<audio>` element survives `astro:transitions` navigation. Any element with
  `data-play-episode` + `data-episode-id`/`data-title`/`data-audio-url`
  (optionally `data-artwork`) on any page starts it — used by `EpisodeCard`,
  `FeaturedEpisode`, and the episode detail page. Scrubber renders a
  deterministic pixel-bar "waveform" from `lib/waveform.ts` (hash of the
  episode id — no audio analysis, no extra request).
- **FeaturedEpisode** — home page "latest episode" block: artwork on an offset
  `--color-brand-strong` panel echoing the Hero treatment, an oversized
  outlined `EP.NN` numeral, primary play button wired to StickyPlayer.
- **HostStrip** — compact host row (photo, name, role) pulling from the shared
  `src/data/hosts.ts`, used on the home page and each episode detail page;
  `about.astro` uses the same data for its fuller host cards.
