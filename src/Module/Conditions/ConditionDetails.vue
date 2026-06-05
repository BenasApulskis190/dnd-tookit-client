<script lang="ts" setup>
import type { Condition } from "@/Module/EncounterManager/types"
import { clean } from "@/utils/clean"

defineProps<{ condition: Condition }>()
</script>

<template>
	<div class="font-serif text-sm text-gray-900">
		<div class="mb-2">
			<h2 class="text-xl font-bold text-red-800">{{ condition.name }}</h2>
			<p class="text-xs text-gray-400">
				{{ condition.source
				}}<span v-if="condition.page">, p. {{ condition.page }}</span>
			</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<div class="space-y-1.5">
			<template v-for="(entry, i) in condition.entries" :key="i">
				<p v-if="typeof entry === 'string'" v-html="clean(entry)" />
				<ul
					v-else-if="entry.type === 'list'"
					class="list-disc pl-5 space-y-1"
				>
					<li
						v-for="(item, j) in entry.items ?? []"
						:key="j"
						v-html="clean(item)"
					/>
				</ul>
			</template>
		</div>
	</div>
</template>
