<script lang="ts" setup>
import { computed } from "vue";
import type { IDifficultyResult } from "@/Module/Encounters/util/difficulty";

const props = defineProps<{ difficulty: IDifficultyResult }>();

// The bar covers 0 → a bit past "Deadly" so a deadly-or-worse encounter's
// fill doesn't sit flush against the edge of the track.
const scaleMax = computed(() => (props.difficulty.thresholds ? props.difficulty.thresholds.deadly * 1.15 : 0));

const fillPercent = computed(() => {
	if (!props.difficulty.thresholds || scaleMax.value <= 0) return 0;
	return Math.min(100, Math.max(0, (props.difficulty.adjustedXp / scaleMax.value) * 100));
});

// Faint tick marks at the easy/medium/hard/deadly boundaries, for reference —
// the fill itself is the one continuous bar, not pre-colored zones.
const ticks = computed(() => {
	const t = props.difficulty.thresholds;
	if (!t || scaleMax.value <= 0) return [];

	return [t.easy, t.medium, t.hard, t.deadly].map((value) => (value / scaleMax.value) * 100);
});

const fillColorClass = computed(() => {
	switch (props.difficulty.label) {
		case "Trivial":
			return "bg-ink-faint";
		case "Easy":
			return "bg-green-500";
		case "Medium":
			return "bg-amber-500";
		case "Hard":
			return "bg-orange-500";
		case "Deadly":
			return "bg-red-500";
		default:
			return "bg-ink-faint";
	}
});

const labelColorClass = computed(() => {
	switch (props.difficulty.label) {
		case "Trivial":
			return "text-ink-faint";
		case "Easy":
			return "text-green-400";
		case "Medium":
			return "text-amber-400";
		case "Hard":
			return "text-orange-400";
		case "Deadly":
			return "text-red-400";
		default:
			return "text-ink-faint";
	}
});
</script>

<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex items-center justify-between gap-2">
			<span class="text-xs font-semibold" :class="labelColorClass">{{ difficulty.label ?? "No party" }}</span>
			<span v-if="difficulty.thresholds" class="text-[11px] text-ink-faint whitespace-nowrap">
				{{ difficulty.adjustedXp }} XP
			</span>
		</div>

		<div class="relative h-2.5 w-full rounded-full bg-bg-elev2 overflow-hidden">
			<div
				class="h-full rounded-full transition-[width] duration-300 ease-out"
				:class="fillColorClass"
				:style="{ width: `${fillPercent}%` }"
			/>
			<div
				v-for="(tick, i) in ticks"
				:key="i"
				class="absolute top-0 h-full w-px bg-bg/40"
				:style="{ left: `${tick}%` }"
			/>
		</div>

		<p v-if="!difficulty.thresholds" class="text-[11px] text-ink-faint">Assign a party to see difficulty.</p>
	</div>
</template>
