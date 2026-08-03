<script setup lang="ts">
import { useItemStore } from "@/Module/Items/store/useItemStore";
import type { IItem } from "@/Module/Items/types";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import BaseTable, { type TableColumn } from "@/Module/Table/BaseTable.vue";
import { attunementLabel, hasRarity, itemTypeLabel, valueLabel } from "@/Module/Items/util/itemFormat";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

function isPaginatedResponse(val: unknown): val is IPaginatedResponse<IItem> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	itemFilter: { rarity: string | null; type: string | null; magic: boolean | null };
	search: string;
}>();

const itemStore = useItemStore();
const { filter } = itemStore;
const { data, isFetching, isError, error } = storeToRefs(itemStore);

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

watch(
	() => props.itemFilter.type,
	(type) => { filter.type = type ?? undefined; filter.page = 1; },
	{ immediate: true },
);

watch(
	() => props.itemFilter.magic,
	(magic) => { filter.magic = magic ?? undefined; filter.page = 1; },
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const items = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const router = useRouter();

// Row selection navigates to the detail child route (/items/:id).
const selectedItem = ref<IItem | null>(null);

watch(selectedItem, (item) => {
	if (item) {
		void router.push({ name: "items-detail", params: { id: item.id } });
		selectedItem.value = null;
	}
});

const columns: TableColumn[] = [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "type", header: "Type", sortField: "type", sortable: true, class: "w-28" },
	{ key: "rarity", header: "Rarity", sortField: "rarity", sortable: true, class: "w-28" },
	{ key: "value", header: "Value", sortField: "valueGp", sortable: true, class: "w-28" },
	{ key: "attunement", header: "Attunement", sortField: "attunement", sortable: true, class: "w-24" },
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
			:items="items?.data ?? []"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedItem"
			@sort="onSort"
		>
			<template #cell-name="{ item }">
				<span class="font-medium">{{ item.name }}</span>
			</template>

			<template #cell-type="{ item }">
				{{ itemTypeLabel(item.type) || "—" }}
			</template>

			<template #cell-rarity="{ item }">
				{{ hasRarity(item.rarity) ? item.rarity : "—" }}
			</template>

			<template #cell-value="{ item }">
				{{ valueLabel(item) }}
			</template>

			<template #cell-attunement="{ item }">
				{{ attunementLabel(item) }}
			</template>

			<template #cell-source="{ item }">
				{{ item.source || "—" }}
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
