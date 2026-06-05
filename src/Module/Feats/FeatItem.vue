<script lang="ts" setup>
import { computed } from "vue"
import type { Feat } from "@/Module/EncounterManager/types"
import FeatDetails from "./FeatDetails.vue"
import ListItem from "@/Module/List/ListItem.vue"

const props = defineProps<{ feat: Feat }>()

const prerequisite = computed(() => {
	const pre = props.feat.prerequisite
	if (!pre?.length) return null
	return pre
		.flatMap((p) => p.race?.map((r) => r.name) ?? [])
		.join(", ")
})
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">
					{{ feat.name }}
				</p>
				<p class="text-xs text-gray-400">
					<span v-if="prerequisite">{{ prerequisite }} · </span>
					{{ feat.source }}
				</p>
			</div>
		</template>

		<template #details>
			<FeatDetails :feat="feat" />
		</template>
	</ListItem>
</template>
