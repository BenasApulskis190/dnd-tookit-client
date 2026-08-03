<script lang="ts" setup>
import { computed } from "vue";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/vue-query";
import BaseBox from "@/Module/Box/BaseBox.vue";
import BaseFilter from "@/Module/Filters/BaseFilter.vue";
import { adventuresApi } from "@/Module/Adventures/api/adventuresApi";

const emit = defineEmits<{
	adventureSelect: [code: string | null];
}>();

// NPCs are scoped to an adventure, so the facet options come from the real
// adventure list rather than a hardcoded set (like the source facets elsewhere).
const { data } = useQuery({
	queryKey: ["adventures-facet"],
	queryFn: () => adventuresApi.getAll({ limit: 100 }),
});

const items = computed(() => {
	const val = data.value;
	const adventures = !val || val instanceof AxiosError ? [] : val.data;
	return [
		{ id: "all", name: "All" },
		...adventures.map((a) => ({ id: a.code, name: a.code })),
	];
});

function onAdventureSelect(item: { id: string; name: string }) {
	emit("adventureSelect", item.id === "all" ? null : item.id);
}
</script>

<template>
	<BaseBox>
		<div>
			<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">Adventure</p>
			<BaseFilter :items="items" @filter-select="onAdventureSelect" />
		</div>
	</BaseBox>
</template>
