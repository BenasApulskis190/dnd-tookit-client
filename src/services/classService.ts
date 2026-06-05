import type { DnDClass } from "@/Module/EncounterManager/types"

let _classes: DnDClass[] | null = null

export function getAllClasses(): DnDClass[] {
	if (_classes) return _classes
	_classes = ( {} as { class: DnDClass[] }).class
	return _classes
}
