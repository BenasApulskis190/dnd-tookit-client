<script lang="ts" setup>
import type { ICondition } from "@/Module/Conditions/types"
import ConditionDetails from "./ConditionDetails.vue"
import ListItem from "@/Module/List/ListItem.vue"

defineProps<{ condition: ICondition }>()
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">
					{{ condition.name }}
				</p>
				<p class="text-xs text-gray-400">{{ condition.source }}</p>
			</div>
		</template>

		<template #details>
			<ConditionDetails :condition="condition" />
		</template>
	</ListItem>
</template>
