<script lang="ts" setup>
import AdventureFilter from "@/Module/Adventures/AdventureFilter.vue"
import AdventureTable from "@/Module/Adventures/AdventureTable.vue"
import { useAdventureStore } from "@/Module/Adventures/store/useAdventureStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const adventureStore = useAdventureStore()
const { isLoading } = storeToRefs(adventureStore)

const filter = ref<{ storyline: string | null }>({ storyline: null })
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<AdventureFilter class="mb-4" @storyline-select="(storyline) => (filter.storyline = storyline)" />
		<AdventureTable :adventureFilter="filter" :search="search" />
	</div>
</template>
