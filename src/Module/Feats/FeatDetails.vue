<script lang="ts" setup>
import { computed } from "vue"
import type { Feat } from "@/Module/EncounterManager/types"
import { clean } from "@/utils/clean"

const props = defineProps<{ feat: Feat }>()

const prerequisite = computed(() => {
	const pre = props.feat.prerequisite
	if (!pre?.length) return null

	return pre
		.map((p) => {
			const parts: string[] = []
			if (p.race?.length) parts.push(p.race.map((r) => r.name).join(" or "))
			if (p.level) parts.push(`${p.level}th level`)
			return parts.join(", ")
		})
		.filter(Boolean)
		.join("; ")
})
</script>

<template>
	<div class="font-serif text-sm text-gray-900">
		<div class="mb-2">
			<h2 class="text-xl font-bold text-red-800">{{ feat.name }}</h2>
			<p v-if="prerequisite" class="italic text-gray-600">
				Prerequisite: {{ prerequisite }}
			</p>
			<p class="text-xs text-gray-400">
				{{ feat.source
				}}<span v-if="feat.page">, p. {{ feat.page }}</span>
			</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<div class="space-y-1.5">
			<template v-for="(entry, i) in feat.entries" :key="i">
				<p v-if="typeof entry === 'string'" v-html="clean(entry)" />
				<ul
					v-else-if="entry.type === 'list'"
					class="list-disc pl-5 space-y-1"
				>
					<li
						v-for="(item, j) in entry.items ?? []"
						:key="j"
						v-html="typeof item === 'string' ? clean(item) : ''"
					/>
				</ul>
			</template>
		</div>
	</div>
</template>
