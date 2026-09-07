import { resoleMonsterImageUrl } from "@/Module/Bestiary/util/monsterImageResolver";
import { abilityModifier, rollInitiative as rollD20Initiative } from "@/Module/Combat/util/dice";
import { generateCombatantId } from "@/Module/Combat/util/id";
import type { Combatant, CombatantKind, CombatState } from "@/Module/Combat/types";
import type { IEncounter } from "@/Module/Encounters/types";
import { defineStore } from "pinia";
import { reactive, watch } from "vue";

const STORAGE_KEY = "dnd_combat_state";

function loadAll(): Record<string, CombatState> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};

		const parsed = JSON.parse(raw) as Record<string, CombatState>;

		// Backfill fields added after some combat state was already persisted
		// (e.g. `conditions`), so older saved fights don't crash on load.
		for (const state of Object.values(parsed)) {
			for (const combatant of state.combatants) {
				combatant.conditions ??= [];
			}
		}

		return parsed;
	} catch {
		return {};
	}
}

// Higher initiative first; combatants without an initiative yet sink to the
// bottom (insertion order among themselves) instead of being sorted as 0.
function compareTurnOrder(a: Combatant, b: Combatant): number {
	if (a.initiative == null && b.initiative == null) return a.order - b.order;
	if (a.initiative == null) return 1;
	if (b.initiative == null) return -1;
	if (b.initiative !== a.initiative) return b.initiative - a.initiative;

	const dexDiff = abilityModifier(b.dexScore) - abilityModifier(a.dexScore);
	if (dexDiff !== 0) return dexDiff;

	return a.order - b.order;
}

interface MonsterSeed {
	id: string;
	name: string;
	source: string;
	hitPointsAvg: number | null;
	armorClass: number | null;
	dexScore: number | null;
}

interface PlayerSeed {
	id: string;
	name: string;
	imageUrl: string | null;
	dexScore: number | null;
	maxHp: number | null;
	currentHp: number | null;
	armorClass: number | null;
}

export const useCombatStore = defineStore("combatStore", () => {
	const all = reactive<Record<string, CombatState>>(loadAll());

	watch(
		all,
		() => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
		},
		{ deep: true },
	);

	function getCombat(encounterId: string): CombatState | undefined {
		return all[encounterId];
	}

	function nextOrder(state: CombatState): number {
		return state.combatants.reduce((max, c) => Math.max(max, c.order), -1) + 1;
	}

	// Only builds combatants the first time a fight is opened — reloading the
	// page must not clobber in-progress HP/initiative/death-save state.
	function ensureCombat(encounterId: string, encounter: IEncounter) {
		if (all[encounterId]) return;

		const combatants: Combatant[] = [];
		let order = 0;

		for (const entry of encounter.monsters) {
			const useSuffix = entry.quantity > 1;
			for (let i = 1; i <= entry.quantity; i++) {
				const maxHp = entry.monster.hitPointsAvg ?? 1;
				combatants.push({
					id: generateCombatantId(),
					kind: "monster",
					refId: entry.monster.id,
					name: useSuffix ? `${entry.monster.name} ${i}` : entry.monster.name,
					imageUrl: resoleMonsterImageUrl(entry.monster.source, entry.monster.name),
					initiative: null,
					dexScore: entry.monster.dexScore,
					maxHp,
					currentHp: maxHp,
					armorClass: entry.monster.armorClass,
					state: "active",
					deathSaves: { successes: 0, failures: 0 },
					conditions: [],
					order: order++,
				});
			}
		}

		for (const character of encounter.party?.characters ?? []) {
			const maxHp = character.maxHp ?? 1;
			combatants.push({
				id: generateCombatantId(),
				kind: "player",
				refId: character.id,
				name: character.name,
				imageUrl: character.imageUrl,
				initiative: null,
				dexScore: character.dexScore,
				maxHp,
				currentHp: character.currentHp ?? maxHp,
				armorClass: character.armorClass,
				state: "active",
				deathSaves: { successes: 0, failures: 0 },
				conditions: [],
				order: order++,
			});
		}

		all[encounterId] = {
			encounterId,
			phase: "setup",
			round: 1,
			currentTurnCombatantId: null,
			combatants,
		};
	}

	function addMonsterCombatant(encounterId: string, monster: MonsterSeed) {
		const state = all[encounterId];
		if (!state) return;

		const maxHp = monster.hitPointsAvg ?? 1;
		state.combatants.push({
			id: generateCombatantId(),
			kind: "monster",
			refId: monster.id,
			name: monster.name,
			imageUrl: resoleMonsterImageUrl(monster.source, monster.name),
			initiative: null,
			dexScore: monster.dexScore,
			maxHp,
			currentHp: maxHp,
			armorClass: monster.armorClass,
			state: "active",
			deathSaves: { successes: 0, failures: 0 },
			conditions: [],
			order: nextOrder(state),
		});
	}

	function addPlayerCombatant(encounterId: string, character: PlayerSeed) {
		const state = all[encounterId];
		if (!state) return;

		const maxHp = character.maxHp ?? 1;
		state.combatants.push({
			id: generateCombatantId(),
			kind: "player",
			refId: character.id,
			name: character.name,
			imageUrl: character.imageUrl,
			initiative: null,
			dexScore: character.dexScore,
			maxHp,
			currentHp: character.currentHp ?? maxHp,
			armorClass: character.armorClass,
			state: "active",
			deathSaves: { successes: 0, failures: 0 },
			conditions: [],
			order: nextOrder(state),
		});
	}

	function turnOrder(encounterId: string): Combatant[] {
		const state = all[encounterId];
		if (!state) return [];

		return state.combatants.filter((c) => c.state === "active" || c.state === "downed").sort(compareTurnOrder);
	}

	function removeCombatant(encounterId: string, combatantId: string) {
		const state = all[encounterId];
		if (!state) return;

		state.combatants = state.combatants.filter((c) => c.id !== combatantId);
		if (state.currentTurnCombatantId === combatantId) {
			state.currentTurnCombatantId = turnOrder(encounterId)[0]?.id ?? null;
		}
	}

	function setInitiative(encounterId: string, combatantId: string, value: number | null) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (combatant) combatant.initiative = value;
	}

	function rollInitiativeFor(encounterId: string, combatantId: string) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (combatant) combatant.initiative = rollD20Initiative(combatant.dexScore);
	}

	function rollAllInitiative(encounterId: string, kind: CombatantKind) {
		const state = all[encounterId];
		if (!state) return;

		for (const combatant of state.combatants) {
			if (combatant.kind === kind) combatant.initiative = rollD20Initiative(combatant.dexScore);
		}
	}

	function startCombat(encounterId: string) {
		const state = all[encounterId];
		if (!state) return;

		state.phase = "battle";
		state.round = 1;
		state.currentTurnCombatantId = turnOrder(encounterId)[0]?.id ?? null;
	}

	// Wipes this encounter's combat state entirely (HP, initiative, death
	// saves, added/removed combatants). The caller should re-seed via
	// ensureCombat right after, which rebuilds fresh combatants from the
	// encounter's current definition.
	function resetCombat(encounterId: string) {
		delete all[encounterId];
	}

	function nextTurn(encounterId: string) {
		const state = all[encounterId];
		if (!state) return;

		const order = turnOrder(encounterId);
		if (order.length === 0) {
			state.currentTurnCombatantId = null;
			return;
		}

		const index = order.findIndex((c) => c.id === state.currentTurnCombatantId);
		const nextIndex = index === -1 ? 0 : (index + 1) % order.length;
		if (index !== -1 && nextIndex <= index) state.round++;

		state.currentTurnCombatantId = order[nextIndex]!.id;
	}

	function prevTurn(encounterId: string) {
		const state = all[encounterId];
		if (!state) return;

		const order = turnOrder(encounterId);
		if (order.length === 0) return;

		const index = order.findIndex((c) => c.id === state.currentTurnCombatantId);
		const prevIndex = index === -1 ? 0 : (index - 1 + order.length) % order.length;
		if (index !== -1 && prevIndex >= index) state.round = Math.max(1, state.round - 1);

		state.currentTurnCombatantId = order[prevIndex]!.id;
	}

	function applyDamage(encounterId: string, combatantId: string, amount: number) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (!combatant || amount <= 0) return;

		combatant.currentHp = Math.max(0, combatant.currentHp - amount);
		if (combatant.currentHp === 0 && combatant.state === "active") {
			combatant.state = "downed";
			combatant.deathSaves = { successes: 0, failures: 0 };
		}
	}

	function applyHeal(encounterId: string, combatantId: string, amount: number) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (!combatant || amount <= 0) return;

		combatant.currentHp = Math.min(combatant.maxHp, combatant.currentHp + amount);
		if (combatant.state === "downed" && combatant.currentHp > 0) {
			combatant.state = "active";
			combatant.deathSaves = { successes: 0, failures: 0 };
		}
	}

	function addDeathSaveSuccess(encounterId: string, combatantId: string) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (!combatant || combatant.state !== "downed") return;

		combatant.deathSaves.successes = Math.min(3, combatant.deathSaves.successes + 1);
		if (combatant.deathSaves.successes >= 3) combatant.state = "stabilized";
	}

	function addDeathSaveFailure(encounterId: string, combatantId: string) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (!combatant || combatant.state !== "downed") return;

		combatant.deathSaves.failures = Math.min(3, combatant.deathSaves.failures + 1);
		if (combatant.deathSaves.failures >= 3) combatant.state = "dead";
	}

	function addCondition(encounterId: string, combatantId: string, condition: string) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (!combatant || combatant.conditions.includes(condition)) return;

		combatant.conditions.push(condition);
	}

	function removeCondition(encounterId: string, combatantId: string, condition: string) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (!combatant) return;

		combatant.conditions = combatant.conditions.filter((c) => c !== condition);
	}

	// Brings a dead or stabilized combatant back into the turn order. They
	// come back "downed" (still at 0 HP, death saves cleared) — healing them
	// from there is what actually gets them back on their feet.
	function revive(encounterId: string, combatantId: string) {
		const combatant = all[encounterId]?.combatants.find((c) => c.id === combatantId);
		if (!combatant || (combatant.state !== "dead" && combatant.state !== "stabilized")) return;

		combatant.state = "downed";
		combatant.deathSaves = { successes: 0, failures: 0 };
	}

	return {
		getCombat,
		ensureCombat,
		addMonsterCombatant,
		addPlayerCombatant,
		removeCombatant,
		setInitiative,
		rollInitiativeFor,
		rollAllInitiative,
		turnOrder,
		startCombat,
		resetCombat,
		nextTurn,
		prevTurn,
		applyDamage,
		applyHeal,
		addDeathSaveSuccess,
		addDeathSaveFailure,
		addCondition,
		removeCondition,
		revive,
	};
});
