<script lang="ts" setup>
import RaceFilter from "@/Module/Races/RaceFilter.vue"
import RaceTable from "@/Module/Races/RaceTable.vue"
import { useRaceStore } from "@/Module/Races/store/useRaceStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const raceStore = useRaceStore()
const { isLoading } = storeToRefs(raceStore)

const filter = ref<{ source: string | null }>({ source: null })
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<RaceFilter class="mb-4" @source-select="(source) => (filter.source = source)" />
		<RaceTable :raceFilter="filter" :search="search" />
		<router-view />
	</div>
</template>
