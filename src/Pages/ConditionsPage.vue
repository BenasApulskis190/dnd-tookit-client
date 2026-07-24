<script lang="ts" setup>
import ConditionFilter from "@/Module/Conditions/ConditionFilter.vue"
import ConditionTable from "@/Module/Conditions/ConditionTable.vue"
import { useConditionStore } from "@/Module/Conditions/store/useConditionStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const conditionStore = useConditionStore()
const { isLoading } = storeToRefs(conditionStore)

const filter = ref<{ source: string | null }>({ source: null })
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<ConditionFilter
			class="mb-4"
			@source-select="(source) => (filter.source = source)"
		/>
		<ConditionTable :conditionFilter="filter" :search="search" />
		<router-view />
	</div>
</template>
