<script lang="ts" setup>
import { computed, ref } from "vue";
import { isAxiosError } from "axios";
import { useRouter } from "vue-router";
import { useEncounterStore } from "@/Module/Encounters/store/useEncounterStore";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import { computeEncounterDifficulty } from "@/Module/Encounters/util/difficulty";
import DifficultyBar from "@/Module/Encounters/DifficultyBar.vue";
import BaseSelect from "@/Module/Select/BaseSelect.vue";
import type { IEncounter } from "@/Module/Encounters/types";

const props = defineProps<{ encounter: IEncounter }>();
const emit = defineEmits<{ edit: [encounter: IEncounter] }>();

const router = useRouter();
const encounterStore = useEncounterStore();
const partyStore = usePartyStore();

const parties = computed(() =>
	partyStore.data && !isAxiosError(partyStore.data) ? partyStore.data.data : [],
);
const partyOptions = computed(() => parties.value.map((party) => ({ id: party.id, value: party.id, label: party.name })));

const totalMonsters = computed(() => props.encounter.monsters.reduce((sum, m) => sum + m.quantity, 0));

const difficulty = computed(() =>
	computeEncounterDifficulty(
		props.encounter.monsters.map((m) => ({ crValue: m.monster.crValue, quantity: m.quantity })),
		props.encounter.party?.characters.map((c) => c.level) ?? [],
	),
);

const assigningParty = ref(false);
const selectedPartyId = ref<string | undefined>(undefined);

function openDetail() {
	router.push({ name: "encounters-detail", params: { id: props.encounter.id } });
}

function remove() {
	encounterStore.remove(props.encounter.id);
}

function startCombat() {
	if (props.encounter.partyId) {
		router.push({ name: "combat", params: { id: props.encounter.id } });
		return;
	}

	assigningParty.value = true;
}

async function confirmAssignParty() {
	if (!selectedPartyId.value) return;

	await encounterStore.update(props.encounter.id, { partyId: selectedPartyId.value });
	assigningParty.value = false;
	router.push({ name: "combat", params: { id: props.encounter.id } });
}
</script>

<template>
	<div class="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-bg-elev p-4">
		<div class="flex items-start justify-between gap-2">
			<button class="min-w-0 flex-1 text-left" @click="openDetail">
				<h3 class="font-display text-lg text-ink truncate hover:underline">{{ encounter.name }}</h3>
				<p v-if="encounter.description" class="text-sm text-ink-mute mt-0.5 line-clamp-2">{{ encounter.description }}</p>
			</button>

			<div class="flex shrink-0 items-center gap-2">
				<button
					class="text-ink-faint hover:text-accent transition-colors"
					title="Edit encounter"
					@click="emit('edit', encounter)"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
					</svg>
				</button>
				<button
					class="text-ink-faint hover:text-red-400 transition-colors"
					title="Delete encounter"
					@click="remove"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
					</svg>
				</button>
			</div>
		</div>

		<div class="flex items-center gap-2 text-xs text-ink-mute">
			<span>{{ totalMonsters }} monster{{ totalMonsters === 1 ? "" : "s" }}</span>
			<span>· {{ encounter.party ? encounter.party.name : "No party" }}</span>
		</div>

		<DifficultyBar :difficulty="difficulty" />

		<div v-if="assigningParty" class="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-bg p-2.5">
			<p class="text-xs text-ink-mute">Assign a party to start combat:</p>
			<BaseSelect v-model="selectedPartyId" :options="partyOptions" placeholder="Select a party…" />
			<div class="flex gap-2">
				<button
					class="flex-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50"
					:disabled="!selectedPartyId"
					@click="confirmAssignParty"
				>
					Assign & start
				</button>
				<button class="text-xs text-ink-faint hover:text-ink" @click="assigningParty = false">Cancel</button>
			</div>
		</div>
		<button
			v-else
			class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
			@click="startCombat"
		>
			⚔ Start combat
		</button>
	</div>
</template>
