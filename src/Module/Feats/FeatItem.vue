<script lang="ts" setup>
import type { IFeat } from "@/Module/Feats/types"
import FeatDetails from "./FeatDetails.vue"
import ListItem from "@/Module/List/ListItem.vue"

defineProps<{ feat: IFeat }>()
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">{{ feat.name }}</p>
				<p class="text-xs text-gray-400">{{ feat.source }}</p>
			</div>
		</template>
		<template #details>
			<FeatDetails :feat="feat" />
		</template>
	</ListItem>
</template>
