# Stuck Between Pixels

Official website for the [Stuck Between Pixels](https://stuckbetweenpixels.com)
podcast. Static Astro site, episodes pulled from the Spotify for Creators RSS
feed at build time. Deployed to GitHub Pages.

See `DESIGN.md` for the design system, and `/design-system` (in dev or a
deployed build) for a live token preview.

## Develop

```bash
bun install
bun run dev
```

Without `PODCAST_RSS_URL` set, the site builds from
`src/data/episodes.sample.json` — every page still renders, with placeholder
episodes.

## Add an episode manually

Before `PODCAST_RSS_URL` is set, episodes come from
`src/data/episodes.sample.json` — edit that file directly, no rebuild tooling
needed. Copy an existing entry and fill in:

```json
{
  "id": "ep-04",
  "title": "Episode title",
  "pubDate": "2026-09-01T13:00:00.000Z",
  "description": "Show notes / description.",
  "link": "https://open.spotify.com",
  "image": "/episodes/ep-04.jpg",
  "tags": ["Web Dev", "Business"],
  "enclosure": { "url": "", "type": "audio/mpeg" },
  "itunes": { "duration": "35:00", "episode": 4 }
}
```

- **Artwork**: drop the image file in `public/episodes/` (e.g.
  `public/episodes/ep-04.jpg`) and point `image` at `/episodes/ep-04.jpg`.
  Square, ideally ≥600px. Omit `image` entirely and the site falls back to
  the site mark — nothing breaks either way.
- **`enclosure.url`**: leave it `""` until you have a direct MP3 link — the
  episode page falls back to "Listen on Spotify" and the sticky/hover play
  buttons just don't render.
- **`tags`**: optional topic chips, also used by the filter row on `/episodes`.
  When the real feed takes over these come from its `categories` instead.
- **`"startHere": true`**: marks the curated entry-point episode shown in the
  "New here? Start with this" block on the homepage. Set it on exactly one
  episode; with none set it falls back to the oldest.
- New entries sort by `pubDate` automatically (`sortByDateDesc` in
  `src/lib/episodes.ts`) — no manual ordering.

Once `PODCAST_RSS_URL` is set (see below), the feed takes over and this file
stops being read.

## Demo episodes vs "coming soon"

Placeholder episodes are on by default so a fresh clone renders something. To
show the pre-launch state instead, build with:

```bash
SHOW_DEMO_EPISODES=false bun run build
```

The collection then loads `src/data/episodes.empty.json`, and the homepage and
`/episodes` both fall back to the `ComingSoon` block. Setting `PODCAST_RSS_URL`
overrides this entirely: the real feed always wins.

Set `SHOW_DEMO_EPISODES` as a repo variable to control what deploys.

## Apple Podcasts badge

The subscribe row uses a generic microphone glyph for the Apple link, not
Apple's mark. Apple's identity guidelines require their supplied badge artwork
and forbid drawing your own. To use the real badge, download it from
<https://marketing.services.apple/apple-podcasts-identity-guidelines> and swap
it into `SubscribeRow.astro`. Note the official asset is a full "Listen on
Apple Podcasts" lockup, so it needs its own treatment rather than dropping into
the existing pill row.

## Social share image

`src/assets/brand/default-social-share.jpg` is generated from the `/og-template`
route so the card uses the real brand fonts. To regenerate: run the dev server,
open `/og-template`, screenshot the `#og-card` element, and save it over that
file at 1200x630. The route is noindexed and excluded from the sitemap.

## Point it at the real podcast feed

Once the show is live on Spotify for Creators:

1. Copy `.env.example` to `.env`, set `PODCAST_RSS_URL` to the show's RSS URL
   (Spotify for Creators → Settings → Distribution → RSS feed).
2. Set the same value as a **repo variable** (Settings → Secrets and
   variables → Actions → Variables) named `PODCAST_RSS_URL` — the deploy
   workflow reads it from there. It's a variable, not a secret: the feed is
   public.
3. Optionally set `PODCAST_SPOTIFY_URL` / `PODCAST_APPLE_URL` for the
   subscribe links, the same way.
4. Optionally set `PUBLIC_GA_ID` (a Google Analytics measurement ID) to load
   `gtag.js`. Leave unset to skip analytics entirely — see `/legal`.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and deploys via GitHub
Pages. Also runs daily (cron) so a new episode shows up without a manual push,
and can be triggered manually from the Actions tab.

Repo Settings → Pages → Source must be **GitHub Actions** (one-time setup).

## Preview vs production builds

`stuckbetweenpixels.com` still serves the old WordPress site, so deploys
currently go to the GitHub Pages **project URL**:

<https://mrdemonwolf.github.io/stuckbetweenpixels-website/>

That build sets `PREVIEW_DEPLOY=1`, which switches `astro.config.mjs` to a
`base` of `/stuckbetweenpixels-website` and drops `public/CNAME` so GitHub
doesn't claim the production domain. Every internal link goes through
`url()` in `src/lib/url.ts` so both modes work — use it for any new
hardcoded `/path` link or `public/` asset reference.

Build either mode locally:

```bash
bun run build                    # production (stuckbetweenpixels.com)
PREVIEW_DEPLOY=1 bun run build   # project-URL preview
```

## Custom domain cutover

`public/CNAME` already points at `stuckbetweenpixels.com`. To go live:

0. Set `PREVIEW_DEPLOY: "0"` in `.github/workflows/deploy.yml` — that restores
   the production `site`, drops the `base`, and stops the workflow deleting
   `public/CNAME`.
1. DNS (apex `A` records) → `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153`
   (`AAAA` → `2606:50c0:8000::153` … `2606:50c0:8003::153`)
2. `www` → `CNAME` → `<github-username>.github.io`
3. If DNS is on Cloudflare: set those records to **DNS only** (grey cloud)
   until GitHub issues the certificate, then you can re-enable the proxy.
4. Old WordPress site can come down once this is verified live.
