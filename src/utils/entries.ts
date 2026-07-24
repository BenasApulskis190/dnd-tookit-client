/**
 * 5etools "entries" — the description payload shared by items, conditions,
 * feats, spells, etc. — arrive from the API as JSON-encoded strings holding a
 * mix of plain paragraphs and structured blocks (`{type:"list", items}`,
 * `{type:"entries", name, entries}`). This normalizes them into a flat list of
 * renderable blocks; inline `{@tag}` markup inside each string is left intact
 * for `EntryText` to tokenize.
 */

export type EntryBlock =
	| { kind: "text"; text: string }
	| { kind: "subhead"; text: string }
	| { kind: "list"; items: string[] };

/** Postgres `Json` columns come back JSON-encoded; already-decoded values pass through. */
export function parseJsonField<T>(value: unknown): T | null {
	if (value == null) return null;
	if (typeof value !== "string") return value as T;

	try {
		return JSON.parse(value) as T;
	} catch {
		return null;
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

export function normalizeEntries(value: unknown): EntryBlock[] {
	const parsed = parseJsonField<unknown>(value);
	if (parsed == null) return [];

	const list = Array.isArray(parsed) ? parsed : [parsed];
	const blocks: EntryBlock[] = [];

	for (const entry of list) {
		if (typeof entry === "string") {
			blocks.push({ kind: "text", text: entry });
			continue;
		}
		if (!isRecord(entry)) continue;

		if (entry.type === "list" && Array.isArray(entry.items)) {
			blocks.push({
				kind: "list",
				items: entry.items.filter(
					(item): item is string => typeof item === "string",
				),
			});
		} else if (Array.isArray(entry.entries)) {
			// Nested sub-section, optionally titled.
			if (typeof entry.name === "string") {
				blocks.push({ kind: "subhead", text: entry.name });
			}
			blocks.push(...normalizeEntries(entry.entries));
		}
	}

	return blocks;
}
