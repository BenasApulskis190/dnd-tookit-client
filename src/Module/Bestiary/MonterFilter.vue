<script lang="ts" setup>
import BaseFilter from "@/Module/Filters/BaseFilter.vue";

import { monsterTypeApi } from "@/Module/Bestiary/api/monsterTypeApi";
import { useQuery } from "@tanstack/vue-query";
import { watch } from "vue";
import BaseBox from "@/Module/Box/BaseBox.vue";

const emit = defineEmits<{
	filterSelect: [item: { id: string; name: string }];
}>();

const { data, isLoading, isError, error } = useQuery({
	queryKey: ["monstersType"],
	queryFn: () => monsterTypeApi.getAll(),
});

watch(isError, (err) => {
	if (err) {
		console.log("handle error", error);

		return;
	}

	console.log("no erros");
});
</script>

<template>
	<BaseBox>
		<div>
			<div v-if="isLoading">loading...</div>
			<BaseFilter
				v-else
				:items="[{ name: 'all', id: 'all-monsters-id' }, ...data]"
				@filter-select="(item) => emit('filterSelect', item)"
			/>
		</div>
	</BaseBox>
</template>
