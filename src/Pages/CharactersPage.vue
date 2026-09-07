<script lang="ts" setup>
import { computed, ref } from "vue";
import { isAxiosError } from "axios";
import { useCharacterStore } from "@/Module/Characters/store/useCharacterStore";
import CharacterCard from "@/Module/Characters/CharacterCard.vue";
import CharacterFormModal from "@/Module/Characters/CharacterFormModal.vue";
import type { ICharacter } from "@/Module/Characters/types";

const characterStore = useCharacterStore();

const characters = computed(() =>
	characterStore.data && !isAxiosError(characterStore.data) ? characterStore.data.data : [],
);

const showFormModal = ref(false);
const editingCharacter = ref<ICharacter | undefined>(undefined);

function openCreateModal() {
	editingCharacter.value = undefined;
	showFormModal.value = true;
}

function openEditModal(character: ICharacter) {
	editingCharacter.value = character;
	showFormModal.value = true;
}
</script>

<template>
	<div class="flex items-start justify-between gap-4 mb-6">
		<div class="flex-1" />

		<button
			class="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
			@click="openCreateModal"
		>
			+ Add character
		</button>
	</div>

	<div
		v-if="characters.length === 0"
		class="flex flex-col items-center justify-center gap-3 text-center py-24"
	>
		<span class="text-4xl">♜</span>
		<p class="font-display text-xl text-ink">No characters yet.</p>
		<p class="text-sm text-ink-mute max-w-sm">
			Create a character sheet for each of your players. You can assign it to a party any time from here or from
			the party itself.
		</p>
		<button
			class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
			@click="openCreateModal"
		>
			+ Create your first character
		</button>
	</div>

	<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		<CharacterCard
			v-for="character in characters"
			:key="character.id"
			:character="character"
			@edit="openEditModal"
		/>
	</div>

	<CharacterFormModal v-model:visible="showFormModal" :character="editingCharacter" />
</template>
