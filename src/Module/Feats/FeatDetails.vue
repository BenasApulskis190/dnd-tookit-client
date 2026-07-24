<script lang="ts" setup>
import { computed } from "vue";
import type { IFeat } from "@/Module/Feats/types";
import EntryContent from "@/Module/Entry/EntryContent.vue";
import { normalizeEntries } from "@/utils/entries";
import {
	abilityBonusLabels,
	prerequisiteLabel,
} from "@/Module/Feats/util/featFormat";

const props = defineProps<{ feat: IFeat }>();

const blocks = computed(() => normalizeEntries(props.feat.description));
const abilityBonuses = computed(() => abilityBonusLabels(props.feat));
const prerequisite = computed(() => prerequisiteLabel(props.feat));
</script>

<template>
	<article class="h-full space-y-6 overflow-y-auto p-6">
		<header>
			<h2 class="font-display text-3xl leading-tight text-feat">
				{{ feat.name }}
			</h2>
			<p class="mt-1 text-xs text-ink-faint">
				{{ feat.source }}<span v-if="feat.page"> · p. {{ feat.page }}</span>
			</p>

			<div v-if="abilityBonuses.length" class="mt-2 flex flex-wrap gap-1.5">
				<span
					v-for="bonus in abilityBonuses"
					:key="bonus"
					class="rounded bg-feat/15 px-2 py-0.5 text-xs font-semibold text-feat"
				>
					{{ bonus }}
				</span>
			</div>
		</header>

		<p v-if="prerequisite" class="text-sm">
			<span class="font-semibold text-ink-soft">Prerequisite: </span>
			<span class="italic text-ink-mute">{{ prerequisite }}</span>
		</p>

		<EntryContent :blocks="blocks" accent="feat" />
	</article>
</template>
