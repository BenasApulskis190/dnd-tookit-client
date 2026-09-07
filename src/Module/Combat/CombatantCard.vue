<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { isAxiosError } from "axios";
import { useCombatStore } from "@/Module/Combat/store/useCombatStore";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";
import { conditionsApi } from "@/Module/Conditions/api/conditionsApi";
import ConditionPanel from "@/Module/Conditions/ConditionPanel.vue";
import BaseSelect from "@/Module/Select/BaseSelect.vue";
import DiceIcon from "@/Module/Loading/DiceIcon.vue";
import type { Combatant } from "@/Module/Combat/types";

const props = defineProps<{ encounterId: string; combatant: Combatant; isCurrentTurn: boolean }>();
const emit = defineEmits<{ "view-details": [combatant: Combatant] }>();

const combatStore = useCombatStore();
const drawers = useDrawerStore();

const damageAmount = ref<number | undefined>(undefined);
const healAmount = ref<number | undefined>(undefined);

// Plain native number inputs, not the BaseInput/NumberField wrapper — that
// component's deferred focus/text sync doesn't reliably accept keystrokes
// for these fields, which made initiative look unresponsive.
function parseNumberInput(raw: string): number | null {
	if (raw.trim() === "") return null;
	const parsed = Number(raw);
	return Number.isNaN(parsed) ? null : parsed;
}

function onInitiativeInput(e: Event) {
	const value = parseNumberInput((e.target as HTMLInputElement).value);
	combatStore.setInitiative(props.encounterId, props.combatant.id, value);
}

function onDamageInput(e: Event) {
	damageAmount.value = parseNumberInput((e.target as HTMLInputElement).value) ?? undefined;
}

function onHealInput(e: Event) {
	healAmount.value = parseNumberInput((e.target as HTMLInputElement).value) ?? undefined;
}

const hpPercent = computed(() =>
	props.combatant.maxHp > 0 ? Math.max(0, (props.combatant.currentHp / props.combatant.maxHp) * 100) : 0,
);

const hpBarColor = computed(() => {
	if (hpPercent.value > 50) return "bg-green-500";
	if (hpPercent.value > 25) return "bg-amber-500";
	return "bg-red-500";
});

const stateBadge = computed(() => {
	switch (props.combatant.state) {
		case "downed":
			return { text: "Downed", class: "bg-amber-500/15 text-amber-400" };
		case "stabilized":
			return { text: "Stabilized", class: "bg-sky-500/15 text-sky-400" };
		case "dead":
			return { text: "Dead", class: "bg-red-500/15 text-red-400" };
		default:
			return null;
	}
});

function submitDamage() {
	if (damageAmount.value && damageAmount.value > 0) {
		combatStore.applyDamage(props.encounterId, props.combatant.id, damageAmount.value);
	}
	damageAmount.value = undefined;
}

function submitHeal() {
	if (healAmount.value && healAmount.value > 0) {
		combatStore.applyHeal(props.encounterId, props.combatant.id, healAmount.value);
	}
	healAmount.value = undefined;
}

function rollInitiative() {
	combatStore.rollInitiativeFor(props.encounterId, props.combatant.id);
}

function remove() {
	combatStore.removeCombatant(props.encounterId, props.combatant.id);
}

const { data: conditionsData } = useQuery({
	queryKey: ["conditions", { limit: 100 }],
	queryFn: () => conditionsApi.getAll({ limit: 100 }),
});

const allConditions = computed(() =>
	conditionsData.value && !isAxiosError(conditionsData.value) ? conditionsData.value.data : [],
);

const conditionOptions = computed(() =>
	allConditions.value
		.filter((condition) => !props.combatant.conditions.includes(condition.name))
		.map((condition) => ({ id: condition.id, value: condition.name, label: condition.name })),
);

const conditionToAdd = ref<string | undefined>(undefined);

watch(conditionToAdd, (value) => {
	if (!value) return;

	combatStore.addCondition(props.encounterId, props.combatant.id, value);
	conditionToAdd.value = undefined;
});

function viewCondition(name: string) {
	const condition = allConditions.value.find((c) => c.name === name);
	if (!condition) return;

	drawers.open("condition", { component: ConditionPanel, props: { id: condition.id }, width: "w-[40vw]" });
}
</script>

<template>
	<div
		class="flex flex-col gap-2.5 rounded-[var(--radius)] border bg-bg-elev p-3 transition-colors"
		:class="isCurrentTurn ? 'border-accent shadow-[0_0_0_1px_var(--accent)]' : 'border-border'"
	>
		<div class="flex items-start gap-2.5">
			<img
				v-if="combatant.imageUrl"
				:src="combatant.imageUrl"
				:alt="combatant.name"
				class="w-10 h-10 shrink-0 rounded object-cover bg-bg-elev2"
			/>
			<div
				v-else
				class="w-10 h-10 shrink-0 rounded bg-bg-elev2 border border-border flex items-center justify-center font-display text-ink-mute"
			>
				{{ combatant.name.charAt(0).toUpperCase() }}
			</div>

			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-1.5">
					<p
						class="text-sm text-ink-soft truncate cursor-pointer hover:text-ink hover:underline w-fit"
						title="See details"
						@click="emit('view-details', combatant)"
					>
						{{ combatant.name }}
					</p>
					<span v-if="stateBadge" class="rounded-full px-1.5 py-0.5 text-[10px] font-medium shrink-0" :class="stateBadge.class">
						{{ stateBadge.text }}
					</span>
					<span v-if="isCurrentTurn" class="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-bg shrink-0">
						Current turn
					</span>
				</div>
				<p v-if="combatant.armorClass != null" class="text-xs text-ink-faint">AC {{ combatant.armorClass }}</p>
			</div>

			<button class="shrink-0 text-ink-faint hover:text-red-400 transition-colors" title="Remove from combat" @click="remove">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
				</svg>
			</button>
		</div>

		<div class="flex items-center gap-2">
			<span class="text-[11px] text-ink-faint shrink-0">Init</span>
			<input
				type="number"
				:value="combatant.initiative ?? ''"
				class="w-16 rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				@input="onInitiativeInput"
			/>
			<button
				class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border border-border text-ink-mute hover:bg-bg-elev2 hover:text-ink"
				title="Roll initiative (1d20 + Dex)"
				@click="rollInitiative"
			>
				<DiceIcon :size="14" />
			</button>

			<div class="flex-1" />

			<span class="text-xs" :class="combatant.currentHp === 0 ? 'text-red-400 font-semibold' : 'text-ink-mute'">
				{{ combatant.currentHp }}/{{ combatant.maxHp }} HP
			</span>
		</div>

		<div class="h-1.5 w-full rounded-full bg-bg-elev2 overflow-hidden">
			<div class="h-full rounded-full transition-[width] duration-300" :class="hpBarColor" :style="{ width: `${hpPercent}%` }" />
		</div>

		<div class="flex flex-wrap items-center gap-1.5">
			<span
				v-for="condition in combatant.conditions"
				:key="condition"
				class="inline-flex items-center gap-1 rounded-full bg-purple-500/15 text-purple-300 px-2 py-0.5 text-[10px] cursor-pointer hover:bg-purple-500/25 transition-colors"
				title="See condition details"
				@click="viewCondition(condition)"
			>
				{{ condition }}
				<button
					class="hover:text-red-400 transition-colors"
					title="Remove condition"
					@click.stop="combatStore.removeCondition(encounterId, combatant.id, condition)"
				>
					×
				</button>
			</span>

			<div class="w-32">
				<BaseSelect v-model="conditionToAdd" :options="conditionOptions" placeholder="+ Condition" />
			</div>
		</div>

		<div v-if="combatant.state === 'active' || combatant.state === 'downed'" class="flex gap-1.5 items-center">
			<span class="text-[11px] text-ink-faint shrink-0">Dmg</span>
			<input
				type="number"
				:value="damageAmount ?? ''"
				class="w-20 rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				@input="onDamageInput"
				@keyup.enter="submitDamage"
			/>
			<button class="rounded-lg bg-red-500/15 text-red-400 px-2 py-1 text-xs font-medium hover:bg-red-500/25 transition-colors" @click="submitDamage">
				Damage
			</button>
			<span class="text-[11px] text-ink-faint shrink-0">Heal</span>
			<input
				type="number"
				:value="healAmount ?? ''"
				class="w-20 rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				@input="onHealInput"
				@keyup.enter="submitHeal"
			/>
			<button class="rounded-lg bg-green-500/15 text-green-400 px-2 py-1 text-xs font-medium hover:bg-green-500/25 transition-colors" @click="submitHeal">
				Heal
			</button>
		</div>

		<div v-if="combatant.state === 'downed'" class="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border p-2">
			<div class="flex items-center gap-1.5">
				<span class="text-[11px] text-green-400 w-4">S</span>
				<span
					v-for="n in 3"
					:key="'s' + n"
					class="w-2.5 h-2.5 rounded-full border"
					:class="n <= combatant.deathSaves.successes ? 'bg-green-500 border-green-500' : 'border-green-500/40'"
				/>
				<button
					class="text-[11px] px-1.5 py-0.5 bg-green-500/15 text-green-400 rounded hover:bg-green-500/25 transition-colors"
					@click="combatStore.addDeathSaveSuccess(encounterId, combatant.id)"
				>
					+
				</button>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="text-[11px] text-red-400 w-4">F</span>
				<span
					v-for="n in 3"
					:key="'f' + n"
					class="w-2.5 h-2.5 rounded-full border"
					:class="n <= combatant.deathSaves.failures ? 'bg-red-500 border-red-500' : 'border-red-500/40'"
				/>
				<button
					class="text-[11px] px-1.5 py-0.5 bg-red-500/15 text-red-400 rounded hover:bg-red-500/25 transition-colors"
					@click="combatStore.addDeathSaveFailure(encounterId, combatant.id)"
				>
					+
				</button>
			</div>
		</div>

		<button
			v-if="combatant.state === 'stabilized' || combatant.state === 'dead'"
			class="w-full rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg hover:opacity-90 transition-opacity"
			@click="combatStore.revive(encounterId, combatant.id)"
		>
			↺ Revive — back in the order
		</button>
	</div>
</template>
