<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { isAxiosError } from "axios";
import BaseModal from "@/Module/Modal/BaseModal.vue";
import BaseSearchBar from "@/Module/SearchBar/BaseSearchBar.vue";
import ItemFilter from "@/Module/Items/ItemFilter.vue";
import ItemTable from "@/Module/Items/ItemTable.vue";
import ItemDetails from "@/Module/Items/ItemDetails.vue";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";
import { useItemStore } from "@/Module/Items/store/useItemStore";
import { useEncounterStore } from "@/Module/Encounters/store/useEncounterStore";
import { lootName, lootTotalValue, encounterLootTotal } from "@/Module/Encounters/util/loot";
import type { IItem } from "@/Module/Items/types";

const props = defineProps<{ encounterId: string }>();

const visible = defineModel<boolean>("visible", { default: false });

const encounterStore = useEncounterStore();
const drawers = useDrawerStore();
const itemStore = useItemStore();
const isLoading = computed(() => itemStore.isLoading);

const encounters = computed(() =>
	encounterStore.data && !isAxiosError(encounterStore.data) ? encounterStore.data.data : [],
);
const encounter = computed(() => encounters.value.find((e) => e.id === props.encounterId));

const total = computed(() => encounterLootTotal(encounter.value?.loot ?? []));

const tab = ref<"catalog" | "custom">("catalog");

const search = ref("");
const itemFilter = reactive<{ rarity: string | null; type: string | null; magic: boolean | null }>({
	rarity: null,
	type: null,
	magic: null,
});

const addingId = ref<string | null>(null);
const error = ref("");

async function addItem(item: IItem) {
	if (!item.id) return;

	addingId.value = item.id;
	error.value = "";

	try {
		await encounterStore.addLoot(props.encounterId, { itemId: item.id, quantity: 1 });
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Failed to add loot.";
	} finally {
		addingId.value = null;
	}
}

function viewItemDetails(item: IItem) {
	drawers.open("item", { component: ItemDetails, props: { item }, width: "w-[45vw]" });
}

const customForm = reactive({ name: "", quantity: 1, valueGp: null as number | null, notes: "" });
const customSubmitting = ref(false);
const customError = ref("");

async function submitCustom() {
	if (!customForm.name.trim()) {
		customError.value = "Name is required.";
		return;
	}

	customSubmitting.value = true;
	customError.value = "";

	try {
		await encounterStore.addLoot(props.encounterId, {
			customName: customForm.name.trim(),
			quantity: customForm.quantity > 0 ? Math.floor(customForm.quantity) : 1,
			valueGp: customForm.valueGp,
			notes: customForm.notes.trim() || undefined,
		});
		customForm.name = "";
		customForm.quantity = 1;
		customForm.valueGp = null;
		customForm.notes = "";
	} catch (e) {
		customError.value = e instanceof Error ? e.message : "Failed to add loot.";
	} finally {
		customSubmitting.value = false;
	}
}

function incrementAdded(lootId: string, current: number) {
	encounterStore.updateLoot(props.encounterId, lootId, { quantity: current + 1 });
}

function decrementAdded(lootId: string, current: number) {
	encounterStore.updateLoot(props.encounterId, lootId, { quantity: current - 1 });
}

function removeAdded(lootId: string) {
	encounterStore.removeLoot(props.encounterId, lootId);
}

function done() {
	visible.value = false;
}
</script>

<template>
	<BaseModal v-model:visible="visible" size="full-screen">
		<template #header>
			<h3 class="font-display text-lg text-ink">Add loot</h3>
		</template>

		<div class="flex flex-1 min-h-0 flex-col lg:flex-row">
			<div class="flex flex-1 min-w-0 min-h-0 flex-col gap-4 p-4 overflow-y-auto">
				<div class="flex gap-1 rounded-lg border border-border bg-bg-elev p-1 w-fit">
					<button
						class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
						:class="tab === 'catalog' ? 'bg-accent text-bg' : 'text-ink-mute hover:text-ink'"
						@click="tab = 'catalog'"
					>
						From catalog
					</button>
					<button
						class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
						:class="tab === 'custom' ? 'bg-accent text-bg' : 'text-ink-mute hover:text-ink'"
						@click="tab = 'custom'"
					>
						Custom loot
					</button>
				</div>

				<template v-if="tab === 'catalog'">
					<p v-if="error" class="text-sm text-red-400">{{ error }}</p>

					<BaseSearchBar v-model="search" :loading="isLoading" />
					<ItemFilter
						@rarity-select="itemFilter.rarity = $event"
						@type-select="itemFilter.type = $event"
						@magic-select="itemFilter.magic = $event"
					/>

					<ItemTable
						:item-filter="itemFilter"
						:search="search"
						mode="select"
						show-actions
						@select="viewItemDetails"
					>
						<template #actions="{ item }">
							<button
								class="rounded-lg bg-accent px-3 py-1 text-xs font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50"
								:disabled="addingId === item.id"
								@click="addItem(item)"
							>
								{{ addingId === item.id ? "Adding…" : "+ Add" }}
							</button>
						</template>
					</ItemTable>
				</template>

				<form v-else class="flex flex-col gap-4 max-w-sm" @submit.prevent="submitCustom">
					<div>
						<label for="loot-name" class="block text-xs text-ink-mute mb-1.5">Name *</label>
						<input
							id="loot-name"
							v-model="customForm.name"
							type="text"
							placeholder="Silver necklace"
							required
							class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
						/>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="loot-quantity" class="block text-xs text-ink-mute mb-1.5">Quantity</label>
							<input
								id="loot-quantity"
								v-model.number="customForm.quantity"
								type="number"
								min="1"
								class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
							/>
						</div>
						<div>
							<label for="loot-value" class="block text-xs text-ink-mute mb-1.5">Value (gp)</label>
							<input
								id="loot-value"
								v-model.number="customForm.valueGp"
								type="number"
								min="0"
								placeholder="0"
								class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
							/>
						</div>
					</div>

					<div>
						<label for="loot-notes" class="block text-xs text-ink-mute mb-1.5">Notes</label>
						<textarea
							id="loot-notes"
							v-model="customForm.notes"
							rows="2"
							placeholder="Optional details…"
							class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent resize-none"
						/>
					</div>

					<p v-if="customError" class="text-sm text-red-400">{{ customError }}</p>

					<button
						type="submit"
						:disabled="customSubmitting"
						class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50"
					>
						{{ customSubmitting ? "Adding…" : "+ Add loot" }}
					</button>
				</form>
			</div>

			<div
				class="w-full lg:w-80 shrink-0 min-h-0 border-t lg:border-t-0 lg:border-l border-border p-4 flex flex-col gap-3"
			>
				<div class="flex flex-col gap-2 flex-1 min-h-0">
					<div class="flex items-center justify-between">
						<p class="text-xs text-ink-mute">Added to this encounter</p>
						<p class="text-xs font-medium text-ink">{{ total.toLocaleString() }} gp</p>
					</div>

					<p v-if="!encounter || encounter.loot.length === 0" class="text-xs text-ink-faint">
						Nothing added yet.
					</p>

					<div class="flex flex-col gap-2 overflow-y-auto">
						<div
							v-for="entry in encounter?.loot ?? []"
							:key="entry.id"
							class="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-elev px-2.5 py-1.5"
						>
							<div class="min-w-0">
								<p class="text-xs text-ink-soft truncate">{{ lootName(entry) }}</p>
								<p class="text-[11px] text-ink-faint">{{ lootTotalValue(entry).toLocaleString() }} gp</p>
							</div>

							<div class="flex items-center gap-1 shrink-0">
								<button
									class="w-5 h-5 flex items-center justify-center rounded border border-border text-ink-mute hover:bg-bg-elev2 text-xs"
									@click="decrementAdded(entry.id, entry.quantity)"
								>
									−
								</button>
								<span class="w-5 text-center text-xs text-ink">{{ entry.quantity }}</span>
								<button
									class="w-5 h-5 flex items-center justify-center rounded border border-border text-ink-mute hover:bg-bg-elev2 text-xs"
									@click="incrementAdded(entry.id, entry.quantity)"
								>
									+
								</button>
								<button
									class="ml-1 text-ink-faint hover:text-red-400 transition-colors"
									title="Remove loot"
									@click="removeAdded(entry.id)"
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				<button
					class="mt-2 w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
					@click="done"
				>
					✓ Done adding loot
				</button>
			</div>
		</div>
	</BaseModal>
</template>
