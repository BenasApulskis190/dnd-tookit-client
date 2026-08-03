<script lang="ts" setup>
import BaseBox from "@/Module/Box/BaseBox.vue"
import BaseFilter from "@/Module/Filters/BaseFilter.vue"

const emit = defineEmits<{
	raritySelect: [rarity: string | null]
	typeSelect: [type: string | null]
	magicSelect: [magic: boolean | null]
}>()

const RARITIES = [
	{ id: "all", name: "All" },
	{ id: "Common", name: "Common" },
	{ id: "Uncommon", name: "Uncommon" },
	{ id: "Rare", name: "Rare" },
	{ id: "Very Rare", name: "Very Rare" },
	{ id: "Legendary", name: "Legendary" },
]

const TYPES = [
	{ id: "all", name: "All" },
	{ id: "weapon", name: "Weapon" },
	{ id: "armor", name: "Armor" },
	{ id: "shield", name: "Shield" },
	{ id: "wondrous item", name: "Wondrous Item" },
	{ id: "potion", name: "Potion" },
	{ id: "ring", name: "Ring" },
	{ id: "rod", name: "Rod" },
	{ id: "staff", name: "Staff" },
	{ id: "wand", name: "Wand" },
	{ id: "scroll", name: "Scroll" },
	{ id: "ammunition", name: "Ammunition" },
	{ id: "tool", name: "Tool" },
	{ id: "instrument", name: "Instrument" },
	{ id: "vehicle", name: "Vehicle" },
	{ id: "mount", name: "Mount" },
	{ id: "trade good", name: "Trade Good" },
	{ id: "treasure", name: "Treasure" },
	{ id: "adventuring gear", name: "Adventuring Gear" },
]

const MAGIC = [
	{ id: "all", name: "All" },
	{ id: "magic", name: "Magic Only" },
	{ id: "mundane", name: "Mundane Only" },
]

function onRaritySelect(item: { id: string; name: string }) {
	emit("raritySelect", item.id === "all" ? null : item.id)
}

function onTypeSelect(item: { id: string; name: string }) {
	emit("typeSelect", item.id === "all" ? null : item.id)
}

function onMagicSelect(item: { id: string; name: string }) {
	emit("magicSelect", item.id === "all" ? null : item.id === "magic")
}
</script>

<template>
	<BaseBox>
		<div class="space-y-3">
			<div>
				<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">Type</p>
				<BaseFilter :items="TYPES" @filter-select="onTypeSelect" />
			</div>
			<div>
				<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">Rarity</p>
				<BaseFilter :items="RARITIES" @filter-select="onRaritySelect" />
			</div>
			<div>
				<p class="text-xs font-semibold text-[var(--ink-faint)] mb-1.5 uppercase tracking-wide">Magic</p>
				<BaseFilter :items="MAGIC" @filter-select="onMagicSelect" />
			</div>
		</div>
	</BaseBox>
</template>
