<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { watchDebounced } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { AxiosError } from "axios";
import BaseModal from "@/Module/Modal/BaseModal.vue";
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue";
import { useGlobalSearchStore } from "@/Module/GlobalSearch/store/useGlobalSearchStore";
import { indexMeta } from "@/Module/GlobalSearch/indices";
import type { IGlobalSearchHit } from "@/Module/GlobalSearch/types";

const visible = defineModel<boolean>("visible", { default: false });

const router = useRouter();
const store = useGlobalSearchStore();
const { filter } = store;
const { data, isLoading, isError } = storeToRefs(store);

const query = ref("");
const activeIndex = ref(0);

watchDebounced(
	query,
	(val) => {
		filter.q = val;
		filter.page = 1;
		activeIndex.value = 0;
	},
	{ debounce: 300 },
);

const hits = computed<IGlobalSearchHit[]>(() => {
	const val = data.value;
	if (!val || val instanceof AxiosError) return [];
	return val.data;
});

const total = computed(() => {
	const val = data.value;
	if (!val || val instanceof AxiosError) return 0;
	return val.pagination.total;
});

/** Flat, score-ordered list of hits grouped under their index heading. */
const groups = computed(() => {
	const byIndex = new Map<string, IGlobalSearchHit[]>();
	for (const hit of hits.value) {
		const bucket = byIndex.get(hit._index) ?? [];
		bucket.push(hit);
		byIndex.set(hit._index, bucket);
	}
	return [...byIndex.entries()].map(([index, items]) => ({
		index,
		meta: indexMeta(index),
		items,
	}));
});

const hasQuery = computed(() => query.value.trim().length > 0);

function selectHit(hit: IGlobalSearchHit) {
	const meta = indexMeta(hit._index);
	visible.value = false;
	if (meta.detail) {
		void router.push({ name: meta.detail, params: { id: hit.id } });
	} else if (meta.route) {
		void router.push(meta.route);
	}
}

// Reset transient UI state whenever the palette closes; refocus input on open.
watch(visible, (open) => {
	if (!open) {
		query.value = "";
		store.reset();
		activeIndex.value = 0;
	}
});

function moveActive(delta: number) {
	const count = hits.value.length;
	if (count === 0) return;
	activeIndex.value = (activeIndex.value + delta + count) % count;
	nextTick(scrollActiveIntoView);
}

function onEnter() {
	const hit = hits.value[activeIndex.value];
	if (hit) selectHit(hit);
}

const listRef = ref<HTMLElement | null>(null);
function scrollActiveIntoView() {
	listRef.value
		?.querySelector<HTMLElement>(`[data-hit-index="${activeIndex.value}"]`)
		?.scrollIntoView({ block: "nearest" });
}

// Global flat index so arrow-key selection can cross group boundaries.
function flatIndexFor(index: string, offset: number): number {
	let running = 0;
	for (const group of groups.value) {
		if (group.index === index) return running + offset;
		running += group.items.length;
	}
	return offset;
}
</script>

<template>
	<BaseModal v-model:visible="visible" size="full-screen">
		<template #header>
			<BaseSearchBar
				v-model="query"
				:loading="isLoading && hasQuery"
				placeholder="Search anything…"
				class="max-w-none"
				@keydown.down.prevent="moveActive(1)"
				@keydown.up.prevent="moveActive(-1)"
				@keydown.enter.prevent="onEnter"
			/>
		</template>

		<div ref="listRef" class="flex-1 overflow-y-auto p-4">
			<!-- Empty / prompt states -->
			<p v-if="!hasQuery" class="px-2 py-10 text-center text-sm text-ink-faint">
				Start typing to search spells, monsters, items, and more.
			</p>
			<p v-else-if="isError" class="px-2 py-10 text-center text-sm text-red-400">
				Something went wrong while searching. Try again.
			</p>
			<p
				v-else-if="!isLoading && hits.length === 0"
				class="px-2 py-10 text-center text-sm text-ink-faint"
			>
				No results for “{{ query }}”.
			</p>

			<template v-else>
				<p class="mb-3 px-2 text-xs uppercase tracking-wide text-ink-faint">
					{{ total }} result{{ total === 1 ? "" : "s" }}
				</p>
				<div v-for="group in groups" :key="group.index" class="mb-5">
					<div class="mb-1.5 flex items-center gap-2 px-2">
						<span :style="{ color: group.meta.color }">{{ group.meta.glyph }}</span>
						<span class="text-xs font-semibold uppercase tracking-wide text-ink-mute">
							{{ group.meta.label }}
						</span>
					</div>
					<ul class="flex flex-col gap-0.5">
						<li v-for="(hit, i) in group.items" :key="hit.id">
							<button
								type="button"
								:data-hit-index="flatIndexFor(group.index, i)"
								class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-bg-elev2"
								:class="{ 'bg-bg-elev2': flatIndexFor(group.index, i) === activeIndex }"
								@click="selectHit(hit)"
							>
								<span
									class="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
									:style="{ background: group.meta.color }"
								/>
								<span class="flex-1 truncate text-sm text-ink">{{ hit.name }}</span>
								<span v-if="hit.source" class="shrink-0 text-xs text-ink-faint">
									{{ hit.source }}
								</span>
							</button>
						</li>
					</ul>
				</div>
			</template>
		</div>
	</BaseModal>
</template>
