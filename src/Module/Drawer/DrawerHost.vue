<script lang="ts" setup>
import { computed, onUnmounted, watch } from "vue";
import { onKeyStroke, useScrollLock } from "@vueuse/core";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";
import BaseDrawer from "@/Module/Drawer/BaseDrawer.vue";

const drawers = useDrawerStore();

onKeyStroke("Escape", () => {
	if (drawers.topName) drawers.close(drawers.topName);
});

const hasOpenDrawers = computed(() => drawers.stack.some((instance) => !instance.closing));

const scrollLocked = useScrollLock(document.body);
watch(hasOpenDrawers, (locked) => (scrollLocked.value = locked), { immediate: true });

// Native `<dialog>` used to keep the rest of the app out of the tab order for
// free; plain fixed `<div>`s don't, so mirror it by hand while any drawer is open.
watch(
	hasOpenDrawers,
	(inert) => {
		document.getElementById("app")?.toggleAttribute("inert", inert);
	},
	{ immediate: true },
);

onUnmounted(() => {
	document.getElementById("app")?.removeAttribute("inert");
});
</script>

<template>
	<BaseDrawer v-for="instance in drawers.stack" :key="instance.name" :instance="instance" />
</template>
