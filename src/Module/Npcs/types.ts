import type { IMonsterDetail } from "@/Module/Bestiary/types";

export interface INpcAdventureRef {
	id: string;
	code: string;
	name: string;
}

/** The trimmed monster summary `GET /npcs` embeds per row. */
export interface INpcMonsterSummary {
	id: string;
	name: string;
	challengeRating: string;
	monsterType: { name: string } | null;
}

export interface INpc {
	id: string;
	name: string;
	source: string;
	adventureId: string;
	monsterId: string | null;
	tokenUrl: string | null;
	/** Physical description: race, age, clothing, distinguishing features. */
	appearance: string | null;
	/** Where the NPC is found, e.g. "Stonehill Inn — Phandalin". */
	location: string | null;
	description: string | null;
	adventure: INpcAdventureRef;
	monster: INpcMonsterSummary | null;
}

/** `GET /npcs/:id` nests the full monster stat block instead of the row summary. */
export interface INpcDetail extends Omit<INpc, "monster"> {
	monster: IMonsterDetail | null;
}

export interface INpcFilter {
	q?: string;
	adventure?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
