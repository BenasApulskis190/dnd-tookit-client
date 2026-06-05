<script lang="ts" setup>
import { ref, computed } from "vue";
import {
	getResolvedMaps,
	type ResolvedPin,
	type ResolvedMap,
} from "@/services/mapService";
import MapViewer from "@/Module/Maps/MapViewer.vue";

const maps = getResolvedMaps();
const selectedMap = ref<ResolvedMap>(maps[0]);
const selectedPin = ref<ResolvedPin | null>(null);

function selectMap(map: ResolvedMap) {
	selectedMap.value = map;
	selectedPin.value = null;
}

function selectPin(pin: ResolvedPin) {
	selectedPin.value = selectedPin.value?.id === pin.id ? null : pin;
}

const hasContent = computed(
	() =>
		selectedPin.value &&
		(selectedPin.value.text.length > 0 ||
			selectedPin.value.readaloud.length > 0),
);
</script>

<template>
	<div class="flex flex-col h-full overflow-hidden">
		<div
			class="flex gap-1 px-3 pt-3 pb-0 border-b border-gray-200 bg-white overflow-x-auto shrink-0"
		>
			<button
				v-for="map in maps"
				:key="map.id"
				:class="[
					'px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
					selectedMap.id === map.id
						? 'border-red-700 text-red-700'
						: 'border-transparent text-gray-500 hover:text-gray-800',
				]"
				@click="selectMap(map)"
			>
				{{ map.name }}
			</button>
		</div>

		<div class="flex flex-1 overflow-hidden">
			<div
				class="w-52 shrink-0 border-r border-gray-200 bg-white overflow-y-auto"
			>
				<p
					class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100"
				>
					Locations
				</p>
				<button
					v-for="pin in selectedMap.pins"
					:key="pin.id"
					:class="[
						'w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors border-b border-gray-50',
						selectedPin?.id === pin.id
							? 'bg-red-50 text-red-700 font-medium'
							: 'text-gray-700 hover:bg-gray-50',
					]"
					@click="selectPin(pin)"
				>
					<span
						:class="[
							'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0',
							selectedPin?.id === pin.id
								? 'bg-red-700 text-white'
								: 'bg-gray-200 text-gray-600',
						]"
						>{{ pin.label }}</span
					>
					<span class="truncate">{{ pin.title }}</span>
				</button>
			</div>

			<div class="flex-1 overflow-auto bg-gray-900">
				<MapViewer
					:map="selectedMap"
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
					class="w-80 shrink-0 border-l border-gray-200 bg-white overflow-y-auto flex flex-col"
				>
					<div
						class="p-4 border-b border-gray-100 flex items-start justify-between gap-2"
					>
						<div>
							<p
								class="text-xs font-semibold text-red-700 uppercase tracking-wide"
							>
								{{ selectedMap.name }}
							</p>
							<h2
								class="text-base font-bold text-gray-900 mt-0.5"
							>
								{{ selectedPin.label }}. {{ selectedPin.title }}
							</h2>
						</div>
						<button
							class="text-gray-400 hover:text-gray-600 text-lg leading-none mt-0.5 shrink-0"
							@click="selectedPin = null"
						>
							X
						</button>
					</div>

					<div
						v-if="hasContent"
						class="p-4 space-y-3 text-sm font-serif text-gray-800"
					>
						<div
							v-if="selectedPin.readaloud.length"
							class="bg-amber-50 border-l-4 border-amber-600 p-3 italic text-gray-700 space-y-1.5"
						>
							<p
								v-for="(line, i) in selectedPin.readaloud"
								:key="i"
							>
								{{ line }}
							</p>
						</div>

						<p v-for="(line, i) in selectedPin.text" :key="i">
							{{ line }}
						</p>
					</div>

					<div v-else class="p-4 text-sm text-gray-400 italic">
						No description available.
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>
