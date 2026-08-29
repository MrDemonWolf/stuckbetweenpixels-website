import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { slugFor, sortByDateDesc } from "../lib/episodes";

// ponytail: this mirrors the show's episodes for the website's own feed readers.
// The canonical podcast feed is still the host's (PODCAST_RSS_URL) — this one is
// not what you submit to Apple/Spotify.
export async function GET(context: APIContext) {
	const episodes = sortByDateDesc(await getCollection("episodes"));

	return rss({
		title: "Stuck Between Pixels",
		description:
			"A podcast about web development, DevOps, AI, business development, and professional networking in tech.",
		site: context.site ?? "https://stuckbetweenpixels.com",
		items: episodes.map((entry) => {
			const data = entry.data as Record<string, unknown>;
			return {
				title: data.title as string,
				description: data.description as string,
				pubDate: new Date(data.pubDate as string),
				link: `/episodes/${slugFor(entry)}/`,
			};
		}),
	});
}
