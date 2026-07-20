<script lang="ts" setup>
import { Pagination } from "@vuetify/v0";
import { computed } from "vue";

const props = defineProps<{
	rows: number;
	totalRecords: number;
	first: number;
}>();

const emit = defineEmits<{
	page: [payload: { page: number }];
}>();

const page = computed({
	get: () => Math.floor(props.first / props.rows) + 1,
	set: (value: number) => emit("page", { page: value - 1 }),
});
</script>

<template>
	<div class="sticky bottom-0 z-10 border-t border-border-soft bg-bg/85 py-2 backdrop-blur-sm">
		<Pagination.Root
			v-slot="{ items }"
			v-model="page"
			class="flex items-center justify-center gap-1"
			:size="totalRecords"
			:items-per-page="rows"
			:total-visible="5"
		>
			<Pagination.Prev
				class="px-2 py-1 rounded text-sm text-ink-mute hover:text-ink data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed"
			>
				‹
			</Pagination.Prev>

			<template v-for="(item, index) in items" :key="index">
				<Pagination.Ellipsis
					v-if="item.type === 'ellipsis'"
					class="px-2 text-ink-faint"
				>
					…
				</Pagination.Ellipsis>
				<Pagination.Item
					v-else
					:value="item.value"
					class="px-3 py-1 rounded text-sm text-ink-mute hover:text-ink data-[selected]:bg-accent/20 data-[selected]:text-ink"
				>
					{{ item.value }}
				</Pagination.Item>
			</template>

			<Pagination.Next
				class="px-2 py-1 rounded text-sm text-ink-mute hover:text-ink data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed"
			>
				›
			</Pagination.Next>
		</Pagination.Root>
	</div>
</template>
