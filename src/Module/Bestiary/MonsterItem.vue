<script lang="ts" setup>
import type { Monster } from "@/Module/EncounterManager/types"
import { getMonsterImageUrl, getMonsterTypeName } from "@/services/monsterService"
import MonsterDetails from "./MonsterDetails.vue"

defineProps<{ monster: Monster }>()

const emit = defineEmits<{ addToEncounter: [monster: Monster] }>()
</script>

<template>
	<ListItem>
		<template #header>
			<img
				:src="getMonsterImageUrl(monster) ?? undefined"
				:alt="monster.name"
				class="w-9 h-9 rounded object-cover shrink-0 bg-gray-100"
			/>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">{{ monster.name }}</p>
				<p class="text-xs text-gray-400">
					{{ getMonsterTypeName(monster) }} · CR {{ monster.cr || "—" }} · {{ monster.source }}
				</p>
			</div>
		</template>

		<template #actions>
			<button
				class="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
				@click="emit('addToEncounter', monster)"
			>
				+ Encounter
			</button>
		</template>

		<template #details>
			<MonsterDetails :monster="monster" />
		</template>
	</ListItem>
</template>
