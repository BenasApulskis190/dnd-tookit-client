<script lang="ts" setup>
withDefaults(
	defineProps<{
		rows?: number;
		columns?: number;
	}>(),
	{ rows: 8, columns: 3 },
);

const WIDTHS = ["96px", "56px", "76px", "64px"];

function barWidth(row: number, col: number): string {
	return WIDTHS[(row + col) % WIDTHS.length] ?? "64px";
}
</script>

<template>
	<div class="flex flex-col" aria-hidden="true">
		<div
			v-for="row in rows"
			:key="row"
			class="flex items-center gap-4 border-t border-border-soft px-3 py-3.5 first:border-t-0"
		>
			<div
				v-for="col in columns"
				:key="col"
				class="skel-bar"
				:class="col === 1 ? 'flex-1' : 'shrink-0'"
				:style="col === 1 ? undefined : { width: barWidth(row, col) }"
			/>
		</div>
	</div>
</template>
