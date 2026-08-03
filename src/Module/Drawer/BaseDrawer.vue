<script lang="ts" setup>
import { computed, useTemplateRef, watch } from "vue";
import { Dialog } from "@vuetify/v0";
import { useElementSize, useMediaQuery } from "@vueuse/core";

const props = withDefaults(
	defineProps<{
		position?: "left" | "right";
		/**
		 * Pushes the drawer off its screen edge by this much (e.g. `"512px"`) —
		 * lets a second drawer sit flush beside a first one instead of
		 * directly on top of it. Pass the first drawer's *measured* width
		 * (from its `update:width` emit), not a guessed viewport fraction —
		 * the rendered width depends on the `sm:max-w-lg` cap and whatever
		 * width class the caller layers on top, which isn't a fixed vw value.
		 * Ignored below the `sm` breakpoint (see `isDesktop` below), where the
		 * drawer is already full-width and stacking side-by-side isn't viable.
		 */
		offset?: string;
	}>(),
	{ position: "right", offset: "0px" },
);

const emit = defineEmits<{ "update:width": [width: number] }>();

const visible = defineModel<boolean>("visible", { default: false });

// Matches the `sm:max-w-lg` breakpoint below — on narrow screens the drawer
// is full-width already, so cascaded drawers should stack flush on top of
// each other instead of shoving each other off-screen.
const isDesktop = useMediaQuery("(min-width: 640px)");
const effectiveOffset = computed(() => (isDesktop.value ? props.offset : "0px"));

// Reports this drawer's actual rendered width so a drawer opened on top of
// it can offset by the real value instead of a guessed one.
const panel = useTemplateRef<HTMLDivElement>("panel");
const { width } = useElementSize(panel);
watch(width, (w) => emit("update:width", w));

defineOptions({ inheritAttrs: false });
</script>

<template>
	<Dialog.Root v-model="visible">
		<Dialog.Content
			v-bind="$attrs"
			:style="position === 'left' ? { left: effectiveOffset } : { right: effectiveOffset }"
			:class="[
				'fixed inset-y-0 m-0 h-full max-h-none max-w-none w-full sm:max-w-lg bg-bg-elev p-0 shadow-lg',
				'transition-[transform,opacity,overlay,display] duration-200 ease-out [transition-behavior:allow-discrete]',
				'backdrop:bg-black/50 backdrop:[transition:background-color_200ms_ease-out]',
				position === 'left'
					? 'left-0 right-auto border-r border-border -translate-x-full opacity-0 open:translate-x-0 open:opacity-100 starting:open:-translate-x-full starting:open:opacity-0'
					: 'right-0 left-auto border-l border-border translate-x-full opacity-0 open:translate-x-0 open:opacity-100 starting:open:translate-x-full starting:open:opacity-0',
			]"
		>
			<div ref="panel" class="h-full">
				<slot />
			</div>
		</Dialog.Content>
	</Dialog.Root>
</template>
