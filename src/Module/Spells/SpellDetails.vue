<script lang="ts" setup>
import { computed } from "vue"
import type { Spell } from "@/Module/EncounterManager/types"
import {
	getSpellSchoolName,
	getRoll20Data,
} from "@/services/spellService"

const props = defineProps<{ spell: Spell }>()

const s = computed(() => props.spell)
const roll20 = computed(() => getRoll20Data(s.value.name, s.value.source))

function castingTime(spell: Spell): string {
	return spell.time
		.map((t) => {
			const base = `${t.number} ${t.unit}`
			return t.condition ? `${base} (${t.condition})` : base
		})
		.join(", ")
}

function rangeDisplay(spell: Spell): string {
	const r = spell.range
	if (r.type === "special") return "Special"
	if (r.type === "sight") return "Sight"
	if (!r.distance) return r.type

	const d = r.distance
	if (d.type === "self") return "Self"
	if (d.type === "touch") return "Touch"
	if (d.type === "unlimited") return "Unlimited"

	return `${d.amount} ${d.type}`
}

function componentsDisplay(spell: Spell): string {
	const c = spell.components
	const parts: string[] = []

	if (c.v) parts.push("V")
	if (c.s) parts.push("S")
	if (c.m) parts.push(`M${typeof c.m === "string" ? ` (${c.m})` : ""}`)

	return parts.join(", ")
}

function durationDisplay(spell: Spell): string {
	return spell.duration
		.map((d) => {
			if (d.type === "instant") return "Instantaneous"
			if (d.type === "permanent") return "Until dispelled"
			if (d.type === "special") return "Special"

			if (d.duration) {
				const inner = `${d.duration.amount ?? ""} ${d.duration.type}`.trim()
				return d.concentration ? `Concentration, up to ${inner}` : inner
			}

			return d.type
		})
		.join(", ")
}

function clean(text: string): string {
	return text
		.replace(
			/\{@(?:dice|damage|hit)\s([^|}]+)(?:\|([^}]+))?\}/g,
			(_, content, display) => `<strong>${display ?? content}</strong>`,
		)
		.replace(
			/\{@\w+\s([^|}]+)(?:\|([^}]+))?\}/g,
			(_, content, display) => display ?? content,
		)
}

const header = computed(() => {
	const level = s.value.level
	const school = getSpellSchoolName(s.value.school)
	const tags: string[] = []

	if (s.value.ritual) tags.push("ritual")

	const tag = tags.length ? ` (${tags.join(", ")})` : ""

	return level === 0
		? `${school} cantrip${tag}`
		: `Level ${level} ${school}${tag}`
})

const classes = computed(() =>
	s.value.classes?.fromClassList?.map((c) => c.name).join(", ") || null,
)

const subclasses = computed(() => {
	const raw = s.value.classes?.fromSubclass as
		| { class: { name: string }; subclass: { name: string } }[]
		| undefined

	if (!raw?.length) return null

	return raw.map((e) => `${e.subclass.name} ${e["class"].name}`).join(", ")
})

const damage = computed(() => {
	const d = roll20.value
	if (!d?.Damage) return null

	return d["Damage Type"] ? `${d.Damage} ${d["Damage Type"]}` : d.Damage
})

const save = computed(() => {
	const d = roll20.value
	if (!d?.Save) return null

	return d["Save Success"] ? `${d.Save} (${d["Save Success"]})` : d.Save
})

const healing = computed(() => roll20.value?.Healing ?? null)
</script>

<template>
	<div class="font-serif text-sm text-gray-900">
		<!-- Header -->
		<div class="mb-2">
			<h2 class="text-xl font-bold text-red-800">{{ s.name }}</h2>
			<p class="italic text-gray-600">{{ header }}</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<!-- Casting properties -->
		<div class="space-y-0.5 mb-2">
			<p>
				<span class="font-bold text-red-800">Casting Time</span>
				{{ castingTime(s) }}
			</p>
			<p>
				<span class="font-bold text-red-800">Range</span>
				{{ rangeDisplay(s) }}
			</p>
			<p>
				<span class="font-bold text-red-800">Components</span>
				{{ componentsDisplay(s) }}
			</p>
			<p>
				<span class="font-bold text-red-800">Duration</span>
				{{ durationDisplay(s) }}
			</p>
		</div>

		<!-- Combat stats from roll20 (if any) -->
		<div v-if="damage || save || healing" class="space-y-0.5 mb-2">
			<p v-if="damage">
				<span class="font-bold text-red-800">Damage</span>
				{{ damage }}
			</p>
			<p v-if="save">
				<span class="font-bold text-red-800">Save</span>
				{{ save }}
			</p>
			<p v-if="healing">
				<span class="font-bold text-red-800">Healing</span>
				{{ healing }}
			</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<!-- Description -->
		<div class="space-y-1.5 mb-2">
			<template v-for="(entry, i) in s.entries" :key="i">
				<p v-if="typeof entry === 'string'" v-html="clean(entry)" />
			</template>
		</div>

		<!-- At Higher Levels -->
		<div v-if="s.entriesHigherLevel?.length" class="mb-2">
			<p v-for="hl in s.entriesHigherLevel" :key="hl.name">
				<span class="font-bold italic">{{ hl.name }}.</span>
				<span v-html="' ' + hl.entries.map(clean).join(' ')" />
			</p>
		</div>

		<hr class="border-red-700 border-t-2 my-2" />

		<!-- Classes / Subclasses / Source -->
		<div class="space-y-0.5">
			<p v-if="classes">
				<span class="font-bold text-red-800">Classes</span>
				{{ classes }}
			</p>
			<p v-if="subclasses">
				<span class="font-bold text-red-800">Subclasses</span>
				{{ subclasses }}
			</p>
			<p>
				<span class="font-bold text-red-800">Source</span>
				{{ s.source }}
				<span v-if="s.page" class="text-gray-500">, page {{ s.page }}</span>
			</p>
		</div>
	</div>
</template>
