<script setup lang="ts">
import BackgroundDetails from "@/Module/Backgrounds/BackgroundDetails.vue";
import { useBackgroundStore } from "@/Module/Backgrounds/store/useBackgroundStore";
import type { IBackground } from "@/Module/Backgrounds/types";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import BaseTable, { type TableColumn } from "@/Module/Table/BaseTable.vue";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

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
const { data, isLoading, isError, error } = storeToRefs(backgroundStore);

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

const selectedBackground = ref<IBackground | null>(null);
const showBackgroundDetails = ref(false);

watch(selectedBackground, (selected) => {
	if (selected) showBackgroundDetails.value = true;
});

watch(showBackgroundDetails, (visible) => {
	if (!visible) selectedBackground.value = null;
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
		<BaseDrawer
			v-model:visible="showBackgroundDetails"
			position="right"
			class="w-[45vw]"
		>
			<BackgroundDetails
				v-if="selectedBackground"
				:background="selectedBackground"
			/>
		</BaseDrawer>

		<div v-if="isError" class="text-sm text-red-500">
			{{ error?.message }}
		</div>

		<BaseTable
			v-else-if="backgrounds"
			:loading="isLoading"
			:items="backgrounds.data"
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
