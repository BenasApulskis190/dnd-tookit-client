import type { Background } from "@/Module/EncounterManager/types";

let _backgrounds: Background[] | null = null;

export function getAllBackgrounds(): Background[] {
	if (_backgrounds) return _backgrounds;
	_backgrounds = ({} as { background: Background[] }).background;
	return _backgrounds;
}
