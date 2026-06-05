<script lang="ts" setup>
import { getAllConditions } from "@/services/conditionService"
import type { Condition } from "@/Module/EncounterManager/types"
import List from "@/Module/List/List.vue"
import ConditionItem from "@/Module/Conditions/ConditionItem.vue"

const conditions = getAllConditions()

function filtered(search: string): Condition[] {
	const q = search.toLowerCase().trim()
	if (!q) return conditions
	return conditions.filter((c) => c.name.toLowerCase().includes(q))
}
</script>

<template>
	<List :search-by="['name']">
		<template #header="{ search }">
			<p class="mt-1 text-xs text-gray-400">
				{{ filtered(search).length }} conditions
			</p>
		</template>
		<template #default="{ search }">
			<ConditionItem
				v-for="condition in filtered(search)"
				:key="condition.name + condition.source"
				:condition="condition"
			/>
		</template>
	</List>
</template>
