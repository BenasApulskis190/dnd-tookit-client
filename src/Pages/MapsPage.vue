<script lang="ts" setup>
import MapFilter from "@/Module/Maps/MapFilter.vue";
import MapGrid from "@/Module/Maps/MapGrid.vue";
import { useMapStore } from "@/Module/Maps/store/useMapStore";
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const mapStore = useMapStore();
const { isLoading } = storeToRefs(mapStore);

const filter = ref<{ adventure: string | null }>({ adventure: null });
const search = ref("");
</script>

<template>
	<div>
		<BaseSearchBar
			v-model="search"
			class="mb-4"
			:loading="isLoading"
			placeholder="Search maps..."
		/>
		<MapFilter
			class="mb-4"
			@adventure-select="(adventure) => (filter.adventure = adventure)"
		/>
		<MapGrid :mapFilter="filter" :search="search" />
	</div>
</template>
