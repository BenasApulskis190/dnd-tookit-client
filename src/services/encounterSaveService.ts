// TODO: seed data previously loaded from savedEncounters.json — replace with GET /encounters/seed or remove seeding entirely
import type { SavedEncounter } from "@/Module/EncounterManager/savedTypes"
import type { EncounterEntry } from "@/Module/EncounterManager/types"

const STORAGE_KEY = "dnd_saved_encounters"

export function loadSavedEncounters(): SavedEncounter[] {
	// TODO: optionally fetch seed encounters from GET /encounters/seed and merge here
	const seed: SavedEncounter[] = []

	let stored: SavedEncounter[] = []

	try {
		const raw = localStorage.getItem(STORAGE_KEY)

		if (raw) {
			stored = JSON.parse(raw) as SavedEncounter[]
		}
	} catch {
		stored = []
	}

	const storedIds = new Set(stored.map((e) => e.id))
	const merged = [...seed.filter((e) => !storedIds.has(e.id)), ...stored]

	return merged
}

export function saveEncounter(name: string, entries: EncounterEntry[]): SavedEncounter {
	const all = loadSavedEncounters()

	const record: SavedEncounter = {
		id: crypto.randomUUID(),
		name,
		savedAt: new Date().toISOString(),
		entries,
	}

	all.push(record)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(all))

	return record
}

export function deleteEncounter(id: string): void {
	const all = loadSavedEncounters().filter((e) => e.id !== id)

	localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
