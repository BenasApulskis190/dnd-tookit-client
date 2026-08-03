/**
 * Metadata for each Elasticsearch index the cross-index `/search` endpoint can
 * return, mapping it to the client route/label/styling used to render a hit.
 * Mirrors the `INDICES` list in the API's `src/lib/elasticsearch.ts`.
 */
// `detail` is the named child route (e.g. bestiary-detail) that opens the entity
// detail drawer over its list page; null until that entity's route is wired.
export const INDEX_META = {
	monsters: { label: "Bestiary", route: "/bestiary", detail: "bestiary-detail", color: "var(--c-monster)", glyph: "☠" },
	spells: { label: "Spells", route: "/spells", detail: "spells-detail", color: "var(--c-spell)", glyph: "✦" },
	conditions: { label: "Conditions", route: "/conditions", detail: "conditions-detail", color: "var(--c-condition)", glyph: "⚡" },
	backgrounds: { label: "Backgrounds", route: "/backgrounds", detail: "backgrounds-detail", color: "var(--c-background)", glyph: "⛩" },
	feats: { label: "Feats", route: "/feats", detail: "feats-detail", color: "var(--c-feat)", glyph: "★" },
	classes: { label: "Classes", route: "/classes", detail: "classes-detail", color: "var(--c-class)", glyph: "⚜" },
	items: { label: "Items", route: "/items", detail: "items-detail", color: "var(--c-item)", glyph: "◈" },
	races: { label: "Races", route: "/races", detail: "races-detail", color: "var(--c-race)", glyph: "❖" },
} as const;

export type IndexName = keyof typeof INDEX_META;

export function indexMeta(index: string) {
	return (
		INDEX_META[index as IndexName] ?? {
			label: index,
			route: null,
			detail: null,
			color: "var(--accent)",
			glyph: "◆",
		}
	);
}
