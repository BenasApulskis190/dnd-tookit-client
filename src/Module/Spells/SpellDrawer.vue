<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import SpellDetails from "@/Module/Spells/SpellDetails.vue";
import { spellsApi } from "@/Module/Spells/api/spellsApi";

// Reusable spell drawer driven by an id rather than the route — lets any list
// (e.g. a monster's spellcasting block) pop a spell open without navigating.
const props = withDefaults(
	defineProps<{ id: string | null; position?: "left" | "right"; offset?: string }>(),
	{ position: "right", offset: "0px" },
);

const visible = defineModel<boolean>("visible", { default: false });

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => ["spell-detail", props.id]),
	queryFn: () => spellsApi.getByid(String(props.id)),
	enabled: computed(() => Boolean(props.id)),
});

const spell = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});
</script>

<template>
	<BaseDrawer v-model:visible="visible" :position="position" :offset="offset" class="w-[45vw]">
		<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
		<div v-else-if="isError" class="p-6 text-sm text-red-400">
			Failed to load spell.
		</div>
		<SpellDetails v-else-if="spell" :spell="spell" />
	</BaseDrawer>
</template>
