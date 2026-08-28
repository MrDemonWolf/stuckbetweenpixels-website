// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Preview deploys (GitHub Pages project URL) live under a subpath and must not
// claim the production domain, which still serves the old WordPress site. Set
// PREVIEW_DEPLOY=1 for that; leave it unset for the real cutover build.
// See "Deploy" in README.md.
const isPreview = process.env.PREVIEW_DEPLOY === "1";

// https://astro.build/config
export default defineConfig({
	site: isPreview
		? "https://mrdemonwolf.github.io"
		: "https://stuckbetweenpixels.com",
	base: isPreview ? "/stuckbetweenpixels-website" : undefined,
	output: "static",
	redirects: {
		"/privacy": "/legal",
	},
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
