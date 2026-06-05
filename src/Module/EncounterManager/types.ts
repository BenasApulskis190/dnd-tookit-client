export interface MonsterType {
	type: string
	tags?: string[]
}

export interface MonsterHp {
	average: number
	formula?: string
}

export interface MonsterSpeed {
	walk?: number
	fly?: number
	swim?: number
	climb?: number
	burrow?: number
}

export type DamageEntry = string | { resist?: string[]; immune?: string[]; note?: string }

export interface EntryListItem {
	type: "item"
	name: string
	entry: string
}

export interface EntryList {
	type: "list"
	style?: string
	items: EntryListItem[]
}

export interface EntryTable {
	type: "table"
	colLabels?: string[]
	rows?: (string | number)[][]
}

export interface EntryInline {
	type: "inline"
	entries?: string[]
}

export type Entry = string | EntryList | EntryTable | EntryInline

export interface SpellLevel {
	slots?: number
	spells: string[]
}

export interface MonsterTrait {
	name: string
	entries?: Entry[]
	headerEntries?: string[]
	footerEntries?: string[]
	spells?: Record<string, SpellLevel>
}

export interface Monster {
	name: string
	source: string
	size: string
	type: string | MonsterType
	alignment?: string[]
	ac: string | number | { ac: number; from?: string[] }[]
	hp: MonsterHp
	speed: MonsterSpeed
	str: number
	dex: number
	con: number
	int: number
	wis: number
	cha: number
	save?: Record<string, string>
	skill?: Record<string, string>
	immune?: DamageEntry[]
	resist?: DamageEntry[]
	vulnerable?: DamageEntry[]
	conditionImmune?: string[]
	senses?: string
	passive?: number
	languages?: string
	cr: string
	crValue?: number
	challengeRating?: string
	trait?: MonsterTrait[]
	spellcasting?: MonsterTrait[]
	action?: MonsterTrait[]
	bonus?: MonsterTrait[]
	reaction?: MonsterTrait[]
	legendary?: MonsterTrait[]
	mythic?: MonsterTrait[]
}

export interface SpellTime {
	number: number
	unit: string
	condition?: string
}

export interface SpellRange {
	type: string
	distance?: { type: string; amount?: number }
}

export interface SpellComponents {
	v?: boolean
	s?: boolean
	m?: string | boolean
}

export interface SpellDuration {
	type: string
	duration?: { type: string; amount?: number }
	concentration?: boolean
}

export interface SpellClass {
	name: string
	source: string
}


export interface Roll20Data {
	Damage?: string
	"Damage Type"?: string
	"Damage Progression"?: string
	Save?: string
	"Save Success"?: string
	Healing?: string
	Target?: string
	"Higher Spell Slot Die"?: string
	"Higher Spell Slot Dice"?: string
	"Higher Spell Slot Bonus"?: string
}

export interface Spell {
	name: string
	source: string
	level: number
	school: string
	time: SpellTime[]
	range: SpellRange
	components: SpellComponents
	duration: SpellDuration[]
	classes?: { fromClassList?: SpellClass[]; fromSubclass?: unknown[] }
	entries: (string | { type: string; name?: string; entries?: string[] })[]
	entriesHigherLevel?: { type: string; name: string; entries: string[] }[]
	ritual?: boolean
	page?: number
}

export interface EncounterEntry {
	monster: Monster
	count: number
}

// Conditions
export interface Condition {
	name: string
	source: string
	page?: number
	entries: (string | { type: string; items?: string[]; colLabels?: string[]; rows?: unknown[] })[]
}

// Backgrounds
export interface Background {
	name: string
	source: string
	page?: number
	skillProficiencies?: string
	entries: (string | { type: string; name?: string; entries?: (string | object)[] })[]
}

// Feats
export interface Feat {
	name: string
	source: string
	page?: number
	prerequisite?: { race?: { name: string }[]; level?: number; ability?: object[] }[]
	entries: (string | { type: string; items?: string[] })[]
	ability?: object
}

// Classes
export interface ClassFeature {
	name: string
	entries: (string | object)[]
	gainSubclassFeature?: boolean
}

export interface ClassStartingProficiencies {
	armor?: string[]
	weapons?: string[]
	tools?: string[]
	skills?: { choose: number; from: string[] } | string
}

export interface DnDClass {
	name: string
	source: string
	hd: { number: number; faces: number }
	proficiency: string[]
	startingProficiencies?: ClassStartingProficiencies
	classFeatures: ClassFeature[][]
	subclassTitle?: string
}

// Items
export interface Item {
	name: string
	source: string
	page?: number
	type?: string
	rarity?: string
	value?: string
	weight?: string
	wondrous?: boolean
	weapon?: boolean
	weaponCategory?: string
	dmg1?: string
	dmg2?: string
	dmgType?: string
	property?: string[]
	entries?: (string | object)[]
}
