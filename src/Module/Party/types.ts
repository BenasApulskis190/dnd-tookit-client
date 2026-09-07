export interface IPartyCharacterSummary {
	id: string;
	name: string;
	playerName: string | null;
	level: number;
	currentHp: number | null;
	maxHp: number | null;
	armorClass: number | null;
	imageUrl: string | null;
	race: { id: string; name: string } | null;
	class: { id: string; name: string } | null;
}

export interface IParty {
	id: string;
	name: string;
	description: string | null;
	imageUrl: string | null;
	characters: IPartyCharacterSummary[];
	createdAt: string;
	updatedAt: string;
}

export interface IPartyPayload {
	name: string;
	description?: string;
	imageUrl?: string;
}
