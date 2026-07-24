<script setup lang="ts">
import EntryText, { type EntryAccent } from "@/Module/Bestiary/EntryText.vue";
import type { EntryBlock } from "@/utils/entries";

// Renders normalized 5etools entry blocks (paragraphs, sub-headings, lists),
// delegating inline {@tag} markup to EntryText. Accent tints roll buttons.
withDefaults(defineProps<{ blocks: EntryBlock[]; accent?: EntryAccent }>(), {
	accent: "monster",
});
</script>

<template>
	<div class="space-y-2 text-sm">
		<template v-for="(block, i) in blocks" :key="i">
			<h4 v-if="block.kind === 'subhead'" class="font-semibold text-ink">
				{{ block.text }}
			</h4>

			<ul
				v-else-if="block.kind === 'list'"
				class="list-disc space-y-1 pl-5 text-ink-soft"
			>
				<li v-for="(item, j) in block.items" :key="j">
					<EntryText :text="item" :accent="accent" />
				</li>
			</ul>

			<p v-else class="text-ink-soft">
				<EntryText :text="block.text" :accent="accent" />
			</p>
		</template>
	</div>
</template>
