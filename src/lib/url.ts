/**
 * Prefix an internal path with Astro's configured `base`.
 *
 * Currently a no-op: Cloudflare Pages serves both production and preview
 * deployments from the root, so `base` is unset and `BASE_URL` is always "/".
 * It is kept because Astro does not rewrite hardcoded `href="/..."` values, so
 * if a subpath deployment is ever needed again this is the single place that
 * has to change rather than ~15 call sites. Prefer it for new internal links.
 */
export function url(path: string) {
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	return `${base}/${path.replace(/^\//, "")}`;
}
