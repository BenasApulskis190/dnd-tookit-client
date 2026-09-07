<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import type { IAdventureDetail, IAdventureMap, IAdventureMapPin } from "@/Module/Adventures/types";
import { adventuresApi } from "@/Module/Adventures/api/adventuresApi";
import { findEntryByName, normalizeEntries } from "@/utils/entries";
import EntryContent from "@/Module/Entry/EntryContent.vue";
import AdventureMapViewer from "@/Module/Adventures/AdventureMapViewer.vue";

const props = defineProps<{ adventure: IAdventureDetail }>();

interface FlatMap extends IAdventureMap {
	sectionOrdinal: number;
}

const maps = computed<FlatMap[]>(() =>
	props.adventure.sections
		.flatMap((section) =>
			section.maps.map((map) => ({ ...map, sectionOrdinal: section.ordinal })),
		)
		.sort((a, b) => a.ordinal - b.ordinal),
);

const selectedMap = ref<FlatMap | null>(maps.value[0] ?? null);
const selectedPin = ref<IAdventureMapPin | null>(null);

watch(maps, (next) => {
	if (!next.some((m) => m.id === selectedMap.value?.id)) {
		selectedMap.value = next[0] ?? null;
		selectedPin.value = null;
	}
});

function selectMap(map: FlatMap) {
	selectedMap.value = map;
	selectedPin.value = null;
}

function selectPin(pin: IAdventureMapPin) {
	selectedPin.value = selectedPin.value?.id === pin.id ? null : pin;
}

// Strips the printed "1. "/"E1. " prefix so the sidebar/panel title doesn't
// repeat what the numbered pin badge already shows.
function entryTitle(entryName: string) {
	return entryName.replace(/^[A-Za-z]?\d+[a-z]?\.\s*/, "");
}

const { data: sectionData } = useQuery({
	queryKey: computed(() => [
		"adventure-section",
		props.adventure.code,
		selectedMap.value?.sectionOrdinal,
	]),
	queryFn: () => adventuresApi.getSection(props.adventure.code, selectedMap.value!.sectionOrdinal),
	enabled: computed(() => selectedMap.value != null),
});

const section = computed(() => {
	const v = sectionData.value;
	return !v || v instanceof AxiosError ? null : v;
});

const description = computed(() => {
	if (!selectedPin.value || !section.value) return [];
	return normalizeEntries(findEntryByName(section.value.entries, selectedPin.value.entryName));
});
</script>

<template>
	<div v-if="maps.length === 0" class="text-sm text-ink-mute">
		No interactive maps for this adventure yet.
	</div>

	<div v-else class="flex flex-col gap-4">
		<div class="flex gap-1 overflow-x-auto border-b border-border">
			<button
				v-for="map in maps"
				:key="map.id"
				:class="[
					'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors',
					selectedMap?.id === map.id
						? 'border-adventure text-adventure'
						: 'border-transparent text-ink-mute hover:text-ink',
				]"
				@click="selectMap(map)"
			>
				{{ map.name }}
			</button>
		</div>

		<div
			v-if="selectedMap"
			class="flex overflow-hidden rounded-lg border border-border bg-bg-elev2"
		>
			<div class="w-52 shrink-0 overflow-y-auto border-r border-border">
				<p
					class="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-faint"
				>
					Locations
				</p>
				<button
					v-for="pin in selectedMap.pins"
					:key="pin.id"
					:class="[
						'flex w-full items-center gap-2 border-b border-border-soft px-3 py-2 text-left text-sm transition-colors',
						selectedPin?.id === pin.id
							? 'bg-adventure/15 font-medium text-adventure'
							: 'text-ink-soft hover:bg-bg-elev',
					]"
					@click="selectPin(pin)"
				>
					<span
						:class="[
							'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
							selectedPin?.id === pin.id ? 'bg-adventure text-bg' : 'bg-bg-elev text-ink-mute',
						]"
						>{{ pin.label }}</span
					>
					<span class="truncate">{{ entryTitle(pin.entryName) }}</span>
				</button>
			</div>

			<div class="flex-1 overflow-auto bg-black/20 p-4">
				<AdventureMapViewer :map="selectedMap" :selected-pin="selectedPin" @select-pin="selectPin" />
			</div>

			<Transition
				enter-active-class="transition-all duration-200 ease-out"
				enter-from-class="opacity-0 translate-x-4"
				enter-to-class="opacity-100 translate-x-0"
				leave-active-class="transition-all duration-150 ease-in"
				leave-from-class="opacity-100 translate-x-0"
				leave-to-class="opacity-0 translate-x-4"
			>
				<div v-if="selectedPin" class="w-80 shrink-0 overflow-y-auto border-l border-border p-4">
					<p class="text-xs font-semibold uppercase tracking-wide text-adventure">
						{{ selectedMap.name }}
					</p>
					<h3 class="mt-0.5 font-display text-lg text-ink">
						{{ selectedPin.label }}. {{ entryTitle(selectedPin.entryName) }}
					</h3>
					<EntryContent v-if="description.length" :blocks="description" accent="adventure" class="mt-3" />
					<p v-else class="mt-3 text-sm italic text-ink-faint">No description available.</p>
				</div>
			</Transition>
		</div>
	</div>
</template>
