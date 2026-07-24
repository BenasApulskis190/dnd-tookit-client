import type { IFeat, IFeatAbilityBonus } from "@/Module/Feats/types";
import { parseJsonField } from "@/utils/entries";

const ABILITY_NAMES: Record<keyof IFeatAbilityBonus, string> = {
	str: "Strength",
	dex: "Dexterity",
	con: "Constitution",
	int: "Intelligence",
	wis: "Wisdom",
	cha: "Charisma",
};

/** ["+1 Dexterity", ...] — the ability score increases the feat grants. */
export function abilityBonusLabels(feat: IFeat): string[] {
	const bonuses = parseJsonField<IFeatAbilityBonus>(feat.abilityBonuses);
	if (!bonuses) return [];

	return (Object.keys(ABILITY_NAMES) as (keyof IFeatAbilityBonus)[])
		.filter((key) => bonuses[key] != null)
		.map((key) => {
			const value = bonuses[key] as number;
			const sign = value >= 0 ? "+" : "";
			return `${sign}${value} ${ABILITY_NAMES[key]}`;
		});
}

/** Prerequisites come as free text or a loosely-typed object; best-effort flatten. */
export function prerequisiteLabel(feat: IFeat): string {
	const raw = parseJsonField<unknown>(feat.prerequisite);
	if (!raw) return "";
	if (typeof raw === "string") return raw;

	const groups = Array.isArray(raw) ? raw : [raw];
	const parts: string[] = [];

	for (const group of groups) {
		if (!group || typeof group !== "object") continue;
		const g = group as Record<string, any>;

		if (Array.isArray(g.race)) {
			parts.push(g.race.map((r: any) => r?.name).filter(Boolean).join(" or "));
		}
		if (Array.isArray(g.ability)) {
			for (const ability of g.ability) {
				for (const [key, min] of Object.entries(ability ?? {})) {
					const name = ABILITY_NAMES[key as keyof IFeatAbilityBonus] ?? key;
					parts.push(`${name} ${min} or higher`);
				}
			}
		}
		if (g.level) {
			parts.push(`Level ${typeof g.level === "object" ? g.level.level : g.level}`);
		}
		if (g.spellcasting || g.spellcasting2020) {
			parts.push("The ability to cast at least one spell");
		}
		if (typeof g.other === "string") parts.push(g.other);
		if (typeof g.proficiency === "object") {
			parts.push("Proficiency with the relevant equipment");
		}
	}

	return parts.filter(Boolean).join(", ");
}
