<script lang="ts" setup>
import { computed } from "vue"
import type { Item } from "@/Module/EncounterManager/types"
import { clean } from "@/utils/clean"
import {
	getItemTypeName,
	DMG_TYPE_MAP,
	PROPERTY_MAP,
} from "@/services/itemService"

const props = defineProps<{ item: Item }>()

const i = computed(() => props.item)

const isWeapon = computed(() => i.value.weapon || i.value.type === "M" || i.value.type === "R")

const dmgType = computed(() => {
	const t = i.value.dmgType
	return t ? (DMG_TYPE_MAP[t] ?? t) : null
})

const properties = computed(() => {
	return (
		i.value.property
			?.map((p) => PROPERTY_MAP[p] ?? p)
			.join(", ") ?? null
	)
})
</script>

<template>
	<div class="font-serif text-sm text-gray-900">
		<div class="mb-2">
			<h2 class="text-xl font-bold text-red-800">{{ i.name }}</h2>
			<p class="italic text-gray-600">
				{{ i.wondrous ? "Wondrous Item" : getItemTypeName(i.type) }}
				<span v-if="i.rarity && i.rarity !== 'None'">
					· {{ i.rarity }}
				</span>
			</p>
			<p class="text-xs text-gray-400">
				{{ i.source
				}}<span v-if="i.page">, p. {{ i.page }}</span>
			</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<div class="space-y-0.5 mb-2">
			<p v-if="i.value">
				<span class="font-bold text-red-800">Cost</span>
				{{ i.value }}
			</p>
			<p v-if="i.weight">
				<span class="font-bold text-red-800">Weight</span>
				{{ i.weight }} lb.
			</p>
			<template v-if="isWeapon">
				<p v-if="i.dmg1">
					<span class="font-bold text-red-800">Damage</span>
					<strong>{{ i.dmg1 }}</strong>
					<span v-if="i.dmg2"> ({{ i.dmg2 }} two-handed)</span>
					<span v-if="dmgType"> {{ dmgType }}</span>
				</p>
			</template>
			<p v-if="properties">
				<span class="font-bold text-red-800">Properties</span>
				{{ properties }}
			</p>
		</div>

		<template v-if="i.entries?.length">
			<hr class="border-red-700 border-t-2 my-2" />
			<div class="space-y-1.5">
				<template v-for="(entry, idx) in i.entries" :key="idx">
					<p
						v-if="typeof entry === 'string'"
						v-html="clean(entry)"
					/>
				</template>
			</div>
		</template>
	</div>
</template>
