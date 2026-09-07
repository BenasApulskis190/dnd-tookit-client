<script lang="ts" setup>
import { computed } from "vue";
import { isAxiosError } from "axios";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import { useCharacterStore } from "@/Module/Characters/store/useCharacterStore";
import CharacterAvatar from "@/Module/Characters/CharacterAvatar.vue";
import type { IParty } from "@/Module/Party/types";

const props = defineProps<{ party: IParty }>();
const emit = defineEmits<{ "create-character": [partyId: string] }>();

const partyStore = usePartyStore();
const characterStore = useCharacterStore();

const unassignedCharacters = computed(() =>
	characterStore.unassignedData && !isAxiosError(characterStore.unassignedData)
		? characterStore.unassignedData.data
		: [],
);

function characterSubline(character: IParty["characters"][number]) {
	const parts = [`Level ${character.level}`];
	if (character.race) parts.push(character.race.name);
	if (character.class) parts.push(character.class.name);
	return parts.join(" · ");
}

async function addExisting(event: Event) {
	const characterId = (event.target as HTMLSelectElement).value;
	if (!characterId) return;

	await partyStore.addCharacter(props.party.id, characterId);
	(event.target as HTMLSelectElement).value = "";
}

function removeCharacter(characterId: string) {
	partyStore.removeCharacter(props.party.id, characterId);
}

function remove() {
	partyStore.remove(props.party.id);
}
</script>

<template>
	<div class="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-bg-elev p-4">
		<div class="flex items-start justify-between gap-2">
			<div class="min-w-0">
				<h3 class="font-display text-lg text-ink truncate">{{ party.name }}</h3>
				<p v-if="party.description" class="text-sm text-ink-mute mt-0.5">{{ party.description }}</p>
			</div>

			<button
				class="shrink-0 text-ink-faint hover:text-red-400 transition-colors"
				title="Delete party"
				@click="remove"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
				</svg>
			</button>
		</div>

		<div v-if="party.characters.length" class="flex flex-col gap-1.5">
			<div
				v-for="character in party.characters"
				:key="character.id"
				class="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg px-2.5 py-1.5"
			>
				<div class="flex items-center gap-2 min-w-0">
					<CharacterAvatar :image-url="character.imageUrl" :name="character.name" />
					<div class="min-w-0">
						<p class="text-sm text-ink-soft truncate">{{ character.name }}</p>
						<p class="text-xs text-ink-faint">{{ characterSubline(character) }}</p>
					</div>
				</div>
				<button
					class="shrink-0 text-ink-faint hover:text-red-400"
					title="Remove from party"
					@click="removeCharacter(character.id)"
				>
					×
				</button>
			</div>
		</div>
		<p v-else class="text-xs text-ink-faint">No characters yet.</p>

		<select
			class="w-full rounded-lg border border-dashed border-border bg-bg px-2.5 py-1.5 text-xs text-ink-mute focus:outline-none focus:border-accent"
			@change="addExisting"
		>
			<option value="">+ Add existing character…</option>
			<option v-for="character in unassignedCharacters" :key="character.id" :value="character.id">
				{{ character.name }}
			</option>
		</select>

		<button
			class="self-start text-xs font-medium text-accent hover:underline"
			@click="emit('create-character', party.id)"
		>
			+ Create new character for this party
		</button>
	</div>
</template>
