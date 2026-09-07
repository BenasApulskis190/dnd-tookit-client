<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import FeatDetails from "@/Module/Feats/FeatDetails.vue";
import { featsApi } from "@/Module/Feats/api/featsApi";

const props = defineProps<{ id: string }>();

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["feat-detail", props.id]),
	queryFn: () => featsApi.getById(props.id),
	enabled: computed(() => Boolean(props.id)),
});

const feat = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
	<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load feat.</div>
	<FeatDetails v-else-if="feat" :feat="feat" />
</template>
