<script lang="ts" setup>
import { computed, ref } from "vue";
import { isAxiosError } from "axios";
import { useEncounterStore } from "@/Module/Encounters/store/useEncounterStore";
import EncounterCard from "@/Module/Encounters/EncounterCard.vue";
import EncounterFormModal from "@/Module/Encounters/EncounterFormModal.vue";
import EncounterGeneratorModal from "@/Module/Encounters/EncounterGeneratorModal.vue";
import type { IEncounter } from "@/Module/Encounters/types";

const encounterStore = useEncounterStore();

const encounters = computed(() =>
	encounterStore.data && !isAxiosError(encounterStore.data) ? encounterStore.data.data : [],
);

const showFormModal = ref(false);
const showGeneratorModal = ref(false);
const editingEncounter = ref<IEncounter | undefined>(undefined);

function openCreateModal() {
	editingEncounter.value = undefined;
	showFormModal.value = true;
}

function openEditModal(encounter: IEncounter) {
	editingEncounter.value = encounter;
	showFormModal.value = true;
}
</script>

<template>
	<div class="flex items-start justify-between gap-4 mb-6">
		<div class="flex-1" />

		<button
			class="inline-flex items-center gap-1.5 rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
			@click="showGeneratorModal = true"
		>
			⚄ Generate encounter
		</button>

		<button
			class="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
			@click="openCreateModal"
		>
			+ Create encounter
		</button>
	</div>

	<div
		v-if="encounters.length === 0"
		class="flex flex-col items-center justify-center gap-3 text-center py-24"
	>
		<span class="text-4xl">⚔</span>
		<p class="font-display text-xl text-ink">No encounters yet.</p>
		<p class="text-sm text-ink-mute max-w-sm">
			Create an encounter, add monsters to it, and optionally assign a party to see how difficult it'll be.
		</p>
		<button
			class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
			@click="openCreateModal"
		>
			+ Create your first encounter
		</button>
		<button
			class="inline-flex items-center gap-1.5 rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
			@click="showGeneratorModal = true"
		>
			⚄ Or generate one
		</button>
	</div>

	<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		<EncounterCard
			v-for="encounter in encounters"
			:key="encounter.id"
			:encounter="encounter"
			@edit="openEditModal"
		/>
	</div>

	<EncounterFormModal v-model:visible="showFormModal" :encounter="editingEncounter" />
	<EncounterGeneratorModal v-model:visible="showGeneratorModal" />
</template>
