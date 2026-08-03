<script lang="ts" setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import type { INpcDetail } from "@/Module/Npcs/types";
import EntryText from "@/Module/Bestiary/EntryText.vue";
import MonsterDrawer from "@/Module/Bestiary/MonsterDrawer.vue";
import { resolveApiUrl } from "@/utils/apiUrl";

const props = withDefaults(defineProps<{ npc: INpcDetail; panelWidth?: number }>(), {
	panelWidth: 0,
});

const tokenUrl = computed(() => resolveApiUrl(props.npc.tokenUrl));
const monster = computed(() => props.npc.monster);

// Opens the stat block in its own right-side drawer, offset by this panel's
// *measured* width (not a guessed vw fraction) minus a small peek so a sliver
// of it stays visible behind the stat block. Its own spells cascade the same
// way in turn (see MonsterDetails' `offset`/`panelWidth` props).
const CASCADE_PEEK_PX = 60;
const monsterDrawerVisible = ref(false);
const monsterOffset = computed(
	() => `${Math.max(props.panelWidth - CASCADE_PEEK_PX, 0)}px`,
);
</script>

<template>
	<article class="h-full space-y-6 overflow-y-auto p-6">
		<header class="flex items-start gap-4">
			<img
				v-if="tokenUrl"
				:src="tokenUrl"
				:alt="npc.name"
				class="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
			/>
			<div class="min-w-0">
				<h2 class="font-display text-3xl leading-tight text-npc">
					{{ npc.name }}
				</h2>
				<p v-if="npc.location" class="mt-1 flex items-center gap-1 text-sm text-ink-mute">
					<span class="text-xs font-semibold uppercase tracking-wide text-ink-faint">
						Location
					</span>
					<span>·</span>
					<span class="italic">{{ npc.location }}</span>
				</p>
				<p class="mt-1 text-xs text-ink-faint">
					{{ npc.source }} ·
					<RouterLink
						:to="{ name: 'adventures-detail', params: { id: npc.adventure.code } }"
						class="underline decoration-dotted underline-offset-2 hover:text-ink"
					>
						{{ npc.adventure.name }}
					</RouterLink>
				</p>
			</div>
		</header>

		<section v-if="npc.appearance" class="space-y-1">
			<p class="text-xs font-semibold uppercase tracking-wide text-ink-faint">
				Appearance
			</p>
			<p class="text-sm text-ink-soft">
				<EntryText :text="npc.appearance" accent="npc" />
			</p>
		</section>

		<section v-if="npc.description" class="space-y-1">
			<p class="text-xs font-semibold uppercase tracking-wide text-ink-faint">
				Description
			</p>
			<p class="text-sm text-ink-soft">
				<EntryText :text="npc.description" accent="npc" />
			</p>
		</section>

		<section v-if="monster" class="space-y-1">
			<p class="text-xs font-semibold uppercase tracking-wide text-ink-faint">
				Stat Block
			</p>
			<div
				class="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-elev2 px-4 py-3"
			>
				<div>
					<p class="font-semibold text-ink">{{ monster.name }}</p>
					<p class="text-xs text-ink-faint">
						{{ monster.monsterType?.name ?? "—" }} · CR {{ monster.challengeRating }}
					</p>
				</div>
				<button
					v-if="monster.id"
					type="button"
					class="shrink-0 rounded bg-npc/15 px-2 py-1 text-xs font-semibold text-npc hover:bg-npc/25"
					@click="monsterDrawerVisible = true"
				>
					View stat block →
				</button>
			</div>
		</section>

		<MonsterDrawer
			v-model:visible="monsterDrawerVisible"
			:id="monster?.id ?? null"
			position="right"
			:offset="monsterOffset"
		/>
	</article>
</template>
