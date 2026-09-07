<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import BackgroundDetails from "@/Module/Backgrounds/BackgroundDetails.vue";
import { backgroundsApi } from "@/Module/Backgrounds/api/backgroundsApi";

const props = defineProps<{ id: string }>();

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["background-detail", props.id]),
	queryFn: () => backgroundsApi.getById(props.id),
	enabled: computed(() => Boolean(props.id)),
});

const background = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
	<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load background.</div>
	<BackgroundDetails v-else-if="background" :background="background" />
</template>
