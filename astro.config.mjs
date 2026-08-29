// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	// Apex is canonical; Cloudflare redirects www to it. Every canonical/OG URL
	// and the sitemap are derived from this.
	site: "https://www.stuckbetweenpixels.com",
	output: "static",
	// No `base`: Cloudflare Pages serves previews at the root of
	// <branch>.<project>.pages.dev, so nothing is ever under a subpath.
	// /privacy -> /legal now lives in public/_redirects as a real 301 instead of
	// the meta-refresh page Astro emits for static `redirects`.
	integrations: [
		sitemap({
			filter: (page) =>
				!page.includes("/design-system") && !page.includes("/og-template"),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
