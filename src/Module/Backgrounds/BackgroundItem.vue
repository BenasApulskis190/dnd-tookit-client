<script lang="ts" setup>
import type { IBackground } from "@/Module/Backgrounds/types"
import ListItem from "@/Module/List/ListItem.vue"

defineProps<{ background: IBackground }>()
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
			<h1>BACKGROUND details</h1>
		</template>
	</ListItem>
</template>
