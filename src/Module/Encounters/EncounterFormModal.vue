<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { isAxiosError } from "axios";
import { useRouter } from "vue-router";
import { useEncounterStore } from "@/Module/Encounters/store/useEncounterStore";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import { useUserStore } from "@/Module/User/store/useUserStore";
import BaseModal from "@/Module/Modal/BaseModal.vue";
import BaseSelect from "@/Module/Select/BaseSelect.vue";
import type { IEncounter } from "@/Module/Encounters/types";

const props = defineProps<{ encounter?: IEncounter }>();

const visible = defineModel<boolean>("visible", { default: false });

const isEditing = computed(() => !!props.encounter);

const router = useRouter();
const encounterStore = useEncounterStore();
const partyStore = usePartyStore();
const userStore = useUserStore();

const parties = computed(() =>
	partyStore.data && !isAxiosError(partyStore.data) ? partyStore.data.data : [],
);
const partyOptions = computed(() => [
	{ id: "none", value: "", label: "No party yet" },
	...parties.value.map((party) => ({ id: party.id, value: party.id, label: party.name })),
]);

const buildForm = () => {
	const e = props.encounter;
	return {
		name: e?.name ?? "",
		description: e?.description ?? "",
		notes: e?.notes ?? "",
		partyId: e?.partyId ?? "",
	};
};

const form = reactive(buildForm());
const error = ref("");
const submitting = ref(false);

watch(visible, (isVisible) => {
	if (isVisible) {
		Object.assign(form, buildForm());
		error.value = "";
		submitting.value = false;
	}
});

async function submit() {
	if (!form.name.trim()) {
		error.value = "Encounter name is required.";
		return;
	}

	submitting.value = true;
	error.value = "";

	const payload = {
		name: form.name.trim(),
		description: form.description.trim() || undefined,
		notes: form.notes.trim() || undefined,
		partyId: form.partyId || null,
	};

	try {
		if (props.encounter) {
			await encounterStore.update(props.encounter.id, payload);
			visible.value = false;
		} else {
			const encounter = await encounterStore.create(payload);
			visible.value = false;
			if (encounter && !isAxiosError(encounter)) {
				router.push({ name: "encounters-detail", params: { id: encounter.id } });
			}
		}
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Failed to save encounter.";
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<BaseModal v-model:visible="visible" size="sm">
		<template #header>
			<h3 class="font-display text-lg text-ink">{{ isEditing ? "Edit encounter" : "Create encounter" }}</h3>
		</template>

		<form class="flex flex-col gap-4 p-4" @submit.prevent="submit">
			<div>
				<label for="encounter-name" class="block text-xs text-ink-mute mb-1.5">Name *</label>
				<input
					id="encounter-name"
					v-model="form.name"
					type="text"
					placeholder="Ambush at the Old Mill"
					required
					autofocus
					class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
				/>
			</div>

			<div>
				<label for="encounter-description" class="block text-xs text-ink-mute mb-1.5">Description</label>
				<textarea
					id="encounter-description"
					v-model="form.description"
					rows="3"
					placeholder="Optional notes about this encounter..."
					class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent resize-none"
				/>
			</div>

			<div>
				<label class="block text-xs text-ink-mute mb-1.5">Party (optional)</label>
				<BaseSelect v-model="form.partyId" :options="partyOptions" placeholder="No party yet" />
			</div>

			<div>
				<label for="encounter-notes" class="block text-xs text-ink-mute mb-1.5">GM notes</label>
				<textarea
					id="encounter-notes"
					v-model="form.notes"
					rows="3"
					placeholder="Private notes — tactics, loot, twists…"
					class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent resize-none"
				/>
			</div>

			<p v-if="error" class="text-sm text-red-400">{{ error }}</p>

			<p v-if="!userStore.isLoggedIn" class="text-xs text-ink-mute rounded-lg border border-dashed border-border px-3 py-2">
				You need to be signed in to {{ isEditing ? "edit this" : "create an" }} encounter.
				<RouterLink to="/login" class="text-accent hover:underline">Log in</RouterLink>
			</p>

			<button
				type="submit"
				:disabled="submitting || !userStore.isLoggedIn"
				class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
			>
				{{ submitting ? "Saving…" : isEditing ? "Save changes" : "Create encounter" }}
			</button>
		</form>
	</BaseModal>
</template>
