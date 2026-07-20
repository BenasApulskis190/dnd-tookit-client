<script lang="ts" setup>
import BaseBox from "@/Module/Box/BaseBox.vue"
import BaseFilter from "@/Module/Filters/BaseFilter.vue"

const emit = defineEmits<{
	raritySelect: [rarity: string | null]
}>()

const RARITIES = [
	{ id: "all", name: "All" },
	{ id: "Common", name: "Common" },
	{ id: "Uncommon", name: "Uncommon" },
	{ id: "Rare", name: "Rare" },
	{ id: "Very Rare", name: "Very Rare" },
	{ id: "Legendary", name: "Legendary" },
]

function onRaritySelect(item: { id: string; name: string }) {
	emit("raritySelect", item.id === "all" ? null : item.id)
}
</script>

<template>
	<BaseBox>
		<div>
			<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">Rarity</p>
			<BaseFilter :items="RARITIES" @filter-select="onRaritySelect" />
		</div>
	</BaseBox>
</template>
