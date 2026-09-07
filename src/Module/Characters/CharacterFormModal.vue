<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { isAxiosError } from "axios";
import { useCharacterStore } from "@/Module/Characters/store/useCharacterStore";
import { usePartyStore } from "@/Module/Party/store/usePartyStore";
import { useUserStore } from "@/Module/User/store/useUserStore";
import { racesApi } from "@/Module/Races/api/racesApi";
import { classesApi } from "@/Module/Classes/api/classesApi";
import { backgroundsApi } from "@/Module/Backgrounds/api/backgroundsApi";
import { readAvatarFile } from "@/Module/Characters/util/avatar";
import CharacterAvatar from "@/Module/Characters/CharacterAvatar.vue";
import BaseModal from "@/Module/Modal/BaseModal.vue";
import type { ICharacter } from "@/Module/Characters/types";

const props = defineProps<{ partyId?: string; character?: ICharacter }>();

const visible = defineModel<boolean>("visible", { default: false });

const isEditing = computed(() => !!props.character);

const characterStore = useCharacterStore();
const partyStore = usePartyStore();
const userStore = useUserStore();

const { data: racesData } = useQuery({
	queryKey: ["races", { limit: 100 }],
	queryFn: () => racesApi.getAll({ limit: 100 }),
});
const { data: classesData } = useQuery({
	queryKey: ["classes", { limit: 100 }],
	queryFn: () => classesApi.getAll({ limit: 100 }),
});
const { data: backgroundsData } = useQuery({
	queryKey: ["backgrounds", { limit: 100 }],
	queryFn: () => backgroundsApi.getAll({ limit: 100 }),
});

const races = computed(() => (racesData.value && !isAxiosError(racesData.value) ? racesData.value.data : []));
const classes = computed(() =>
	classesData.value && !isAxiosError(classesData.value) ? classesData.value.data : [],
);
const backgrounds = computed(() =>
	backgroundsData.value && !isAxiosError(backgroundsData.value) ? backgroundsData.value.data : [],
);
const parties = computed(() =>
	partyStore.data && !isAxiosError(partyStore.data) ? partyStore.data.data : [],
);

const buildForm = () => {
	const c = props.character;
	return {
		name: c?.name ?? "",
		playerName: c?.playerName ?? "",
		level: c?.level ?? 1,
		raceId: c?.raceId ?? "",
		classId: c?.classId ?? "",
		backgroundId: c?.backgroundId ?? "",
		armorClass: c?.armorClass ?? null,
		currentHp: c?.currentHp ?? (null as number | null),
		maxHp: c?.maxHp ?? (null as number | null),
		strScore: c?.strScore ?? 10,
		dexScore: c?.dexScore ?? 10,
		conScore: c?.conScore ?? 10,
		intScore: c?.intScore ?? 10,
		wisScore: c?.wisScore ?? 10,
		chaScore: c?.chaScore ?? 10,
		passivePerception: c?.passivePerception ?? (null as number | null),
		passiveInvestigation: c?.passiveInvestigation ?? (null as number | null),
		passiveInsight: c?.passiveInsight ?? (null as number | null),
		imageUrl: c?.imageUrl ?? (null as string | null),
		partyId: c?.partyId ?? props.partyId ?? "",
		notes: c?.notes ?? "",
	};
};

const form = reactive(buildForm());
const error = ref("");
const avatarError = ref("");
const submitting = ref(false);

watch(visible, (isVisible) => {
	if (isVisible) {
		Object.assign(form, buildForm());
		error.value = "";
		avatarError.value = "";
		submitting.value = false;
	}
});

async function onAvatarChange(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	if (!file) return;

	avatarError.value = "";

	try {
		form.imageUrl = await readAvatarFile(file);
	} catch (e) {
		avatarError.value = e instanceof Error ? e.message : "Failed to read image.";
	} finally {
		input.value = "";
	}
}

function clearAvatar() {
	form.imageUrl = null;
}

async function submit() {
	if (!form.name.trim()) {
		error.value = "Character name is required.";
		return;
	}

	submitting.value = true;
	error.value = "";

	const payload = {
		name: form.name.trim(),
		playerName: form.playerName.trim() || undefined,
		level: form.level || undefined,
		raceId: form.raceId || undefined,
		classId: form.classId || undefined,
		backgroundId: form.backgroundId || undefined,
		armorClass: form.armorClass ?? undefined,
		currentHp: form.currentHp ?? form.maxHp ?? undefined,
		maxHp: form.maxHp ?? undefined,
		strScore: form.strScore,
		dexScore: form.dexScore,
		conScore: form.conScore,
		intScore: form.intScore,
		wisScore: form.wisScore,
		chaScore: form.chaScore,
		passivePerception: form.passivePerception ?? undefined,
		passiveInvestigation: form.passiveInvestigation ?? undefined,
		passiveInsight: form.passiveInsight ?? undefined,
		imageUrl: form.imageUrl ?? undefined,
		partyId: form.partyId || null,
		notes: form.notes.trim() || undefined,
	};

	try {
		if (props.character) {
			await characterStore.update(props.character.id, payload);
		} else {
			await characterStore.create(payload);
		}
		visible.value = false;
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Failed to save character.";
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<BaseModal v-model:visible="visible" size="lg">
		<template #header>
			<h3 class="font-display text-lg text-ink">{{ isEditing ? "Edit character" : "Create character" }}</h3>
		</template>

		<form class="flex flex-1 min-h-0 flex-col gap-4 p-4 overflow-y-auto" @submit.prevent="submit">
			<div class="flex items-center gap-3">
				<CharacterAvatar :image-url="form.imageUrl" :name="form.name || '?'" size="md" />

				<div class="flex flex-col gap-1">
					<div class="flex items-center gap-2">
						<label
							for="char-avatar"
							class="cursor-pointer text-xs font-medium text-accent hover:underline"
						>
							{{ form.imageUrl ? "Change avatar" : "Upload avatar" }}
						</label>
						<button v-if="form.imageUrl" type="button" class="text-xs text-ink-faint hover:text-red-400" @click="clearAvatar">
							Remove
						</button>
					</div>
					<input id="char-avatar" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
					<p v-if="avatarError" class="text-xs text-red-400">{{ avatarError }}</p>
					<p v-else class="text-[11px] text-ink-faint">PNG or JPG, up to 1.5MB.</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div class="col-span-2 sm:col-span-1">
					<label for="char-name" class="block text-xs text-ink-mute mb-1.5">Name *</label>
					<input
						id="char-name"
						v-model="form.name"
						type="text"
						placeholder="Elandrin Nightsong"
						required
						autofocus
						class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
					/>
				</div>

				<div class="col-span-2 sm:col-span-1">
					<label for="char-player" class="block text-xs text-ink-mute mb-1.5">Player name</label>
					<input
						id="char-player"
						v-model="form.playerName"
						type="text"
						placeholder="Optional"
						class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
					/>
				</div>

				<div>
					<label for="char-race" class="block text-xs text-ink-mute mb-1.5">Race</label>
					<select
						id="char-race"
						v-model="form.raceId"
						class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
					>
						<option value="">—</option>
						<option v-for="race in races" :key="race.id" :value="race.id">{{ race.name }}</option>
					</select>
				</div>

				<div>
					<label for="char-class" class="block text-xs text-ink-mute mb-1.5">Class</label>
					<select
						id="char-class"
						v-model="form.classId"
						class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
					>
						<option value="">—</option>
						<option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
					</select>
				</div>

				<div>
					<label for="char-background" class="block text-xs text-ink-mute mb-1.5">Background</label>
					<select
						id="char-background"
						v-model="form.backgroundId"
						class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
					>
						<option value="">—</option>
						<option v-for="bg in backgrounds" :key="bg.id" :value="bg.id">{{ bg.name }}</option>
					</select>
				</div>

				<div>
					<label for="char-level" class="block text-xs text-ink-mute mb-1.5">Level</label>
					<input
						id="char-level"
						v-model.number="form.level"
						type="number"
						min="1"
						max="20"
						class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
					/>
				</div>
			</div>

			<div>
				<p class="block text-xs text-ink-mute mb-1.5">Combat stats</p>
				<div class="grid grid-cols-3 gap-2">
					<div>
						<label for="char-ac" class="block text-[10px] uppercase text-ink-faint mb-1">Armor class</label>
						<input id="char-ac" v-model.number="form.armorClass" type="number" min="0" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-max-hp" class="block text-[10px] uppercase text-ink-faint mb-1">Max HP</label>
						<input id="char-max-hp" v-model.number="form.maxHp" type="number" min="0" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-current-hp" class="block text-[10px] uppercase text-ink-faint mb-1">Current HP</label>
						<input id="char-current-hp" v-model.number="form.currentHp" type="number" min="0" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
				</div>
			</div>

			<div>
				<p class="block text-xs text-ink-mute mb-1.5">Ability scores</p>
				<div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
					<div>
						<label for="char-str" class="block text-[10px] uppercase text-ink-faint mb-1">Str</label>
						<input id="char-str" v-model.number="form.strScore" type="number" min="1" max="30" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-dex" class="block text-[10px] uppercase text-ink-faint mb-1">Dex</label>
						<input id="char-dex" v-model.number="form.dexScore" type="number" min="1" max="30" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-con" class="block text-[10px] uppercase text-ink-faint mb-1">Con</label>
						<input id="char-con" v-model.number="form.conScore" type="number" min="1" max="30" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-int" class="block text-[10px] uppercase text-ink-faint mb-1">Int</label>
						<input id="char-int" v-model.number="form.intScore" type="number" min="1" max="30" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-wis" class="block text-[10px] uppercase text-ink-faint mb-1">Wis</label>
						<input id="char-wis" v-model.number="form.wisScore" type="number" min="1" max="30" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-cha" class="block text-[10px] uppercase text-ink-faint mb-1">Cha</label>
						<input id="char-cha" v-model.number="form.chaScore" type="number" min="1" max="30" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
				</div>
			</div>

			<div>
				<p class="block text-xs text-ink-mute mb-1.5">General info</p>
				<div class="grid grid-cols-3 gap-2">
					<div>
						<label for="char-passive-perception" class="block text-[10px] uppercase text-ink-faint mb-1">Passive perception</label>
						<input id="char-passive-perception" v-model.number="form.passivePerception" type="number" min="0" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-passive-investigation" class="block text-[10px] uppercase text-ink-faint mb-1">Passive investigation</label>
						<input id="char-passive-investigation" v-model.number="form.passiveInvestigation" type="number" min="0" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
					<div>
						<label for="char-passive-insight" class="block text-[10px] uppercase text-ink-faint mb-1">Passive insight</label>
						<input id="char-passive-insight" v-model.number="form.passiveInsight" type="number" min="0" class="w-full rounded-lg border border-border bg-bg-elev px-2 py-1.5 text-sm text-ink text-center focus:outline-none focus:border-accent" />
					</div>
				</div>
			</div>

			<div>
				<label for="char-party" class="block text-xs text-ink-mute mb-1.5">Party</label>
				<select
					id="char-party"
					v-model="form.partyId"
					class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
				>
					<option value="">Unassigned</option>
					<option v-for="party in parties" :key="party.id" :value="party.id">{{ party.name }}</option>
				</select>
			</div>

			<div>
				<label for="char-notes" class="block text-xs text-ink-mute mb-1.5">Notes</label>
				<textarea
					id="char-notes"
					v-model="form.notes"
					rows="2"
					placeholder="Optional notes..."
					class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent resize-none"
				/>
			</div>

			<p v-if="error" class="text-sm text-red-400">{{ error }}</p>

			<p v-if="!userStore.isLoggedIn" class="text-xs text-ink-mute rounded-lg border border-dashed border-border px-3 py-2">
				You need to be signed in to {{ isEditing ? "edit this" : "create a" }} character.
				<RouterLink to="/login" class="text-accent hover:underline">Log in</RouterLink>
			</p>

			<button
				type="submit"
				:disabled="submitting || !userStore.isLoggedIn"
				class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
			>
				{{ submitting ? "Saving…" : isEditing ? "Save changes" : "Create character" }}
			</button>
		</form>
	</BaseModal>
</template>
