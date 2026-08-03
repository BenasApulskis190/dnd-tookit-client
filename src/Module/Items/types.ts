export interface IItemDescription {
	entries: (string | Record<string, unknown>)[];
}

export interface IItem {
	id: string;
	name: string;
	source: string;
	type: string;
	types: string[];
	subtype: string | null;
	armorType: string | null;
	weaponType: string | null;
	weaponCategory: string | null;
	rarity: string | null;
	attunement: boolean;
	attunementRequirement: string | null;
	value: string | null;
	valueGp: number | null;
	valueEstimated: boolean;
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
	armorType?: string;
	weaponType?: string;
	weaponCategory?: string;
	rarity?: string;
	attunement?: boolean;
	magic?: boolean;
	valueMin?: number;
	valueMax?: number;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
