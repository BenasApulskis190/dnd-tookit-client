<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import ClassDetails from "@/Module/Classes/ClassDetails.vue";
import { classesApi } from "@/Module/Classes/api/classesApi";
import BaseBreadcrumbs from "@/Module/Breadcrumbs/BaseBreadcrumbs.vue";

const route = useRoute();
const id = computed(() => String(route.params.id ?? ""));

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["class-detail", id.value]),
	queryFn: () => classesApi.getById(id.value),
	enabled: computed(() => id.value.length > 0),
});

const dndClass = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});

const breadcrumbs = computed(() => [
	{ label: "Classes", to: { name: "classes" } },
	{ label: dndClass.value?.name ?? "…" },
]);
</script>

<template>
	<div class="mx-auto max-w-3xl">
		<BaseBreadcrumbs :items="breadcrumbs" />

		<div v-if="isLoading" class="text-sm text-ink-mute">Loading…</div>
		<div v-else-if="isError" class="text-sm text-red-400">
			Failed to load class.
		</div>
		<ClassDetails v-else-if="dndClass" :dnd-class="dndClass" />
	</div>
</template>
