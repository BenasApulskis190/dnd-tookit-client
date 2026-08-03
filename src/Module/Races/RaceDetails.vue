<script lang="ts" setup>
import { computed } from "vue";
import type { IRace } from "@/Module/Races/types";
import EntryContent from "@/Module/Entry/EntryContent.vue";
import { normalizeEntries } from "@/utils/entries";
import { abilityBonusLabels, sizeLabel, speedLabels } from "@/Module/Races/util/raceFormat";

const props = defineProps<{ race: IRace }>();

const blocks = computed(() => normalizeEntries(props.race.description));
const abilityBonuses = computed(() => abilityBonusLabels(props.race));
const speeds = computed(() => speedLabels(props.race));
const subraces = computed(() => props.race.subraces ?? []);

function subraceBlocks(subrace: IRace["subraces"][number]) {
	return normalizeEntries(subrace.description);
}
</script>

<template>
	<article class="h-full space-y-6 overflow-y-auto p-6">
		<header>
			<h2 class="font-display text-3xl leading-tight text-race">
				{{ race.name }}
			</h2>
			<p class="mt-1 text-xs text-ink-faint">
				{{ race.source }}<span v-if="race.page"> · p. {{ race.page }}</span>
			</p>

			<div v-if="abilityBonuses.length" class="mt-2 flex flex-wrap gap-1.5">
				<span
					v-for="bonus in abilityBonuses"
					:key="bonus"
					class="rounded bg-race/15 px-2 py-0.5 text-xs font-semibold text-race"
				>
					{{ bonus }}
				</span>
			</div>
		</header>

		<dl
			class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
		>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Size</dt>
				<dd class="text-sm text-ink-soft">{{ sizeLabel(race.size) }}</dd>
			</div>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Speed</dt>
				<dd class="text-sm text-ink-soft">{{ speeds.join(", ") }}</dd>
			</div>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Darkvision</dt>
				<dd class="text-sm text-ink-soft">
					{{ race.darkvision ? `${race.darkvision} ft.` : "—" }}
				</dd>
			</div>
			<div class="bg-bg-elev2 px-3 py-2">
				<dt class="text-xs uppercase tracking-wide text-ink-faint">Languages</dt>
				<dd class="text-sm text-ink-soft">
					{{ race.languages?.length ? race.languages.join(", ") : "—" }}
				</dd>
			</div>
		</dl>

		<EntryContent :blocks="blocks" accent="race" />

		<section v-if="subraces.length" class="space-y-3">
			<h3 class="border-b border-race/40 pb-1 font-display text-xl text-race">
				Subraces
			</h3>
			<details
				v-for="subrace in subraces"
				:key="subrace.id"
				class="rounded-lg border border-border bg-bg-elev2"
			>
				<summary
					class="flex cursor-pointer items-center justify-between gap-2 px-4 py-2 text-sm font-semibold text-ink-soft"
				>
					<span>{{ subrace.name }}</span>
					<span class="text-xs font-normal text-ink-faint">{{ subrace.source }}</span>
				</summary>
				<div class="border-t border-border px-4 py-3">
					<EntryContent :blocks="subraceBlocks(subrace)" accent="race" />
				</div>
			</details>
		</section>
	</article>
</template>
