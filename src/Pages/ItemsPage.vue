<script lang="ts" setup>
import ItemFilter from "@/Module/Items/ItemFilter.vue"
import ItemTable from "@/Module/Items/ItemTable.vue"
import { useItemStore } from "@/Module/Items/store/useItemStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const itemStore = useItemStore()
const { isLoading } = storeToRefs(itemStore)

const filter = ref<{ rarity: string | null }>({ rarity: null })
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<ItemFilter class="mb-4" @rarity-select="(rarity) => (filter.rarity = rarity)" />
		<ItemTable :itemFilter="filter" :search="search" />
	</div>
</template>
