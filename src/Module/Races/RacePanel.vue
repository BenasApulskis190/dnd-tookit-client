<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import RaceDetails from "@/Module/Races/RaceDetails.vue";
import { racesApi } from "@/Module/Races/api/racesApi";

const props = defineProps<{ id: string }>();

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["race-detail", props.id]),
	queryFn: () => racesApi.getById(props.id),
	enabled: computed(() => Boolean(props.id)),
});

const race = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
	<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load race.</div>
	<RaceDetails v-else-if="race" :race="race" />
</template>
