<script lang="ts" setup>
import { computed } from "vue";
import type { IItem } from "@/Module/Items/types";
import EntryContent from "@/Module/Entry/EntryContent.vue";
import { normalizeEntries } from "@/utils/entries";
import {
	attunementLabel,
	damageLabel,
	hasRarity,
	itemSubtitle,
	itemTypesLabel,
	valueLabel,
} from "@/Module/Items/util/itemFormat";

const props = defineProps<{ item: IItem }>();

const blocks = computed(() => normalizeEntries(props.item.description));

const stats = computed(() => {
	const item = props.item;

	// Core fields are always shown (— when absent) so the grid stays even; the
	// combat fields only appear for items they apply to.
	const rows: { label: string; value: string }[] = [
		{ label: "Value", value: valueLabel(item) },
		{ label: "Weight", value: item.weight != null ? `${item.weight} lb.` : "—" },
		{ label: "Rarity", value: hasRarity(item.rarity) ? item.rarity! : "—" },
		{ label: "Attunement", value: attunementLabel(item) },
	];

	if (item.types.length > 1) rows.push({ label: "Types", value: itemTypesLabel(item) });
	if (damageLabel(item)) rows.push({ label: "Damage", value: damageLabel(item) });
	if (item.armorClass != null)
		rows.push({ label: "Armor Class", value: String(item.armorClass) });
	if (item.strengthRequirement != null)
		rows.push({ label: "Strength", value: `Str ${item.strengthRequirement}` });
	if (item.stealthDisadvantage)
		rows.push({ label: "Stealth", value: "Disadvantage" });

	return rows;
});
</script>

<template>
	<article class="h-full space-y-6 overflow-y-auto p-6">
		<header>
			<h2 class="font-display text-3xl leading-tight text-item">
				{{ item.name }}
			</h2>
			<p class="mt-1 text-sm italic text-ink-mute">{{ itemSubtitle(item) }}</p>
			<p class="mt-1 text-xs text-ink-faint">
				{{ item.source }}<span v-if="item.page"> · p. {{ item.page }}</span>
			</p>
		</header>

		<dl
			v-if="stats.length"
			class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border"
		>
			<div v-for="stat in stats" :key="stat.label" class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">
					{{ stat.label }}
				</dt>
				<dd class="text-sm text-ink-soft">{{ stat.value }}</dd>
			</div>
		</dl>

		<EntryContent v-if="blocks.length" :blocks="blocks" accent="item" />
	</article>
</template>
