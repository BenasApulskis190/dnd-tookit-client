<script lang="ts" setup>
import { Dialog } from "@vuetify/v0";

withDefaults(
	defineProps<{
		position?: "left" | "right";
	}>(),
	{ position: "right" },
);

const visible = defineModel<boolean>("visible", { default: false });

defineOptions({ inheritAttrs: false });
</script>

<template>
	<Dialog.Root v-model="visible">
		<Dialog.Content
			v-bind="$attrs"
			:class="[
				'fixed inset-y-0 m-0 h-full max-h-none max-w-none w-full sm:max-w-lg bg-bg-elev p-0 shadow-lg',
				'transition-[transform,opacity,overlay,display] duration-200 ease-out [transition-behavior:allow-discrete]',
				'backdrop:bg-black/50 backdrop:[transition:background-color_200ms_ease-out]',
				position === 'left'
					? 'left-0 right-auto border-r border-border -translate-x-full opacity-0 open:translate-x-0 open:opacity-100 starting:open:-translate-x-full starting:open:opacity-0'
					: 'right-0 left-auto border-l border-border translate-x-full opacity-0 open:translate-x-0 open:opacity-100 starting:open:translate-x-full starting:open:opacity-0',
			]"
		>
			<slot />
		</Dialog.Content>
	</Dialog.Root>
</template>
