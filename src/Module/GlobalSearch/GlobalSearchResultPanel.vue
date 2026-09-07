<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import type { IndexName } from "@/Module/GlobalSearch/indices";
import { spellsApi } from "@/Module/Spells/api/spellsApi";
import { conditionsApi } from "@/Module/Conditions/api/conditionsApi";
import { backgroundsApi } from "@/Module/Backgrounds/api/backgroundsApi";
import { featsApi } from "@/Module/Feats/api/featsApi";
import { itemsApi } from "@/Module/Items/api/itemsApi";
import { racesApi } from "@/Module/Races/api/racesApi";
import type { ISpell } from "@/Module/Spells/types";
import type { ICondition } from "@/Module/Conditions/types";
import type { IBackground } from "@/Module/Backgrounds/types";
import type { IFeat } from "@/Module/Feats/types";
import type { IItem } from "@/Module/Items/types";
import type { IRace } from "@/Module/Races/types";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";
import SpellDetails from "@/Module/Spells/SpellDetails.vue";
import ConditionDetails from "@/Module/Conditions/ConditionDetails.vue";
import BackgroundDetails from "@/Module/Backgrounds/BackgroundDetails.vue";
import FeatDetails from "@/Module/Feats/FeatDetails.vue";
import ItemDetails from "@/Module/Items/ItemDetails.vue";
import RaceDetails from "@/Module/Races/RaceDetails.vue";

const props = defineProps<{ index: IndexName; id: string }>();

// Monsters render via MonsterDetails' own `id` prop (it fetches and handles
// its own loading/error state) — every other index's Details component takes
// the fully-resolved entity as a prop, so those are fetched generically here.
const FETCHERS: Partial<Record<IndexName, (id: string) => Promise<unknown>>> = {
	spells: spellsApi.getByid,
	conditions: conditionsApi.getById,
	backgrounds: backgroundsApi.getById,
	feats: featsApi.getById,
	items: itemsApi.getById,
	races: racesApi.getById,
};

const { data, isLoading, isError } = useQuery({
	queryKey: computed(() => [props.index, "detail", props.id]),
	queryFn: () => FETCHERS[props.index]!(props.id),
	enabled: computed(() => props.index !== "monsters" && Boolean(FETCHERS[props.index])),
	// Compendium entries are static reference data — once fetched, never
	// refetch just because the accordion item was collapsed and reopened.
	staleTime: Infinity,
});

const entity = computed(() => {
	const v = data.value;
	return !v || v instanceof AxiosError ? null : v;
});

// Cast once per index so the template can bind each Details component's
// entity-specific prop without a per-branch assertion.
const spell = computed(() => entity.value as ISpell);
const condition = computed(() => entity.value as ICondition);
const background = computed(() => entity.value as IBackground);
const feat = computed(() => entity.value as IFeat);
const item = computed(() => entity.value as IItem);
const race = computed(() => entity.value as IRace);
</script>

<template>
	<div class="max-h-[60vh] overflow-y-auto rounded-md border border-border bg-bg-elev2">
		<MonsterDetails v-if="index === 'monsters'" :id="id" />
		<template v-else>
			<div v-if="isLoading" class="p-6 text-sm text-ink-faint">Loading…</div>
			<div v-else-if="isError" class="p-6 text-sm text-red-400">Failed to load.</div>
			<template v-else-if="entity">
				<SpellDetails v-if="index === 'spells'" :spell="spell" />
				<ConditionDetails v-else-if="index === 'conditions'" :condition="condition" />
				<BackgroundDetails v-else-if="index === 'backgrounds'" :background="background" />
				<FeatDetails v-else-if="index === 'feats'" :feat="feat" />
				<ItemDetails v-else-if="index === 'items'" :item="item" />
				<RaceDetails v-else-if="index === 'races'" :race="race" />
			</template>
		</template>
	</div>
</template>
