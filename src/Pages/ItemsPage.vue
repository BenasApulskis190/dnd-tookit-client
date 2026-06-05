<script lang="ts" setup>
import { getAllItems, getItemTypeName } from "@/services/itemService"
import type { Item } from "@/Module/EncounterManager/types"
import List from "@/Module/List/List.vue"
import ItemItem from "@/Module/Items/ItemItem.vue"

const items = getAllItems()

function filtered(search: string): Item[] {
	const q = search.toLowerCase().trim()
	if (!q) return items
	return items.filter(
		(item) =>
			item.name.toLowerCase().includes(q) ||
			getItemTypeName(item.type).toLowerCase().includes(q) ||
			(item.rarity ?? "").toLowerCase().includes(q) ||
			item.source.toLowerCase().includes(q),
	)
}
</script>

<template>
	<List :search-by="['name', 'type', 'rarity', 'source']">
		<template #header="{ search }">
			<p class="mt-1 text-xs text-gray-400">
				{{ filtered(search).length }} items
			</p>
		</template>
		<template #default="{ search }">
			<ItemItem
				v-for="item in filtered(search)"
				:key="item.name + item.source"
				:item="item"
			/>
		</template>
	</List>
</template>
