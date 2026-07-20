<script lang="ts" setup>
import type { IItem } from "@/Module/Items/types"
import ItemDetails from "./ItemDetails.vue"
import ListItem from "@/Module/List/ListItem.vue"

defineProps<{ item: IItem }>()
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</p>
				<p class="text-xs text-gray-400">
					{{ item.type }}<span v-if="item.rarity"> · {{ item.rarity }}</span> · {{ item.source }}
				</p>
			</div>
		</template>
		<template #details>
			<ItemDetails :item="item" />
		</template>
	</ListItem>
</template>
