<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import SpellDetails from "@/Module/Spells/SpellDetails.vue";
import { spellsApi } from "@/Module/Spells/api/spellsApi";

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id ?? ""));

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["spell-detail", id.value]),
	queryFn: () => spellsApi.getByid(id.value),
	enabled: computed(() => id.value.length > 0),
});

const spell = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});

const visible = computed({
	get: () => id.value.length > 0,
	set: (open) => {
		if (!open) void router.push({ name: "spells" });
	},
});
</script>

<template>
	<BaseDrawer v-model:visible="visible" position="right" class="w-[45vw]">
		<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
		<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load spell.</div>
		<SpellDetails v-else-if="spell" :spell="spell" />
	</BaseDrawer>
</template>
