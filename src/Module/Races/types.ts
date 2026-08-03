export interface IRaceDescription {
	entries: (string | Record<string, unknown>)[];
}

export interface IRaceAbilityBonuses {
	str?: number | null;
	dex?: number | null;
	con?: number | null;
	int?: number | null;
	wis?: number | null;
	cha?: number | null;
}

export interface ISubrace {
	id: string;
	raceId: string;
	name: string;
	source: string | null;
	page: number | null;
	abilityBonuses: Record<string, unknown> | null;
	description: IRaceDescription | null;
	createdAt: string;
}

export interface IRace {
	id: string;
	name: string;
	source: string;
	page: number | null;
	size: string | null;
	speed: number;
	darkvision: number | null;
	speedFly: number | null;
	speedSwim: number | null;
	strBonus: number | null;
	dexBonus: number | null;
	conBonus: number | null;
	intBonus: number | null;
	wisBonus: number | null;
	chaBonus: number | null;
	description: IRaceDescription | null;
	subraces: ISubrace[];
	/** Only present on `GET /races/:id`; the list endpoint omits language links. */
	languages?: string[];
	createdAt: string;
}

export interface IRaceFilter {
	q?: string;
	source?: string;
	size?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
