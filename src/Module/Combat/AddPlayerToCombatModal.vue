<script lang="ts" setup>
import { computed } from "vue";
import { isAxiosError } from "axios";
import BaseModal from "@/Module/Modal/BaseModal.vue";
import CharacterAvatar from "@/Module/Characters/CharacterAvatar.vue";
import { useCharacterStore } from "@/Module/Characters/store/useCharacterStore";
import { useCombatStore } from "@/Module/Combat/store/useCombatStore";
import type { ICharacter } from "@/Module/Characters/types";

const props = defineProps<{ encounterId: string }>();

const visible = defineModel<boolean>("visible", { default: false });

const characterStore = useCharacterStore();
const combatStore = useCombatStore();

const characters = computed(() =>
	characterStore.data && !isAxiosError(characterStore.data) ? characterStore.data.data : [],
);

const availableCharacters = computed(() => {
	const combat = combatStore.getCombat(props.encounterId);
	const existingRefIds = new Set(
		(combat?.combatants ?? []).filter((c) => c.kind === "player").map((c) => c.refId),
	);
	return characters.value.filter((c) => !existingRefIds.has(c.id));
});

function addCharacter(character: ICharacter) {
	combatStore.addPlayerCombatant(props.encounterId, {
		id: character.id,
		name: character.name,
		imageUrl: character.imageUrl,
		dexScore: character.dexScore,
		maxHp: character.maxHp,
		currentHp: character.currentHp,
		armorClass: character.armorClass,
	});
}
</script>

<template>
	<BaseModal v-model:visible="visible" size="sm">
		<template #header>
			<h3 class="font-display text-lg text-ink">Add player</h3>
		</template>

		<div class="flex flex-col gap-2 p-4 max-h-[70vh] overflow-y-auto">
			<p v-if="availableCharacters.length === 0" class="text-xs text-ink-faint">
				All of your characters are already in this fight.
			</p>

			<div
				v-for="character in availableCharacters"
				:key="character.id"
				class="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-elev px-3 py-2"
			>
				<div class="flex items-center gap-2 min-w-0">
					<CharacterAvatar :image-url="character.imageUrl" :name="character.name" />
					<p class="text-sm text-ink-soft truncate">{{ character.name }}</p>
				</div>
				<button
					class="shrink-0 rounded-lg bg-accent px-3 py-1 text-xs font-medium text-bg hover:opacity-90 transition-opacity"
					@click="addCharacter(character)"
				>
					+ Add
				</button>
			</div>
		</div>
	</BaseModal>
</template>
