/**
 * Prefix an internal path with Astro's configured `base`.
 *
 * Astro does not rewrite hardcoded `href="/..."` values, so every internal link
 * and public-asset reference has to go through this — otherwise the preview
 * build under /stuckbetweenpixels-website/ 404s on every link. On the
 * production build BASE_URL is "/" and this is a no-op.
 */
export function url(path: string) {
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	return `${base}/${path.replace(/^\//, "")}`;
}
