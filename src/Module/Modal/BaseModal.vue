<script lang="ts" setup>
import { Dialog } from "@vuetify/v0";

withDefaults(
	defineProps<{
		size?: "full-screen" | "lg" | "md" | "sm";
	}>(),
	{ size: "md" },
);

const visible = defineModel<boolean>("visible", { default: false });

defineOptions({ inheritAttrs: false });

const sizeClasses: Record<"full-screen" | "lg" | "md" | "sm", string> = {
	sm: "max-w-sm w-full max-h-[85vh] rounded-xl",
	md: "max-w-xl w-full max-h-[85vh] rounded-xl",
	lg: "max-w-3xl w-full max-h-[85vh] rounded-xl",
	"full-screen": "w-full h-full max-w-none max-h-none rounded-none",
};
</script>

<template>
	<Dialog.Root v-model="visible">
		<Dialog.Content
			v-bind="$attrs"
			:class="[
				'fixed inset-0 m-auto hidden open:flex flex-col overflow-hidden bg-[#15161d]/80 p-0 font-mono text-ink shadow-lg backdrop-blur-2xl border border-border/60',
				'transition-[transform,opacity,overlay,display] duration-200 ease-out [transition-behavior:allow-discrete]',
				'backdrop:bg-black/50 backdrop:[transition:background-color_200ms_ease-out]',
				'scale-95 opacity-0 open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0',
				sizeClasses[size],
			]"
		>
			<div class="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/60 p-4">
				<slot name="header" />
				<Dialog.Close
					class="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-bg-elev2 hover:text-ink"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M18 6 6 18" /><path d="m6 6 12 12" />
					</svg>
				</Dialog.Close>
			</div>
			<slot />
		</Dialog.Content>
	</Dialog.Root>
</template>
