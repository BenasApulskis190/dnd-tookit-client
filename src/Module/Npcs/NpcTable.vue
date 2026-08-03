<script setup lang="ts">
import { useNpcStore } from "@/Module/Npcs/store/useNpcStore";
import type { INpc } from "@/Module/Npcs/types";
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
): val is IPaginatedResponse<INpc> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	npcFilter: {
		adventure: string | null;
	};
	search: string;
}>();

const npcStore = useNpcStore();
const { filter } = npcStore;
const { data, isFetching, isError, error } = storeToRefs(npcStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.npcFilter.adventure,
	(adventure) => {
		filter.adventure = adventure ?? undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const npcs = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const router = useRouter();

// Row selection navigates to the detail child route (/npcs/:id).
const selectedNpc = ref<INpc | null>(null);

watch(selectedNpc, (npc) => {
	if (npc) {
		void router.push({ name: "npcs-detail", params: { id: npc.id } });
		selectedNpc.value = null;
	}
});

const columns: TableColumn[] = [
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "location", header: "Location", class: "w-48" },
	{ key: "adventure", header: "Adventure", class: "w-32" },
	{ key: "cr", header: "CR", class: "w-16" },
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
			:items="npcs?.data ?? []"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedNpc"
			@sort="onSort"
		>
			<template #cell-name="{ item }">
				<span class="font-medium">{{ item.name }}</span>
			</template>
			<template #cell-location="{ item }">
				<span class="text-ink-mute">{{ item.location ?? "—" }}</span>
			</template>
			<template #cell-adventure="{ item }">
				{{ item.adventure.code }}
			</template>
			<template #cell-cr="{ item }">
				{{ item.monster?.challengeRating ?? "—" }}
			</template>
		</BaseTable>

		<BasePagination
			v-if="npcs"
			:rows="filter.limit"
			:totalRecords="npcs.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
