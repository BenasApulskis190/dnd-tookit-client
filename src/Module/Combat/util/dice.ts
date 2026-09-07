export function rollD20(): number {
	return 1 + Math.floor(Math.random() * 20);
}

export function abilityModifier(score: number | null | undefined): number {
	if (score == null) return 0;
	return Math.floor((score - 10) / 2);
}

export function rollInitiative(dexScore: number | null | undefined): number {
	return rollD20() + abilityModifier(dexScore);
}
