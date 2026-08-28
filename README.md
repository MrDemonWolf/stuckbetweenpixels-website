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
- New entries sort by `pubDate` automatically (`sortByDateDesc` in
  `src/lib/episodes.ts`) — no manual ordering.

Once `PODCAST_RSS_URL` is set (see below), the feed takes over and this file
stops being read.

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

## Custom domain cutover

`public/CNAME` already points at `stuckbetweenpixels.com`. To go live:

1. DNS (apex `A` records) → `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153`
   (`AAAA` → `2606:50c0:8000::153` … `2606:50c0:8003::153`)
2. `www` → `CNAME` → `<github-username>.github.io`
3. If DNS is on Cloudflare: set those records to **DNS only** (grey cloud)
   until GitHub issues the certificate, then you can re-enable the proxy.
4. Old WordPress site can come down once this is verified live.
