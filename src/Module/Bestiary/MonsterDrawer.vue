<script setup lang="ts">
import { ref, watch } from "vue";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";

// Reusable monster drawer driven by an id rather than the route — lets any
// list (e.g. an NPC's linked stat block) pop a monster open without
// navigating away, mirroring Spells/SpellDrawer.vue. `offset` lets the caller
// push it flush beside another already-open drawer instead of on top of it.
withDefaults(
	defineProps<{ id: string | null; position?: "left" | "right"; offset?: string }>(),
	{ position: "right", offset: "0px" },
);

const visible = defineModel<boolean>("visible", { default: false });

// Forwarded into MonsterDetails so *its* spell drawer can cascade off this
// panel's actual measured width too, not a guess.
const panelWidth = ref(0);

// `id` is set as soon as the NPC data loads, well before the drawer is ever
// opened, so MonsterDetails can't mount on `id` alone — that fired its fetch
// immediately instead of on click. Mount it only once the drawer has
// actually been opened, then leave it mounted (BaseDrawer hides it visually
// when closed) so re-opening doesn't refetch either.
const hasOpened = ref(false);
watch(
	visible,
	(open) => {
		if (open) hasOpened.value = true;
	},
	{ immediate: true },
);
</script>

<template>
	<BaseDrawer
		v-model:visible="visible"
		:position="position"
		:offset="offset"
		class="w-[45vw]"
		@update:width="(w) => (panelWidth = w)"
	>
		<MonsterDetails v-if="hasOpened && id" :id="id" :offset="offset" :panel-width="panelWidth" />
	</BaseDrawer>
</template>
