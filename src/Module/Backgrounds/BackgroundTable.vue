<script setup lang="ts">
import { useBackgroundStore } from "@/Module/Backgrounds/store/useBackgroundStore";
import type { IBackground } from "@/Module/Backgrounds/types";
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
): val is IPaginatedResponse<IBackground> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	backgroundFilter: {
		source: string | null;
	};
	search: string;
}>();

const backgroundStore = useBackgroundStore();
const { filter } = backgroundStore;
const { data, isFetching, isError, error } = storeToRefs(backgroundStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.backgroundFilter.source,
	(source) => {
		filter.source = source ?? undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const backgrounds = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const router = useRouter();

const selectedBackground = ref<IBackground | null>(null);

watch(selectedBackground, (background) => {
	if (background) {
		void router.push({ name: "backgrounds-detail", params: { id: background.id } });
		selectedBackground.value = null;
	}
});

const columns: TableColumn[] = [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
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
			:items="backgrounds?.data ?? []"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedBackground"
			@sort="onSort"
		>
			<template #cell-name="{ item }">
				<span class="font-medium">{{ item.name }}</span>
			</template>
		</BaseTable>

		<BasePagination
			v-if="backgrounds"
			:rows="filter.limit"
			:totalRecords="backgrounds.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
