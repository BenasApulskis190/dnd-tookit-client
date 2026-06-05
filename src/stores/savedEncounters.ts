import { ref } from "vue"
import { defineStore } from "pinia"
import type { SavedEncounter } from "@/Module/EncounterManager/savedTypes"
import type { EncounterEntry } from "@/Module/EncounterManager/types"
import {
	loadSavedEncounters,
	saveEncounter,
	deleteEncounter,
} from "@/services/encounterSaveService"

export const useSavedEncountersStore = defineStore("savedEncounters", () => {
	const encounters = ref<SavedEncounter[]>(loadSavedEncounters())

	function save(name: string, entries: EncounterEntry[]) {
		const record = saveEncounter(name, entries)

		encounters.value.push(record)
	}

	function remove(id: string) {
		deleteEncounter(id)

		encounters.value = encounters.value.filter((e) => e.id !== id)
	}

	return { encounters, save, remove }
})
