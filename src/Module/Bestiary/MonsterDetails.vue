<script lang="ts" setup>
import { monstersApi } from "@/Module/Bestiary/api/monsterApi";
import type { IMonster } from "@/Module/Bestiary/types";
import { useQuery } from "@tanstack/vue-query";

const props = defineProps<{ monster: IMonster }>();

const { data, isLoading, isError, error } = useQuery({
	queryKey: ["monster", props.monster.id],
	queryFn: () => monstersApi.getById(props.monster.id),
});
</script>

<template>
	<div>
		<div>{{ monster.name }}</div>
		<div>{{ monster.id }}</div>
		<pre v-if="!isLoading">
			{{ data }}
		</pre
		>
	</div>
</template>
