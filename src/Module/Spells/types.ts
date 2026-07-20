export interface ISpellCastingTime {
	number: number;
	unit: "action" | "bonus action" | "reaction" | "minute" | "hour";
}

export interface ISpellDistance {
	type: "feet" | "miles" | "touch" | "self" | "sight" | "unlimited";
	amount?: number;
}

export interface ISpellRange {
	type: "point" | "radius" | "cone" | "line" | "cube" | "sphere";
	distance?: ISpellDistance;
}

export interface ISpellComponents {
	v?: boolean;
	s?: boolean;
	m?: boolean | string;
}

export interface ISpellDurationValue {
	type: "rounds" | "minutes" | "hours" | "days";
	amount: number;
}

export interface ISpellDuration {
	type: "instant" | "timed" | "until dispelled" | "special";
	duration?: ISpellDurationValue;
}

export interface ISpellDescription {
	entries: (string | Record<string, unknown>)[];
}

export interface ISpell {
	id: string;
	name: string;
	source: string;
	level: number;
	school: string | null;
	castingTime: ISpellCastingTime;
	range: ISpellRange;
	components: ISpellComponents;
	materialDescription: string | null;
	duration: ISpellDuration;
	concentration: boolean;
	ritual: boolean;
	description: ISpellDescription;
	higherLevel: ISpellDescription | null;
	damageType: string | null;
	savingThrow: string | null;
	page: number | null;
	createdAt: string;
}

export interface ISpellFilter {
	q?: string;
	level?: number;
	school?: string;
	source?: string;
	concentration?: boolean;
	ritual?: boolean;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
