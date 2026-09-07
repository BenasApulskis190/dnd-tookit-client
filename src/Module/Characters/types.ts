export interface ICharacterRef {
	id: string;
	name: string;
}

export interface ICharacter {
	id: string;
	userId: string;
	partyId: string | null;
	name: string;
	playerName: string | null;
	level: number;
	raceId: string | null;
	subraceId: string | null;
	classId: string | null;
	subclassId: string | null;
	backgroundId: string | null;
	armorClass: number | null;
	currentHp: number | null;
	maxHp: number | null;
	tempHp: number;
	proficiencyBonus: number | null;
	experiencePoints: number;
	strScore: number;
	dexScore: number;
	conScore: number;
	intScore: number;
	wisScore: number;
	chaScore: number;
	passivePerception: number | null;
	passiveInvestigation: number | null;
	passiveInsight: number | null;
	inspiration: boolean;
	imageUrl: string | null;
	notes: string | null;
	party: ICharacterRef | null;
	race: ICharacterRef | null;
	subrace: ICharacterRef | null;
	class: ICharacterRef | null;
	subclass: ICharacterRef | null;
	background: ICharacterRef | null;
	createdAt: string;
	updatedAt: string;
}

export interface ICharacterFilter {
	partyId?: string;
	unassigned?: boolean;
}

export interface ICharacterPayload {
	name: string;
	playerName?: string;
	level?: number;
	raceId?: string;
	classId?: string;
	backgroundId?: string;
	armorClass?: number;
	currentHp?: number;
	maxHp?: number;
	strScore?: number;
	dexScore?: number;
	conScore?: number;
	intScore?: number;
	wisScore?: number;
	chaScore?: number;
	passivePerception?: number;
	passiveInvestigation?: number;
	passiveInsight?: number;
	imageUrl?: string;
	partyId?: string | null;
	notes?: string;
}
