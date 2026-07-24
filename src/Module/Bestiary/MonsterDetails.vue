<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { monstersApi } from "@/Module/Bestiary/api/monsterApi";
import type {
	IMonsterDetail,
	IMonsterEntry,
	IMonsterSpell,
} from "@/Module/Bestiary/types";
import { resoleMonsterImageUrl } from "@/Module/Bestiary/util/monsterImageResolver";
import EntryText from "@/Module/Bestiary/EntryText.vue";
import SpellDrawer from "@/Module/Spells/SpellDrawer.vue";
import {
	abilityModifier,
	armorClassLabel,
	challengeLabel,
	descriptionParagraphs,
	hitPointsLabel,
	proficiencyBonus,
	savingThrows,
	sensesLabel,
	skillsLabel,
	speedLabel,
	subtitle,
} from "@/Module/Bestiary/util/monsterFormat";

const props = defineProps<{ id?: string }>();

const route = useRoute();
const monsterId = computed(() => props.id ?? String(route.params.id ?? ""));

const { data, isLoading, isError, error } = useQuery({
	queryKey: computed(() => ["monster", monsterId.value]),
	queryFn: () => monstersApi.getById(monsterId.value),
	enabled: computed(() => monsterId.value.length > 0),
});

const monster = computed(() => (data.value ?? null) as IMonsterDetail | null);

// The image endpoint is best-effort — plenty of creatures have no artwork, so
// a failed load just collapses the image column rather than showing a broken tile.
const imageFailed = ref(false);
const imageUrl = computed(() =>
	monster.value
		? resoleMonsterImageUrl(monster.value.source, monster.value.name)
		: null,
);
watch(imageUrl, () => {
	imageFailed.value = false;
});

const abilities = computed(() => {
	const m = monster.value;
	if (!m) return [];

	return [
		{ label: "STR", score: m.strScore },
		{ label: "DEX", score: m.dexScore },
		{ label: "CON", score: m.conScore },
		{ label: "INT", score: m.intScore },
		{ label: "WIS", score: m.wisScore },
		{ label: "CHA", score: m.chaScore },
	];
});

/** Rows that only appear when the creature actually has the data. */
const traitRows = computed(() => {
	const m = monster.value;
	if (!m) return [];

	return [
		{ label: "Saving Throws", value: savingThrows(m) },
		{ label: "Skills", value: skillsLabel(m.skills) },
		{ label: "Senses", value: sensesLabel(m) },
		{ label: "Languages", value: m.languages ?? "" },
	].filter((row) => row.value);
});

const ACTION_SECTIONS: { type: string; title: string }[] = [
	{ type: "action", title: "Actions" },
	{ type: "bonus", title: "Bonus Actions" },
	{ type: "reaction", title: "Reactions" },
	{ type: "legendary", title: "Legendary Actions" },
	{ type: "mythic", title: "Mythic Actions" },
];

const actionSections = computed(() => {
	const actions = monster.value?.actions ?? [];

	return ACTION_SECTIONS.map(({ type, title }) => ({
		title,
		entries: actions.filter((action) => (action.type ?? "action") === type),
	})).filter((section) => section.entries.length > 0);
});

function paragraphs(entry: IMonsterEntry): string[] {
	return descriptionParagraphs(entry.description);
}

/** Spells grouped by level (0 = cantrips), each group sorted by name. */
const spellGroups = computed(() => {
	const spells = monster.value?.spells ?? [];
	if (!spells.length) return [];

	const byLevel = new Map<number, IMonsterSpell[]>();
	for (const spell of spells) {
		const group = byLevel.get(spell.level) ?? [];
		group.push(spell);
		byLevel.set(spell.level, group);
	}

	return [...byLevel.entries()]
		.sort(([a], [b]) => a - b)
		.map(([level, group]) => ({
			level,
			title: level === 0 ? "Cantrips" : `Level ${level}`,
			spells: [...group].sort((a, b) => a.name.localeCompare(b.name)),
		}));
});

// Clicking a spell opens it in a left drawer alongside this (right-hand) one.
const selectedSpellId = ref<string | null>(null);
const spellDrawerVisible = ref(false);

function openSpell(id: string) {
	selectedSpellId.value = id;
	spellDrawerVisible.value = true;
}
</script>

<template>
	<div class="h-full overflow-y-auto p-6">
		<div v-if="isLoading" class="text-sm text-ink-mute">Loading…</div>

		<div v-else-if="isError" class="text-sm text-red-400">
			{{ error?.message ?? "Failed to load monster." }}
		</div>

		<article v-else-if="monster" class="space-y-6">
			<!-- Name + optional artwork -->
			<header class="flex items-start gap-4">
				<div class="min-w-0 flex-1">
					<h2 class="font-display text-3xl leading-tight text-monster">
						{{ monster.name }}
					</h2>
					<p class="mt-1 text-sm italic text-ink-mute">{{ subtitle(monster) }}</p>
					<p class="mt-1 text-xs text-ink-faint">
						{{ monster.source }}<span v-if="monster.page"> · p. {{ monster.page }}</span>
					</p>
				</div>

				<img
					v-if="imageUrl && !imageFailed"
					:src="imageUrl"
					:alt="monster.name"
					class="h-28 w-28 shrink-0 rounded-lg border border-border object-cover"
					@error="imageFailed = true"
				/>
			</header>

			<!-- Core defensive stats -->
			<dl
				class="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border"
			>
				<div class="bg-bg-elev2 px-3 py-2">
					<dt class="text-xs uppercase tracking-wide text-ink-faint">Armor Class</dt>
					<dd class="text-sm text-ink-soft">{{ armorClassLabel(monster) }}</dd>
				</div>
				<div class="bg-bg-elev2 px-3 py-2">
					<dt class="text-xs uppercase tracking-wide text-ink-faint">Hit Points</dt>
					<dd class="text-sm text-ink-soft">{{ hitPointsLabel(monster) }}</dd>
				</div>
				<div class="bg-bg-elev2 px-3 py-2">
					<dt class="text-xs uppercase tracking-wide text-ink-faint">Speed</dt>
					<dd class="text-sm text-ink-soft">{{ speedLabel(monster) }}</dd>
				</div>
			</dl>

			<!-- Ability scores -->
			<div class="grid grid-cols-6 gap-2">
				<div
					v-for="ability in abilities"
					:key="ability.label"
					class="rounded-lg border border-border bg-bg-elev2 py-2 text-center"
				>
					<div class="text-xs font-semibold tracking-wide text-ink-faint">
						{{ ability.label }}
					</div>
					<div class="text-sm text-ink">{{ ability.score ?? "—" }}</div>
					<div class="text-xs text-ink-mute">{{ abilityModifier(ability.score) }}</div>
				</div>
			</div>

			<!-- Proficiencies, senses, challenge -->
			<dl class="space-y-1 text-sm">
				<div v-for="row in traitRows" :key="row.label" class="flex gap-2">
					<dt class="shrink-0 font-semibold text-ink-soft">{{ row.label }}</dt>
					<dd class="text-ink-mute">{{ row.value }}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="shrink-0 font-semibold text-ink-soft">Challenge</dt>
					<dd class="text-ink-mute">
						{{ challengeLabel(monster.challengeRating) }}
						<span class="text-ink-faint">
							· Proficiency Bonus
							{{ proficiencyBonus(monster.challengeRating, monster.crValue) }}
						</span>
					</dd>
				</div>
			</dl>

			<!-- Traits -->
			<section v-if="monster.traits?.length" class="space-y-3">
				<h3
					class="border-b border-monster/40 pb-1 font-display text-xl text-monster"
				>
					Traits
				</h3>
				<div v-for="trait in monster.traits" :key="trait.id" class="text-sm">
					<p
						v-for="(paragraph, i) in paragraphs(trait)"
						:key="i"
						class="text-ink-soft"
					>
						<span v-if="i === 0" class="font-semibold italic text-ink">
							{{ trait.name }}.
						</span>
						<EntryText :text="paragraph" />
					</p>
				</div>
			</section>

			<!-- Spellcasting spell list -->
			<section v-if="spellGroups.length" class="space-y-3">
				<h3
					class="border-b border-monster/40 pb-1 font-display text-xl text-monster"
				>
					Spells
				</h3>
				<div v-for="group in spellGroups" :key="group.level" class="text-sm">
					<span class="font-semibold italic text-ink">{{ group.title }}: </span>
					<span class="text-ink-soft">
						<template v-for="(spell, i) in group.spells" :key="spell.id">
							<button
								type="button"
								class="rounded text-spell underline decoration-dotted underline-offset-2 hover:bg-spell/15"
								@click="openSpell(spell.id)"
							>
								{{ spell.name }}</button
							><span v-if="i < group.spells.length - 1">, </span>
						</template>
					</span>
				</div>
			</section>

			<!-- Actions, bonus actions, reactions, legendary/mythic -->
			<section
				v-for="section in actionSections"
				:key="section.title"
				class="space-y-3"
			>
				<h3
					class="border-b border-monster/40 pb-1 font-display text-xl text-monster"
				>
					{{ section.title }}
				</h3>
				<div v-for="entry in section.entries" :key="entry.id" class="text-sm">
					<p
						v-for="(paragraph, i) in paragraphs(entry)"
						:key="i"
						class="text-ink-soft"
					>
						<span v-if="i === 0" class="font-semibold italic text-ink">
							{{ entry.name }}.
						</span>
						<EntryText :text="paragraph" />
					</p>
				</div>
			</section>

			<SpellDrawer
				v-model:visible="spellDrawerVisible"
				:id="selectedSpellId"
				position="left"
			/>
		</article>
	</div>
</template>
