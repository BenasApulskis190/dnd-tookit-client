// TODO: replace with API call to GET /monsters
import type { Monster } from "@/Module/EncounterManager/types"

// TODO: SOURCE_FOLDER_MAP was used to resolve image paths from local files — needed again when image endpoint is wired up
// const SOURCE_FOLDER_MAP: Record<string, string> = { "AL 3pp": "AL (3pp)", ... }

export function getAllMonsters(): Monster[] {
	// TODO: fetch from GET /monsters
	return []
}

export function getMonsterTypeName(monster: Monster): string {
	if (typeof monster.type === "string") {
		return monster.type
	}

	return monster.type.type
}

export function getMonsterImageUrl(_monster: Monster): string | null {
	// TODO: fetch image from GET /monsters/:id/image (or derive from API base URL)
	return null
}
