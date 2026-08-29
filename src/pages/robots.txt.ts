import type { APIContext } from "astro";

// Generated rather than static so the Sitemap line follows `site`/`base` — the
// preview build lives on a different origin than production.
export function GET(context: APIContext) {
	const site = context.site ?? new URL("https://www.stuckbetweenpixels.com");
	const sitemap = new URL(
		`${import.meta.env.BASE_URL.replace(/\/$/, "")}/sitemap-index.xml`,
		site,
	).href;

	return new Response(
		`User-agent: *
Allow: /
Disallow: ${import.meta.env.BASE_URL.replace(/\/$/, "")}/design-system

Sitemap: ${sitemap}
`,
		{ headers: { "Content-Type": "text/plain; charset=utf-8" } },
	);
}
