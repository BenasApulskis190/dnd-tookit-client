<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import ItemDetails from "@/Module/Items/ItemDetails.vue";
import { itemsApi } from "@/Module/Items/api/itemsApi";

const props = defineProps<{ id: string }>();

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["item-detail", props.id]),
	queryFn: () => itemsApi.getById(props.id),
	enabled: computed(() => Boolean(props.id)),
});

const item = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
	<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load item.</div>
	<ItemDetails v-else-if="item" :item="item" />
</template>
