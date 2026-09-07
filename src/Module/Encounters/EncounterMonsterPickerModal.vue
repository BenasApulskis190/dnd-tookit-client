<script lang="ts" setup>
import { computed, ref } from "vue";
import { isAxiosError } from "axios";
import { storeToRefs } from "pinia";
import BaseModal from "@/Module/Modal/BaseModal.vue";
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue";
import MonterFilter from "@/Module/Bestiary/MonterFilter.vue";
import MonsterTable from "@/Module/Bestiary/MonsterTable.vue";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";
import { useMonsterStore } from "@/Module/Bestiary/store/useMonsterStore";
import { useEncounterStore } from "@/Module/Encounters/store/useEncounterStore";
import { computeEncounterDifficulty } from "@/Module/Encounters/util/difficulty";
import DifficultyBar from "@/Module/Encounters/DifficultyBar.vue";
import { resoleMonsterImageUrl } from "@/Module/Bestiary/util/monsterImageResolver";
import type { IMonster } from "@/Module/Bestiary/types";

const props = defineProps<{ encounterId: string }>();

const visible = defineModel<boolean>("visible", { default: false });

const encounterStore = useEncounterStore();
const drawers = useDrawerStore();
const monsterStore = useMonsterStore();
const { isLoading } = storeToRefs(monsterStore);

const encounters = computed(() =>
	encounterStore.data && !isAxiosError(encounterStore.data) ? encounterStore.data.data : [],
);
const encounter = computed(() => encounters.value.find((e) => e.id === props.encounterId));

const totalMonsters = computed(
	() => encounter.value?.monsters.reduce((sum, m) => sum + m.quantity, 0) ?? 0,
);

const difficulty = computed(() =>
	computeEncounterDifficulty(
		encounter.value?.monsters.map((m) => ({ crValue: m.monster.crValue, quantity: m.quantity })) ?? [],
		encounter.value?.party?.characters.map((c) => c.level) ?? [],
	),
);

const search = ref("");
const typeFilter = ref<{ type: string | null }>({ type: null });

function handleFilterSelect(item: { id: string; name: string }) {
	typeFilter.value.type = item.name;
}

const addingId = ref<string | null>(null);
const error = ref("");

async function addMonster(monster: IMonster) {
	if (!monster.id) return;

	addingId.value = monster.id;
	error.value = "";

	try {
		await encounterStore.addMonster(props.encounterId, monster.id, 1);
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Failed to add monster.";
	} finally {
		addingId.value = null;
	}
}

function incrementAdded(monsterId: string, current: number) {
	encounterStore.updateMonster(props.encounterId, monsterId, current + 1);
}

function decrementAdded(monsterId: string, current: number) {
	encounterStore.updateMonster(props.encounterId, monsterId, current - 1);
}

function removeAdded(monsterId: string) {
	encounterStore.removeMonster(props.encounterId, monsterId);
}

// Clicking a row (anywhere outside the Add button) opens the monster's
// details in a drawer, same as the Bestiary page, without leaving this picker.
function openMonsterDetails(id: string) {
	drawers.open("monster", { component: MonsterDetails, props: { id }, width: "w-[45vw]" });
}

function viewDetails(monster: IMonster) {
	if (!monster.id) return;
	openMonsterDetails(monster.id);
}

function viewAddedDetails(monsterId: string) {
	openMonsterDetails(monsterId);
}

function done() {
	visible.value = false;
}
</script>

<template>
	<BaseModal v-model:visible="visible" size="full-screen">
		<template #header>
			<h3 class="font-display text-lg text-ink">Add monster</h3>
		</template>

		<div class="flex flex-1 min-h-0 flex-col lg:flex-row">
			<div class="flex flex-1 min-w-0 min-h-0 flex-col gap-4 p-4 overflow-y-auto">
				<p v-if="error" class="text-sm text-red-400">{{ error }}</p>

				<BaseSearchBar v-model="search" :loading="isLoading" />
				<MonterFilter @filter-select="handleFilterSelect" />

				<MonsterTable
					:monster-filter="typeFilter"
					:search="search"
					mode="select"
					show-actions
					@select="viewDetails"
				>
					<template #actions="{ monster }">
						<button
							class="rounded-lg bg-accent px-3 py-1 text-xs font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50"
							:disabled="addingId === monster.id"
							@click="addMonster(monster)"
						>
							{{ addingId === monster.id ? "Adding…" : "+ Add" }}
						</button>
					</template>
				</MonsterTable>
			</div>

			<div
				class="w-full lg:w-80 shrink-0 min-h-0 border-t lg:border-t-0 lg:border-l border-border p-4 flex flex-col gap-3"
			>
				<div>
					<p class="text-xs text-ink-mute mb-1.5">
						Difficulty · {{ totalMonsters }} monster{{ totalMonsters === 1 ? "" : "s" }}
					</p>
					<DifficultyBar :difficulty="difficulty" />
				</div>

				<div class="flex flex-col gap-2 flex-1 min-h-0">
					<p class="text-xs text-ink-mute">Added to this encounter</p>

					<p v-if="!encounter || encounter.monsters.length === 0" class="text-xs text-ink-faint">
						Nothing added yet.
					</p>

					<div class="flex flex-col gap-2 overflow-y-auto">
						<div
							v-for="entry in encounter?.monsters ?? []"
							:key="entry.id"
							class="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-elev px-2.5 py-1.5"
						>
							<div class="flex items-center gap-2 min-w-0">
								<img
									:src="resoleMonsterImageUrl(entry.monster.source, entry.monster.name)"
									:alt="entry.monster.name"
									class="w-7 h-7 shrink-0 rounded object-cover bg-bg-elev2"
								/>
								<div class="min-w-0">
									<p
										class="text-xs text-ink-soft truncate cursor-pointer hover:text-ink hover:underline w-fit"
										title="See monster details"
										@click="viewAddedDetails(entry.monster.id)"
									>
										{{ entry.monster.name }}
									</p>
									<p class="text-[11px] text-ink-faint">CR {{ entry.monster.challengeRating }}</p>
								</div>
							</div>

							<div class="flex items-center gap-1 shrink-0">
								<button
									class="w-5 h-5 flex items-center justify-center rounded border border-border text-ink-mute hover:bg-bg-elev2 text-xs"
									@click="decrementAdded(entry.monster.id, entry.quantity)"
								>
									−
								</button>
								<span class="w-5 text-center text-xs text-ink">{{ entry.quantity }}</span>
								<button
									class="w-5 h-5 flex items-center justify-center rounded border border-border text-ink-mute hover:bg-bg-elev2 text-xs"
									@click="incrementAdded(entry.monster.id, entry.quantity)"
								>
									+
								</button>
								<button
									class="ml-1 text-ink-faint hover:text-red-400 transition-colors"
									title="Remove monster"
									@click="removeAdded(entry.monster.id)"
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				<button
					class="mt-2 w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
					@click="done"
				>
					✓ Done adding monsters
				</button>
			</div>
		</div>
	</BaseModal>
</template>
