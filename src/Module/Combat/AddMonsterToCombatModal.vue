<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import BaseModal from "@/Module/Modal/BaseModal.vue";
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue";
import MonterFilter from "@/Module/Bestiary/MonterFilter.vue";
import MonsterTable from "@/Module/Bestiary/MonsterTable.vue";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";
import { useMonsterStore } from "@/Module/Bestiary/store/useMonsterStore";
import { useCombatStore } from "@/Module/Combat/store/useCombatStore";
import type { IMonster } from "@/Module/Bestiary/types";

const props = defineProps<{ encounterId: string }>();

const visible = defineModel<boolean>("visible", { default: false });

const monsterStore = useMonsterStore();
const combatStore = useCombatStore();
const drawers = useDrawerStore();
const { isLoading } = storeToRefs(monsterStore);

const search = ref("");
const typeFilter = ref<{ type: string | null }>({ type: null });

function handleFilterSelect(item: { id: string; name: string }) {
	typeFilter.value.type = item.name;
}

function addMonster(monster: IMonster) {
	if (!monster.id) return;

	combatStore.addMonsterCombatant(props.encounterId, {
		id: monster.id,
		name: monster.name,
		source: monster.source,
		hitPointsAvg: monster.hitPointsAvg ?? null,
		armorClass: monster.armorClass ?? null,
		dexScore: monster.dexScore ?? null,
	});
}

function viewDetails(monster: IMonster) {
	if (!monster.id) return;
	drawers.open("monster", { component: MonsterDetails, props: { id: monster.id }, width: "w-[45vw]" });
}
</script>

<template>
	<BaseModal v-model:visible="visible" size="full-screen">
		<template #header>
			<h3 class="font-display text-lg text-ink">Add monster to combat</h3>
		</template>

		<div class="flex flex-1 min-h-0 flex-col gap-4 p-4 overflow-y-auto">
			<BaseSearchBar v-model="search" :loading="isLoading" />
			<MonterFilter @filter-select="handleFilterSelect" />

			<MonsterTable :monster-filter="typeFilter" :search="search" mode="select" show-actions @select="viewDetails">
				<template #actions="{ monster }">
					<button
						class="rounded-lg bg-accent px-3 py-1 text-xs font-medium text-bg hover:opacity-90 transition-opacity"
						@click="addMonster(monster)"
					>
						+ Add
					</button>
				</template>
			</MonsterTable>
		</div>
	</BaseModal>
</template>
