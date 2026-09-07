export type CombatantKind = "player" | "monster";

// active: fighting normally, in the turn order.
// downed: at 0 HP, still in the turn order, rolling death saves.
// stabilized: 3 death save successes — pulled out of the turn order.
// dead: 3 death save failures — pulled out of the turn order.
export type CombatantState = "active" | "downed" | "stabilized" | "dead";

export interface Combatant {
	id: string;
	kind: CombatantKind;
	refId: string;
	name: string;
	imageUrl: string | null;
	initiative: number | null;
	dexScore: number | null;
	maxHp: number;
	currentHp: number;
	armorClass: number | null;
	state: CombatantState;
	deathSaves: { successes: number; failures: number };
	conditions: string[];
	/** Insertion order — default tie-break, and where newly-added combatants land in the turn order until their initiative is set. */
	order: number;
}

export interface CombatState {
	encounterId: string;
	phase: "setup" | "battle";
	round: number;
	currentTurnCombatantId: string | null;
	combatants: Combatant[];
}
