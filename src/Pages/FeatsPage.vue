<script lang="ts" setup>
import FeatFilter from "@/Module/Feats/FeatFilter.vue"
import FeatTable from "@/Module/Feats/FeatTable.vue"
import { useFeatStore } from "@/Module/Feats/store/useFeatStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const featStore = useFeatStore()
const { isLoading } = storeToRefs(featStore)

const filter = ref<{ source: string | null }>({ source: null })
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<FeatFilter class="mb-4" @source-select="(source) => (filter.source = source)" />
		<FeatTable :featFilter="filter" :search="search" />
		<router-view />
	</div>
</template>
