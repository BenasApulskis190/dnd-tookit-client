<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";

const route = useRoute();
const router = useRouter();

// Drawer is open whenever this child route (/bestiary/:id) is active; closing
// returns to the list. MonsterDetails reads the id straight from the route.
const visible = computed({
	get: () => Boolean(route.params.id),
	set: (open) => {
		if (!open) void router.push({ name: "bestiary" });
	},
});

// Forwarded into MonsterDetails so a spell it opens cascades off this
// panel's actual measured width.
const panelWidth = ref(0);
</script>

<template>
	<BaseDrawer
		v-model:visible="visible"
		position="right"
		class="w-[45vw]"
		@update:width="(w) => (panelWidth = w)"
	>
		<MonsterDetails :panel-width="panelWidth" />
	</BaseDrawer>
</template>
