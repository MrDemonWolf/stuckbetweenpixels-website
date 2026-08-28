import type { CollectionEntry } from "astro:content";
import { url } from "./url";

/** Feed items and the sample JSON both have unstable/URL-ish ids — make a safe route slug. */
export function slugFor(entry: CollectionEntry<"episodes">) {
	return encodeURIComponent(entry.id);
}

export function sortByDateDesc(entries: CollectionEntry<"episodes">[]) {
	return [...entries].sort((a, b) => {
		const dateA = new Date(a.data.pubDate ?? 0).getTime();
		const dateB = new Date(b.data.pubDate ?? 0).getTime();
		return dateB - dateA;
	});
}

export function formatDate(pubDate: unknown) {
	if (!pubDate) return "";
	return new Date(pubDate as string).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

type EpisodeData = Record<string, unknown>;

function itunes(data: EpisodeData) {
	return data.itunes as Record<string, unknown> | undefined;
}

export function durationFor(entry: CollectionEntry<"episodes">) {
	return itunes(entry.data as EpisodeData)?.duration as string | undefined;
}

export function episodeNumberFor(entry: CollectionEntry<"episodes">) {
	return itunes(entry.data as EpisodeData)?.episode as number | undefined;
}

/** True once real episode art exists — callers use this to style the fallback differently. */
export function hasArtworkFor(entry: CollectionEntry<"episodes">) {
	return Boolean((entry.data as EpisodeData).image);
}

/** Falls back to the site mark so cards/players never render a broken image. */
export function artworkFor(entry: CollectionEntry<"episodes">) {
	const data = entry.data as EpisodeData;
	return url((data.image as string | undefined) ?? "/favicon.png");
}

export function audioUrlFor(entry: CollectionEntry<"episodes">) {
	const data = entry.data as EpisodeData;
	const enclosure = data.enclosure as Record<string, unknown> | undefined;
	const url = enclosure?.url as string | undefined;
	return url && url.length > 0 ? url : undefined;
}

export { waveformHeights } from "./waveform";
