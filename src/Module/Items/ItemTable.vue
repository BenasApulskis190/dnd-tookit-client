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

const props = withDefaults(
	defineProps<{
		itemFilter: { rarity: string | null; type: string | null; magic: boolean | null };
		search: string;
		/** "navigate" (default) pushes to the /items/:id route on row click. "select"
		 * instead emits `select` with the clicked item, for embedding this table in a
		 * picker (e.g. adding loot to an encounter) without leaving the current page. */
		mode?: "navigate" | "select";
		/** Adds a trailing "Actions" column rendered via the `actions` slot. */
		showActions?: boolean;
	}>(),
	{ mode: "navigate", showActions: false },
);

const emit = defineEmits<{ select: [item: IItem] }>();

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

// Row selection navigates to the detail child route (/items/:id) by default,
// or emits `select` when used as a picker (see `mode` prop).
const selectedItem = ref<IItem | null>(null);

watch(selectedItem, (item) => {
	if (!item) return;

	if (props.mode === "select") {
		emit("select", item);
	} else {
		void router.push({ name: "items-detail", params: { id: item.id } });
	}
	selectedItem.value = null;
});

const columns = computed<TableColumn[]>(() => [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "type", header: "Type", sortField: "type", sortable: true, class: "w-28" },
	{ key: "rarity", header: "Rarity", sortField: "rarity", sortable: true, class: "w-28" },
	{ key: "value", header: "Value", sortField: "valueGp", sortable: true, class: "w-28" },
	{ key: "attunement", header: "Attunement", sortField: "attunement", sortable: true, class: "w-24" },
	{ key: "source", header: "Source", sortField: "source", sortable: true, class: "w-24" },
	...(props.showActions ? [{ key: "actions", header: "", class: "w-24" }] : []),
]);

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

			<template v-if="showActions" #cell-actions="{ item }">
				<div class="flex justify-end" @click.stop>
					<slot name="actions" :item="item" />
				</div>
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
