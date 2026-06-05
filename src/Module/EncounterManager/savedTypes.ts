import type { EncounterEntry } from "./types"

export interface SavedEncounter {
	id: string
	name: string
	savedAt: string
	entries: EncounterEntry[]
}
