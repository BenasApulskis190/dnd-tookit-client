<script lang="ts" setup>
import type { IAdventureMap, IAdventureMapPin } from "@/Module/Adventures/types";
import { resolveApiUrl } from "@/utils/apiUrl";

defineProps<{ map: IAdventureMap; selectedPin: IAdventureMapPin | null }>();

const emit = defineEmits<{ selectPin: [pin: IAdventureMapPin] }>();
</script>

<template>
	<div class="relative inline-block select-none">
		<img
			:src="resolveApiUrl(map.imageUrl) ?? undefined"
			:alt="map.name"
			class="block h-auto w-[900px] max-w-full"
			draggable="false"
		/>

		<button
			v-for="pin in map.pins"
			:key="pin.id"
			:style="{ left: pin.x + '%', top: pin.y + '%' }"
			:title="pin.entryName"
			:class="[
				'absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-150',
				selectedPin?.id === pin.id
					? 'scale-125 border-adventure bg-adventure text-bg shadow-lg'
					: 'border-white/80 bg-black/70 text-white hover:scale-110 hover:border-adventure',
			]"
			@click="emit('selectPin', pin)"
		>
			{{ pin.label }}
		</button>
	</div>
</template>
