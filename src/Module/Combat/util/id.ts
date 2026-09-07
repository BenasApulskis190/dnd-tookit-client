// crypto.randomUUID() only exists in secure contexts (https/localhost); this
// app is served over plain http (http://dnd.dev), so it's undefined there.
// crypto.getRandomValues() has no such restriction, so fall back to it.
export function generateCombatantId(): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}

	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
