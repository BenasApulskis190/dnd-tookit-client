<script lang="ts" setup>
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import AdventureMapViewer from "@/Module/Adventures/AdventureMapViewer.vue";
import { adventuresApi } from "@/Module/Adventures/api/adventuresApi";
import type { IAdventureMapPin } from "@/Module/Adventures/types";
import EntryContent from "@/Module/Entry/EntryContent.vue";
import type { IMapDetail } from "@/Module/Maps/types";
import { findEntryByName, normalizeEntries } from "@/utils/entries";

const props = defineProps<{ map: IMapDetail }>();

const selectedPin = ref<IAdventureMapPin | null>(null);

function selectPin(pin: IAdventureMapPin) {
	selectedPin.value = selectedPin.value?.id === pin.id ? null : pin;
}

// Strips the printed "1. "/"E1. " prefix so the sidebar/panel title doesn't
// repeat what the numbered pin badge already shows.
function entryTitle(entryName: string) {
	return entryName.replace(/^[A-Za-z]?\d+[a-z]?\.\s*/, "");
}

// Pin descriptions live in the chapter's entry tree, which the flat map
// response doesn't carry — fetch the section the map came from.
const { data: sectionData } = useQuery({
	queryKey: computed(() => [
		"adventure-section",
		props.map.adventure.code,
		props.map.section.ordinal,
	]),
	queryFn: () =>
		adventuresApi.getSection(
			props.map.adventure.code,
			props.map.section.ordinal,
		),
});

const section = computed(() => {
	const v = sectionData.value;
	return !v || v instanceof AxiosError ? null : v;
});

const description = computed(() => {
	if (!selectedPin.value || !section.value) return [];
	return normalizeEntries(
		findEntryByName(section.value.entries, selectedPin.value.entryName),
	);
});
</script>

<template>
	<div class="flex flex-col gap-4">
		<div>
			<h1 class="font-display text-2xl text-ink">{{ map.name }}</h1>
			<p class="mt-0.5 text-sm text-ink-mute">
				<RouterLink
					:to="{
						name: 'adventures-detail',
						params: { id: map.adventure.code },
					}"
					class="transition-colors hover:text-map"
				>
					{{ map.adventure.name }}
				</RouterLink>
				·
				<RouterLink
					:to="{
						name: 'adventures-section',
						params: {
							id: map.adventure.code,
							ordinal: map.section.ordinal,
						},
					}"
					class="transition-colors hover:text-map"
				>
					{{ map.section.name }}
				</RouterLink>
			</p>
		</div>

		<div
			class="flex overflow-hidden rounded-lg border border-border bg-bg-elev2"
		>
			<div
				v-if="map.pins.length"
				class="w-52 shrink-0 overflow-y-auto border-r border-border"
			>
				<p
					class="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-faint"
				>
					Locations
				</p>
				<button
					v-for="pin in map.pins"
					:key="pin.id"
					:class="[
						'flex w-full items-center gap-2 border-b border-border-soft px-3 py-2 text-left text-sm transition-colors',
						selectedPin?.id === pin.id
							? 'bg-map/15 font-medium text-map'
							: 'text-ink-soft hover:bg-bg-elev',
					]"
					@click="selectPin(pin)"
				>
					<span
						:class="[
							'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
							selectedPin?.id === pin.id
								? 'bg-map text-bg'
								: 'bg-bg-elev text-ink-mute',
						]"
						>{{ pin.label }}</span
					>
					<span class="truncate">{{
						entryTitle(pin.entryName)
					}}</span>
				</button>
			</div>

			<div class="flex-1 overflow-auto bg-black/20 p-4">
				<AdventureMapViewer
					:map="map"
					:selected-pin="selectedPin"
					@select-pin="selectPin"
				/>
			</div>

			<Transition
				enter-active-class="transition-all duration-200 ease-out"
				enter-from-class="opacity-0 translate-x-4"
				enter-to-class="opacity-100 translate-x-0"
				leave-active-class="transition-all duration-150 ease-in"
				leave-from-class="opacity-100 translate-x-0"
				leave-to-class="opacity-0 translate-x-4"
			>
				<div
					v-if="selectedPin"
					class="w-80 shrink-0 overflow-y-auto border-l border-border p-4"
				>
					<p
						class="text-xs font-semibold uppercase tracking-wide text-map"
					>
						{{ map.name }}
					</p>
					<h3 class="mt-0.5 font-display text-lg text-ink">
						{{ selectedPin.label }}.
						{{ entryTitle(selectedPin.entryName) }}
					</h3>
					<EntryContent
						v-if="description.length"
						:blocks="description"
						accent="adventure"
						class="mt-3"
					/>
					<p v-else class="mt-3 text-sm italic text-ink-faint">
						No description available.
					</p>
				</div>
			</Transition>
		</div>
	</div>
</template>
