<script lang="ts" setup>
import { computed } from "vue";
import { isAxiosError } from "axios";
import { useCharacterStore } from "@/Module/Characters/store/useCharacterStore";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import CharacterAvatar from "@/Module/Characters/CharacterAvatar.vue";
import type { ICharacter } from "@/Module/Characters/types";

const props = defineProps<{ character: ICharacter }>();
const emit = defineEmits<{ edit: [character: ICharacter] }>();

const characterStore = useCharacterStore();
const partyStore = usePartyStore();

const parties = computed(() =>
	partyStore.data && !isAxiosError(partyStore.data) ? partyStore.data.data : [],
);

const subline = computed(() => {
	const parts = [`Level ${props.character.level}`];
	if (props.character.race) parts.push(props.character.race.name);
	if (props.character.class) parts.push(props.character.class.name);
	return parts.join(" · ");
});

async function assignToParty(event: Event) {
	const partyId = (event.target as HTMLSelectElement).value;
	if (!partyId) return;

	await partyStore.addCharacter(partyId, props.character.id);
}

function unassignFromParty() {
	if (!props.character.partyId) return;

	partyStore.removeCharacter(props.character.partyId, props.character.id);
}

function remove() {
	characterStore.remove(props.character.id);
}
</script>

<template>
	<div class="flex flex-col gap-2 rounded-[var(--radius)] border border-border bg-bg-elev p-4">
		<div class="flex items-start justify-between gap-2">
			<div class="flex items-start gap-2.5 min-w-0">
				<CharacterAvatar :image-url="character.imageUrl" :name="character.name" />

				<div class="min-w-0">
					<h4 class="font-display text-base text-ink truncate">{{ character.name }}</h4>
					<p class="text-xs text-ink-mute mt-0.5">{{ subline }}</p>
					<p v-if="character.playerName" class="text-xs text-ink-faint mt-0.5">Played by {{ character.playerName }}</p>
				</div>
			</div>

			<div class="flex shrink-0 items-center gap-2">
				<button
					class="text-ink-faint hover:text-accent transition-colors"
					title="Edit character"
					@click="emit('edit', character)"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
					</svg>
				</button>
				<button
					class="text-ink-faint hover:text-red-400 transition-colors"
					title="Delete character"
					@click="remove"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
					</svg>
				</button>
			</div>
		</div>

		<div v-if="character.armorClass != null || character.maxHp != null" class="flex gap-3 text-xs text-ink-soft">
			<span v-if="character.armorClass != null">AC {{ character.armorClass }}</span>
			<span v-if="character.maxHp != null">HP {{ character.currentHp ?? character.maxHp }}/{{ character.maxHp }}</span>
		</div>

		<div v-if="character.party" class="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg px-2.5 py-1.5">
			<span class="text-xs text-ink-soft truncate">{{ character.party.name }}</span>
			<button class="shrink-0 text-xs text-ink-faint hover:text-red-400" @click="unassignFromParty">
				Remove
			</button>
		</div>
		<select
			v-else
			class="w-full rounded-lg border border-dashed border-border bg-bg px-2.5 py-1.5 text-xs text-ink-mute focus:outline-none focus:border-accent"
			@change="assignToParty"
		>
			<option value="">+ Add to party…</option>
			<option v-for="party in parties" :key="party.id" :value="party.id">{{ party.name }}</option>
		</select>
	</div>
</template>
