import type { IItem } from "@/Module/Items/types";

function titleCase(s: string): string {
	return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Categories are already clean, lowercase strings from the API ("weapon", "wondrous item") — just title-case for display. */
export function itemTypeLabel(type: string | null): string {
	return type ? titleCase(type) : "";
}

/** All categories an item belongs to (a Flame Tongue is both "Weapon" and "Magic Item"). */
export function itemTypesLabel(item: IItem): string {
	return (item.types ?? []).map(titleCase).join(", ");
}

/** Rarity "None"/"Unknown" is placeholder noise for mundane gear — hide it. */
export function hasRarity(rarity: string | null): boolean {
	return Boolean(rarity) && rarity !== "None" && !rarity!.startsWith("Unknown");
}

/** "Martial Melee Weapon" / "Heavy Armor" / "Wondrous Item, Magic Item" subtitle. */
export function itemSubtitle(item: IItem): string {
	if (item.weaponType) {
		const category = item.weaponCategory ? titleCase(item.weaponCategory) + " " : "";
		return `${category}${titleCase(item.weaponType)} Weapon`;
	}
	if (item.armorType) {
		return item.armorType === "shield" ? "Shield" : `${titleCase(item.armorType)} Armor`;
	}
	return itemTypesLabel(item);
}

export function damageLabel(item: IItem): string {
	if (!item.damage) return "";
	return item.damageType ? `${item.damage} ${item.damageType}` : item.damage;
}

/** Attunement copy includes the specific requirement when the source text names one (e.g. "by a Creature of non-Lawful Alignment"). */
export function attunementLabel(item: IItem): string {
	if (!item.attunement) return "—";
	return item.attunementRequirement ? `Required (${item.attunementRequirement})` : "Required";
}

/** Prefers the printed price; falls back to the DMG rarity-guideline estimate, marked as such. */
export function valueLabel(item: IItem): string {
	if (item.value) return item.value;
	if (item.valueGp != null) {
		const gp = item.valueGp.toLocaleString();
		return item.valueEstimated ? `~${gp} gp (est.)` : `${gp} gp`;
	}
	return "—";
}
