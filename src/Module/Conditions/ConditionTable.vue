<script setup lang="ts">
import ConditionDetails from "@/Module/Conditions/ConditionDetails.vue";
import { useConditionStore } from "@/Module/Conditions/store/useConditionStore";
import type { ICondition } from "@/Module/Conditions/types";
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
): val is IPaginatedResponse<ICondition> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	conditionFilter: {
		source: string | null;
	};
	search: string;
}>();

const conditionStore = useConditionStore();
const { filter } = conditionStore;
const { data, isLoading, isError, error } = storeToRefs(conditionStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.conditionFilter.source,
	(source) => {
		filter.source = source ?? undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const conditions = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const selectedCondition = ref<ICondition | null>(null);
const showConditionDetails = ref(false);

watch(selectedCondition, (selected) => {
	if (selected) showConditionDetails.value = true;
});

watch(showConditionDetails, (visible) => {
	if (!visible) selectedCondition.value = null;
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
			v-model:visible="showConditionDetails"
			position="right"
			class="w-[45vw]"
		>
			<ConditionDetails
				v-if="selectedCondition"
				:condition="selectedCondition"
			/>
		</BaseDrawer>

		<div v-if="isError" class="text-sm text-red-500">
			{{ error?.message }}
		</div>

		<BaseTable
			v-else-if="conditions"
			:loading="isLoading"
			:items="conditions.data"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedCondition"
			@sort="onSort"
		>
			<template #cell-name="{ item }">
				<span class="font-medium">{{ item.name }}</span>
			</template>
		</BaseTable>

		<BasePagination
			v-if="conditions"
			:rows="filter.limit"
			:totalRecords="conditions.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
