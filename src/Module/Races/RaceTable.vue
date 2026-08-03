<script setup lang="ts">
import { useRaceStore } from "@/Module/Races/store/useRaceStore";
import type { IRace } from "@/Module/Races/types";
import { sizeLabel } from "@/Module/Races/util/raceFormat";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import BaseTable, { type TableColumn } from "@/Module/Table/BaseTable.vue";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

function isPaginatedResponse(
	val: unknown,
): val is IPaginatedResponse<IRace> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	raceFilter: {
		source: string | null;
	};
	search: string;
}>();

const raceStore = useRaceStore();
const { filter } = raceStore;
const { data, isFetching, isError, error } = storeToRefs(raceStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.raceFilter.source,
	(source) => {
		filter.source = source ?? undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const races = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const router = useRouter();

// Row selection navigates to the detail child route (/races/:id).
const selectedRace = ref<IRace | null>(null);

watch(selectedRace, (race) => {
	if (race) {
		void router.push({ name: "races-detail", params: { id: race.id } });
		selectedRace.value = null;
	}
});

const columns: TableColumn[] = [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "size", header: "Size", class: "w-24" },
	{ key: "speed", header: "Speed", class: "w-24" },
	{ key: "source", header: "Source", sortField: "source", sortable: true, class: "w-24" },
];

function onSort(e: { sortField: string; sortOrder: "asc" | "desc" }) {
	filter.sortBy = e.sortField;
	filter.sortOrder = e.sortOrder;
	filter.page = 1;
}
</script>

<template>
	<div class="flex flex-col gap-3 mt-4">
		<div v-if="isError" class="text-sm text-red-500">
			{{ error?.message }}
		</div>

		<BaseTable
			v-else
			:loading="isFetching"
			:items="races?.data ?? []"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedRace"
			@sort="onSort"
		>
			<template #cell-name="{ item }">
				<span class="font-medium">{{ item.name }}</span>
			</template>
			<template #cell-size="{ item }">
				{{ sizeLabel(item.size) }}
			</template>
			<template #cell-speed="{ item }"> {{ item.speed }} ft. </template>
		</BaseTable>

		<BasePagination
			v-if="races"
			:rows="filter.limit"
			:totalRecords="races.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
