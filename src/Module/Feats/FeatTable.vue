<script setup lang="ts">
import { useFeatStore } from "@/Module/Feats/store/useFeatStore";
import type { IFeat } from "@/Module/Feats/types";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import BaseTable, { type TableColumn } from "@/Module/Table/BaseTable.vue";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

function isPaginatedResponse(val: unknown): val is IPaginatedResponse<IFeat> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	featFilter: { source: string | null };
	search: string;
}>();

const featStore = useFeatStore();
const { filter } = featStore;
const { data, isFetching, isError, error } = storeToRefs(featStore);

watchDebounced(
	() => props.search,
	(val) => { filter.q = val; filter.page = 1; },
	{ debounce: 1000 },
);

watch(
	() => props.featFilter.source,
	(source) => { filter.source = source ?? undefined; filter.page = 1; },
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const feats = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const router = useRouter();

// Row selection navigates to the detail child route (/feats/:id).
const selectedFeat = ref<IFeat | null>(null);

watch(selectedFeat, (feat) => {
	if (feat) {
		void router.push({ name: "feats-detail", params: { id: feat.id } });
		selectedFeat.value = null;
	}
});

const columns: TableColumn[] = [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "prerequisite", header: "Prerequisite" },
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
		<div v-if="isError" class="text-sm text-red-500">{{ error?.message }}</div>

		<BaseTable
			v-else
			:loading="isFetching"
			:items="feats?.data ?? []"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedFeat"
			@sort="onSort"
		>
			<template #cell-name="{ item: feat }">
				<span class="font-medium">{{ feat.name }}</span>
			</template>

			<template #cell-prerequisite="{ item: feat }">
				<span class="text-xs text-gray-500">
					{{ typeof feat.prerequisite === "string" ? feat.prerequisite : feat.prerequisite ? "See details" : "—" }}
				</span>
			</template>
		</BaseTable>

		<BasePagination
			v-if="feats"
			:rows="filter.limit"
			:totalRecords="feats.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
