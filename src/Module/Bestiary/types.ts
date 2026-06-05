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
	trait?: IMonsterTrait[];
	spellcasting?: IMonsterTrait[];
	action?: IMonsterTrait[];
	bonus?: IMonsterTrait[];
	reaction?: IMonsterTrait[];
	legendary?: IMonsterTrait[];
	mythic?: IMonsterTrait[];
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

