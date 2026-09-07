<script lang="ts" setup>
import { Tabs } from "@vuetify/v0";

defineProps<{ tabs: { value: string; label: string }[] }>();

const active = defineModel<string>({ required: true });
</script>

<template>
	<Tabs.Root v-model="active" class="contents">
		<Tabs.List class="flex gap-1 border-b border-border">
			<Tabs.Item
				v-for="tab in tabs"
				:key="tab.value"
				:value="tab.value"
				class="border-b-2 border-transparent px-3 py-2 text-sm font-medium text-ink-mute transition-colors hover:text-ink data-[selected]:border-accent data-[selected]:text-ink"
			>
				{{ tab.label }}
			</Tabs.Item>
		</Tabs.List>
		<Tabs.Panel v-for="tab in tabs" :key="tab.value" :value="tab.value">
			<slot :name="tab.value" />
		</Tabs.Panel>
	</Tabs.Root>
</template>
