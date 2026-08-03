<script lang="ts" setup>
import { computed } from "vue";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/vue-query";
import BaseBox from "@/Module/Box/BaseBox.vue";
import BaseFilter from "@/Module/Filters/BaseFilter.vue";
import { adventuresApi } from "@/Module/Adventures/api/adventuresApi";

const emit = defineEmits<{
	storylineSelect: [storyline: string | null];
}>();

// Storylines aren't a fixed enum, so the facet options are derived from the
// adventures that actually exist rather than a hardcoded list.
const { data } = useQuery({
	queryKey: ["adventures-storylines"],
	queryFn: () => adventuresApi.getAll({ limit: 100 }),
});

const items = computed(() => {
	const val = data.value;
	const adventures = !val || val instanceof AxiosError ? [] : val.data;
	const storylines = [...new Set(adventures.map((a) => a.storyline).filter((s): s is string => !!s))].sort();
	return [{ id: "all", name: "All" }, ...storylines.map((s) => ({ id: s, name: s }))];
});

function onStorylineSelect(item: { id: string; name: string }) {
	emit("storylineSelect", item.id === "all" ? null : item.id);
}
</script>

<template>
	<BaseBox>
		<div>
			<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">Storyline</p>
			<BaseFilter :items="items" @filter-select="onStorylineSelect" />
		</div>
	</BaseBox>
</template>
