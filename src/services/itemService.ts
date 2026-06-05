// TODO: replace with API call to GET /items and GET /items/basic
import type { Item } from "@/Module/EncounterManager/types"

export const ITEM_TYPE_MAP: Record<string, string> = {
	M: "Melee Weapon",
	R: "Ranged Weapon",
	LA: "Light Armor",
	MA: "Medium Armor",
	HA: "Heavy Armor",
	S: "Shield",
	$: "Treasure",
	SCF: "Spellcasting Focus",
	GS: "Gaming Set",
	INS: "Instrument",
	T: "Tool",
	AT: "Artisan's Tools",
	P: "Potion",
	SC: "Scroll",
	RD: "Rod",
	RG: "Ring",
	ST: "Staff",
	W: "Wand",
}

export const DMG_TYPE_MAP: Record<string, string> = {
	S: "Slashing",
	P: "Piercing",
	B: "Bludgeoning",
	F: "Fire",
	C: "Cold",
	L: "Lightning",
	A: "Acid",
	N: "Necrotic",
	R: "Radiant",
	T: "Thunder",
	I: "Poison",
}

export const PROPERTY_MAP: Record<string, string> = {
	A: "Ammunition",
	F: "Finesse",
	H: "Heavy",
	L: "Light",
	LD: "Loading",
	R: "Range",
	S: "Special",
	T: "Thrown",
	"2H": "Two-Handed",
	V: "Versatile",
}

export function getAllItems(): Item[] {
	// TODO: fetch from GET /items (magic) and GET /items/basic, merge and sort by name
	return []
}

export function getItemTypeName(type?: string): string {
	if (!type) return "Item"
	return ITEM_TYPE_MAP[type] ?? type
}
