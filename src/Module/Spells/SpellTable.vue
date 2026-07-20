<script setup lang="ts">
import SpellDetails from "@/Module/Spells/SpellDetails.vue";
import { useSpellStore } from "@/Module/Spells/store/useSpellStore";
import type { ISpell } from "@/Module/Spells/types";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import BasePagination from "@/Module/Pagination/BasePagination.vue";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import BaseTable, { type TableColumn } from "@/Module/Table/BaseTable.vue";
import { watchDebounced } from "@vueuse/core";
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

function isPaginatedResponse(val: unknown): val is IPaginatedResponse<ISpell> {
	return !(val instanceof AxiosError);
}

const props = defineProps<{
	spellFilter: {
		level: number | null;
		school: string | null;
	};
	search: string;
}>();

const spellStore = useSpellStore();
const { filter } = spellStore;
const { data, isLoading, isError, error } = storeToRefs(spellStore);

watchDebounced(
	() => props.search,
	(val) => {
		filter.q = val;
		filter.page = 1;
	},
	{ debounce: 1000 },
);

watch(
	() => props.spellFilter.level,
	(level) => {
		filter.level = level ?? undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

watch(
	() => props.spellFilter.school,
	(school) => {
		filter.school = school ?? undefined;
		filter.page = 1;
	},
	{ immediate: true },
);

function onPageChange(e: { page: number }) {
	filter.page = e.page + 1;
}

const spells = computed(() =>
	data.value && isPaginatedResponse(data.value) ? data.value : null,
);

const selectedSpell = ref<ISpell | null>(null);
const showSpellDetails = ref(false);

watch(selectedSpell, (selected) => {
	if (selected) showSpellDetails.value = true;
});

watch(showSpellDetails, (visible) => {
	if (!visible) selectedSpell.value = null;
});

const columns: TableColumn[] = [
	{ key: "level", header: "Lvl", sortField: "level", sortable: true, class: "w-16 text-center" },
	{ key: "name", header: "Name", sortField: "name", sortable: true },
	{ key: "school", header: "School" },
	{ key: "tags", header: "Tags", class: "w-20" },
];

function onSort(e: { sortField: string; sortOrder: "asc" | "desc" }) {
	filter.sortBy = e.sortField;
	filter.sortOrder = e.sortOrder;
	filter.page = 1;
}

const SCHOOL_NAMES: Record<string, string> = {
	A: "Abjuration",
	C: "Conjuration",
	D: "Divination",
	E: "Enchantment",
	V: "Evocation",
	I: "Illusion",
	N: "Necromancy",
	T: "Transmutation",
};

function schoolName(code: string | null): string {
	if (!code) return "—";
	return SCHOOL_NAMES[code] ?? code;
}

function rangeDisplay(spell: ISpell): string {
	const d = spell.range.distance;
	if (!d) return spell.range.type;
	if (d.type === "self") return "Self";
	if (d.type === "touch") return "Touch";
	if (d.type === "unlimited") return "Unlimited";
	if (d.type === "sight") return "Sight";
	return d.amount ? `${d.amount} ${d.type}` : d.type;
}
</script>

<template>
	<div class="flex flex-col gap-3 mt-4">
		<BaseDrawer
			v-model:visible="showSpellDetails"
			position="right"
			class="w-[45vw]"
		>
			<SpellDetails v-if="selectedSpell" :spell="selectedSpell" />
		</BaseDrawer>

		<div v-if="isError" class="text-sm text-red-500">
			{{ error?.message }}
		</div>
		<BaseTable
			v-else-if="spells"
			:loading="isLoading"
			:items="spells.data"
			:columns="columns"
			:sort-field="filter.sortBy"
			:sort-order="filter.sortOrder"
			v-model:selection="selectedSpell"
			@sort="onSort"
		>
			<template #cell-level="{ item: spell }">
				<span class="font-mono font-semibold text-xs">
					{{ spell.level === 0 ? "C" : spell.level }}
				</span>
			</template>

			<template #cell-name="{ item: spell }">
				<span class="font-medium">{{ spell.name }}</span>
			</template>

			<template #cell-school="{ item: spell }">
				{{ schoolName(spell.school) }}
			</template>

			<template #cell-tags="{ item: spell }">
				<div class="flex gap-1">
					<span
						v-if="spell.concentration"
						title="Concentration"
						class="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold"
						>C</span
					>
					<span
						v-if="spell.ritual"
						title="Ritual"
						class="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold"
						>R</span
					>
				</div>
			</template>
		</BaseTable>

		<BasePagination
			v-if="spells"
			:rows="filter.limit"
			:totalRecords="spells.pagination.total"
			:first="(filter.page - 1) * filter.limit"
			@page="onPageChange"
		/>
	</div>
</template>
