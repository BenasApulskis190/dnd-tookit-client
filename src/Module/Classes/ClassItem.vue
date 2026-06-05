<script lang="ts" setup>
import type { DnDClass } from "@/Module/EncounterManager/types"
import ClassDetails from "./ClassDetails.vue"
import ListItem from "@/Module/List/ListItem.vue"

defineProps<{ dndClass: DnDClass }>()
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">
					{{ dndClass.name }}
				</p>
				<p class="text-xs text-gray-400">
					d{{ dndClass.hd.faces }} hit die ·
					{{ dndClass.source }}
				</p>
			</div>
		</template>

		<template #details>
			<ClassDetails :dnd-class="dndClass" />
		</template>
	</ListItem>
</template>
