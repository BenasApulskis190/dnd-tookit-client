<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import RaceDetails from "@/Module/Races/RaceDetails.vue";
import { racesApi } from "@/Module/Races/api/racesApi";

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id ?? ""));

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["race-detail", id.value]),
	queryFn: () => racesApi.getById(id.value),
	enabled: computed(() => id.value.length > 0),
});

const race = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});

const visible = computed({
	get: () => id.value.length > 0,
	set: (open) => {
		if (!open) void router.push({ name: "races" });
	},
});
</script>

<template>
	<BaseDrawer v-model:visible="visible" position="right" class="w-[45vw]">
		<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
		<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load race.</div>
		<RaceDetails v-else-if="race" :race="race" />
	</BaseDrawer>
</template>
