<script lang="ts" setup>
import type { Background } from "@/Module/EncounterManager/types"
import { clean } from "@/utils/clean"

defineProps<{ background: Background }>()
</script>

<template>
	<div class="font-serif text-sm text-gray-900">
		<div class="mb-2">
			<h2 class="text-xl font-bold text-red-800">{{ background.name }}</h2>
			<p class="text-xs text-gray-400">
				{{ background.source
				}}<span v-if="background.page">, p. {{ background.page }}</span>
			</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<div class="space-y-0.5 mb-2">
			<p v-if="background.skillProficiencies">
				<span class="font-bold text-red-800">Skill Proficiencies</span>
				{{ background.skillProficiencies }}
			</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<div class="space-y-3">
			<template v-for="(entry, i) in background.entries" :key="i">
				<p v-if="typeof entry === 'string'" v-html="clean(entry)" />

				<div v-else-if="entry.type === 'entries' && entry.name">
					<p class="font-bold italic text-red-800">{{ entry.name }}</p>
					<div class="space-y-1 mt-0.5">
						<template
							v-for="(sub, j) in entry.entries ?? []"
							:key="j"
						>
							<p
								v-if="typeof sub === 'string'"
								v-html="clean(sub)"
							/>
						</template>
					</div>
				</div>

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
