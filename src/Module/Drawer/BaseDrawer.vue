<script lang="ts" setup>
import { computed, useTemplateRef, watch } from "vue";
import { useElementSize, useMediaQuery } from "@vueuse/core";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";
import { useTopDialogTarget } from "@/Module/Drawer/composables/useTopDialogTarget";
import type { IDrawerInstance } from "@/Module/Drawer/types";

const props = defineProps<{ instance: IDrawerInstance }>();

const drawers = useDrawerStore();

// Teleport into the open BaseModal dialog (if any) instead of `body` — see
// useTopDialogTarget for why a plain `body` teleport would render behind it.
const topDialog = useTopDialogTarget();
const teleportTarget = computed(() => topDialog.value ?? "body");

const isTop = computed(() => drawers.topName === props.instance.name);

// A closing instance is already out of the store's active stack (see
// useDrawerStore), so it holds its last position/z-index until its leave
// transition finishes instead of snapping to a recomputed one.
const zIndex = computed(() =>
	props.instance.closing ? props.instance.frozenZIndex : drawers.zIndexOf(props.instance.name),
);

// Below `sm` every drawer is already full-width (see the `w-full sm:...`
// convention on `width`), so cascaded drawers stack flush on top of each
// other instead of shoving each other off-screen.
const isDesktop = useMediaQuery("(min-width: 640px)");
const offset = computed(() => {
	if (!isDesktop.value) return "0px";
	const px = props.instance.closing ? props.instance.frozenOffsetPx : drawers.offsetOf(props.instance.name);
	return `${px}px`;
});

const panel = useTemplateRef<HTMLDivElement>("panel");
const { width } = useElementSize(panel);
watch(width, (w) => drawers.setWidth(props.instance.name, w), { immediate: true });

function close() {
	drawers.close(props.instance.name);
}

function finalizeClose() {
	drawers.finalizeClose(props.instance.name);
}
</script>

<template>
	<Teleport :to="teleportTarget">
		<Transition
			enter-active-class="transition-opacity duration-200 ease-out"
			enter-from-class="opacity-0"
			leave-active-class="transition-opacity duration-200 ease-out"
			leave-to-class="opacity-0"
		>
			<div
				v-if="instance.backdrop && !instance.closing"
				class="fixed inset-0 bg-black/50"
				:style="{ zIndex: zIndex - 1 }"
				@click="close"
			/>
		</Transition>
		<Transition
			appear
			enter-active-class="transition-[transform,opacity] duration-200 ease-out"
			:enter-from-class="instance.position === 'left' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'"
			leave-active-class="transition-[transform,opacity] duration-200 ease-out"
			:leave-to-class="instance.position === 'left' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'"
			@after-leave="finalizeClose"
		>
			<div
				v-if="!instance.closing"
				ref="panel"
				:inert="!isTop"
				class="fixed inset-y-0 h-full bg-bg-elev shadow-lg transition-[left,right] duration-200 ease-out"
				:class="[
					instance.width,
					instance.position === 'left' ? 'left-0 border-r border-border' : 'right-0 border-l border-border',
				]"
				:style="[instance.position === 'left' ? { left: offset } : { right: offset }, { zIndex }]"
			>
				<component :is="instance.component" v-bind="instance.props" />
			</div>
		</Transition>
	</Teleport>
</template>
