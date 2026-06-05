<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { watchDebounced } from "@vueuse/core";
import type { IMonster } from "@/Module/Bestiary/types";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import DataTable, { type DataTableSortEvent } from "primevue/datatable";
import Column from "primevue/column";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { Monster } from "@/Module/EncounterManager/types";
import { AxiosError } from "axios";
import { resoleMonsterImageUrl } from "@/Module/Bestiary/util/monsterImageResolver";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";
import { useMonsterStore } from "@/Module/Bestiary/store/useMonsterStore";
import { storeToRefs } from "pinia";

function isPaginatedResponse(val: unknown): val is IPaginatedResponse<Monster> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	monsterFilter: {
		type: string | null;
	};
	search: string;
}>();

const monsterStore = useMonsterStore();

const { filter } = monsterStore;

const { data, isLoading, isError, error } = storeToRefs(monsterStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.monsterFilter.type,
	(type) => {
		filter.type = type && type !== "all" ? type : undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const monsters = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const selectedMonster = ref<IMonster | null>(null);

function onSort(e: DataTableSortEvent) {
	filter.sortBy = typeof e.sortField === "string" ? e.sortField : undefined;
	filter.sortOrder = e.sortOrder === 1 ? "asc" : "desc";
	filter.page = 1;
}

const showMonsterDetails = ref<boolean>(false);

watch(selectedMonster, (selected) => {
	if (selected) {
		showMonsterDetails.value = true;
	}
});

watch(showMonsterDetails, (visible) => {
	if (!visible) {
		selectedMonster.value = null;
	}
});
</script>

<template>
	<div class="flex flex-col gap-3 mt-4">

		<BaseDrawer v-model:visible="showMonsterDetails" position="right" :pt="{ root: { style: 'width: 45vw' } }">
			<MonsterDetails v-if="selectedMonster"
				:monster="selectedMonster"
			/>
		</BaseDrawer>

		<div v-if="isError" class="text-sm text-red-500">
			{{ error?.message }}
		</div>

		<DataTable
			v-else-if="monsters"
			:loading="isLoading"
			:value="monsters.data"
			class="text-sm"
			striped-rows
			v-model:selection="selectedMonster"
			:selection-mode="'single'"
			@sort="onSort"
		>
			<Column
				header="CR"
				sort-field="crValue"
				:sortable="true"
				class="w-32 text-center font-semibold"
			>
				<template #body="{ data: monster }">
					<div class="flex gap-2 items-center">
						<img
							:src="
								resoleMonsterImageUrl(
									monster.source,
									monster.name,
								)
							"
							class="h-9 w-8 shrink-0 rounded object-cover bg-gray-100"
						/>
						<div>
							{{ monster.challengeRating }}
						</div>
					</div>
				</template>
			</Column>

			<Column header="Name" sort-field="name" :sortable="true">
				<template #body="{ data: monster }">
					<div class="flex items-center gap-2">
						<span class="font-medium">{{ monster.name }}</span>
					</div>
				</template>
			</Column>

			<Column header="Type">
				<template #body="{ data: monster }">
					{{
						monster.type
							? monster.type
							: ((monster as any).monsterType?.name ?? "—")
					}}
				</template>
			</Column>

			<Column
				header="Size"
				field="size"
				sort-field="size"
				:sortable="true"
			/>

			<Column header="Alignment">
				<template #body="{ data: monster }">
					{{ monster.alignment }}
				</template>
			</Column>
		</DataTable>

		<BasePagination
			v-if="monsters"
			:rows="filter.limit"
			:totalRecords="monsters.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
