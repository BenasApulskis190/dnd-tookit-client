<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import AdventureSectionContent from "@/Module/Adventures/AdventureSectionContent.vue";
import { adventuresApi } from "@/Module/Adventures/api/adventuresApi";
import BaseBreadcrumbs from "@/Module/Breadcrumbs/BaseBreadcrumbs.vue";

const route = useRoute();
const id = computed(() => String(route.params.id ?? ""));
const ordinal = computed(() => Number(route.params.ordinal));

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["adventure-section", id.value, ordinal.value]),
	queryFn: () => adventuresApi.getSection(id.value, ordinal.value),
	enabled: computed(() => id.value.length > 0 && !Number.isNaN(ordinal.value)),
});

const section = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});

const breadcrumbs = computed(() => [
	{ label: "Adventures", to: { name: "adventures" } },
	{ label: section.value?.adventure.name ?? "…", to: { name: "adventures-detail", params: { id: id.value } } },
	{ label: section.value?.name ?? "…" },
]);
</script>

<template>
	<div class="mx-auto max-w-3xl">
		<BaseBreadcrumbs :items="breadcrumbs" />

		<div v-if="isLoading" class="text-sm text-ink-mute">Loading…</div>
		<div v-else-if="isError" class="text-sm text-red-400">
			Failed to load chapter.
		</div>
		<AdventureSectionContent v-else-if="section" :section="section" />
	</div>
</template>
