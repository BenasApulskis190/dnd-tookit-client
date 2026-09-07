<script lang="ts" setup>
import { computed, ref } from "vue";
import { isAxiosError } from "axios";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import PartyCard from "@/Module/Party/PartyCard.vue";
import CreatePartyModal from "@/Module/Party/CreatePartyModal.vue";
import CharacterFormModal from "@/Module/Characters/CharacterFormModal.vue";

const partyStore = usePartyStore();

const parties = computed(() =>
	partyStore.data && !isAxiosError(partyStore.data) ? partyStore.data.data : [],
);

const showCreatePartyModal = ref(false);
const showCreateCharacterModal = ref(false);
const createCharacterPartyId = ref<string | undefined>(undefined);

function openCreateCharacterModal(partyId: string) {
	createCharacterPartyId.value = partyId;
	showCreateCharacterModal.value = true;
}
</script>

<template>
	<div class="flex items-start justify-between gap-4 mb-6">
		<div class="flex-1" />

		<button
			class="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
			@click="showCreatePartyModal = true"
		>
			+ Add party
		</button>
	</div>

	<div
		v-if="parties.length === 0"
		class="flex flex-col items-center justify-center gap-3 text-center py-24"
	>
		<span class="text-4xl">☘</span>
		<p class="font-display text-xl text-ink">No parties yet.</p>
		<p class="text-sm text-ink-mute max-w-sm">
			Create a party, then add your player characters to it. You can drop a whole party into an encounter at once.
		</p>
		<button
			class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
			@click="showCreatePartyModal = true"
		>
			+ Create your first party
		</button>
	</div>

	<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		<PartyCard v-for="party in parties" :key="party.id" :party="party" @create-character="openCreateCharacterModal" />
	</div>

	<CreatePartyModal v-model:visible="showCreatePartyModal" />
	<CharacterFormModal v-model:visible="showCreateCharacterModal" :party-id="createCharacterPartyId" />
</template>
