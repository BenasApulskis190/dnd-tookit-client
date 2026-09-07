<script setup lang="ts">
import { useMonsterStore } from "@/Module/Bestiary/store/useMonsterStore";
import type { IMonster } from "@/Module/Bestiary/types";
import { resoleMonsterImageUrl } from "@/Module/Bestiary/util/monsterImageResolver";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import BaseTable, { type TableColumn } from "@/Module/Table/BaseTable.vue";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

function isPaginatedResponse(val: unknown): val is IPaginatedResponse<IMonster> {
	return !(val instanceof AxiosError);
}

const props = withDefaults(
	defineProps<{
		monsterFilter: {
			type: string | null;
		};
		search: string;
		/** "navigate" (default) pushes to the /bestiary/:id route on row click,
		 * matching the Bestiary page. "select" instead emits `select` with the
		 * clicked monster, for embedding this table in a picker (e.g. adding a
		 * monster to an encounter) without leaving the current page. */
		mode?: "navigate" | "select";
		/** Adds a trailing "Actions" column rendered via the `actions` slot. */
		showActions?: boolean;
	}>(),
	{ mode: "navigate", showActions: false },
);

const emit = defineEmits<{ select: [monster: IMonster] }>();

const monsterStore = useMonsterStore();

const { filter } = monsterStore;

const { data, isFetching, isError, error } = storeToRefs(monsterStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.monsterFilter.type,
	(type) => {
		filter.type = type && type !== "all" ? type : undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const monsters = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const router = useRouter();

const selectedMonster = ref<IMonster | null>(null);

watch(selectedMonster, (monster) => {
	if (!monster) return;

	if (props.mode === "select") {
		emit("select", monster);
	} else {
		void router.push({ name: "bestiary-detail", params: { id: monster.id } });
	}
	selectedMonster.value = null;
});

const columns = computed<TableColumn[]>(() => [
	{ key: "cr", header: "CR", sortField: "crValue", sortable: true, class: "w-32 text-center font-semibold" },
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "type", header: "Type" },
	{ key: "size", header: "Size", sortField: "size", sortable: true },
	{ key: "alignment", header: "Alignment" },
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

		<div v-if="isError" class="text-sm text-red-500">
			{{ error?.message }}
		</div>

		<BaseTable
			v-else
			:loading="isFetching"
			:items="monsters?.data ?? []"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedMonster"
			@sort="onSort"
		>
			<template #cell-cr="{ item: monster }">
				<div class="flex gap-2 items-center">
					<img
						:src="
							resoleMonsterImageUrl(
								monster.source,
								monster.name,
							)
						"
						class="h-9 w-8 shrink-0 rounded object-cover bg-gray-100"
					/>
					<div>
						{{ monster.challengeRating }}
					</div>
				</div>
			</template>

			<template #cell-name="{ item: monster }">
				<div class="flex items-center gap-2">
					<span class="font-medium">{{ monster.name }}</span>
				</div>
			</template>

			<template #cell-type="{ item: monster }">
				{{
					monster.type
						? monster.type
						: ((monster as any).monsterType?.name ?? "—")
				}}
			</template>

			<template #cell-alignment="{ item: monster }">
				{{ monster.alignment }}
			</template>

			<template v-if="showActions" #cell-actions="{ item: monster }">
				<div class="flex justify-end" @click.stop>
					<slot name="actions" :monster="monster" />
				</div>
			</template>
		</BaseTable>

		<BasePagination
			v-if="monsters"
			:rows="filter.limit"
			:totalRecords="monsters.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
