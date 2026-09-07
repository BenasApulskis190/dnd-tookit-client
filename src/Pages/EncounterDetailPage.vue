<script lang="ts" setup>
import { computed, ref } from "vue";
import { isAxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";
import BaseBreadcrumbs from "@/Module/Breadcrumbs/BaseBreadcrumbs.vue";
import { useEncounterStore } from "@/Module/Encounters/store/useEncounterStore";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import { computeEncounterDifficulty } from "@/Module/Encounters/util/difficulty";
import DifficultyBar from "@/Module/Encounters/DifficultyBar.vue";
import EncounterMonsterPickerModal from "@/Module/Encounters/EncounterMonsterPickerModal.vue";
import EncounterLootPickerModal from "@/Module/Encounters/EncounterLootPickerModal.vue";
import EncounterFormModal from "@/Module/Encounters/EncounterFormModal.vue";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";
import ItemDetails from "@/Module/Items/ItemDetails.vue";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";
import { resoleMonsterImageUrl } from "@/Module/Bestiary/util/monsterImageResolver";
import BaseSelect from "@/Module/Select/BaseSelect.vue";
import { lootName, lootTotalValue, encounterLootTotal } from "@/Module/Encounters/util/loot";
import { itemsApi } from "@/Module/Items/api/itemsApi";

const route = useRoute();
const router = useRouter();
const encounterStore = useEncounterStore();
const partyStore = usePartyStore();
const drawers = useDrawerStore();

const encounterId = computed(() => route.params.id as string);

const encounters = computed(() =>
	encounterStore.data && !isAxiosError(encounterStore.data) ? encounterStore.data.data : [],
);
const encounter = computed(() => encounters.value.find((e) => e.id === encounterId.value));

const breadcrumbs = computed(() => [
	{ label: "Encounters", to: { name: "encounters" } },
	{ label: encounter.value?.name ?? "…" },
]);

const parties = computed(() =>
	partyStore.data && !isAxiosError(partyStore.data) ? partyStore.data.data : [],
);
const partyOptions = computed(() => parties.value.map((party) => ({ id: party.id, value: party.id, label: party.name })));
const assignedPartyOptions = computed(() => [
	{ id: "none", value: "", label: "No party assigned" },
	...partyOptions.value,
]);

const totalMonsters = computed(
	() => encounter.value?.monsters.reduce((sum, m) => sum + m.quantity, 0) ?? 0,
);

const difficulty = computed(() =>
	computeEncounterDifficulty(
		encounter.value?.monsters.map((m) => ({ crValue: m.monster.crValue, quantity: m.quantity })) ?? [],
		encounter.value?.party?.characters.map((c) => c.level) ?? [],
	),
);

const showMonsterPicker = ref(false);
const showLootPicker = ref(false);
const showFormModal = ref(false);

const lootTotal = computed(() => encounterLootTotal(encounter.value?.loot ?? []));

async function viewItemDetails(itemId: string) {
	const item = await itemsApi.getById(itemId);
	if (isAxiosError(item)) return;
	drawers.open("item", { component: ItemDetails, props: { item }, width: "w-[45vw]" });
}

function incrementLoot(lootId: string, current: number) {
	if (!encounter.value) return;
	encounterStore.updateLoot(encounter.value.id, lootId, { quantity: current + 1 });
}

function decrementLoot(lootId: string, current: number) {
	if (!encounter.value) return;
	encounterStore.updateLoot(encounter.value.id, lootId, { quantity: current - 1 });
}

function removeLoot(lootId: string) {
	if (!encounter.value) return;
	encounterStore.removeLoot(encounter.value.id, lootId);
}
const assigningParty = ref(false);
const selectedPartyId = ref<string | undefined>(undefined);

const partyModel = computed<string | undefined>({
	get: () => encounter.value?.partyId ?? "",
	set: (value) => {
		if (!encounter.value) return;
		encounterStore.update(encounter.value.id, { partyId: value || null });
	},
});

const editingName = ref(false);
const nameDraft = ref("");
const nameError = ref("");

function startEditName() {
	if (!encounter.value) return;
	nameDraft.value = encounter.value.name;
	nameError.value = "";
	editingName.value = true;
}

async function saveName() {
	if (!encounter.value) return;

	const trimmed = nameDraft.value.trim();
	if (!trimmed) {
		nameError.value = "Name can't be empty.";
		return;
	}

	if (trimmed !== encounter.value.name) {
		await encounterStore.update(encounter.value.id, { name: trimmed });
	}
	editingName.value = false;
}

function cancelEditName() {
	editingName.value = false;
	nameError.value = "";
}

const editingDescription = ref(false);
const descriptionDraft = ref("");

function startEditDescription() {
	if (!encounter.value) return;
	descriptionDraft.value = encounter.value.description ?? "";
	editingDescription.value = true;
}

async function saveDescription() {
	if (!encounter.value) return;

	await encounterStore.update(encounter.value.id, { description: descriptionDraft.value.trim() });
	editingDescription.value = false;
}

function cancelEditDescription() {
	editingDescription.value = false;
}

function viewMonsterDetails(monsterId: string) {
	drawers.open("monster", { component: MonsterDetails, props: { id: monsterId }, width: "w-[45vw]" });
}

function incrementMonster(monsterId: string, current: number) {
	if (!encounter.value) return;
	encounterStore.updateMonster(encounter.value.id, monsterId, current + 1);
}

function decrementMonster(monsterId: string, current: number) {
	if (!encounter.value) return;
	encounterStore.updateMonster(encounter.value.id, monsterId, current - 1);
}

function removeMonster(monsterId: string) {
	if (!encounter.value) return;
	encounterStore.removeMonster(encounter.value.id, monsterId);
}

function removeEncounter() {
	if (!encounter.value) return;
	encounterStore.remove(encounter.value.id);
	router.push({ name: "encounters" });
}

function startCombat() {
	if (!encounter.value) return;

	if (encounter.value.partyId) {
		router.push({ name: "combat", params: { id: encounter.value.id } });
		return;
	}

	assigningParty.value = true;
}

async function confirmAssignParty() {
	if (!encounter.value || !selectedPartyId.value) return;

	await encounterStore.update(encounter.value.id, { partyId: selectedPartyId.value });
	assigningParty.value = false;
	router.push({ name: "combat", params: { id: encounter.value.id } });
}
</script>

<template>
	<div v-if="!encounter" class="py-24 text-center text-sm text-ink-mute">Encounter not found.</div>

	<div v-else class="max-w-3xl flex flex-col gap-6">
		<BaseBreadcrumbs :items="breadcrumbs" />

		<div class="flex items-start justify-between gap-4">
			<div class="min-w-0 flex-1">
				<div v-if="editingName" class="flex flex-col gap-1.5 max-w-md">
					<input
						v-model="nameDraft"
						type="text"
						autofocus
						class="w-full rounded-lg border border-accent bg-bg-elev px-3 py-1.5 text-lg text-ink focus:outline-none"
						@keydown.enter="saveName"
						@keydown.escape="cancelEditName"
					/>
					<p v-if="nameError" class="text-xs text-red-400">{{ nameError }}</p>
					<div class="flex gap-2">
						<button
							class="rounded-lg bg-accent px-3 py-1 text-xs font-medium text-bg hover:opacity-90 transition-opacity"
							@click="saveName"
						>
							✓ Save
						</button>
						<button
							class="rounded-lg border border-border px-3 py-1 text-xs text-ink-mute hover:text-ink transition-colors"
							@click="cancelEditName"
						>
							✕ Cancel
						</button>
					</div>
				</div>
				<div v-else class="group flex items-center gap-2">
					<h1 class="font-display text-2xl text-ink">{{ encounter.name }}</h1>
					<button
						class="text-ink-faint hover:text-accent transition-colors opacity-60 group-hover:opacity-100"
						title="Edit name"
						@click="startEditName"
					>
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
						</svg>
					</button>
				</div>

				<div v-if="editingDescription" class="flex flex-col gap-1.5 max-w-md mt-1.5">
					<textarea
						v-model="descriptionDraft"
						rows="2"
						autofocus
						placeholder="Add a description…"
						class="w-full rounded-lg border border-accent bg-bg-elev px-3 py-1.5 text-sm text-ink focus:outline-none resize-none"
						@keydown.escape="cancelEditDescription"
					/>
					<div class="flex gap-2">
						<button
							class="rounded-lg bg-accent px-3 py-1 text-xs font-medium text-bg hover:opacity-90 transition-opacity"
							@click="saveDescription"
						>
							✓ Save
						</button>
						<button
							class="rounded-lg border border-border px-3 py-1 text-xs text-ink-mute hover:text-ink transition-colors"
							@click="cancelEditDescription"
						>
							✕ Cancel
						</button>
					</div>
				</div>
				<div v-else class="group flex items-center gap-2 mt-1">
					<p class="text-sm" :class="encounter.description ? 'text-ink-mute' : 'text-ink-faint italic'">
						{{ encounter.description || "No description" }}
					</p>
					<button
						class="text-ink-faint hover:text-accent transition-colors opacity-60 group-hover:opacity-100"
						title="Edit description"
						@click="startEditDescription"
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
						</svg>
					</button>
				</div>
			</div>

			<div class="flex shrink-0 gap-2">
				<button
					class="rounded-lg border border-border px-3 py-1.5 text-xs text-ink-mute hover:text-ink hover:border-ink/30 transition-colors"
					@click="showFormModal = true"
				>
					Edit encounter
				</button>
				<button
					class="rounded-lg border border-border px-3 py-1.5 text-xs text-ink-mute hover:text-red-400 hover:border-red-400/50 transition-colors"
					@click="removeEncounter"
				>
					Delete encounter
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="rounded-[var(--radius)] border border-border bg-bg-elev p-4">
				<label class="block text-xs text-ink-mute mb-1.5">Party</label>
				<BaseSelect v-model="partyModel" :options="assignedPartyOptions" placeholder="No party assigned" />

				<div v-if="encounter.party" class="mt-2 flex flex-wrap gap-1.5">
					<span
						v-for="character in encounter.party.characters"
						:key="character.id"
						class="inline-flex items-center rounded-full border border-border bg-bg px-2 py-0.5 text-[11px] text-ink-soft"
					>
						{{ character.name }} · Lv{{ character.level }}
					</span>
					<span v-if="encounter.party.characters.length === 0" class="text-[11px] text-ink-faint">
						This party has no characters yet.
					</span>
				</div>
			</div>

			<div class="rounded-[var(--radius)] border border-border bg-bg-elev p-4">
				<p class="block text-xs text-ink-mute mb-1.5">
					Difficulty · {{ totalMonsters }} monster{{ totalMonsters === 1 ? "" : "s" }}
				</p>
				<DifficultyBar :difficulty="difficulty" />
			</div>
		</div>

		<div v-if="encounter.notes" class="rounded-[var(--radius)] border border-border bg-bg-elev p-4">
			<p class="block text-xs text-ink-mute mb-1.5">GM notes</p>
			<p class="text-sm text-ink-soft whitespace-pre-wrap">{{ encounter.notes }}</p>
		</div>

		<div class="flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<h2 class="font-display text-lg text-ink">Monsters</h2>
				<button class="text-xs font-medium text-accent hover:underline" @click="showMonsterPicker = true">
					+ Add monster
				</button>
			</div>

			<p v-if="encounter.monsters.length === 0" class="text-xs text-ink-faint">No monsters added yet.</p>

			<div
				v-for="entry in encounter.monsters"
				:key="entry.id"
				class="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-elev px-3 py-2"
			>
				<div class="flex items-center gap-2.5 min-w-0">
					<img
						:src="resoleMonsterImageUrl(entry.monster.source, entry.monster.name)"
						:alt="entry.monster.name"
						class="w-9 h-9 shrink-0 rounded object-cover bg-bg-elev2"
					/>
					<div class="min-w-0">
						<p
							class="text-sm text-ink-soft truncate cursor-pointer hover:text-ink hover:underline w-fit"
							title="See monster details"
							@click="viewMonsterDetails(entry.monster.id)"
						>
							{{ entry.monster.name }}
						</p>
						<p class="text-xs text-ink-faint">
							CR {{ entry.monster.challengeRating }}
							<span v-if="entry.monster.hitPointsAvg != null"> · HP {{ entry.monster.hitPointsAvg }}</span>
							<span v-if="entry.monster.armorClass != null"> · AC {{ entry.monster.armorClass }}</span>
						</p>
					</div>
				</div>

				<div class="flex items-center gap-3 shrink-0">
					<button
						class="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-ink-mute hover:text-ink hover:bg-bg-elev2 transition-colors"
						title="See monster details"
						@click="viewMonsterDetails(entry.monster.id)"
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" />
						</svg>
						Details
					</button>

					<div class="flex items-center gap-1 rounded-lg border border-border bg-bg px-1 py-0.5">
						<button
							class="w-6 h-6 flex items-center justify-center rounded text-ink-mute hover:bg-bg-elev2 hover:text-ink"
							title="Remove one"
							@click="decrementMonster(entry.monster.id, entry.quantity)"
						>
							−
						</button>
						<span class="w-5 text-center text-sm font-medium text-ink">{{ entry.quantity }}</span>
						<button
							class="w-6 h-6 flex items-center justify-center rounded text-ink-mute hover:bg-bg-elev2 hover:text-ink"
							title="Add one"
							@click="incrementMonster(entry.monster.id, entry.quantity)"
						>
							+
						</button>
					</div>

					<button
						class="inline-flex items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-xs text-red-400/80 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-colors"
						title="Remove this monster from the encounter"
						@click="removeMonster(entry.monster.id)"
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
						</svg>
						Remove
					</button>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<h2 class="font-display text-lg text-ink">Loot</h2>
				<div class="flex items-center gap-3">
					<p v-if="encounter.loot.length > 0" class="text-xs text-ink-mute">
						{{ lootTotal.toLocaleString() }} gp total
					</p>
					<button class="text-xs font-medium text-accent hover:underline" @click="showLootPicker = true">
						+ Add loot
					</button>
				</div>
			</div>

			<p v-if="encounter.loot.length === 0" class="text-xs text-ink-faint">No loot added yet.</p>

			<div
				v-for="entry in encounter.loot"
				:key="entry.id"
				class="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-elev px-3 py-2"
			>
				<div class="min-w-0">
					<p
						class="text-sm text-ink-soft truncate w-fit"
						:class="entry.item ? 'cursor-pointer hover:text-ink hover:underline' : ''"
						:title="entry.item ? 'See item details' : undefined"
						@click="entry.item && viewItemDetails(entry.item.id)"
					>
						{{ lootName(entry) }}
					</p>
					<p class="text-xs text-ink-faint">
						{{ lootTotalValue(entry).toLocaleString() }} gp
						<span v-if="entry.notes"> · {{ entry.notes }}</span>
					</p>
				</div>

				<div class="flex items-center gap-3 shrink-0">
					<div class="flex items-center gap-1 rounded-lg border border-border bg-bg px-1 py-0.5">
						<button
							class="w-6 h-6 flex items-center justify-center rounded text-ink-mute hover:bg-bg-elev2 hover:text-ink"
							title="Remove one"
							@click="decrementLoot(entry.id, entry.quantity)"
						>
							−
						</button>
						<span class="w-5 text-center text-sm font-medium text-ink">{{ entry.quantity }}</span>
						<button
							class="w-6 h-6 flex items-center justify-center rounded text-ink-mute hover:bg-bg-elev2 hover:text-ink"
							title="Add one"
							@click="incrementLoot(entry.id, entry.quantity)"
						>
							+
						</button>
					</div>

					<button
						class="inline-flex items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-xs text-red-400/80 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-colors"
						title="Remove this loot from the encounter"
						@click="removeLoot(entry.id)"
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
						</svg>
						Remove
					</button>
				</div>
			</div>
		</div>

		<div v-if="assigningParty" class="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-bg-elev p-3 max-w-sm">
			<p class="text-xs text-ink-mute">Assign a party to start combat:</p>
			<BaseSelect v-model="selectedPartyId" :options="partyOptions" placeholder="Select a party…" />
			<div class="flex gap-2">
				<button
					class="flex-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50"
					:disabled="!selectedPartyId"
					@click="confirmAssignParty"
				>
					Assign & start
				</button>
				<button class="text-xs text-ink-faint hover:text-ink" @click="assigningParty = false">Cancel</button>
			</div>
		</div>
		<button
			v-else
			class="self-start inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
			@click="startCombat"
		>
			⚔ Start combat
		</button>

		<EncounterMonsterPickerModal v-model:visible="showMonsterPicker" :encounter-id="encounter.id" />
		<EncounterLootPickerModal v-model:visible="showLootPicker" :encounter-id="encounter.id" />
		<EncounterFormModal v-model:visible="showFormModal" :encounter="encounter" />
	</div>
</template>
