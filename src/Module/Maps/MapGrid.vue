<script setup lang="ts">
import { useMapStore } from "@/Module/Maps/store/useMapStore";
import MapCard from "@/Module/Maps/MapCard.vue";
import type { IMap } from "@/Module/Maps/types";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";

const props = defineProps<{
	mapFilter: { adventure: string | null };
	search: string;
}>();

const mapStore = useMapStore();
const { filter } = mapStore;
const { data, isFetching, isError, error } = storeToRefs(mapStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.mapFilter.adventure,
	(adventure) => {
		filter.adventure = adventure ?? undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const maps = computed<IPaginatedResponse<IMap> | null>(() => {
	const val = data.value;
	return !val || val instanceof AxiosError ? null : val;
});
</script>

<template>
	<div class="mt-4 flex flex-col gap-3">
		<div v-if="isError" class="text-sm text-red-500">
			{{ error?.message }}
		</div>

		<template v-else>
			<div
				v-if="maps?.data.length"
				:class="[
					'grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
					isFetching ? 'opacity-60' : '',
				]"
			>
				<MapCard v-for="map in maps.data" :key="map.id" :map="map" />
			</div>

			<div v-else-if="isFetching" class="text-sm text-ink-mute">
				Loading…
			</div>
			<div v-else class="text-sm text-ink-mute">
				No maps match that search.
			</div>

			<BasePagination
				v-if="maps"
				:rows="filter.limit"
				:totalRecords="maps.pagination.total"
				:first="(filter.page - 1) * filter.limit"
				@page="onPageChange"
			/>
		</template>
	</div>
</template>
