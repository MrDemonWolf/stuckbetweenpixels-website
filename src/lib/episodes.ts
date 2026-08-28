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

/** Sample JSON uses `tags`; RSS feeds expose the same idea as `categories`. */
export function tagsFor(entry: CollectionEntry<"episodes">) {
	const data = entry.data as EpisodeData;
	const raw = (data.tags ?? data.categories) as unknown;
	if (!Array.isArray(raw)) return [];
	return raw
		.map((t) => (typeof t === "string" ? t : (t as EpisodeData)?.term))
		.filter((t): t is string => typeof t === "string" && t.length > 0);
}

export function allTags(entries: CollectionEntry<"episodes">[]) {
	return [...new Set(entries.flatMap(tagsFor))].sort();
}

/** Curated entry point for new listeners — falls back to the oldest episode. */
export function startHereFor(entries: CollectionEntry<"episodes">[]) {
	const flagged = entries.find(
		(e) => (e.data as EpisodeData).startHere === true,
	);
	if (flagged) return flagged;
	return sortByDateDesc(entries).at(-1);
}

export function yearFor(entry: CollectionEntry<"episodes">) {
	const pubDate = (entry.data as EpisodeData).pubDate;
	return pubDate ? new Date(pubDate as string).getFullYear() : 0;
}

/** Newest-first year buckets for the editorial archive. */
export function groupByYear(entries: CollectionEntry<"episodes">[]) {
	const byYear = new Map<number, CollectionEntry<"episodes">[]>();
	for (const entry of sortByDateDesc(entries)) {
		const year = yearFor(entry);
		byYear.set(year, [...(byYear.get(year) ?? []), entry]);
	}
	return [...byYear.entries()].sort((a, b) => b[0] - a[0]);
}

/** "38:12" / "1:02:30" -> seconds. Feeds also emit bare seconds. */
function durationToSeconds(duration: string | undefined) {
	if (!duration) return 0;
	const parts = duration.split(":").map(Number);
	if (parts.some(Number.isNaN)) return 0;
	return parts.reduce((total, part) => total * 60 + part, 0);
}

/** Rounded-down whole hours across the archive, for the stats strip. */
export function totalRuntimeHours(entries: CollectionEntry<"episodes">[]) {
	const seconds = entries.reduce(
		(sum, entry) => sum + durationToSeconds(durationFor(entry)),
		0,
	);
	return Math.floor(seconds / 3600);
}

export { waveformHeights } from "./waveform";
