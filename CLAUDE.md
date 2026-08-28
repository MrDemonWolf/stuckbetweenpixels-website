# Stuck Between Pixels — project notes

Static Astro site. See `README.md` for full setup, `DESIGN.md` for design tokens.

## Dev server

```bash
bun run dev
```

Runs at `http://localhost:4321`. Launch with `run_in_background: true` — it's a
long-running process, not a one-shot command. No `PODCAST_RSS_URL` needed; the
site builds from `src/data/episodes.sample.json` until the podcast feed is live.

Other scripts: `bun run build`, `bun run preview` (serves the built `dist/`),
`bun run check` (biome lint + format, `--write` applied).
