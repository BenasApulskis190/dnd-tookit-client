<script lang="ts" setup>
import type { ISpell } from "@/Module/Spells/types"
import ListItem from "@/Module/List/ListItem.vue"
import SpellDetails from "./SpellDetails.vue"

defineProps<{ spell: ISpell }>()
</script>

<template>
	<ListItem>
		<template #header>
			<div class="min-w-0">
				<p class="text-sm font-medium text-gray-800 truncate">
					{{ spell.name }}
				</p>
				<p class="text-xs text-gray-400">
					{{ spell.level === 0 ? "Cantrip" : `Level ${spell.level}` }}
					<template v-if="spell.school"> · {{ spell.school }}</template>
				</p>
			</div>
		</template>

		<template #details>
			<SpellDetails :spell="spell" />
		</template>
	</ListItem>
</template>
