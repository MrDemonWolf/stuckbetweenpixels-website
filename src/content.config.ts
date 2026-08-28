import { defineCollection } from "astro:content";
import { feedLoader } from "@ascorbic/feed-loader";
import { file } from "astro/loaders";

const rssUrl = import.meta.env.PODCAST_RSS_URL;

// ponytail: show isn't published yet — sample data keeps every page rendering
// until PODCAST_RSS_URL exists. Set it in .env / repo variables when it does.
export const collections = {
	episodes: defineCollection({
		loader: rssUrl
			? feedLoader({ url: rssUrl })
			: file("src/data/episodes.sample.json"),
	}),
};
