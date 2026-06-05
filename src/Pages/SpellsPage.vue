<script lang="ts" setup>
import { getAllSpells, getSpellSchoolName } from "@/services/spellService"
import type { Spell } from "@/Module/EncounterManager/types"
import List from "@/Module/List/List.vue"
import SpellItem from "@/Module/Spells/SpellItem.vue"

const spells = getAllSpells()

function filtered(search: string): Spell[] {
	const q = search.toLowerCase().trim()

	if (!q) {
		return spells
	}

	return spells.filter((s) => {
		return (
			s.name.toLowerCase().includes(q) ||
			getSpellSchoolName(s.school).toLowerCase().includes(q) ||
			s.source.toLowerCase().includes(q) ||
			s.classes?.fromClassList?.some((c) =>
				c.name.toLowerCase().includes(q),
			)
		)
	})
}
</script>

<template>
	<List :search-by="['name', 'school', 'class', 'source']">
		<template #header="{ search }">
			<p class="mt-1 text-xs text-gray-400">
				{{ filtered(search).length }} spells
			</p>
		</template>

		<template #default="{ search }">
			<SpellItem
				v-for="spell in filtered(search)"
				:key="spell.name + spell.source"
				:spell="spell"
			/>
		</template>
	</List>
</template>
