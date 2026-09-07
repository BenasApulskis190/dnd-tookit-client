<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { isAxiosError } from "axios";
import { useRoute } from "vue-router";
import BaseBreadcrumbs from "@/Module/Breadcrumbs/BaseBreadcrumbs.vue";
import { useEncounterStore } from "@/Module/Encounters/store/useEncounterStore";
import { useCombatStore } from "@/Module/Combat/store/useCombatStore";
import CombatantCard from "@/Module/Combat/CombatantCard.vue";
import TurnOrderStrip from "@/Module/Combat/TurnOrderStrip.vue";
import AddMonsterToCombatModal from "@/Module/Combat/AddMonsterToCombatModal.vue";
import AddPlayerToCombatModal from "@/Module/Combat/AddPlayerToCombatModal.vue";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";
import PlayerPanel from "@/Module/Combat/PlayerPanel.vue";
import DiceIcon from "@/Module/Loading/DiceIcon.vue";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";
import type { Combatant } from "@/Module/Combat/types";

const route = useRoute();
const encounterStore = useEncounterStore();
const combatStore = useCombatStore();
const drawers = useDrawerStore();

const encounterId = computed(() => route.params.id as string);

const encounters = computed(() =>
	encounterStore.data && !isAxiosError(encounterStore.data) ? encounterStore.data.data : [],
);
const encounter = computed(() => encounters.value.find((e) => e.id === encounterId.value));

const breadcrumbs = computed(() => [
	{ label: "Encounters", to: { name: "encounters" } },
	{ label: encounter.value?.name ?? "…", to: { name: "encounters-detail", params: { id: encounterId.value } } },
	{ label: "Combat" },
]);

// Combat state is seeded from the encounter exactly once — after that it
// lives entirely in the (localStorage-persisted) combat store, so a reload
// mid-fight doesn't reset HP/initiative/death saves.
watch(
	encounter,
	(value) => {
		if (value) combatStore.ensureCombat(encounterId.value, value);
	},
	{ immediate: true },
);

const combat = computed(() => combatStore.getCombat(encounterId.value));
const players = computed(() => combat.value?.combatants.filter((c) => c.kind === "player") ?? []);
const monsters = computed(() => combat.value?.combatants.filter((c) => c.kind === "monster") ?? []);
const order = computed(() => combatStore.turnOrder(encounterId.value));

const allReady = computed(
	() => (combat.value?.combatants.length ?? 0) > 0 && combat.value!.combatants.every((c) => c.initiative != null),
);

function startCombat() {
	combatStore.startCombat(encounterId.value);
}

function endCombat() {
	if (!encounter.value) return;
	if (!window.confirm("End this combat and reset it? All HP, initiative, and death save progress will be lost.")) {
		return;
	}

	combatStore.resetCombat(encounterId.value);
	combatStore.ensureCombat(encounterId.value, encounter.value);
}

const showAddMonster = ref(false);
const showAddPlayer = ref(false);

function viewDetails(combatant: Combatant) {
	if (combatant.kind === "monster") {
		drawers.open("monster", {
			component: MonsterDetails,
			props: { id: combatant.refId },
			width: "w-[45vw]",
		});
	} else {
		drawers.open("player", { component: PlayerPanel, props: { name: combatant.name }, width: "w-[45vw]" });
	}
}
</script>

<template>
	<div v-if="!encounter" class="py-24 text-center text-sm text-ink-mute">Encounter not found.</div>

	<div v-else class="flex flex-col gap-4">
		<BaseBreadcrumbs :items="breadcrumbs" />

		<div class="flex items-center justify-between gap-4">
			<div class="min-w-0">
				<h1 class="font-display text-2xl text-ink">Combat</h1>
			</div>

			<div class="flex shrink-0 gap-2">
				<button
					v-if="combat?.phase === 'setup'"
					class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
					:disabled="!allReady"
					:title="allReady ? '' : 'Give every combatant an initiative value first'"
					@click="startCombat"
				>
					⚔ Start combat
				</button>
				<button
					v-if="combat && combat.combatants.length > 0"
					class="rounded-lg border border-border px-3 py-1.5 text-xs text-ink-mute hover:text-red-400 hover:border-red-400/50 transition-colors"
					@click="endCombat"
				>
					End combat
				</button>
			</div>
		</div>

		<TurnOrderStrip
			v-if="combat?.phase === 'battle'"
			:order="order"
			:current-turn-combatant-id="combat.currentTurnCombatantId"
			:round="combat.round"
			@next="combatStore.nextTurn(encounterId)"
			@prev="combatStore.prevTurn(encounterId)"
		/>
		<p v-else class="text-xs text-ink-faint">
			Set initiative for everyone (or roll it), then start combat. New combatants can still join mid-fight.
		</p>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg text-ink">Party</h2>
					<div class="flex gap-2">
						<button
							class="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
							@click="combatStore.rollAllInitiative(encounterId, 'player')"
						>
							<DiceIcon :size="13" /> Roll all
						</button>
						<button class="text-xs font-medium text-accent hover:underline" @click="showAddPlayer = true">
							+ Add player
						</button>
					</div>
				</div>

				<p v-if="players.length === 0" class="text-xs text-ink-faint">No players in this fight yet.</p>

				<CombatantCard
					v-for="combatant in players"
					:key="combatant.id"
					:encounter-id="encounterId"
					:combatant="combatant"
					:is-current-turn="combat?.phase === 'battle' && combatant.id === combat.currentTurnCombatantId"
					@view-details="viewDetails"
				/>
			</div>

			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg text-ink">Monsters</h2>
					<div class="flex gap-2">
						<button
							class="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
							@click="combatStore.rollAllInitiative(encounterId, 'monster')"
						>
							<DiceIcon :size="13" /> Roll all
						</button>
						<button class="text-xs font-medium text-accent hover:underline" @click="showAddMonster = true">
							+ Add monster
						</button>
					</div>
				</div>

				<p v-if="monsters.length === 0" class="text-xs text-ink-faint">No monsters in this fight yet.</p>

				<CombatantCard
					v-for="combatant in monsters"
					:key="combatant.id"
					:encounter-id="encounterId"
					:combatant="combatant"
					:is-current-turn="combat?.phase === 'battle' && combatant.id === combat.currentTurnCombatantId"
					@view-details="viewDetails"
				/>
			</div>
		</div>

		<AddMonsterToCombatModal v-model:visible="showAddMonster" :encounter-id="encounterId" />
		<AddPlayerToCombatModal v-model:visible="showAddPlayer" :encounter-id="encounterId" />
	</div>
</template>
