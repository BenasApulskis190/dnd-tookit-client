<script lang="ts" setup>
import { ref, watch } from "vue";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import { useUserStore } from "@/Module/User/store/useUserStore";
import BaseModal from "@/Module/Modal/BaseModal.vue";

const visible = defineModel<boolean>("visible", { default: false });

const partyStore = usePartyStore();
const userStore = useUserStore();

const name = ref("");
const description = ref("");
const error = ref("");
const submitting = ref(false);

watch(visible, (isVisible) => {
	if (isVisible) {
		name.value = "";
		description.value = "";
		error.value = "";
		submitting.value = false;
	}
});

async function submit() {
	if (!name.value.trim()) {
		error.value = "Party name is required.";
		return;
	}

	submitting.value = true;
	error.value = "";

	try {
		await partyStore.create({ name: name.value.trim(), description: description.value.trim() || undefined });
		visible.value = false;
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Failed to create party.";
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<BaseModal v-model:visible="visible" size="sm">
		<template #header>
			<h3 class="font-display text-lg text-ink">Create party</h3>
		</template>

		<form class="flex flex-col gap-4 p-4" @submit.prevent="submit">
			<div>
				<label for="party-name" class="block text-xs text-ink-mute mb-1.5">Name *</label>
				<input
					id="party-name"
					v-model="name"
					type="text"
					placeholder="The Crimson Blades"
					required
					autofocus
					class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
				/>
			</div>

			<div>
				<label for="party-description" class="block text-xs text-ink-mute mb-1.5">Description</label>
				<textarea
					id="party-description"
					v-model="description"
					rows="3"
					placeholder="Optional notes about this party..."
					class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent resize-none"
				/>
			</div>

			<p v-if="error" class="text-sm text-red-400">{{ error }}</p>

			<p v-if="!userStore.isLoggedIn" class="text-xs text-ink-mute rounded-lg border border-dashed border-border px-3 py-2">
				You need to be signed in to create a party.
				<RouterLink to="/login" class="text-accent hover:underline">Log in</RouterLink>
			</p>

			<button
				type="submit"
				:disabled="submitting || !userStore.isLoggedIn"
				class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
			>
				{{ submitting ? "Creating…" : "Create party" }}
			</button>
		</form>
	</BaseModal>
</template>
