<script lang="ts" setup>
import { getAllClasses } from "@/services/classService"
import type { DnDClass } from "@/Module/EncounterManager/types"
import List from "@/Module/List/List.vue"
import ClassItem from "@/Module/Classes/ClassItem.vue"

const classes = getAllClasses()

function filtered(search: string): DnDClass[] {
	const q = search.toLowerCase().trim()
	if (!q) return classes
	return classes.filter((c) => c.name.toLowerCase().includes(q))
}
</script>

<template>
	<List :search-by="['name']">
		<template #header="{ search }">
			<p class="mt-1 text-xs text-gray-400">
				{{ filtered(search).length }} classes
			</p>
		</template>
		<template #default="{ search }">
			<ClassItem
				v-for="dndClass in filtered(search)"
				:key="dndClass.name + dndClass.source"
				:dnd-class="dndClass"
			/>
		</template>
	</List>
</template>
