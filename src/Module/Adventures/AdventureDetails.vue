<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { IAdventureDetail } from "@/Module/Adventures/types";
import { levelRangeLabel, publishedYearLabel } from "@/Module/Adventures/util/adventureFormat";
import { resolveApiUrl } from "@/utils/apiUrl";

const props = defineProps<{ adventure: IAdventureDetail }>();

const sections = computed(() =>
	[...props.adventure.sections].sort((a, b) => a.ordinal - b.ordinal),
);
const npcs = computed(() => props.adventure.npcs ?? []);
</script>

<template>
	<article class="space-y-8">
		<header>
			<h1 class="font-display text-4xl leading-tight text-adventure">
				{{ adventure.name }}
			</h1>
			<p class="mt-1 text-xs text-ink-faint">
				{{ adventure.code }}<span v-if="adventure.book"> · {{ adventure.book.name }}</span>
			</p>
		</header>

		<dl
			class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
		>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Levels</dt>
				<dd class="text-sm text-ink-soft">{{ levelRangeLabel(adventure) }}</dd>
			</div>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Storyline</dt>
				<dd class="text-sm text-ink-soft">{{ adventure.storyline ?? "—" }}</dd>
			</div>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Published</dt>
				<dd class="text-sm text-ink-soft">{{ publishedYearLabel(adventure.published) }}</dd>
			</div>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Chapters</dt>
				<dd class="text-sm text-ink-soft">{{ sections.length }}</dd>
			</div>
		</dl>

		<section v-if="sections.length" class="space-y-3">
			<h2 class="border-b border-adventure/40 pb-1 font-display text-2xl text-adventure">
				Chapters
			</h2>
			<ol class="space-y-1.5">
				<li v-for="section in sections" :key="section.id">
					<RouterLink
						:to="{ name: 'adventures-section', params: { id: adventure.code, ordinal: section.ordinal } }"
						class="flex items-center gap-3 rounded-lg border border-border bg-bg-elev2 px-4 py-2.5 text-sm text-ink-soft transition-colors hover:border-adventure/40 hover:text-ink"
					>
						<span class="shrink-0 rounded bg-adventure/15 px-1.5 py-0.5 text-xs font-semibold text-adventure">
							{{ section.ordinal }}
						</span>
						<span class="flex-1 font-medium">{{ section.name }}</span>
					</RouterLink>
				</li>
			</ol>
		</section>

		<section v-if="npcs.length" class="space-y-3">
			<h2 class="border-b border-adventure/40 pb-1 font-display text-2xl text-adventure">
				NPCs
			</h2>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
				<RouterLink
					v-for="npc in npcs"
					:key="npc.id"
					:to="{ name: 'npcs-detail', params: { id: npc.id } }"
					class="flex items-center gap-3 rounded-lg border border-border bg-bg-elev2 px-3 py-2 text-sm text-ink-soft transition-colors hover:border-adventure/40 hover:text-ink"
				>
					<img
						v-if="npc.tokenUrl"
						:src="resolveApiUrl(npc.tokenUrl) ?? undefined"
						:alt="npc.name"
						class="h-8 w-8 shrink-0 rounded-full border border-border object-cover"
					/>
					<span class="truncate font-medium">{{ npc.name }}</span>
				</RouterLink>
			</div>
		</section>
	</article>
</template>
