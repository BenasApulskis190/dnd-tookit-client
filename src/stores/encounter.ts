import { ref, computed } from "vue"
import { defineStore } from "pinia"
import type { Monster, EncounterEntry } from "@/Module/EncounterManager/types"

export const useEncounterStore = defineStore("encounter", () => {
	const entries = ref<EncounterEntry[]>([])

	const totalMonsters = computed(() => {
		return entries.value.reduce((sum, e) => sum + e.count, 0)
	})

	function addMonster(monster: Monster) {
		const existing = entries.value.find((e) => e.monster.name === monster.name && e.monster.source === monster.source)

		if (existing) {
			existing.count++
		} else {
			entries.value.push({ monster, count: 1 })
		}
	}

	function removeMonster(name: string, source: string) {
		const index = entries.value.findIndex((e) => e.monster.name === name && e.monster.source === source)

		if (index === -1) {
			return
		}

		if (entries.value[index].count > 1) {
			entries.value[index].count--
		} else {
			entries.value.splice(index, 1)
		}
	}

	function clearEncounter() {
		entries.value = []
	}

	return { entries, totalMonsters, addMonster, removeMonster, clearEncounter }
})
