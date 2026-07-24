<script lang="ts" setup>
import BackgroundFilter from "@/Module/Backgrounds/BackgroundFilter.vue"
import BackgroundTable from "@/Module/Backgrounds/BackgroundTable.vue"
import { useBackgroundStore } from "@/Module/Backgrounds/store/useBackgroundStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const backgroundStore = useBackgroundStore()
const { isLoading } = storeToRefs(backgroundStore)

const filter = ref<{ source: string | null }>({ source: null })
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<BackgroundFilter
			class="mb-4"
			@source-select="(source) => (filter.source = source)"
		/>
		<BackgroundTable :backgroundFilter="filter" :search="search" />
		<router-view />
	</div>
</template>
