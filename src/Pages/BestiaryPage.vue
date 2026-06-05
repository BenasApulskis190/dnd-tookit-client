<script lang="ts" setup>
import MonsterTable from "@/Module/Bestiary/MonsterTable.vue";
import MonterFilter from "@/Module/Bestiary/MonterFilter.vue";
import { useMonsterStore } from "@/Module/Bestiary/store/useMonsterStore";
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const handleFilterSelect = (item: { id: string; name: string }) => {
	filter.value.type = item.name;
};

const monsterStore = useMonsterStore();

const { isLoading} = storeToRefs(monsterStore);

const filter = ref<{ type: string | null }>({ type: null });
const search = ref<string>("");
</script>

<template>
	<div>
		<BaseSearchBar v-model="search" class="mb-4" :loading="isLoading" />
		<MonterFilter @filter-select="handleFilterSelect" class="mb-4" />
		<MonsterTable :monsterFilter="filter" :search="search" />
	</div>
</template>
