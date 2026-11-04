<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { isAxiosError } from "axios";
import { useRouter } from "vue-router";
import { useQueryClient } from "@tanstack/vue-query";
import BaseModal from "@/Module/Modal/BaseModal.vue";
import BaseSelect from "@/Module/Select/BaseSelect.vue";
import DifficultyBar from "@/Module/Encounters/DifficultyBar.vue";
import { encountersApi } from "@/Module/Encounters/api/encountersApi";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import { useUserStore } from "@/Module/User/store/useUserStore";
import { xpForCr } from "@/Module/Encounters/util/difficulty";
import {
	generateEncounter,
	TARGET_DIFFICULTIES,
	themesFor,
	type EncounterRole,
	type IGeneratedEncounter,
	type TargetDifficulty,
} from "@/Module/Encounters/util/generator";
import {
	DISPOSITION_LABELS,
	ENCOUNTER_SETTINGS,
	STYLE_LABELS,
	type EncounterDisposition,
} from "@/Module/Encounters/util/generatorThemes";

const visible = defineModel<boolean>("visible", { default: false });

const router = useRouter();
const queryClient = useQueryClient();
const partyStore = usePartyStore();
const userStore = useUserStore();

const parties = computed(() =>
	partyStore.data && !isAxiosError(partyStore.data) ? partyStore.data.data : [],
);

const form = reactive({
	settingId: "",
	disposition: "" as EncounterDisposition | "",
	themeId: "",
	difficulty: "Medium" as TargetDifficulty,
	partyId: "",
	playerCount: 4,
	playerLevel: 3,
});

const settingOptions = computed(() => [
	{ id: "any", value: "", label: "Random setting" },
	...ENCOUNTER_SETTINGS.map((s) => ({ id: s.id, value: s.id, label: s.name })),
]);

const dispositionOptions = computed(() => [
	{ id: "any", value: "", label: "Any" },
	...(Object.keys(DISPOSITION_LABELS) as EncounterDisposition[]).map((d) => ({
		id: d,
		value: d,
		label: DISPOSITION_LABELS[d],
	})),
]);

// Specific theme only makes sense once a setting is chosen.
const themeOptions = computed(() => [
	{ id: "any", value: "", label: "Random encounter" },
	...themesFor(form.settingId, form.disposition || undefined).map((t) => ({
		id: t.id,
		value: t.id,
		label: t.name,
	})),
]);

const partyOptions = computed(() => [
	{ id: "none", value: "", label: "No party — enter players manually" },
	...parties.value.map((p) => ({ id: p.id, value: p.id, label: `${p.name} (${p.characters.length})` })),
]);

const selectedParty = computed(() => parties.value.find((p) => p.id === form.partyId));

const partyLevels = computed(() => {
	const chars = selectedParty.value?.characters ?? [];
	if (chars.length) return chars.map((c) => c.level);

	const count = Math.min(Math.max(Math.round(form.playerCount) || 1, 1), 10);
	const level = Math.min(Math.max(Math.round(form.playerLevel) || 1, 1), 20);
	return Array.from({ length: count }, () => level);
});

// Reset theme when it no longer belongs to the selected setting/disposition.
watch(
	() => [form.settingId, form.disposition],
	() => {
		if (!themeOptions.value.some((o) => o.value === form.themeId)) form.themeId = "";
	},
);

const result = ref<IGeneratedEncounter | null>(null);
const generating = ref(false);
const saving = ref(false);
const error = ref("");

watch(visible, (isVisible) => {
	if (isVisible) {
		result.value = null;
		error.value = "";
	}
});

async function generate() {
	generating.value = true;
	error.value = "";
	try {
		result.value = await generateEncounter({
			settingId: form.settingId || undefined,
			disposition: form.disposition || undefined,
			themeId: form.themeId || undefined,
			difficulty: form.difficulty,
			partyLevels: partyLevels.value,
		});
	} catch (e) {
		result.value = null;
		error.value = e instanceof Error ? e.message : "Failed to generate encounter.";
	} finally {
		generating.value = false;
	}
}

const difficultyMismatch = computed(
	() => result.value && result.value.difficulty.label !== form.difficulty,
);

async function save() {
	if (!result.value) return;
	const { setting, theme, hook, monsters, composition, tactics } = result.value;

	saving.value = true;
	error.value = "";
	try {
		const encounter = await encountersApi.create({
			name: `${theme.name} — ${setting.name}`,
			description: hook,
			notes: [
				`Generated ${form.difficulty} ${DISPOSITION_LABELS[theme.disposition].toLowerCase()} encounter for ${partyLevels.value.length} player(s), levels ${partyLevels.value.join(", ")}.`,
				composition,
				...monsters.map((m) => `• ${m.quantity}× ${m.monster.name}: ${m.role}, ${m.style}`),
				"Tactics:",
				...tactics.map((t) => `• ${t}`),
			].join("\n"),
			partyId: selectedParty.value?.id ?? null,
		});
		if (isAxiosError(encounter)) throw new Error("Failed to create encounter.");

		for (const { monster, quantity } of monsters) {
			const added = await encountersApi.addMonster(encounter.id, monster.id, quantity);
			if (isAxiosError(added)) throw new Error(`Encounter created, but adding ${monster.name} failed.`);
		}

		await queryClient.invalidateQueries({ queryKey: ["encounters"] });
		visible.value = false;
		router.push({ name: "encounters-detail", params: { id: encounter.id } });
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Failed to save encounter.";
	} finally {
		saving.value = false;
	}
}

const dispositionClass: Record<EncounterDisposition, string> = {
	hostile: "text-red-400 border-red-400/40",
	neutral: "text-amber-400 border-amber-400/40",
	friendly: "text-green-400 border-green-400/40",
};

const roleClass: Record<EncounterRole, string> = {
	leader: "text-red-400 border-red-400/40",
	elite: "text-amber-400 border-amber-400/40",
	minion: "text-ink-mute border-border",
};

const numberInputClass =
	"w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent";
</script>

<template>
	<BaseModal v-model:visible="visible" size="lg">
		<template #header>
			<h3 class="font-display text-lg text-ink">Generate encounter</h3>
		</template>

		<div class="flex flex-col gap-4 p-4 overflow-y-auto">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<label class="block text-xs text-ink-mute mb-1.5">Setting</label>
					<BaseSelect v-model="form.settingId" :options="settingOptions" placeholder="Random setting" />
				</div>
				<div>
					<label class="block text-xs text-ink-mute mb-1.5">Alignment</label>
					<BaseSelect v-model="form.disposition" :options="dispositionOptions" placeholder="Any" />
				</div>
				<div>
					<label class="block text-xs text-ink-mute mb-1.5">Encounter type</label>
					<BaseSelect v-model="form.themeId" :options="themeOptions" placeholder="Random encounter" />
				</div>
				<div>
					<label class="block text-xs text-ink-mute mb-1.5">Difficulty</label>
					<div class="grid grid-cols-4 gap-1">
						<button
							v-for="d in TARGET_DIFFICULTIES"
							:key="d"
							type="button"
							class="rounded-lg border px-2 py-1.5 text-xs transition-colors"
							:class="
								form.difficulty === d
									? 'border-accent text-accent bg-accent/10'
									: 'border-border text-ink-mute hover:text-ink'
							"
							@click="form.difficulty = d"
						>
							{{ d }}
						</button>
					</div>
				</div>
			</div>

			<div class="rounded-lg border border-border p-3 flex flex-col gap-3">
				<div>
					<label class="block text-xs text-ink-mute mb-1.5">Party</label>
					<BaseSelect v-model="form.partyId" :options="partyOptions" placeholder="No party" />
				</div>

				<p v-if="selectedParty && selectedParty.characters.length" class="text-xs text-ink-mute">
					{{ selectedParty.characters.length }} characters, levels
					{{ partyLevels.join(", ") }}
				</p>

				<div v-else class="grid grid-cols-2 gap-3">
					<p v-if="selectedParty" class="col-span-2 text-xs text-amber-400">
						This party has no characters yet — using the numbers below.
					</p>
					<div>
						<label for="gen-players" class="block text-xs text-ink-mute mb-1.5">Players</label>
						<input
							id="gen-players"
							v-model.number="form.playerCount"
							type="number"
							min="1"
							max="10"
							:class="numberInputClass"
						/>
					</div>
					<div>
						<label for="gen-level" class="block text-xs text-ink-mute mb-1.5">Level</label>
						<input
							id="gen-level"
							v-model.number="form.playerLevel"
							type="number"
							min="1"
							max="20"
							:class="numberInputClass"
						/>
					</div>
				</div>
			</div>

			<button
				type="button"
				:disabled="generating"
				class="w-full rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
				@click="generate"
			>
				{{ generating ? "Rolling…" : result ? "⟳ Reroll" : "⚄ Generate" }}
			</button>

			<div v-if="result" class="rounded-lg border border-border bg-bg-elev p-3 flex flex-col gap-3">
				<div class="flex flex-wrap items-center gap-2">
					<span class="font-display text-ink">{{ result.theme.name }}</span>
					<span class="rounded-full border border-border px-2 py-0.5 text-xs text-ink-mute">
						{{ result.setting.name }}
					</span>
					<span
						class="rounded-full border px-2 py-0.5 text-xs"
						:class="dispositionClass[result.theme.disposition]"
					>
						{{ DISPOSITION_LABELS[result.theme.disposition] }}
					</span>
				</div>

				<p class="text-sm text-ink-mute italic">{{ result.hook }}</p>

				<p class="text-xs text-ink-faint">{{ result.composition }}</p>

				<ul class="flex flex-col divide-y divide-border">
					<li
						v-for="{ monster, quantity, role, style } in result.monsters"
						:key="monster.id"
						class="flex items-center justify-between gap-2 py-1.5 text-sm"
					>
						<span class="flex items-center gap-2 min-w-0 text-ink">
							<span
								class="shrink-0 w-14 rounded-full border px-1.5 py-0.5 text-center text-[10px] uppercase tracking-wide"
								:class="roleClass[role]"
							>
								{{ role }}
							</span>
							<span class="truncate">
								<span class="text-accent">{{ quantity }}×</span> {{ monster.name }}
								<span class="text-xs text-ink-faint">({{ monster.source }})</span>
							</span>
						</span>
						<span class="shrink-0 text-xs text-ink-mute">
							<span :title="STYLE_LABELS[style].label">{{ STYLE_LABELS[style].glyph }} {{ STYLE_LABELS[style].label }}</span>
							· CR {{ monster.challengeRating }} · {{ xpForCr(monster.crValue) * quantity }} XP
						</span>
					</li>
				</ul>

				<ul v-if="result.tactics.length" class="flex flex-col gap-1 text-xs text-ink-mute list-disc pl-4">
					<li v-for="tip in result.tactics" :key="tip">{{ tip }}</li>
				</ul>

				<div>
					<div class="flex justify-between text-xs text-ink-mute mb-1">
						<span>{{ result.difficulty.label }}</span>
						<span>{{ result.difficulty.adjustedXp }} adjusted XP</span>
					</div>
					<DifficultyBar :difficulty="result.difficulty" />
				</div>

				<p v-if="difficultyMismatch" class="text-xs text-amber-400">
					Couldn't hit {{ form.difficulty }} with this encounter type for this party — closest is
					{{ result.difficulty.label }}. Try a reroll or another type.
				</p>
			</div>

			<p v-if="error" class="text-sm text-red-400">{{ error }}</p>

			<p v-if="!userStore.isLoggedIn" class="text-xs text-ink-mute rounded-lg border border-dashed border-border px-3 py-2">
				You need to be signed in to save an encounter.
				<RouterLink to="/login" class="text-accent hover:underline">Log in</RouterLink>
			</p>

			<button
				v-if="result"
				type="button"
				:disabled="saving || !userStore.isLoggedIn"
				class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
				@click="save"
			>
				{{ saving ? "Saving…" : "Create encounter" }}
			</button>
		</div>
	</BaseModal>
</template>
