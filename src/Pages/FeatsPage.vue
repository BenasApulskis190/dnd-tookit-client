<script lang="ts" setup>
import { getAllFeats } from "@/services/featService"
import type { Feat } from "@/Module/EncounterManager/types"
import List from "@/Module/List/List.vue"
import FeatItem from "@/Module/Feats/FeatItem.vue"

const feats = getAllFeats()

function filtered(search: string): Feat[] {
	const q = search.toLowerCase().trim()
	if (!q) return feats
	return feats.filter(
		(f) =>
			f.name.toLowerCase().includes(q) ||
			f.source.toLowerCase().includes(q),
	)
}
</script>

<template>
	<List :search-by="['name', 'source']">
		<template #header="{ search }">
			<p class="mt-1 text-xs text-gray-400">
				{{ filtered(search).length }} feats
			</p>
		</template>
		<template #default="{ search }">
			<FeatItem
				v-for="feat in filtered(search)"
				:key="feat.name + feat.source"
				:feat="feat"
			/>
		</template>
	</List>
</template>
