<script lang="ts" setup>
import { computed } from "vue";
import type { IClassDetail, IClassFeature } from "@/Module/Classes/types";
import { useClassIcons } from "@/Module/Classes/useClassIcons";
import EntryContent from "@/Module/Entry/EntryContent.vue";
import { normalizeEntries } from "@/utils/entries";
import {
	featuresByLevel,
	savingThrowProficiencies,
} from "@/Module/Classes/util/classFormat";

const props = defineProps<{ dndClass: IClassDetail }>();

const { getClassIcon } = useClassIcons();
const icon = computed(() => getClassIcon(props.dndClass.name));

const description = computed(() => normalizeEntries(props.dndClass.description));
const saves = computed(() => savingThrowProficiencies(props.dndClass));
const features = computed(() => featuresByLevel(props.dndClass));
const subclasses = computed(() => props.dndClass.subclasses ?? []);

function featureBlocks(feature: IClassFeature) {
	return normalizeEntries(feature.description);
}
</script>

<template>
	<article class="space-y-8">
		<!-- Header -->
		<header class="flex items-start gap-4">
			<component
				:is="icon"
				v-if="icon"
				class="h-14 w-14 shrink-0 text-class"
			/>
			<div class="min-w-0">
				<h1 class="font-display text-4xl leading-tight text-class">
					{{ dndClass.name }}
				</h1>
				<p class="mt-1 text-xs text-ink-faint">{{ dndClass.source }}</p>
			</div>
		</header>

		<!-- Core stats -->
		<dl
			class="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3"
		>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Hit Die</dt>
				<dd class="text-sm text-ink-soft">d{{ dndClass.hitDie }}</dd>
			</div>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Saving Throws</dt>
				<dd class="text-sm text-ink-soft">{{ saves.join(", ") || "—" }}</dd>
			</div>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">
					{{ dndClass.subclassTitle || "Subclasses" }}
				</dt>
				<dd class="text-sm text-ink-soft">{{ subclasses.length }}</dd>
			</div>
		</dl>

		<!-- Description -->
		<EntryContent
			v-if="description.length"
			:blocks="description"
			accent="feat"
		/>

		<!-- Class features -->
		<section v-if="features.length" class="space-y-4">
			<h2 class="border-b border-class/40 pb-1 font-display text-2xl text-class">
				Class Features
			</h2>
			<div v-for="feature in features" :key="feature.id" class="space-y-1">
				<div class="flex items-baseline gap-2">
					<span
						class="shrink-0 rounded bg-class/15 px-1.5 py-0.5 text-xs font-semibold text-class"
					>
						Lvl {{ feature.level }}
					</span>
					<h3 class="font-semibold text-ink">{{ feature.name }}</h3>
				</div>
				<EntryContent :blocks="featureBlocks(feature)" accent="feat" />
			</div>
		</section>

		<!-- Subclasses -->
		<section v-if="subclasses.length" class="space-y-3">
			<h2 class="border-b border-class/40 pb-1 font-display text-2xl text-class">
				{{ dndClass.subclassTitle ? `${dndClass.subclassTitle}s` : "Subclasses" }}
			</h2>
			<details
				v-for="subclass in subclasses"
				:key="subclass.id"
				class="rounded-lg border border-border bg-bg-elev2"
			>
				<summary
					class="flex cursor-pointer items-center justify-between gap-2 px-4 py-2 text-sm font-semibold text-ink-soft"
				>
					<span>{{ subclass.name }}</span>
					<span class="text-xs font-normal text-ink-faint">{{ subclass.source }}</span>
				</summary>
				<div class="space-y-4 border-t border-border px-4 py-3">
					<div
						v-for="feature in subclass.features"
						:key="feature.id"
						class="space-y-1"
					>
						<div class="flex items-baseline gap-2">
							<span
								class="shrink-0 rounded bg-class/15 px-1.5 py-0.5 text-xs font-semibold text-class"
							>
								Lvl {{ feature.level }}
							</span>
							<h3 class="font-semibold text-ink">{{ feature.name }}</h3>
						</div>
						<EntryContent :blocks="featureBlocks(feature)" accent="feat" />
					</div>
				</div>
			</details>
		</section>
	</article>
</template>
