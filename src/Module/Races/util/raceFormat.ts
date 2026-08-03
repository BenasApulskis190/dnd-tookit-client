import type { IRace, IRaceAbilityBonuses } from "@/Module/Races/types";

const ABILITY_NAMES: Record<keyof IRaceAbilityBonuses, string> = {
	str: "Strength",
	dex: "Dexterity",
	con: "Constitution",
	int: "Intelligence",
	wis: "Wisdom",
	cha: "Charisma",
};

const SIZE_NAMES: Record<string, string> = {
	T: "Tiny",
	S: "Small",
	M: "Medium",
	L: "Large",
	H: "Huge",
	G: "Gargantuan",
};

export function sizeLabel(size: string | null): string {
	if (!size) return "—";
	return SIZE_NAMES[size] ?? size;
}

/** ["+2 Dexterity", ...] — the ability score increases the race grants. */
export function abilityBonusLabels(race: IRace): string[] {
	const entries: [keyof IRaceAbilityBonuses, number | null][] = [
		["str", race.strBonus],
		["dex", race.dexBonus],
		["con", race.conBonus],
		["int", race.intBonus],
		["wis", race.wisBonus],
		["cha", race.chaBonus],
	];

	return entries
		.filter((entry): entry is [keyof IRaceAbilityBonuses, number] => entry[1] != null)
		.map(([key, value]) => {
			const sign = value >= 0 ? "+" : "";
			return `${sign}${value} ${ABILITY_NAMES[key]}`;
		});
}

/** ["30 ft. walk", "30 ft. fly", ...] — every speed the race has above 0. */
export function speedLabels(race: IRace): string[] {
	const labels = [`${race.speed} ft. walk`];
	if (race.speedFly) labels.push(`${race.speedFly} ft. fly`);
	if (race.speedSwim) labels.push(`${race.speedSwim} ft. swim`);
	return labels;
}
