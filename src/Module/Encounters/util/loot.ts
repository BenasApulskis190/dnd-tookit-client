import type { IEncounterLoot } from "@/Module/Encounters/types";

/** Loot name: custom entries carry their own name, catalog entries fall back to the linked item's name. */
export function lootName(loot: IEncounterLoot): string {
	return loot.customName ?? loot.item?.name ?? "Unknown item";
}

/** Per-unit gold value: an explicit override on the loot entry wins, otherwise fall back to the catalog item's value. */
export function lootUnitValue(loot: IEncounterLoot): number {
	if (loot.valueGp != null) return loot.valueGp;
	return loot.item?.valueGp ?? 0;
}

export function lootTotalValue(loot: IEncounterLoot): number {
	return lootUnitValue(loot) * loot.quantity;
}

export function encounterLootTotal(loot: IEncounterLoot[]): number {
	return loot.reduce((sum, entry) => sum + lootTotalValue(entry), 0);
}
