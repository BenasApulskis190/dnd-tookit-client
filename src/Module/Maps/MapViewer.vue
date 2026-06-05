<script lang="ts" setup>
import type { ResolvedMap, ResolvedPin } from "@/services/mapService";

const props = defineProps<{
	map: ResolvedMap;
	selectedPin: ResolvedPin | null;
}>();

const emit = defineEmits<{ selectPin: [pin: ResolvedPin] }>();
</script>

<template>
	<div class="relative select-none">
		<img
			:src="map.imageUrl"
			:alt="map.name"
			class="h-auto w-[900px] block"
			draggable="false"
		/>

		<button
			v-for="pin in map.pins"
			:key="pin.id"
			:style="{ left: pin.x + '%', top: pin.y + '%' }"
			:title="pin.title"
			:class="[
				'absolute -translate-x-1/2 -translate-y-1/2',
				'flex items-center justify-center',
				'w-6 h-6 rounded-full text-xs font-bold border-2',
				'transition-all duration-150 cursor-pointer',
				selectedPin?.id === pin.id
					? 'bg-red-700 border-yellow-300 text-white scale-125 shadow-lg'
					: 'bg-black/70 border-white/80 text-white hover:bg-red-700 hover:scale-110',
			]"
			@click="emit('selectPin', pin)"
		>
			{{ pin.label }}
		</button>
	</div>
</template>
