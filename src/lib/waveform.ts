/**
 * Deterministic pixel-bar heights for the waveform scrubber — no audio
 * analysis, no extra request, just a stable hash of a seed string (the
 * episode id). Shared by the server-rendered EpisodeCard preview and the
 * client-side StickyPlayer so both draw the same "waveform" for an episode.
 */
export function waveformHeights(seed: string, bars = 48) {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
	return Array.from({ length: bars }, (_, i) => {
		h = (h * 1664525 + 1013904223) >>> 0;
		return Math.round(20 + (Math.sin(i * 0.6 + h) * 0.5 + 0.5) * 80);
	});
}
