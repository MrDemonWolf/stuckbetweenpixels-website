# Stuck Between Pixels

Official website for the [Stuck Between Pixels](https://stuckbetweenpixels.com)
podcast. Static Astro site, episodes pulled from the Spotify for Creators RSS
feed at build time. Deployed to Cloudflare Pages.

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

Set `SHOW_DEMO_EPISODES` as a Cloudflare Pages build environment variable to
control what deploys.

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
2. Set the same value as a build environment variable named
   `PODCAST_RSS_URL` in the Cloudflare Pages project (Settings → Environment
   variables). That is where the build reads it from.
3. Optionally set `PODCAST_SPOTIFY_URL` / `PODCAST_APPLE_URL` for the
   subscribe links, the same way.
4. Optionally set `PUBLIC_GA_ID` (a Google Analytics measurement ID) to load
   `gtag.js`. Leave unset to skip analytics entirely — see `/legal`.

## Deploy

Hosted on **Cloudflare Pages** with its Git integration. Every push to `main`
builds and deploys; every pull request gets its own preview deployment at a
`*.pages.dev` URL, served from the root path.

There is no deploy step in CI. `.github/workflows/ci.yml` only type-checks and
builds (to fail fast on a broken commit), and runs the nightly rebuild.

### Nightly rebuild

Cloudflare's Git integration builds on push, not on a schedule. Once the site
reads from the real RSS feed it will need a daily rebuild, so a newly published
episode appears without anyone pushing.

**This is not set up yet, deliberately.** While `PODCAST_RSS_URL` is unset the
episode list comes from a checked-in JSON file, so a nightly rebuild would
regenerate identical output and spend build minutes for nothing. The `nightly`
job in `ci.yml` no-ops until the secret exists.

Turn it on at the same time you point the site at the real feed: create a deploy
hook in the Pages project (Settings → Builds → Add deploy hook, branch `main`)
and store its URL as the GitHub secret `CLOUDFLARE_DEPLOY_HOOK`. Trigger it by
hand with "Run workflow" on the CI workflow.

### Build settings

| Setting | Value |
|---|---|
| Build command | `bun run build` |
| Output directory | `dist` |
| Production branch | `main` |

**Build environment variables live in the Cloudflare Pages dashboard**, not in
GitHub. Set `NODE_VERSION=22` (Astro 7 requires >=22.12), plus whichever of
`PODCAST_RSS_URL`, `PODCAST_SPOTIFY_URL`, `PODCAST_APPLE_URL`, `PUBLIC_GA_ID`
and `SHOW_DEMO_EPISODES` apply. Missing them doesn't fail the build; the site
just quietly loses analytics or falls back to sample episodes.

### Redirects and headers

`public/_redirects` and `public/_headers` are Cloudflare Pages features, copied
verbatim into `dist/` at build time. `_redirects` holds the `/privacy` → `/legal`
301; `_headers` marks `*.pages.dev` previews `noindex` so they don't compete
with the real domain in search, and sets immutable caching on `/_astro/*`.

### Domains

The **apex** `stuckbetweenpixels.com` is canonical — it is what `site` in
`astro.config.mjs` declares, and therefore what every canonical tag, OG URL and
the sitemap use. `www` is added as a second custom domain and redirects to the
apex. The zone is already on Cloudflare, so adding the custom domains in the
Pages project sets the DNS records for you.

There is no `base` path and no `public/CNAME`; both were GitHub Pages
workarounds and are gone.
