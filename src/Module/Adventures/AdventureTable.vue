<script setup lang="ts">
import { useAdventureStore } from "@/Module/Adventures/store/useAdventureStore";
import type { IAdventure } from "@/Module/Adventures/types";
import { levelRangeLabel } from "@/Module/Adventures/util/adventureFormat";
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
): val is IPaginatedResponse<IAdventure> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	adventureFilter: {
		storyline: string | null;
	};
	search: string;
}>();

const adventureStore = useAdventureStore();
const { filter } = adventureStore;
const { data, isFetching, isError, error } = storeToRefs(adventureStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.adventureFilter.storyline,
	(storyline) => {
		filter.storyline = storyline ?? undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const adventures = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const router = useRouter();

// Adventures carry chapters + NPCs, so the detail is its own full page (like
// Classes) rather than a drawer overlay — row selection navigates there.
const selectedAdventure = ref<IAdventure | null>(null);

watch(selectedAdventure, (adventure) => {
	if (adventure) {
		void router.push({ name: "adventures-detail", params: { id: adventure.code } });
		selectedAdventure.value = null;
	}
});

const columns: TableColumn[] = [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "code", header: "Code", class: "w-20" },
	{ key: "levels", header: "Levels", class: "w-20" },
	{ key: "storyline", header: "Storyline", class: "w-40" },
];
</script>

<template>
	<div class="flex flex-col gap-3 mt-4">
		<div v-if="isError" class="text-sm text-red-500">
			{{ error?.message }}
		</div>

		<BaseTable
			v-else
			:loading="isFetching"
			:items="adventures?.data ?? []"
			:columns="columns"
			v-model:selection="selectedAdventure"
		>
			<template #cell-name="{ item }">
				<span class="font-medium">{{ item.name }}</span>
			</template>
			<template #cell-levels="{ item }">
				{{ levelRangeLabel(item) }}
			</template>
			<template #cell-storyline="{ item }">
				{{ item.storyline ?? "—" }}
			</template>
		</BaseTable>

		<BasePagination
			v-if="adventures"
			:rows="filter.limit"
			:totalRecords="adventures.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
