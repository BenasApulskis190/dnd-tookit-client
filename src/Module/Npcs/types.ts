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

export type INpcDetail = INpc;

export interface INpcFilter {
	q?: string;
	adventure?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
