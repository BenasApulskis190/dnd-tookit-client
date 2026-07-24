/**
 * 5etools entry text is peppered with inline tags:
 *
 *   {@dice 1d6+2}                    a rollable expression
 *   {@hit 4}                         an attack bonus (roll d20 + 4)
 *   {@damage 2d6 + 3}                a damage expression
 *   {@creature Goblin|MM|goblin}     a cross-reference, optional display text
 *
 * Rather than flattening these to plain strings, entries are tokenized so the
 * rollable ones stay identifiable — that's what lets the UI attach a dice
 * roller to them later instead of re-parsing rendered text.
 */

export type EntryToken =
	| { kind: "text"; text: string }
	/** Rollable: `expression` is the dice/bonus to feed a roller, `text` is what to display. */
	| { kind: "roll"; tag: RollTag; expression: string; text: string }
	/** A reference to another entity — not rollable, but linkable. */
	| { kind: "ref"; tag: string; name: string; source?: string; text: string };

export type RollTag =
	| "dice"
	| "damage"
	| "hit"
	| "d20"
	| "scaledice"
	| "scaledamage"
	| "recharge"
	| "chance"
	| "dc";

const ROLL_TAGS = new Set<string>([
	"dice",
	"damage",
	"hit",
	"d20",
	"scaledice",
	"scaledamage",
	"recharge",
	"chance",
	"dc",
]);

const TAG_PATTERN = /\{@(\w+)\s+([^}]+)\}/g;

/** `{@hit 4}` displays as "+4"; `{@dc 13}` as "DC 13"; the rest display as-is. */
function displayForRoll(tag: string, parts: string[]): string {
	const value = parts[0] ?? "";
	const display = parts[1] ?? "";

	switch (tag) {
		case "hit":
			return display || (value.startsWith("-") ? value : `+${value}`);
		case "dc":
			return `DC ${display || value}`;
		case "recharge":
			return value ? `Recharge ${value}–6` : "Recharge";
		case "chance":
			return display || `${value} percent`;
		default:
			return display || value;
	}
}

/**
 * `{@hit 4}` rolls a d20 with a +4 bonus; `{@dc 13}` isn't rolled by the
 * creature at all (the target saves), but the DC is what a roll is checked
 * against, so both carry their numeric operand through as the expression.
 */
function expressionForRoll(tag: string, parts: string[]): string {
	const value = parts[0];

	switch (tag) {
		case "hit":
			return `1d20${value.startsWith("-") ? value : `+${value}`}`;
		case "d20":
			return `1d20${value.startsWith("-") ? value : `+${value}`}`;
		default:
			return value;
	}
}

/** Splits one entry string into displayable/rollable tokens, in order. */
export function tokenizeEntry(text: string): EntryToken[] {
	const tokens: EntryToken[] = [];
	let cursor = 0;

	for (const match of text.matchAll(TAG_PATTERN)) {
		const [raw, tag, body] = match;
		const start = match.index;

		if (start > cursor) {
			tokens.push({ kind: "text", text: text.slice(cursor, start) });
		}
		cursor = start + raw.length;

		const parts = body.split("|").map((part) => part.trim());

		if (ROLL_TAGS.has(tag)) {
			tokens.push({
				kind: "roll",
				tag: tag as RollTag,
				expression: expressionForRoll(tag, parts),
				text: displayForRoll(tag, parts),
			});
		} else {
			const [name, source, display] = parts;
			tokens.push({
				kind: "ref",
				tag,
				name,
				source: source || undefined,
				text: display || name,
			});
		}
	}

	if (cursor < text.length) {
		tokens.push({ kind: "text", text: text.slice(cursor) });
	}

	return tokens;
}

/** Flattened plain text — for titles, tooltips and anywhere markup can't go. */
export function entryToPlainText(text: string): string {
	return tokenizeEntry(text)
		.map((token) => token.text)
		.join("");
}
