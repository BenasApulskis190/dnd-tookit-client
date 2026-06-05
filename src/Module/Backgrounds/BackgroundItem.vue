<script lang="ts" setup>
import type { Background } from "@/Module/EncounterManager/types"
import BackgroundDetails from "./BackgroundDetails.vue"
import ListItem from "@/Module/List/ListItem.vue"

defineProps<{ background: Background }>()
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">
					{{ background.name }}
				</p>
				<p class="text-xs text-gray-400">
					<span v-if="background.skillProficiencies">
						{{ background.skillProficiencies }} ·
					</span>
					{{ background.source }}
				</p>
			</div>
		</template>

		<template #details>
			<BackgroundDetails :background="background" />
		</template>
	</ListItem>
</template>
