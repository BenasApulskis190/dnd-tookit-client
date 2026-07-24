import type { IClass, IClassDetail, IClassFeature } from "@/Module/Classes/types";

const SAVES: { flag: keyof IClass; label: string }[] = [
	{ flag: "proficiencyStr", label: "Strength" },
	{ flag: "proficiencyDex", label: "Dexterity" },
	{ flag: "proficiencyCon", label: "Constitution" },
	{ flag: "proficiencyInt", label: "Intelligence" },
	{ flag: "proficiencyWis", label: "Wisdom" },
	{ flag: "proficiencyCha", label: "Charisma" },
];

/** ["Strength", "Constitution"] — the class's saving-throw proficiencies. */
export function savingThrowProficiencies(dndClass: IClass): string[] {
	return SAVES.filter(({ flag }) => dndClass[flag]).map(({ label }) => label);
}

/** Class features sorted by the level they're gained at, then by name. */
export function featuresByLevel(dndClass: IClassDetail): IClassFeature[] {
	return [...(dndClass.features ?? [])].sort(
		(a, b) => a.level - b.level || a.name.localeCompare(b.name),
	);
}
