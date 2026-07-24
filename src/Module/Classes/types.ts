export type ClassName =
  | 'Artificer'
  | 'Barbarian'
  | 'Bard'
  | 'Cleric'
  | 'Druid'
  | 'Fighter'
  | 'Monk'
  | 'Paladin'
  | 'Ranger'
  | 'Rogue'
  | 'Sorcerer'
  | 'Warlock'
  | 'Wizard'

export interface IClassDescription {
	entries: (string | Record<string, unknown>)[];
}

export interface IClassFeature {
	id: string;
	classId: string;
	name: string;
	level: number;
	description: IClassDescription;
	gainSubclassFeature: boolean;
	createdAt: string;
}

export interface ISubclass {
	id: string;
	classId: string;
	name: string;
	shortName: string | null;
	source: string;
	description: IClassDescription | null;
	createdAt: string;
}

export interface IClass {
	id: string;
	name: string;
	source: string;
	hitDie: number;
	proficiencyStr: boolean;
	proficiencyDex: boolean;
	proficiencyCon: boolean;
	proficiencyInt: boolean;
	proficiencyWis: boolean;
	proficiencyCha: boolean;
	subclassTitle: string | null;
	description: IClassDescription | null;
	createdAt: string;
}

/** What `GET /classes/:id` returns — the class plus its features and subclasses. */
export interface IClassDetail extends IClass {
	features: IClassFeature[];
	subclasses: (ISubclass & { features: IClassFeature[] })[];
}

export interface IClassFilter {
	q?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
