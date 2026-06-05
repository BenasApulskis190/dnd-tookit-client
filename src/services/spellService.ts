// TODO: replace with API call to GET /spells
import type { Spell, Roll20Data } from "@/Module/EncounterManager/types"

const roll20Map = new Map<string, Roll20Data>()
// TODO: populate roll20Map from GET /spells/roll20

export function getAllSpells(): Spell[] {
	// TODO: fetch from GET /spells
	return []
}

export function getRoll20Data(name: string, source: string): Roll20Data | undefined {
	return roll20Map.get(`${name}|${source}`)
}

export const SCHOOL_MAP: Record<string, string> = {
	A: "Abjuration",
	C: "Conjuration",
	D: "Divination",
	E: "Enchantment",
	V: "Evocation",
	I: "Illusion",
	N: "Necromancy",
	T: "Transmutation",
}

export function getSpellSchoolName(school: string): string {
	return SCHOOL_MAP[school] ?? school
}

export function getSpellLevelLabel(level: number): string {
	if (level === 0) return "Cantrip"

	const suffixes: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" }
	const suffix = suffixes[level] ?? `${level}th`

	return `${suffix}-level`
}
