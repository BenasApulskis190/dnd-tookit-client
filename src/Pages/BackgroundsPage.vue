<script lang="ts" setup>
import { getAllBackgrounds } from "@/services/backgroundService"
import type { Background } from "@/Module/EncounterManager/types"
import List from "@/Module/List/List.vue"
import BackgroundItem from "@/Module/Backgrounds/BackgroundItem.vue"

const backgrounds = getAllBackgrounds()

function filtered(search: string): Background[] {
	const q = search.toLowerCase().trim()
	if (!q) return backgrounds
	return backgrounds.filter(
		(b) =>
			b.name.toLowerCase().includes(q) ||
			b.source.toLowerCase().includes(q),
	)
}
</script>

<template>
	<List :search-by="['name', 'source']">
		<template #header="{ search }">
			<p class="mt-1 text-xs text-gray-400">
				{{ filtered(search).length }} backgrounds
			</p>
		</template>
		<template #default="{ search }">
			<BackgroundItem
				v-for="background in filtered(search)"
				:key="background.name + background.source"
				:background="background"
			/>
		</template>
	</List>
</template>
