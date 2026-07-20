<script lang="ts" setup>
import BaseBox from "@/Module/Box/BaseBox.vue"
import BaseFilter from "@/Module/Filters/BaseFilter.vue"

const emit = defineEmits<{
	sourceSelect: [source: string | null]
}>()

const SOURCES = [
	{ id: "all", name: "All" },
	{ id: "PHB", name: "PHB" },
	{ id: "DMG", name: "DMG" },
	{ id: "TCE", name: "TCE" },
]

function onSourceSelect(item: { id: string; name: string }) {
	emit("sourceSelect", item.id === "all" ? null : item.id)
}
</script>

<template>
	<BaseBox>
		<div>
			<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">Source</p>
			<BaseFilter :items="SOURCES" @filter-select="onSourceSelect" />
		</div>
	</BaseBox>
</template>
