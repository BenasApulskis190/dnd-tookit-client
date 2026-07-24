<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import FeatDetails from "@/Module/Feats/FeatDetails.vue";
import { featsApi } from "@/Module/Feats/api/featsApi";

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id ?? ""));

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["feat-detail", id.value]),
	queryFn: () => featsApi.getById(id.value),
	enabled: computed(() => id.value.length > 0),
});

const feat = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});

const visible = computed({
	get: () => id.value.length > 0,
	set: (open) => {
		if (!open) void router.push({ name: "feats" });
	},
});
</script>

<template>
	<BaseDrawer v-model:visible="visible" position="right" class="w-[45vw]">
		<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
		<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load feat.</div>
		<FeatDetails v-else-if="feat" :feat="feat" />
	</BaseDrawer>
</template>
