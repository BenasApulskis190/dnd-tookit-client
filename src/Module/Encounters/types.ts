export interface IEncounterMonsterSummary {
	id: string;
	quantity: number;
	monster: {
		id: string;
		name: string;
		source: string;
		size: string;
		challengeRating: string;
		crValue: number | null;
		dexScore: number | null;
		hitPointsAvg: number | null;
		armorClass: number | null;
		monsterType?: { name: string } | null;
	};
}

export interface IEncounterPartyCharacterSummary {
	id: string;
	name: string;
	level: number;
	dexScore: number;
	armorClass: number | null;
	currentHp: number | null;
	maxHp: number | null;
	imageUrl: string | null;
}

export interface IEncounterPartySummary {
	id: string;
	name: string;
	characters: IEncounterPartyCharacterSummary[];
}

export interface IEncounterLootItemSummary {
	id: string;
	name: string;
	source: string;
	type: string;
	rarity: string | null;
	valueGp: number | null;
}

export interface IEncounterLoot {
	id: string;
	itemId: string | null;
	customName: string | null;
	quantity: number;
	valueGp: number | null;
	notes: string | null;
	item: IEncounterLootItemSummary | null;
}

export interface IEncounter {
	id: string;
	userId: string;
	partyId: string | null;
	name: string;
	description: string | null;
	notes: string | null;
	isActive: boolean;
	party: IEncounterPartySummary | null;
	monsters: IEncounterMonsterSummary[];
	loot: IEncounterLoot[];
	createdAt: string;
	updatedAt: string;
}

export interface IEncounterLootPayload {
	itemId?: string;
	customName?: string;
	quantity?: number;
	valueGp?: number | null;
	notes?: string;
}

export interface IEncounterPayload {
	name: string;
	description?: string;
	notes?: string;
	partyId?: string | null;
	isActive?: boolean;
}
