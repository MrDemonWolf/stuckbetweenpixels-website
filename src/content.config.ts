import { defineCollection } from "astro:content";
import { feedLoader } from "@ascorbic/feed-loader";
import { file } from "astro/loaders";

const rssUrl = import.meta.env.PODCAST_RSS_URL;

// Placeholder episodes are opt-in. With no feed and demo content off, the
// collection is empty on purpose and every surface falls back to its
// "coming soon" state — see SHOW_DEMO_EPISODES in README.md.
// Defaults to on so a fresh clone still renders something.
const showDemo = import.meta.env.SHOW_DEMO_EPISODES !== "false";

function loader() {
	if (rssUrl) return feedLoader({ url: rssUrl });
	return file(
		showDemo ? "src/data/episodes.sample.json" : "src/data/episodes.empty.json",
	);
}

export const collections = {
	episodes: defineCollection({ loader: loader() }),
};
