<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import NpcDetails from "@/Module/Npcs/NpcDetails.vue";
import { npcsApi } from "@/Module/Npcs/api/npcsApi";

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id ?? ""));

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["npc-detail", id.value]),
	queryFn: () => npcsApi.getById(id.value),
	enabled: computed(() => id.value.length > 0),
});

const npc = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});

const visible = computed({
	get: () => id.value.length > 0,
	set: (open) => {
		if (!open) void router.push({ name: "npcs" });
	},
});

// The stat block drawer cascades off this panel's *actual* rendered width,
// not a guessed fraction of the viewport.
const panelWidth = ref(0);
</script>

<template>
	<BaseDrawer
		v-model:visible="visible"
		position="right"
		class="w-[45vw]"
		@update:width="(w) => (panelWidth = w)"
	>
		<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
		<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load NPC.</div>
		<NpcDetails v-else-if="npc" :npc="npc" :panel-width="panelWidth" />
	</BaseDrawer>
</template>
