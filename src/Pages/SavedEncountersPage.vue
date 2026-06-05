<script lang="ts" setup>
import { useRouter } from "vue-router"
import { useSavedEncountersStore } from "@/stores/savedEncounters"
import { getMonsterImageUrl } from "@/services/monsterService"
import type { SavedEncounter } from "@/Module/EncounterManager/savedTypes"
import List from "@/Module/List/List.vue"

const router = useRouter()
const store = useSavedEncountersStore()

function filtered(search: string): SavedEncounter[] {
	const q = search.toLowerCase().trim()

	if (!q) {
		return store.encounters
	}

	return store.encounters.filter((e) => e.name.toLowerCase().includes(q))
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

function totalMonsters(entries: { count: number }[]): number {
	return entries.reduce((sum, e) => sum + e.count, 0)
}

function runEncounter(id: string) {
	router.push({ name: "combat", params: { id } })
}
</script>

<template>
	<List :search-by="['name']">
		<template #header="{ search }">
			<p class="mt-1 text-xs text-gray-400">{{ filtered(search).length }} encounters</p>
		</template>

		<template #default="{ search }">
			<div v-if="store.encounters.length === 0" class="flex items-center justify-center h-40 text-sm text-gray-400">
				No saved encounters yet
			</div>

			<ListItem
				v-for="encounter in filtered(search)"
				:key="encounter.id"
			>
				<template #header>
					<div class="min-w-0">
						<p class="text-sm font-medium text-gray-800 truncate">{{ encounter.name }}</p>
						<p class="text-xs text-gray-400">
							{{ formatDate(encounter.savedAt) }} · {{ totalMonsters(encounter.entries) }} monster{{ totalMonsters(encounter.entries) !== 1 ? "s" : "" }}
						</p>
					</div>
				</template>

				<template #actions>
					<button
						class="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
						@click="runEncounter(encounter.id)"
					>
						Run Encounter
					</button>
					<button
						class="px-2 py-1 text-xs text-red-500 hover:text-red-700"
						@click="store.remove(encounter.id)"
					>
						Delete
					</button>
				</template>

				<template #details>
					<div class="flex flex-wrap gap-2">
						<div
							v-for="entry in encounter.entries"
							:key="entry.monster.name + entry.monster.source"
							class="flex items-center gap-2 px-2 py-1 bg-white border border-gray-200 rounded"
						>
							<img
								:src="getMonsterImageUrl(entry.monster) ?? undefined"
								:alt="entry.monster.name"
								class="w-6 h-6 rounded object-cover bg-gray-100"
							/>
							<span class="text-xs text-gray-700">{{ entry.monster.name }}</span>
							<span v-if="entry.count > 1" class="text-xs font-medium text-indigo-600">×{{ entry.count }}</span>
						</div>
					</div>
				</template>
			</ListItem>
		</template>
	</List>
</template>
