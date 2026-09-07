<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import AdventureDetails from "@/Module/Adventures/AdventureDetails.vue";
import AdventureMaps from "@/Module/Adventures/AdventureMaps.vue";
import { adventuresApi } from "@/Module/Adventures/api/adventuresApi";
import BaseBreadcrumbs from "@/Module/Breadcrumbs/BaseBreadcrumbs.vue";
import BaseTabs from "@/Module/Tabs/BaseTabs.vue";

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

const breadcrumbs = computed(() => [
	{ label: "Adventures", to: { name: "adventures" } },
	{ label: adventure.value?.name ?? "…" },
]);

// Maps tab needs a lot more horizontal room than the prose column does.
const activeTab = ref("details");
</script>

<template>
	<div :class="['mx-auto', activeTab === 'maps' ? 'max-w-6xl' : 'max-w-3xl']">
		<BaseBreadcrumbs :items="breadcrumbs" />

		<div v-if="isLoading" class="text-sm text-ink-mute">Loading…</div>
		<div v-else-if="isError" class="text-sm text-red-400">
			Failed to load adventure.
		</div>
		<BaseTabs
			v-else-if="adventure"
			v-model="activeTab"
			:tabs="[
				{ value: 'details', label: 'Details' },
				...(adventure.sections.some((s) => s.maps.length > 0)
					? [{ value: 'maps', label: 'Maps' }]
					: []),
			]"
			class="mt-4"
		>
			<template #details>
				<AdventureDetails :adventure="adventure" class="mt-4" />
			</template>
			<template #maps>
				<AdventureMaps :adventure="adventure" class="mt-4" />
			</template>
		</BaseTabs>
	</div>
</template>
