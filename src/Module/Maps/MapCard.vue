<script lang="ts" setup>
import type { IMap } from "@/Module/Maps/types";
import { resolveApiUrl } from "@/utils/apiUrl";

defineProps<{ map: IMap }>();
</script>

<template>
	<RouterLink
		:to="{ name: 'maps-detail', params: { id: map.id } }"
		class="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-bg-elev transition-colors hover:border-map"
	>
		<div
			class="flex h-40 items-center justify-center overflow-hidden bg-black/30"
		>
			<img
				:src="resolveApiUrl(map.imageUrl) ?? undefined"
				:alt="map.name"
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
			/>
		</div>

		<div class="flex flex-1 flex-col gap-1 px-3 py-2.5">
			<p
				class="truncate font-display text-base text-ink group-hover:text-map"
			>
				{{ map.name }}
			</p>
			<p class="truncate text-xs text-ink-mute">
				{{ map.adventure.code }} · {{ map.section.name }}
			</p>
			<p
				v-if="map.pins.length"
				class="mt-auto pt-1 text-xs text-ink-faint"
			>
				{{ map.pins.length }}
				{{ map.pins.length === 1 ? "location" : "locations" }}
			</p>
		</div>
	</RouterLink>
</template>
