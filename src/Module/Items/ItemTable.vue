<script setup lang="ts">
import ItemDetails from "@/Module/Items/ItemDetails.vue";
import { useItemStore } from "@/Module/Items/store/useItemStore";
import type { IItem } from "@/Module/Items/types";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import BaseTable, { type TableColumn } from "@/Module/Table/BaseTable.vue";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

function isPaginatedResponse(val: unknown): val is IPaginatedResponse<IItem> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	itemFilter: { rarity: string | null };
	search: string;
}>();

const itemStore = useItemStore();
const { filter } = itemStore;
const { data, isLoading, isError, error } = storeToRefs(itemStore);

watchDebounced(
	() => props.search,
	(val) => { filter.q = val; filter.page = 1; },
	{ debounce: 1000 },
);

watch(
	() => props.itemFilter.rarity,
	(rarity) => { filter.rarity = rarity ?? undefined; filter.page = 1; },
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const items = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const selectedItem = ref<IItem | null>(null);
const showItemDetails = ref(false);

watch(selectedItem, (selected) => { if (selected) showItemDetails.value = true; });
watch(showItemDetails, (visible) => { if (!visible) selectedItem.value = null; });

const columns: TableColumn[] = [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "type", header: "Type", sortField: "type", sortable: true, class: "w-28" },
	{ key: "rarity", header: "Rarity", sortField: "rarity", sortable: true, class: "w-28" },
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
			v-model:visible="showItemDetails"
			position="right"
			class="w-[45vw]"
		>
			<ItemDetails v-if="selectedItem" :item="selectedItem" />
		</BaseDrawer>

		<div v-if="isError" class="text-sm text-red-500">{{ error?.message }}</div>

		<BaseTable
			v-else-if="items"
			:loading="isLoading"
			:items="items.data"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedItem"
			@sort="onSort"
		>
			<template #cell-name="{ item }">
				<span class="font-medium">{{ item.name }}</span>
			</template>

			<template #cell-rarity="{ item }">
				{{ item.rarity ?? "—" }}
			</template>
		</BaseTable>

		<BasePagination
			v-if="items"
			:rows="filter.limit"
			:totalRecords="items.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
