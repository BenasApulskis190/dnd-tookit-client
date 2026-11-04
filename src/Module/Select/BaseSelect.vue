<script lang="ts" setup generic="T extends string">
import { Select } from "@vuetify/v0";

import { computed } from "vue";

const props = defineProps<{
	options: { id: string; value: T; label: string }[];
	placeholder?: string;
}>();

const modelValue = defineModel<T | undefined>();

// Select.Value only exposes the raw value, so look up the option's label.
const selectedLabel = computed(() => props.options.find((o) => o.value === modelValue.value)?.label);
</script>

<template>
	<Select.Root v-model="modelValue">
		<Select.Activator
			class="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm text-ink cursor-pointer focus:outline-none data-[open=true]:border-accent"
		>
			<Select.Value v-slot="{ selectedValue }" class="truncate">{{ selectedLabel ?? selectedValue }}</Select.Value>
			<Select.Placeholder class="truncate text-ink-faint">{{ placeholder ?? "Select…" }}</Select.Placeholder>
			<Select.Cue class="shrink-0 text-ink-faint text-xs">▾</Select.Cue>
		</Select.Activator>

		<Select.Content
			class="max-h-60 overflow-y-auto rounded-lg border border-border bg-bg-elev shadow-lg py-1"
			:style="{ minWidth: 'anchor-size(width)' }"
		>
			<Select.Item
				v-for="option in options"
				:key="option.id"
				:id="option.id"
				:value="option.value"
				class="cursor-pointer px-3 py-1.5 text-sm text-ink data-[highlighted]:bg-bg-elev2 data-[selected=true]:text-accent data-[selected=true]:font-medium"
			>
				{{ option.label }}
			</Select.Item>
		</Select.Content>
	</Select.Root>
</template>
