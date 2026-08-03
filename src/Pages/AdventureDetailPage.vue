<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import AdventureDetails from "@/Module/Adventures/AdventureDetails.vue";
import { adventuresApi } from "@/Module/Adventures/api/adventuresApi";

const route = useRoute();
const id = computed(() => String(route.params.id ?? ""));

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["adventure-detail", id.value]),
	queryFn: () => adventuresApi.getByIdOrCode(id.value),
	enabled: computed(() => id.value.length > 0),
});

const adventure = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<div class="mx-auto max-w-3xl">
		<RouterLink
			:to="{ name: 'adventures' }"
			class="mb-6 inline-flex items-center gap-1 text-sm text-ink-mute hover:text-ink"
		>
			← Back to adventures
		</RouterLink>

		<div v-if="isLoading" class="text-sm text-ink-mute">Loading…</div>
		<div v-else-if="isError" class="text-sm text-red-400">
			Failed to load adventure.
		</div>
		<AdventureDetails v-else-if="adventure" :adventure="adventure" />
	</div>
</template>
