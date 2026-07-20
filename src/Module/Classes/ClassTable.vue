<script setup lang="ts">
import ClassDetails from "@/Module/Classes/ClassDetails.vue";
import { useClassStore } from "@/Module/Classes/store/useClassStore";
import { useClassIcons } from "@/Module/Classes/useClassIcons";
import type { IClass } from "@/Module/Classes/types";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import BaseTable, { type TableColumn } from "@/Module/Table/BaseTable.vue";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

function isPaginatedResponse(val: unknown): val is IPaginatedResponse<IClass> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	classFilter: { source: string | null };
	search: string;
}>();

const classStore = useClassStore();
const { filter } = classStore;
const { data, isLoading, isError, error } = storeToRefs(classStore);
const { getClassIcon } = useClassIcons();

watchDebounced(
	() => props.search,
	(val) => { filter.q = val; filter.page = 1; },
	{ debounce: 1000 },
);

watch(
	() => props.classFilter.source,
	(source) => { filter.source = source ?? undefined; filter.page = 1; },
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const classes = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const selectedClass = ref<IClass | null>(null);
const showClassDetails = ref(false);

watch(selectedClass, (selected) => { if (selected) showClassDetails.value = true; });
watch(showClassDetails, (visible) => { if (!visible) selectedClass.value = null; });

const columns: TableColumn[] = [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "hitDie", header: "Hit Die", sortField: "hitDie", sortable: true, class: "w-24" },
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
			v-model:visible="showClassDetails"
			position="right"
			class="w-[45vw]"
		>
			<ClassDetails v-if="selectedClass" :dnd-class="selectedClass" />
		</BaseDrawer>

		<div v-if="isError" class="text-sm text-red-500">{{ error?.message }}</div>

		<BaseTable
			v-else-if="classes"
			:loading="isLoading"
			:items="classes.data"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedClass"
			@sort="onSort"
		>
			<template #cell-name="{ item: dndClass }">
				<div class="flex items-center gap-2">
					<component
						:is="getClassIcon(dndClass.name)"
						v-if="getClassIcon(dndClass.name)"
						class="w-6 h-6 shrink-0"
					/>
					<span class="font-medium">{{ dndClass.name }}</span>
				</div>
			</template>

			<template #cell-hitDie="{ item: dndClass }">
				d{{ dndClass.hitDie }}
			</template>
		</BaseTable>

		<BasePagination
			v-if="classes"
			:rows="filter.limit"
			:totalRecords="classes.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
