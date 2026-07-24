import type { ISpell } from "@/Module/Spells/types";

const SCHOOL_NAMES: Record<string, string> = {
	A: "Abjuration",
	C: "Conjuration",
	D: "Divination",
	E: "Enchantment",
	V: "Evocation",
	I: "Illusion",
	N: "Necromancy",
	T: "Transmutation",
};

/**
 * Like the monster endpoint, the spell endpoint returns Postgres `Json` columns
 * (`castingTime`, `range`, `components`, `duration`, `description`, ...) as
 * JSON-encoded *strings*, so each has to be parsed before use. Already-decoded
 * values pass through untouched.
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

function ordinal(n: number): string {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

export function schoolName(code: string | null): string {
	if (!code) return "";
	return SCHOOL_NAMES[code] ?? code;
}

/** "Evocation cantrip" / "8th-level necromancy". */
export function levelSchoolLabel(spell: ISpell): string {
	const school = schoolName(spell.school);
	if (spell.level === 0) {
		return school ? `${school} cantrip` : "Cantrip";
	}
	const level = `${ordinal(spell.level)}-level`;
	return school ? `${level} ${school.toLowerCase()}` : level;
}

function pluralize(amount: number, unit: string): string {
	return amount === 1 ? unit : `${unit}s`;
}

interface CastingTime {
	number: number;
	unit: string;
}

export function castingTimeLabel(spell: ISpell): string {
	const times = parseJsonField<CastingTime[]>(spell.castingTime);
	const first = Array.isArray(times) ? times[0] : (times as CastingTime | null);
	if (!first) return "—";

	const unit = first.unit === "bonus action" ? "bonus action" : first.unit;
	const label = `${first.number} ${pluralize(first.number, unit)}`;
	return spell.ritual ? `${label} (ritual)` : label;
}

interface Range {
	type: string;
	distance?: { type: string; amount?: number };
}

const AREA_TYPES = new Set(["radius", "cone", "line", "cube", "sphere"]);

export function rangeLabel(spell: ISpell): string {
	const range = parseJsonField<Range>(spell.range);
	if (!range) return "—";

	const d = range.distance;
	if (!d) return range.type;

	if (d.type === "self") return "Self";
	if (d.type === "touch") return "Touch";
	if (d.type === "sight") return "Sight";
	if (d.type === "unlimited") return "Unlimited";

	const distance = d.amount ? `${d.amount} ${d.type}` : d.type;
	if (AREA_TYPES.has(range.type) && d.amount) {
		return `Self (${d.amount}-${d.type === "feet" ? "foot" : d.type} ${range.type})`;
	}
	return distance;
}

interface Components {
	v?: boolean;
	s?: boolean;
	m?: boolean | string;
}

export function componentsLabel(spell: ISpell): string {
	const c = parseJsonField<Components>(spell.components);
	if (!c) return "—";

	const parts: string[] = [];
	if (c.v) parts.push("V");
	if (c.s) parts.push("S");
	if (c.m) {
		const material = typeof c.m === "string" ? c.m : spell.materialDescription;
		parts.push(material ? `M (${material})` : "M");
	}
	return parts.length ? parts.join(", ") : "—";
}

interface Duration {
	type: string;
	duration?: { type: string; amount: number };
}

export function durationLabel(spell: ISpell): string {
	const durations = parseJsonField<Duration[]>(spell.duration);
	const first = Array.isArray(durations)
		? durations[0]
		: (durations as Duration | null);
	if (!first) return "—";

	let base: string;
	switch (first.type) {
		case "instant":
			base = "Instantaneous";
			break;
		case "until dispelled":
			base = "Until dispelled";
			break;
		case "special":
			base = "Special";
			break;
		case "timed":
			base = first.duration
				? `${first.duration.amount} ${pluralize(first.duration.amount, first.duration.type.replace(/s$/, ""))}`
				: "—";
			break;
		default:
			base = first.type;
	}

	if (spell.concentration) {
		return first.type === "timed"
			? `Concentration, up to ${base.toLowerCase()}`
			: `Concentration, ${base.toLowerCase()}`;
	}
	return base;
}

/** Description / higher-level entries arrive as JSON-encoded arrays of strings. */
export function entryParagraphs(value: unknown): string[] {
	const parsed = parseJsonField<unknown>(value);
	if (parsed == null) return [];

	const list = Array.isArray(parsed)
		? parsed
		: typeof parsed === "object" && "entries" in parsed
			? ((parsed as { entries: unknown[] }).entries ?? [])
			: [parsed];

	return list.filter((entry): entry is string => typeof entry === "string");
}

interface SpellClass {
	class?: { name: string };
}

/** Distinct class names a spell is on, sorted alphabetically. */
export function spellClasses(spell: ISpell): string[] {
	const raw = (spell as unknown as { classes?: SpellClass[] }).classes;
	if (!Array.isArray(raw)) return [];

	const names = new Set<string>();
	for (const entry of raw) {
		if (entry.class?.name) names.add(entry.class.name);
	}
	return [...names].sort((a, b) => a.localeCompare(b));
}
