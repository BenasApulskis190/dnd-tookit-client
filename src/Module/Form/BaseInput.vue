<script lang="ts" setup>
import { Input, NumberField } from "@vuetify/v0";

defineProps<{
	inputType: "text" | "number";
}>();

defineOptions({ inheritAttrs: false });
</script>

<template>
	<NumberField.Root
		v-if="inputType === 'number'"
		v-bind="$attrs"
		class="inline-flex items-stretch rounded-lg border border-border bg-bg-elev overflow-hidden"
	>
		<NumberField.Decrement class="px-2 text-ink-mute hover:text-ink">−</NumberField.Decrement>
		<NumberField.Control
			class="w-full min-w-0 bg-transparent px-2 py-1.5 text-sm text-ink text-center focus:outline-none"
		/>
		<NumberField.Increment class="px-2 text-ink-mute hover:text-ink">+</NumberField.Increment>
	</NumberField.Root>

	<Input.Root v-if="inputType === 'text'" v-bind="$attrs">
		<Input.Control
			class="w-full rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
		/>
	</Input.Root>
</template>
