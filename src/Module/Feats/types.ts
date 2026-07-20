export interface IFeatDescription {
	entries: (string | Record<string, unknown>)[];
}

export interface IFeatAbilityBonus {
	str?: number;
	dex?: number;
	con?: number;
	int?: number;
	wis?: number;
	cha?: number;
}

export interface IFeat {
	id: string;
	name: string;
	source: string;
	prerequisite: string | Record<string, unknown> | null;
	abilityBonuses: IFeatAbilityBonus | null;
	description: IFeatDescription;
	page: number | null;
	createdAt: string;
}

export interface IFeatFilter {
	q?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
