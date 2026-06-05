<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSavedEncountersStore } from "@/stores/savedEncounters";
import {
	getAllMonsters,
	getMonsterImageUrl,
} from "@/services/monsterService";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";
import type { Monster } from "@/Module/EncounterManager/types";

interface DeathSaves {
	successes: number; // 0–3
	failures: number; // 0–3
}

interface Combatant {
	id: string;
	name: string;
	type: "player" | "monster";
	initiative: number | null;
	maxHp: number;
	currentHp: number;
	imageUrl?: string | null;
	subtitle: string;
	monster?: Monster;
	deathSaves: DeathSaves;
}

const route = useRoute();
const router = useRouter();
const store = useSavedEncountersStore();

const encounter = computed(() =>
	store.encounters.find((e) => e.id === (route.params.id as string)),
);

const phase = ref<"setup" | "battle">("setup");
const round = ref(1);
const currentTurnIndex = ref(0);
const combatants = ref<Combatant[]>([]);
const damageInputs = ref<Record<string, string>>({});
const healInputs = ref<Record<string, string>>({});
const selectedMonster = ref<Monster | null>(null);

const fullMonsterMap = new Map<string, Monster>(
	getAllMonsters().map((m) => [`${m.name}|${m.source}`, m]),
);

function buildCombatants() {
	const list: Combatant[] = [];

	for (const p of {}) {
		list.push({
			id: `player-${p.name}`,
			name: p.name,
			type: "player",
			initiative: null,
			maxHp: p.maxHp,
			currentHp: p.maxHp,
			subtitle: `${p.player} · ${p.class}`,
			deathSaves: { successes: 0, failures: 0 },
		});
	}

	if (encounter.value) {
		for (const entry of encounter.value.entries) {
			for (let i = 1; i <= entry.count; i++) {
				const suffix = entry.count > 1 ? ` ${i}` : "";
				const full =
					fullMonsterMap.get(
						`${entry.monster.name}|${entry.monster.source}`,
					) ?? entry.monster;
				list.push({
					id: `monster-${full.name}-${full.source}-${i}`,
					name: full.name + suffix,
					type: "monster",
					initiative: null,
					maxHp: full.hp.average,
					currentHp: full.hp.average,
					imageUrl: getMonsterImageUrl(full),
					subtitle: `CR ${full.cr}`,
					monster: full,
					deathSaves: { successes: 0, failures: 0 },
				});
			}
		}
	}

	combatants.value = list;
	for (const c of list) {
		damageInputs.value[c.id] = "";
		healInputs.value[c.id] = "";
	}
}

buildCombatants();

const sorted = computed<Combatant[]>(() => {
	if (phase.value === "setup") return combatants.value;
	return [...combatants.value].sort(
		(a, b) => (b.initiative ?? 0) - (a.initiative ?? 0),
	);
});

const allReady = computed(() =>
	combatants.value.every(
		(c) => c.initiative !== null && String(c.initiative).trim() !== "",
	),
);

function startBattle() {
	round.value = 1;
	currentTurnIndex.value = 0;
	const s = sorted.value;
	for (let i = 0; i < s.length; i++) {
		if ((s[i]?.currentHp ?? 0) > 0) {
			currentTurnIndex.value = i;
			break;
		}
	}
	phase.value = "battle";
}

function nextTurn() {
	const total = sorted.value.length;
	const start = currentTurnIndex.value;
	for (let i = 1; i <= total; i++) {
		const next = (start + i) % total;
		if ((sorted.value[next]?.currentHp ?? 0) > 0) {
			if (next <= start) round.value++;
			currentTurnIndex.value = next;
			return;
		}
	}
}

function prevTurn() {
	const total = sorted.value.length;
	const start = currentTurnIndex.value;
	for (let i = 1; i <= total; i++) {
		const prev = (start - i + total) % total;
		if ((sorted.value[prev]?.currentHp ?? 0) > 0) {
			if (prev > start) round.value = Math.max(1, round.value - 1);
			currentTurnIndex.value = prev;
			return;
		}
	}
}

function applyDamage(combatant: Combatant) {
	const dmg = parseInt(damageInputs.value[combatant.id] ?? "0", 10);
	if (isNaN(dmg) || dmg <= 0) return;
	combatant.currentHp = Math.max(0, combatant.currentHp - dmg);
	damageInputs.value[combatant.id] = "";
	if (
		combatant.currentHp === 0 &&
		sorted.value[currentTurnIndex.value]?.id === combatant.id
	) {
		nextTurn();
	}
}

function applyHeal(combatant: Combatant) {
	const hp = parseInt(healInputs.value[combatant.id] ?? "0", 10);
	if (isNaN(hp) || hp <= 0) return;
	const wasDown = combatant.currentHp === 0;
	combatant.currentHp = Math.min(combatant.maxHp, combatant.currentHp + hp);
	healInputs.value[combatant.id] = "";
	// Resurrect: clear death saves when healing from 0
	if (wasDown && combatant.currentHp > 0) {
		combatant.deathSaves = { successes: 0, failures: 0 };
	}
}

function addDeathSaveSuccess(combatant: Combatant) {
	if (combatant.deathSaves.successes < 3) {
		combatant.deathSaves.successes++;
	}
}

function addDeathSaveFailure(combatant: Combatant) {
	if (combatant.deathSaves.failures < 3) {
		combatant.deathSaves.failures++;
	}
}

function deathSaveStatus(c: Combatant): "dying" | "stable" | "dead" {
	if (c.deathSaves.failures >= 3) return "dead";
	if (c.deathSaves.successes >= 3) return "stable";
	return "dying";
}
</script>

<template>
	<!-- Setup phase -->
	<div v-if="phase === 'setup'" class="p-6 max-w-2xl">
		<div class="flex items-center gap-4 mb-6">
			<button
				class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
				@click="router.back()"
			>
				← Back
			</button>
			<h1 class="text-xl font-bold text-gray-900">
				{{ encounter?.name ?? "Combat Manager" }}
			</h1>
		</div>

		<p class="text-sm text-gray-500 mb-5">
			Set initiative for all combatants, then start the battle.
		</p>

		<div class="space-y-2 mb-6">
			<div
				v-for="c in combatants"
				:key="c.id"
				class="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg"
			>
				<div
					v-if="c.type === 'player'"
					class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0"
				>
					{{ c.name[0] }}
				</div>
				<img
					v-else-if="c.imageUrl"
					:src="c.imageUrl"
					:alt="c.name"
					class="w-9 h-9 rounded-full object-cover bg-gray-100 shrink-0"
				/>
				<div
					v-else
					class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0"
				>
					{{ c.name[0] }}
				</div>

				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-gray-900 truncate">
						{{ c.name }}
					</p>
					<p class="text-xs text-gray-400">{{ c.subtitle }}</p>
				</div>

				<div class="flex items-center gap-2 shrink-0">
					<span class="text-xs text-gray-500">Initiative</span>
					<input
						v-model.number="c.initiative"
						type="number"
						min="1"
						max="30"
						placeholder="—"
						class="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-indigo-300"
					/>
				</div>
			</div>
		</div>

		<button
			:disabled="!allReady"
			class="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			@click="startBattle"
		>
			Start Battle
		</button>
	</div>

	<div v-else class="flex h-full">
		<div class="flex-1 min-w-0 p-6 overflow-y-auto">
			<div class="flex items-center justify-between mb-5 flex-wrap gap-3">
				<div>
					<h1 class="text-xl font-bold text-gray-900">
						{{ encounter?.name ?? "Combat" }}
					</h1>
					<p class="text-sm text-gray-500">Round {{ round }}</p>
				</div>
				<div class="flex gap-2">
					<button
						class="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
						@click="prevTurn"
					>
						← Prev Turn
					</button>
					<button
						class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
						@click="nextTurn"
					>
						Next Turn →
					</button>
				</div>
			</div>

			<div class="space-y-2">
				<div
					v-for="(c, idx) in sorted"
					:key="c.id"
					:class="[
						'flex items-center gap-4 px-4 py-3 rounded-xl border-l-4 transition-all duration-200',
						c.currentHp === 0 && c.type === 'monster'
							? 'opacity-40 bg-gray-50 border-l-gray-200 border border-gray-100 pointer-events-none'
							: c.currentHp === 0 && c.type === 'player'
								? 'bg-red-50 border-l-red-400 border border-red-100'
								: idx === currentTurnIndex
									? 'bg-yellow-50 border-l-yellow-400 border border-yellow-200 shadow-md scale-[1.01]'
									: 'bg-white border-l-transparent border border-gray-200 hover:border-gray-300',
					]"
				>
					<div
						v-if="c.type === 'player'"
						:class="[
							'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
							c.currentHp === 0
								? 'bg-red-100 text-red-400'
								: 'bg-indigo-100 text-indigo-600',
						]"
					>
						{{ c.name[0] }}
					</div>
					<img
						v-else-if="c.imageUrl"
						:src="c.imageUrl"
						:alt="c.name"
						class="w-10 h-10 rounded-full object-cover bg-gray-100 shrink-0"
					/>
					<div
						v-else
						class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0"
					>
						{{ c.name[0] }}
					</div>

					<!-- Name + subtitle -->
					<div class="w-36 shrink-0">
						<p
							:class="[
								'text-sm font-semibold truncate',
								c.currentHp === 0 && c.type === 'player'
									? 'text-red-700'
									: idx === currentTurnIndex
										? 'text-yellow-900'
										: 'text-gray-900',
							]"
						>
							{{ c.name }}
						</p>
						<p class="text-xs text-gray-400 truncate">
							{{ c.subtitle }}
						</p>
					</div>

					<!-- Initiative badge -->
					<span
						:class="[
							'text-xs font-bold px-2 py-0.5 rounded-full shrink-0',
							idx === currentTurnIndex && c.currentHp > 0
								? 'bg-yellow-200 text-yellow-800'
								: 'bg-indigo-50 text-indigo-700',
						]"
					>
						Init {{ c.initiative }}
					</span>

					<!-- HP bar + numbers -->
					<div class="flex-1 min-w-0">
						<div class="flex justify-between text-xs mb-1">
							<span class="text-gray-500">HP</span>
							<span
								:class="
									c.currentHp === 0
										? 'text-red-600 font-bold'
										: 'text-gray-700 font-medium'
								"
							>
								{{ c.currentHp }} / {{ c.maxHp }}
							</span>
						</div>
						<div
							class="h-2 bg-gray-200 rounded-full overflow-hidden"
						>
							<div
								:style="{
									width: `${Math.max(0, (c.currentHp / c.maxHp) * 100)}%`,
								}"
								:class="[
									'h-full rounded-full transition-all duration-300',
									c.currentHp / c.maxHp > 0.5
										? 'bg-green-500'
										: c.currentHp / c.maxHp > 0.25
											? 'bg-yellow-500'
											: 'bg-red-500',
								]"
							/>
						</div>
					</div>

					<div
						v-if="c.currentHp === 0 && c.type === 'monster'"
						class="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0 w-64 text-center"
					>
						Defeated
					</div>

					<div
						v-else-if="c.currentHp === 0 && c.type === 'player'"
						class="flex items-center gap-3 shrink-0"
					>
						<span
							v-if="deathSaveStatus(c) === 'dead'"
							class="text-xs font-bold text-red-600 uppercase tracking-wide"
							>Dead</span
						>
						<span
							v-else-if="deathSaveStatus(c) === 'stable'"
							class="text-xs font-bold text-green-600 uppercase tracking-wide"
							>Stable</span
						>

						<div
							v-if="deathSaveStatus(c) !== 'dead'"
							class="flex flex-col gap-1"
						>
							<div class="flex items-center gap-1.5">
								<span class="text-xs text-green-700 w-3"
									>S</span
								>
								<span
									v-for="n in 3"
									:key="'s' + n"
									:class="[
										'w-3 h-3 rounded-full border',
										n <= c.deathSaves.successes
											? 'bg-green-500 border-green-500'
											: 'bg-white border-green-400',
									]"
								/>
								<button
									v-if="deathSaveStatus(c) === 'dying'"
									class="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors leading-none"
									title="Add success"
									@click="addDeathSaveSuccess(c)"
								>
									+
								</button>
								<button
									v-if="c.deathSaves.successes > 0"
									class="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition-colors leading-none"
									title="Remove success"
									@click="c.deathSaves.successes--"
								>
									−
								</button>
							</div>
							<!-- Failures -->
							<div class="flex items-center gap-1.5">
								<span class="text-xs text-red-700 w-3">F</span>
								<span
									v-for="n in 3"
									:key="'f' + n"
									:class="[
										'w-3 h-3 rounded-full border',
										n <= c.deathSaves.failures
											? 'bg-red-500 border-red-500'
											: 'bg-white border-red-400',
									]"
								/>
								<button
									class="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors leading-none"
									title="Add failure"
									@click="addDeathSaveFailure(c)"
								>
									+
								</button>
								<button
									v-if="c.deathSaves.failures > 0"
									class="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition-colors leading-none"
									title="Remove failure"
									@click="c.deathSaves.failures--"
								>
									−
								</button>
							</div>
						</div>

						<div class="flex gap-1.5 items-center">
							<input
								v-model="healInputs[c.id]"
								type="number"
								min="1"
								placeholder="HP"
								class="w-14 px-2 py-1 text-sm border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200 text-center"
								@keyup.enter="applyHeal(c)"
							/>
							<button
								class="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded hover:bg-green-600 transition-colors whitespace-nowrap"
								@click="applyHeal(c)"
							>
								Resurrect
							</button>
						</div>
					</div>

					<div v-else class="flex gap-2 shrink-0 items-center">
						<input
							v-model="damageInputs[c.id]"
							type="number"
							min="1"
							placeholder="Dmg"
							class="w-14 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-200 text-center"
							@keyup.enter="applyDamage(c)"
						/>
						<button
							class="px-2.5 py-1 text-xs font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
							@click="applyDamage(c)"
						>
							Damage
						</button>
						<input
							v-model="healInputs[c.id]"
							type="number"
							min="1"
							placeholder="Heal"
							class="w-14 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200 text-center"
							@keyup.enter="applyHeal(c)"
						/>
						<button
							class="px-2.5 py-1 text-xs font-semibold bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
							@click="applyHeal(c)"
						>
							Heal
						</button>
					</div>

					<!-- Details button (monsters only) or spacer -->
					<button
						v-if="c.type === 'monster' && c.monster"
						:class="[
							'px-3 py-1 text-xs font-semibold rounded border transition-colors shrink-0',
							selectedMonster?.name === c.monster.name &&
							selectedMonster?.source === c.monster.source
								? 'bg-gray-800 text-white border-gray-800'
								: 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-800',
						]"
						@click="
							selectedMonster?.name === c.monster.name &&
							selectedMonster?.source === c.monster.source
								? (selectedMonster = null)
								: (selectedMonster = c.monster ?? null)
						"
					>
						Details
					</button>
					<div v-else class="w-16 shrink-0" />
				</div>
			</div>
		</div>

		<Transition
			enter-active-class="transition-all duration-200"
			enter-from-class="opacity-0 translate-x-4"
			enter-to-class="opacity-100 translate-x-0"
			leave-active-class="transition-all duration-150"
			leave-from-class="opacity-100 translate-x-0"
			leave-to-class="opacity-0 translate-x-4"
		>
			<div
				v-if="selectedMonster"
				class="w-96 shrink-0 border-l border-gray-200 bg-white overflow-y-auto"
			>
				<div
					class="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100"
				>
					<p class="text-sm font-semibold text-gray-700">
						Monster Details
					</p>
					<button
						class="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
						@click="selectedMonster = null"
					>
						✕
					</button>
				</div>
				<div class="p-4">
					<MonsterDetails :monster="selectedMonster" />
				</div>
			</div>
		</Transition>
	</div>
</template>
