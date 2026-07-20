<script lang="ts" setup>
import BaseBox from "@/Module/Box/BaseBox.vue"
import BaseFilter from "@/Module/Filters/BaseFilter.vue"

const emit = defineEmits<{
	levelSelect: [level: number | null]
	schoolSelect: [school: string | null]
}>()

const LEVELS = [
	{ id: "all", name: "All" },
	{ id: "0", name: "Cantrip" },
	{ id: "1", name: "1st" },
	{ id: "2", name: "2nd" },
	{ id: "3", name: "3rd" },
	{ id: "4", name: "4th" },
	{ id: "5", name: "5th" },
	{ id: "6", name: "6th" },
	{ id: "7", name: "7th" },
	{ id: "8", name: "8th" },
	{ id: "9", name: "9th" },
]

const SCHOOLS = [
	{ id: "all", name: "All" },
	{ id: "A", name: "Abjuration" },
	{ id: "C", name: "Conjuration" },
	{ id: "D", name: "Divination" },
	{ id: "E", name: "Enchantment" },
	{ id: "V", name: "Evocation" },
	{ id: "I", name: "Illusion" },
	{ id: "N", name: "Necromancy" },
	{ id: "T", name: "Transmutation" },
]

function onLevelSelect(item: { id: string; name: string }) {
	emit("levelSelect", item.id === "all" ? null : Number(item.id))
}

function onSchoolSelect(item: { id: string; name: string }) {
	emit("schoolSelect", item.id === "all" ? null : item.id)
}
</script>

<template>
	<BaseBox>
		<div class="space-y-3">
			<div>
				<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">Level</p>
				<BaseFilter :items="LEVELS" @filter-select="onLevelSelect" />
			</div>
			<div>
				<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">School</p>
				<BaseFilter :items="SCHOOLS" @filter-select="onSchoolSelect" />
			</div>
		</div>
	</BaseBox>
</template>
