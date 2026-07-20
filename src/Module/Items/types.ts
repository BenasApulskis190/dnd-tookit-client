export interface IItemDescription {
	entries: (string | Record<string, unknown>)[];
}

export interface IItem {
	id: string;
	name: string;
	source: string;
	type: string;
	subtype: string | null;
	rarity: string | null;
	attunement: boolean;
	value: string | null;
	weight: number | null;
	damage: string | null;
	damageType: string | null;
	armorClass: number | null;
	strengthRequirement: number | null;
	stealthDisadvantage: boolean;
	description: IItemDescription | null;
	page: number | null;
	createdAt: string;
}

export interface IItemFilter {
	q?: string;
	type?: string;
	subtype?: string;
	rarity?: string;
	attunement?: boolean;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
