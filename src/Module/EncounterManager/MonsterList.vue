<script lang="ts" setup>

import { getAllMonsters, getMonsterTypeName, getMonsterImageUrl } from "@/services/monsterService"
import { useEncounterStore } from "@/stores/encounter"
import type { Monster } from "./types"
import List from "@/Module/List/List.vue"

const store = useEncounterStore()
const monsters = getAllMonsters()

function filtered(search: string): Monster[] {
	const q = search.toLowerCase().trim()

	if (!q) {
		return monsters
	}

	return monsters.filter((m) => {
		return m.name.toLowerCase().includes(q) || getMonsterTypeName(m).toLowerCase().includes(q)
	})
}

function crDisplay(monster: Monster): string {
	return monster.cr || "—"
}

function acDisplay(monster: Monster): string {
	if (Array.isArray(monster.ac)) {
		return String(monster.ac[0]?.ac ?? "—")
	}

	return String(monster.ac ?? "—")
}

function hpDisplay(monster: Monster): string {
	return `${monster.hp.average} (${monster.hp.formula ?? ""})`
}

function speedDisplay(monster: Monster): string {
	const parts: string[] = []

	if (monster.speed.walk) { parts.push(`${monster.speed.walk} ft.`) }
	if (monster.speed.fly) { parts.push(`fly ${monster.speed.fly} ft.`) }
	if (monster.speed.swim) { parts.push(`swim ${monster.speed.swim} ft.`) }
	if (monster.speed.climb) { parts.push(`climb ${monster.speed.climb} ft.`) }

	return parts.join(", ") || "—"
}

const statLabels = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const
const statKeys = ["str", "dex", "con", "int", "wis", "cha"] as const

function modifier(score: number): string {
	const mod = Math.floor((score - 10) / 2)

	return mod >= 0 ? `+${mod}` : String(mod)
}
</script>

<template>
	<List :search-by="['name', 'type']">
		<template #header="{ search }">
			<p class="mt-1 text-xs text-gray-400">{{ filtered(search).length }} monsters</p>
		</template>

		<template #default="{ search }">
			<ListItem
				v-for="monster in filtered(search)"
				:key="monster.name + monster.source"
			>
				<template #header>
					<img
						:src="getMonsterImageUrl(monster) ?? undefined"
						:alt="monster.name"
						class="w-9 h-9 rounded object-cover shrink-0 bg-gray-100"
					/>
					<div class="min-w-0">
						<p class="text-sm font-medium text-gray-800 truncate">{{ monster.name }}</p>
						<p class="text-xs text-gray-400">{{ getMonsterTypeName(monster) }} · CR {{ crDisplay(monster) }} · {{ monster.source }}</p>
					</div>
				</template>

				<template #actions>
					<button
						class="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
						@click="store.addMonster(monster)"
					>
						Add
					</button>
				</template>

				<template #details>
					<div class="grid grid-cols-3 gap-2 text-xs mb-3">
						<div><span class="text-gray-400">AC</span> <span class="font-medium text-gray-700">{{ acDisplay(monster) }}</span></div>
						<div><span class="text-gray-400">HP</span> <span class="font-medium text-gray-700">{{ hpDisplay(monster) }}</span></div>
						<div><span class="text-gray-400">Speed</span> <span class="font-medium text-gray-700">{{ speedDisplay(monster) }}</span></div>
					</div>

					<div class="grid grid-cols-6 gap-1 text-center">
						<div v-for="(label, i) in statLabels" :key="label" class="bg-white rounded border border-gray-200 py-1">
							<p class="text-xs text-gray-400">{{ label }}</p>
							<p class="text-sm font-semibold text-gray-800">{{ monster[statKeys[i]!] }}</p>
							<p class="text-xs text-gray-500">{{ modifier(monster[statKeys[i]!]) }}</p>
						</div>
					</div>

					<div v-if="monster.languages" class="mt-2 text-xs text-gray-500">
						<span class="text-gray-400">Languages:</span> {{ monster.languages }}
					</div>
				</template>
			</ListItem>
		</template>
	</List>
</template>
