<script lang="ts" setup>
import { computed } from "vue";
import type { ISpell } from "@/Module/Spells/types";
import EntryText from "@/Module/Bestiary/EntryText.vue";
import {
	castingTimeLabel,
	componentsLabel,
	durationLabel,
	entryParagraphs,
	levelSchoolLabel,
	rangeLabel,
	spellClasses,
} from "@/Module/Spells/util/spellFormat";

const props = defineProps<{ spell: ISpell }>();

const stats = computed(() => [
	{ label: "Casting Time", value: castingTimeLabel(props.spell) },
	{ label: "Range", value: rangeLabel(props.spell) },
	{ label: "Components", value: componentsLabel(props.spell) },
	{ label: "Duration", value: durationLabel(props.spell) },
]);

const description = computed(() => entryParagraphs(props.spell.description));
const higherLevel = computed(() => entryParagraphs(props.spell.higherLevel));
const classes = computed(() => spellClasses(props.spell));

const tags = computed(() =>
	[
		props.spell.concentration ? "Concentration" : null,
		props.spell.ritual ? "Ritual" : null,
	].filter((tag): tag is string => Boolean(tag)),
);
</script>

<template>
	<article class="h-full space-y-6 overflow-y-auto p-6">
		<!-- Name + level/school subtitle -->
		<header>
			<h2 class="font-display text-3xl leading-tight text-spell">
				{{ spell.name }}
			</h2>
			<p class="mt-1 text-sm italic text-ink-mute">{{ levelSchoolLabel(spell) }}</p>
			<p class="mt-1 text-xs text-ink-faint">
				{{ spell.source }}<span v-if="spell.page"> · p. {{ spell.page }}</span>
			</p>

			<div v-if="tags.length" class="mt-2 flex flex-wrap gap-1.5">
				<span
					v-for="tag in tags"
					:key="tag"
					class="rounded bg-spell/15 px-2 py-0.5 text-xs font-semibold text-spell"
				>
					{{ tag }}
				</span>
			</div>
		</header>

		<!-- Casting stats -->
		<dl
			class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border"
		>
			<div v-for="stat in stats" :key="stat.label" class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">
					{{ stat.label }}
				</dt>
				<dd class="text-sm text-ink-soft">{{ stat.value }}</dd>
			</div>
		</dl>

		<!-- Description -->
		<section v-if="description.length" class="space-y-2 text-sm">
			<p v-for="(paragraph, i) in description" :key="i" class="text-ink-soft">
				<EntryText :text="paragraph" accent="spell" />
			</p>
		</section>

		<!-- At higher levels -->
		<section v-if="higherLevel.length" class="space-y-2 text-sm">
			<h3 class="font-display text-lg text-spell">At Higher Levels</h3>
			<p v-for="(paragraph, i) in higherLevel" :key="i" class="text-ink-soft">
				<EntryText :text="paragraph" accent="spell" />
			</p>
		</section>

		<!-- Classes -->
		<section v-if="classes.length" class="space-y-2">
			<h3 class="text-xs uppercase tracking-wide text-ink-faint">Classes</h3>
			<div class="flex flex-wrap gap-1.5">
				<span
					v-for="name in classes"
					:key="name"
					class="rounded border border-border bg-bg-elev2 px-2 py-0.5 text-xs text-ink-mute"
				>
					{{ name }}
				</span>
			</div>
		</section>
	</article>
</template>
