<script lang="ts" setup>
import { computed } from "vue";
import type { IAdventureSection } from "@/Module/Adventures/types";
import EntryContent from "@/Module/Entry/EntryContent.vue";
import { normalizeEntries } from "@/utils/entries";
import { resolveApiUrl } from "@/utils/apiUrl";

const props = defineProps<{ section: IAdventureSection }>();

const blocks = computed(() => normalizeEntries(props.section.entries));
const images = computed(() => {
	const mapImagePaths = new Set(props.section.maps.map((map) => map.imagePath));
	return (props.section.images ?? []).filter((image) => !mapImagePaths.has(image.path));
});
</script>

<template>
	<article class="space-y-8">
		<header>
			<p class="text-xs uppercase tracking-wide text-ink-faint">
				Chapter {{ section.ordinal }}
			</p>
			<h1 class="font-display text-4xl leading-tight text-adventure">
				{{ section.name }}
			</h1>
		</header>

		<EntryContent :blocks="blocks" accent="adventure" />

		<section v-if="images.length" class="space-y-3">
			<h2 class="border-b border-adventure/40 pb-1 font-display text-2xl text-adventure">
				Images
			</h2>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<figure
					v-for="image in images"
					:key="image.path"
					class="overflow-hidden rounded-lg border border-border bg-bg-elev2"
				>
					<img :src="resolveApiUrl(image.url) ?? undefined" :alt="image.title" class="h-40 w-full object-cover" />
					<figcaption v-if="image.title" class="px-2 py-1.5 text-xs text-ink-faint">
						{{ image.title }}
					</figcaption>
				</figure>
			</div>
		</section>
	</article>
</template>
