<script lang="ts" setup>
import { computed } from "vue";
import { tokenizeEntry, type RollTag } from "@/Module/Bestiary/util/entryTokens";

export type EntryAccent =
	| "monster"
	| "spell"
	| "item"
	| "condition"
	| "feat";

// Roll buttons pick up the accent of whatever entity's text they render.
const props = withDefaults(
	defineProps<{ text: string; accent?: EntryAccent }>(),
	{ accent: "monster" },
);

// Rolls are rendered as buttons carrying their expression so a dice roller can
// be wired to this event later without re-parsing the text.
const emit = defineEmits<{
	roll: [payload: { tag: RollTag; expression: string; label: string }];
}>();

const tokens = computed(() => tokenizeEntry(props.text));

// Literal class strings so Tailwind's JIT keeps each accent's utilities.
const ACCENTS: Record<EntryAccent, string> = {
	monster: "text-monster hover:bg-monster/15",
	spell: "text-spell hover:bg-spell/15",
	item: "text-item hover:bg-item/15",
	condition: "text-condition hover:bg-condition/15",
	feat: "text-feat hover:bg-feat/15",
};

const rollClass = computed(() => ACCENTS[props.accent] ?? ACCENTS.monster);
</script>

<template>
	<span>
		<template v-for="(token, i) in tokens" :key="i">
			<button
				v-if="token.kind === 'roll'"
				type="button"
				class="rounded px-0.5 font-mono underline decoration-dotted underline-offset-2"
				:class="rollClass"
				:title="`Roll ${token.expression}`"
				@click="
					emit('roll', {
						tag: token.tag,
						expression: token.expression,
						label: token.text,
					})
				"
			>
				{{ token.text }}
			</button>

			<span
				v-else-if="token.kind === 'ref'"
				class="underline decoration-ink-faint decoration-dotted underline-offset-2"
				:title="token.source ? `${token.name} (${token.source})` : token.name"
			>
				{{ token.text }}
			</span>

			<template v-else>{{ token.text }}</template>
		</template>
	</span>
</template>
