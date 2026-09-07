<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import SpellDetails from "@/Module/Spells/SpellDetails.vue";
import { spellsApi } from "@/Module/Spells/api/spellsApi";

const props = defineProps<{ id: string }>();

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["spell-detail", props.id]),
	queryFn: () => spellsApi.getByid(props.id),
	enabled: computed(() => Boolean(props.id)),
});

const spell = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
	<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load spell.</div>
	<SpellDetails v-else-if="spell" :spell="spell" />
</template>
