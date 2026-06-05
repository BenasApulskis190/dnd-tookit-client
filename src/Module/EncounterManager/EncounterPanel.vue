<script lang="ts" setup>
import { ref } from "vue"
import { useEncounterStore } from "@/stores/encounter"
import { useSavedEncountersStore } from "@/stores/savedEncounters"
import { getMonsterImageUrl } from "@/services/monsterService"

const store = useEncounterStore()
const savedStore = useSavedEncountersStore()

const encounterName = ref("")
const saved = ref(false)

function handleSave() {
	const name = encounterName.value.trim()

	if (!name || store.entries.length === 0) {
		return
	}

	savedStore.save(name, store.entries)
	encounterName.value = ""
	saved.value = true

	setTimeout(() => {
		saved.value = false
	}, 2000)
}
</script>

<template>
	<div class="flex flex-col h-full">
		<div class="flex items-center justify-between p-3 border-b border-gray-200">
			<div>
				<h2 class="text-sm font-semibold text-gray-800">Current Encounter</h2>
				<p class="text-xs text-gray-400">{{ store.totalMonsters }} monster{{ store.totalMonsters !== 1 ? "s" : "" }}</p>
			</div>

			<button
				v-if="store.entries.length > 0"
				class="text-xs text-red-500 hover:text-red-700"
				@click="store.clearEncounter()"
			>
				Clear
			</button>
		</div>

		<div class="overflow-y-auto flex-1">
			<div v-if="store.entries.length === 0" class="flex items-center justify-center h-32 text-sm text-gray-400">
				No monsters added yet
			</div>

			<div
				v-for="entry in store.entries"
				:key="entry.monster.name + entry.monster.source"
				class="flex items-center gap-3 px-3 py-2 border-b border-gray-100 hover:bg-gray-50"
			>
				<img
					:src="getMonsterImageUrl(entry.monster) ?? undefined"
					:alt="entry.monster.name"
					class="w-10 h-10 rounded object-cover shrink-0 bg-gray-100"
				/>

				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-gray-800 truncate">{{ entry.monster.name }}</p>
					<p class="text-xs text-gray-400">CR {{ entry.monster.cr || "—" }} · {{ entry.monster.source }}</p>
				</div>

				<div class="flex items-center gap-1 ml-2 shrink-0">
					<button
						class="w-6 h-6 flex items-center justify-center text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
						@click="store.removeMonster(entry.monster.name, entry.monster.source)"
					>
						−
					</button>
					<span class="w-6 text-center text-sm font-medium">{{ entry.count }}</span>
					<button
						class="w-6 h-6 flex items-center justify-center text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
						@click="store.addMonster(entry.monster)"
					>
						+
					</button>
				</div>
			</div>
		</div>

		<div v-if="store.entries.length > 0" class="p-3 border-t border-gray-200 flex gap-2">
			<input
				v-model="encounterName"
				type="text"
				placeholder="Encounter name..."
				class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
				@keydown.enter="handleSave"
			/>
			<button
				:disabled="!encounterName.trim()"
				class="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
				@click="handleSave"
			>
				{{ saved ? "Saved!" : "Save" }}
			</button>
		</div>
	</div>
</template>
