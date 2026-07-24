import type { IItem } from "@/Module/Items/types";

const TYPE_NAMES: Record<string, string> = {
	G: "Adventuring Gear",
	A: "Ammunition",
	AF: "Ammunition",
	AT: "Artisan's Tools",
	EM: "Eldritch Machine",
	EXP: "Explosive",
	FD: "Food & Drink",
	GS: "Gaming Set",
	HA: "Heavy Armor",
	INS: "Instrument",
	LA: "Light Armor",
	M: "Melee Weapon",
	MA: "Medium Armor",
	MNT: "Mount",
	GV: "Generic Variant",
	P: "Potion",
	R: "Ranged Weapon",
	RD: "Rod",
	RG: "Ring",
	S: "Shield",
	SC: "Scroll",
	SCF: "Spellcasting Focus",
	T: "Tools",
	TAH: "Tack & Harness",
	TG: "Trade Good",
	VEH: "Vehicle (Land)",
	SHP: "Vehicle (Water)",
	AIR: "Vehicle (Air)",
	WD: "Wand",
	$: "Treasure",
	OTH: "Other",
};

const DAMAGE_TYPES: Record<string, string> = {
	B: "bludgeoning",
	P: "piercing",
	S: "slashing",
};

export function itemTypeLabel(code: string | null): string {
	if (!code) return "";
	return TYPE_NAMES[code] ?? code;
}

/** Rarity "None"/"Unknown" is placeholder noise for mundane gear — hide it. */
export function hasRarity(rarity: string | null): boolean {
	return Boolean(rarity) && rarity !== "None" && !rarity!.startsWith("Unknown");
}

/** "Melee Weapon, Martial" style subtitle (rarity lives in the stat grid). */
export function itemSubtitle(item: IItem): string {
	return [itemTypeLabel(item.type), item.subtype].filter(Boolean).join(", ");
}

export function damageLabel(item: IItem): string {
	if (!item.damage) return "";
	const type = item.damageType
		? (DAMAGE_TYPES[item.damageType] ?? item.damageType)
		: "";
	return type ? `${item.damage} ${type}` : item.damage;
}

export function attunementLabel(item: IItem): string {
	return item.attunement ? "Required" : "—";
}
