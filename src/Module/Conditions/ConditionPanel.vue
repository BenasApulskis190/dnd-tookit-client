<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import ConditionDetails from "@/Module/Conditions/ConditionDetails.vue";
import { conditionsApi } from "@/Module/Conditions/api/conditionsApi";

const props = defineProps<{ id: string }>();

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["condition-detail", props.id]),
	queryFn: () => conditionsApi.getById(props.id),
	enabled: computed(() => Boolean(props.id)),
});

const condition = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
	<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load condition.</div>
	<ConditionDetails v-else-if="condition" :condition="condition" />
</template>
