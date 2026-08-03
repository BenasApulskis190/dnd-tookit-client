<script lang="ts" setup>
import NpcFilter from "@/Module/Npcs/NpcFilter.vue"
import NpcTable from "@/Module/Npcs/NpcTable.vue"
import { useNpcStore } from "@/Module/Npcs/store/useNpcStore"
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const npcStore = useNpcStore()
const { isLoading } = storeToRefs(npcStore)

const filter = ref<{ adventure: string | null }>({ adventure: null })
const search = ref("")
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<NpcFilter class="mb-4" @adventure-select="(adventure) => (filter.adventure = adventure)" />
		<NpcTable :npcFilter="filter" :search="search" />
		<router-view />
	</div>
</template>
