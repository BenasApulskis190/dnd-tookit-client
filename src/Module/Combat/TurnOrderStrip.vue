<script lang="ts" setup>
import { computed } from "vue";
import type { Combatant } from "@/Module/Combat/types";

const props = defineProps<{ order: Combatant[]; currentTurnCombatantId: string | null; round: number }>();
const emit = defineEmits<{ next: []; prev: [] }>();

// Rotate the sorted order so whoever's turn it is right now is always shown
// first, instead of making people scan the strip to find them.
const rotated = computed(() => {
	const index = props.order.findIndex((c) => c.id === props.currentTurnCombatantId);
	if (index <= 0) return props.order;

	return [...props.order.slice(index), ...props.order.slice(0, index)];
});
</script>

<template>
	<div class="flex items-center gap-3 rounded-[var(--radius)] border border-border bg-bg-elev p-3">
		<div class="flex flex-col items-center shrink-0 px-2">
			<span class="text-[10px] uppercase tracking-wide text-ink-faint">Round</span>
			<span class="font-display text-xl text-ink">{{ round }}</span>
		</div>

		<button
			class="shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink-mute hover:text-ink hover:bg-bg-elev2 transition-colors"
			@click="emit('prev')"
		>
			← Prev
		</button>

		<div class="flex-1 min-w-0 flex gap-2 overflow-x-auto">
			<div
				v-for="(combatant, i) in rotated"
				:key="combatant.id"
				class="flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1.5"
				:class="i === 0 ? 'border-accent bg-accent/10' : 'border-border bg-bg'"
			>
				<img
					v-if="combatant.imageUrl"
					:src="combatant.imageUrl"
					:alt="combatant.name"
					class="w-6 h-6 rounded object-cover shrink-0"
				/>
				<div
					v-else
					class="w-6 h-6 rounded bg-bg-elev2 flex items-center justify-center text-[10px] text-ink-mute shrink-0"
				>
					{{ combatant.name.charAt(0).toUpperCase() }}
				</div>
				<span class="text-xs whitespace-nowrap" :class="i === 0 ? 'text-ink font-semibold' : 'text-ink-mute'">
					{{ combatant.name }}
				</span>
				<span class="text-[10px] text-ink-faint">{{ combatant.initiative ?? "—" }}</span>
			</div>

			<p v-if="rotated.length === 0" class="text-xs text-ink-faint px-2 py-1.5">No one left in the fight.</p>
		</div>

		<button
			class="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg hover:opacity-90 transition-opacity"
			@click="emit('next')"
		>
			Next →
		</button>
	</div>
</template>
