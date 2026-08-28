// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://stuckbetweenpixels.com",
	output: "static",
	redirects: {
		"/privacy": "/legal",
	},
	integrations: [
		sitemap({ filter: (page) => !page.includes("/design-system") }),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
