<script lang="ts" setup>
import { computed } from "vue"
import type { DnDClass } from "@/Module/EncounterManager/types"
import { clean } from "@/utils/clean"

const props = defineProps<{ dndClass: DnDClass }>()

const c = computed(() => props.dndClass)

const savingThrows = computed(() =>
	c.value.proficiency.map((s) => s.toUpperCase()).join(", "),
)

const skillsDisplay = computed(() => {
	const skills = c.value.startingProficiencies?.skills
	if (!skills) return null
	if (typeof skills === "string") return skills
	return `Choose ${skills.choose} from ${skills.from.join(", ")}`
})

const leveledFeatures = computed(() =>
	c.value.classFeatures.map((features, index) => ({
		level: index + 1,
		features,
	})).filter((lvl) => lvl.features.length > 0),
)
</script>

<template>
	<div class="font-serif text-sm text-gray-900">
		<div class="mb-2">
			<h2 class="text-xl font-bold text-red-800">{{ c.name }}</h2>
			<p class="italic text-gray-600">
				Hit Die: d{{ c.hd.faces }} · Saves: {{ savingThrows }}
			</p>
			<p class="text-xs text-gray-400">{{ c.source }}</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<div
			v-if="c.startingProficiencies"
			class="space-y-0.5 mb-2"
		>
			<p v-if="c.startingProficiencies.armor?.length">
				<span class="font-bold text-red-800">Armor</span>
				{{ c.startingProficiencies.armor.join(", ") }}
			</p>
			<p v-if="c.startingProficiencies.weapons?.length">
				<span class="font-bold text-red-800">Weapons</span>
				{{ c.startingProficiencies.weapons.join(", ") }}
			</p>
			<p v-if="c.startingProficiencies.tools?.length">
				<span class="font-bold text-red-800">Tools</span>
				{{ c.startingProficiencies.tools.join(", ") }}
			</p>
			<p v-if="skillsDisplay">
				<span class="font-bold text-red-800">Skills</span>
				{{ skillsDisplay }}
			</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<div class="space-y-3">
			<div v-for="lvl in leveledFeatures" :key="lvl.level">
				<p class="font-bold text-red-800 text-xs uppercase tracking-wide mb-1">
					Level {{ lvl.level }}
				</p>
				<div
					v-for="feature in lvl.features"
					:key="feature.name"
					class="mb-2"
				>
					<p class="font-bold italic">{{ feature.name }}</p>
					<div class="space-y-1">
						<template
							v-for="(entry, i) in feature.entries"
							:key="i"
						>
							<p
								v-if="typeof entry === 'string'"
								v-html="clean(entry)"
							/>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
