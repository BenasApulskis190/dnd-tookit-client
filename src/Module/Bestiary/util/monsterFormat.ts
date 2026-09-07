import type { IMonsterDetail } from "@/Module/Bestiary/types";

const SIZE_LABELS: Record<string, string> = {
	T: "Tiny",
	S: "Small",
	M: "Medium",
	L: "Large",
	H: "Huge",
	G: "Gargantuan",
};

const ALIGNMENT_LABELS: Record<string, string> = {
	L: "Lawful",
	N: "Neutral",
	C: "Chaotic",
	G: "Good",
	E: "Evil",
	U: "Unaligned",
	A: "Any alignment",
};

const CR_XP: Record<string, number> = {
	"0": 10,
	"1/8": 25,
	"1/4": 50,
	"1/2": 100,
	"1": 200,
	"2": 450,
	"3": 700,
	"4": 1100,
	"5": 1800,
	"6": 2300,
	"7": 2900,
	"8": 3900,
	"9": 5000,
	"10": 5900,
	"11": 7200,
	"12": 8400,
	"13": 10000,
	"14": 11500,
	"15": 13000,
	"16": 15000,
	"17": 18000,
	"18": 20000,
	"19": 22000,
	"20": 25000,
	"21": 33000,
	"22": 41000,
	"23": 50000,
	"24": 62000,
	"25": 75000,
	"26": 90000,
	"27": 105000,
	"28": 120000,
	"29": 135000,
	"30": 155000,
};

/**
 * Postgres `Json` columns come back from the API as JSON-encoded *strings*
 * (alignment `'["L","E"]'`, trait description `'["text"]'`), so each one has to
 * be parsed before use. Already-decoded values pass through untouched.
 */
export function parseJsonField<T>(value: unknown): T | null {
	if (value == null) return null;
	if (typeof value !== "string") return value as T;

	try {
		return JSON.parse(value) as T;
	} catch {
		return null;
	}
}

/** Trait/action `description` is a JSON-encoded array of paragraphs. */
export function descriptionParagraphs(description: unknown): string[] {
	const parsed = parseJsonField<unknown>(description);
	const list = Array.isArray(parsed) ? parsed : [parsed];

	return list.filter((entry): entry is string => typeof entry === "string");
}

export function sizeLabel(size?: string): string {
	if (!size) return "";
	return SIZE_LABELS[size] ?? size;
}

export function alignmentLabel(alignment: unknown): string {
	const codes = parseJsonField<string[]>(alignment);
	if (!codes?.length) return "";

	return codes.map((code) => ALIGNMENT_LABELS[code] ?? code).join(" ");
}

/** "Small Humanoid (Goblinoid), Lawful Evil" */
export function subtitle(monster: IMonsterDetail): string {
	const tags = parseJsonField<string[]>(monster.tags);
	const type = monster.monsterType?.name ?? "";
	const typePart = tags?.length ? `${type} (${tags.join(", ")})` : type;
	const alignment = alignmentLabel(monster.alignment);

	const left = [sizeLabel(monster.size), typePart].filter(Boolean).join(" ");
	return alignment ? `${left}, ${alignment}` : left;
}

export function armorClassLabel(monster: IMonsterDetail): string {
	if (monster.armorClass == null) return "—";
	return monster.armorType
		? `${monster.armorClass} (${monster.armorType})`
		: String(monster.armorClass);
}

export function hitPointsLabel(monster: IMonsterDetail): string {
	if (monster.hitPointsAvg == null) return "—";
	return monster.hitPointsFormula
		? `${monster.hitPointsAvg} (${monster.hitPointsFormula})`
		: String(monster.hitPointsAvg);
}

/** Walk speed is unlabelled, every other movement mode is prefixed. */
export function speedLabel(monster: IMonsterDetail): string {
	const parts: string[] = [];
	if (monster.speedWalk != null) parts.push(`${monster.speedWalk} ft.`);
	if (monster.speedFly != null) parts.push(`fly ${monster.speedFly} ft.`);
	if (monster.speedSwim != null) parts.push(`swim ${monster.speedSwim} ft.`);
	if (monster.speedClimb != null) parts.push(`climb ${monster.speedClimb} ft.`);
	if (monster.speedBurrow != null)
		parts.push(`burrow ${monster.speedBurrow} ft.`);

	return parts.length ? parts.join(", ") : "—";
}

export function abilityModifier(score?: number | null): string {
	if (score == null) return "—";
	const mod = Math.floor((score - 10) / 2);
	return signed(mod);
}

export function signed(value: number): string {
	return value >= 0 ? `+${value}` : String(value);
}

export function savingThrows(monster: IMonsterDetail): string {
	const saves: [string, number | null | undefined][] = [
		["Str", monster.strSave],
		["Dex", monster.dexSave],
		["Con", monster.conSave],
		["Int", monster.intSave],
		["Wis", monster.wisSave],
		["Cha", monster.chaSave],
	];

	return saves
		.filter(([, value]) => value != null)
		.map(([label, value]) => `${label} ${signed(value as number)}`)
		.join(", ");
}

/**
 * Damage resistance/immunity/vulnerability and condition immunity entries
 * are usually a plain string array, but 5etools sometimes wraps a subset in
 * an object carrying a `note` (e.g. "from nonmagical weapons") or `preNote`
 * (e.g. "While in bear form:") qualifier, or a freeform `special` string.
 */
export type IDamageBucketEntry =
	| string
	| {
			resist?: string[];
			immune?: string[];
			vulnerable?: string[];
			conditionImmune?: string[];
			note?: string;
			preNote?: string;
			special?: string;
	  };

function damageEntryLabel(entry: IDamageBucketEntry): string {
	if (typeof entry === "string") return entry;
	if (entry.special) return entry.special;

	const list =
		entry.resist ?? entry.immune ?? entry.vulnerable ?? entry.conditionImmune ?? [];
	return [entry.preNote, list.join(", "), entry.note].filter(Boolean).join(" ");
}

/** Formats a damage resistance/immunity/vulnerability or condition immunity column. */
export function damageListLabel(entries: unknown): string {
	const parsed = parseJsonField<IDamageBucketEntry[]>(entries);
	if (!parsed?.length) return "";

	return parsed.map(damageEntryLabel).join("; ");
}

/** A condition-immunity bucket split into linkable names plus its surrounding qualifier text. */
export interface IConditionImmunityGroup {
	preNote?: string;
	names: string[];
	note?: string;
	special?: string;
}

/**
 * Same source shape as `damageListLabel`, but keeps each condition name
 * separate (rather than joined into one string) so the caller can render
 * individual names as links into the Conditions module.
 */
export function conditionImmunityGroups(entries: unknown): IConditionImmunityGroup[] {
	const parsed = parseJsonField<IDamageBucketEntry[]>(entries);
	if (!parsed?.length) return [];

	return parsed.map((entry) => {
		if (typeof entry === "string") return { names: [entry] };
		if (entry.special) return { names: [], special: entry.special };
		return { preNote: entry.preNote, names: entry.conditionImmune ?? [], note: entry.note };
	});
}

export function skillsLabel(skills: unknown): string {
	const parsed = parseJsonField<Record<string, string | number>>(skills);
	if (!parsed || typeof parsed !== "object") return "";

	return Object.entries(parsed)
		.map(([name, value]) => {
			const label = name.charAt(0).toUpperCase() + name.slice(1);
			const bonus = typeof value === "number" ? signed(value) : value;
			return `${label} ${bonus}`;
		})
		.join(", ");
}

export function sensesLabel(monster: IMonsterDetail): string {
	const parts: string[] = [];
	if (monster.senses) parts.push(monster.senses);
	if (monster.passivePerception != null)
		parts.push(`passive Perception ${monster.passivePerception}`);

	return parts.join(", ");
}

export function challengeLabel(cr?: string): string {
	if (!cr) return "—";
	const xp = CR_XP[cr];
	return xp ? `${cr} (${xp.toLocaleString()} XP)` : cr;
}

/** Derived from CR — the API does not store proficiency bonus. */
export function proficiencyBonus(cr?: string, crValue?: number | null): string {
	const value = crValue ?? (cr ? Number(cr) : NaN);
	if (Number.isNaN(value)) return "—";

	return signed(Math.max(2, 2 + Math.floor(Math.max(0, value - 1) / 4)));
}
