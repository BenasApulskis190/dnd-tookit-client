<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import BaseBreadcrumbs from "@/Module/Breadcrumbs/BaseBreadcrumbs.vue";
import MapDetails from "@/Module/Maps/MapDetails.vue";
import { mapsApi } from "@/Module/Maps/api/mapsApi";

const route = useRoute();
const id = computed(() => String(route.params.id ?? ""));

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["map-detail", id.value]),
	queryFn: () => mapsApi.getById(id.value),
	enabled: computed(() => id.value.length > 0),
});

const map = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});

const breadcrumbs = computed(() => [
	{ label: "Maps", to: { name: "maps" } },
	{ label: map.value?.name ?? "…" },
]);
</script>

<template>
	<div class="mx-auto max-w-6xl">
		<BaseBreadcrumbs :items="breadcrumbs" />

		<div v-if="isLoading" class="text-sm text-ink-mute">Loading…</div>
		<div v-else-if="isError" class="text-sm text-red-400">
			Failed to load map.
		</div>
		<MapDetails v-else-if="map" :map="map" />
	</div>
</template>
