<script lang="ts" setup>
import ClassFilter from "@/Module/Classes/ClassFilter.vue"
import ClassTable from "@/Module/Classes/ClassTable.vue"
import { useClassStore } from "@/Module/Classes/store/useClassStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const classStore = useClassStore()
const { isLoading } = storeToRefs(classStore)

const filter = ref<{ source: string | null }>({ source: null })
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<ClassFilter class="mb-4" @source-select="(source) => (filter.source = source)" />
		<ClassTable :classFilter="filter" :search="search" />
	</div>
</template>
