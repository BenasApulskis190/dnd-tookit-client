<script lang="ts" setup generic="T extends Record<string, any>">
import { computed } from "vue";
import DiceLoader from "@/Module/Loading/DiceLoader.vue";
import SkeletonRows from "@/Module/Loading/SkeletonRows.vue";

export interface TableColumn {
	key: string;
	header: string;
	sortField?: string;
	sortable?: boolean;
	class?: string;
}

const props = withDefaults(
	defineProps<{
		items: T[];
		columns: TableColumn[];
		loading?: boolean;
		sortField?: string;
		sortOrder?: "asc" | "desc";
		selection?: T | null;
		rowKey?: (item: T) => string | number;
		scrollable?: boolean;
		maxHeight?: string;
	}>(),
	{ maxHeight: "60vh" },
);

const emit = defineEmits<{
	sort: [payload: { sortField: string; sortOrder: "asc" | "desc" }];
	"update:selection": [item: T | null];
}>();

function onHeaderClick(column: TableColumn) {
	if (!column.sortable) return;

	const field = column.sortField ?? column.key;
	const sortOrder: "asc" | "desc" =
		props.sortField === field && props.sortOrder === "asc" ? "desc" : "asc";

	emit("sort", { sortField: field, sortOrder });
}

function onRowClick(item: T) {
	emit("update:selection", item === props.selection ? null : item);
}

const showDiceLoader = computed(
	() => props.loading && props.items.length === 0,
);
const showSkeleton = computed(() => props.loading && props.items.length > 0);
</script>

<template>
	<div class="relative rounded-lg border border-border overflow-hidden">
		<div
			v-if="!showDiceLoader"
			:class="scrollable ? 'overflow-y-auto' : ''"
			:style="scrollable ? { maxHeight } : undefined"
		>
			<table class="w-full text-sm border-collapse">
				<thead>
					<tr class="text-left text-ink-mute">
						<th
							v-for="column in columns"
							:key="column.key"
							:class="[
								column.class,
								column.sortable ? 'cursor-pointer select-none' : '',
								'px-3 py-2 font-semibold whitespace-nowrap bg-bg-elev2',
								scrollable ? 'sticky top-0 z-10' : '',
							]"
							@click="onHeaderClick(column)"
						>
							<span class="inline-flex items-center gap-1">
								{{ column.header }}
								<span
									v-if="column.sortable && sortField === (column.sortField ?? column.key)"
									class="text-xs text-accent"
								>
									{{ sortOrder === "asc" ? "↑" : "↓" }}
								</span>
							</span>
						</th>
					</tr>
				</thead>
				<tbody v-if="showSkeleton">
					<tr>
						<td :colspan="columns.length" class="p-0">
							<SkeletonRows :columns="columns.length" />
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr
						v-for="(item, index) in items"
						:key="rowKey ? rowKey(item) : index"
						class="border-t border-border-soft cursor-pointer hover:bg-bg-elev2"
						:class="[
							index % 2 === 1 ? 'bg-bg-elev' : 'bg-surface',
							item === selection ? 'bg-accent/10 hover:bg-accent/15' : '',
						]"
						@click="onRowClick(item)"
					>
						<td v-for="column in columns" :key="column.key" :class="[column.class, 'px-3 py-2 text-ink']">
							<slot :name="`cell-${column.key}`" :item="item">
								{{ (item as any)[column.key] }}
							</slot>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<DiceLoader v-if="showDiceLoader" />
	</div>
</template>
