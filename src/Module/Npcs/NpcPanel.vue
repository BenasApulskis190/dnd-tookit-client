<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import NpcDetails from "@/Module/Npcs/NpcDetails.vue";
import { npcsApi } from "@/Module/Npcs/api/npcsApi";

const props = defineProps<{ id: string }>();

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["npc-detail", props.id]),
	queryFn: () => npcsApi.getById(props.id),
	enabled: computed(() => Boolean(props.id)),
});

const npc = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
	<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load NPC.</div>
	<NpcDetails v-else-if="npc" :npc="npc" />
</template>
