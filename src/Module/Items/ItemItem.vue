<script lang="ts" setup>
import type { Item } from "@/Module/EncounterManager/types"
import { getItemTypeName } from "@/services/itemService"
import ItemDetails from "./ItemDetails.vue"
import ListItem from "@/Module/List/ListItem.vue"

defineProps<{ item: Item }>()
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">
					{{ item.name }}
				</p>
				<p class="text-xs text-gray-400">
					{{ getItemTypeName(item.type) }}
					<span v-if="item.rarity && item.rarity !== 'None'">
						· {{ item.rarity }}
					</span>
					<span v-if="item.value"> · {{ item.value }}</span>
					· {{ item.source }}
				</p>
			</div>
		</template>

		<template #details>
			<ItemDetails :item="item" />
		</template>
	</ListItem>
</template>
