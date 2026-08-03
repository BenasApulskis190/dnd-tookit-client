import type { IAdventure } from "@/Module/Adventures/types";

/** "1–5", "3", or "—" — the character level range an adventure targets. */
export function levelRangeLabel(
	adventure: Pick<IAdventure, "levelStart" | "levelEnd">,
): string {
	const { levelStart, levelEnd } = adventure;
	if (levelStart == null && levelEnd == null) return "—";
	if (levelStart != null && levelEnd != null && levelStart !== levelEnd) {
		return `${levelStart}–${levelEnd}`;
	}
	return `${levelStart ?? levelEnd}`;
}

/** The publication year, or "—" if unknown/unparseable. */
export function publishedYearLabel(published: string | null): string {
	if (!published) return "—";
	const year = new Date(published).getFullYear();
	return Number.isNaN(year) ? "—" : String(year);
}
