<script lang="ts" setup>
import type { Spell } from "@/Module/EncounterManager/types"
import { getSpellLevelLabel, getSpellSchoolName } from "@/services/spellService"
import SpellDetails from "./SpellDetails.vue"
import ListItem from "@/Module/List/ListItem.vue"

defineProps<{ spell: Spell }>()
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">
					{{ spell.name }}
				</p>
				<p class="text-xs text-gray-400">
					{{ getSpellLevelLabel(spell.level) }} ·
					{{ getSpellSchoolName(spell.school) }} · {{ spell.source }}
				</p>
			</div>
		</template>

		<template #details>
			<SpellDetails :spell="spell" />
		</template>
	</ListItem>
</template>
