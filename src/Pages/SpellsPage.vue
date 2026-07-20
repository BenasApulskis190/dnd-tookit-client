<script lang="ts" setup>
import SpellFilter from "@/Module/Spells/SpellFilter.vue"
import SpellTable from "@/Module/Spells/SpellTable.vue"
import { useSpellStore } from "@/Module/Spells/store/useSpellStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const spellStore = useSpellStore()
const { isLoading } = storeToRefs(spellStore)

const filter = ref<{ level: number | null; school: string | null }>({
	level: null,
	school: null,
})
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<SpellFilter
			class="mb-4"
			@level-select="(level) => (filter.level = level)"
			@school-select="(school) => (filter.school = school)"
		/>
		<SpellTable :spellFilter="filter" :search="search" />
	</div>
</template>
