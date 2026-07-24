<script lang="ts" setup>
import { computed } from "vue";
import type { ICondition } from "@/Module/Conditions/types";
import EntryContent from "@/Module/Entry/EntryContent.vue";
import { normalizeEntries } from "@/utils/entries";

const props = defineProps<{ condition: ICondition }>();

const blocks = computed(() => normalizeEntries(props.condition.description));
</script>

<template>
	<article class="h-full space-y-6 overflow-y-auto p-6">
		<header>
			<h2 class="font-display text-3xl leading-tight text-condition">
				{{ condition.name }}
			</h2>
			<p class="mt-1 text-xs text-ink-faint">
				{{ condition.source
				}}<span v-if="condition.page"> · p. {{ condition.page }}</span>
			</p>
		</header>

		<EntryContent :blocks="blocks" accent="condition" />
	</article>
</template>
