export interface IMonster {
	type: string;
	tags?: string[];
}

export interface IMonsterHp {
	average: number;
	formula?: string;
}

export interface IMonsterSpeed {
	walk?: number;
	fly?: number;
	swim?: number;
	climb?: number;
	burrow?: number;
}

export type IDamageEntry =
	| string
	| { resist?: string[]; immune?: string[]; note?: string };

export interface IEntryListItem {
	type: "item";
	name: string;
	entry: string;
}

export interface IEntryList {
	type: "list";
	style?: string;
	items: IEntryListItem[];
}

export interface IEntryTable {
	type: "table";
	colLabels?: string[];
	rows?: (string | number)[][];
}

export interface IEntryInline {
	type: "inline";
	entries?: string[];
}

export interface ISpellLevel {
	slots?: number;
	spells: string[];
}

export interface IMonsterTrait {
	name: string;
	entries?: any[];
	headerEntries?: string[];
	footerEntries?: string[];
	spells?: Record<string, ISpellLevel>;
}

export interface IMonster {
	id?: string;
	name: string;
	source: string;
	size: string;
	type: string;
	alignment?: string[];
	ac: string | number | { ac: number; from?: string[] }[];
	hp: IMonsterHp;
	speed: IMonsterSpeed;
	str: number;
	dex: number;
	con: number;
	int: number;
	wis: number;
	cha: number;
	save?: Record<string, string>;
	skill?: Record<string, string>;
	immune?: IDamageEntry[];
	resist?: IDamageEntry[];
	vulnerable?: IDamageEntry[];
	conditionImmune?: string[];
	senses?: string;
	passive?: number;
	languages?: string;
	cr: string;
	challengeRating?: string;
	dexScore?: number | null;
	hitPointsAvg?: number | null;
	armorClass?: number | null;
	trait?: IMonsterTrait[];
	spellcasting?: IMonsterTrait[];
	action?: IMonsterTrait[];
	bonus?: IMonsterTrait[];
	reaction?: IMonsterTrait[];
	legendary?: IMonsterTrait[];
	mythic?: IMonsterTrait[];
}

/**
 * What `GET /monsters/:id` actually returns — the flat Prisma row, not the
 * nested 5etools `IMonster` shape above. `tags`, `alignment`, `skills`,
 * `damageVulnerabilities`, `damageResistances`, `damageImmunities`,
 * `conditionImmunities` and the trait/action `description` fields are
 * Postgres `Json` columns and arrive as JSON-encoded strings; run them
 * through `parseJsonField` before use.
 */
export interface IMonsterEntry {
	id: string;
	monsterId: string;
	name: string;
	/** Actions only: "action" | "bonus" | "reaction" | "legendary" | "mythic". */
	type?: string;
	description: unknown;
}

export interface IMonsterDetail {
	id: string;
	name: string;
	source: string;
	size: string;
	typeId: string;
	tags: unknown;
	alignment: unknown;
	armorClass?: number | null;
	armorType?: string | null;
	hitPointsAvg?: number | null;
	hitPointsFormula?: string | null;
	speedWalk?: number | null;
	speedFly?: number | null;
	speedSwim?: number | null;
	speedClimb?: number | null;
	speedBurrow?: number | null;
	strScore?: number | null;
	dexScore?: number | null;
	conScore?: number | null;
	intScore?: number | null;
	wisScore?: number | null;
	chaScore?: number | null;
	strSave?: number | null;
	dexSave?: number | null;
	conSave?: number | null;
	intSave?: number | null;
	wisSave?: number | null;
	chaSave?: number | null;
	skills: unknown;
	damageVulnerabilities: unknown;
	damageResistances: unknown;
	damageImmunities: unknown;
	conditionImmunities: unknown;
	senses?: string | null;
	passivePerception?: number | null;
	languages?: string | null;
	challengeRating: string;
	crValue?: number | null;
	page?: number | null;
	monsterType?: { id: string; name: string };
	traits?: IMonsterEntry[];
	actions?: IMonsterEntry[];
	spells?: IMonsterSpell[];
}

/** Spells a spellcaster monster can cast, as returned by `GET /monsters/:id`. */
export interface IMonsterSpell {
	id: string;
	name: string;
	/** 0 = cantrip. */
	level: number;
}

export interface ICreateMonsterDto {
	name: string;
	source: string;
	size: string;
	type: string;
	alignment?: string[];
	ac: number;
	hp: number;
	speed: number;
	str: number;
	dex: number;
	con: number;
	int: number;
	wis: number;
	cha: number;
	cr: string;
}

export interface IUpdateMonsterDto extends Partial<ICreateMonsterDto> {}

export interface IMonsterFilter {
	q?: string;
	type?: string;
	cr?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

