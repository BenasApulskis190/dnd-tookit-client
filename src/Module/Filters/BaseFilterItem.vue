<script lang="ts" setup>
const props = defineProps<{
	name: string;
	id: string;
	isActive: boolean;
}>();
</script>

<template>
	<div
		class="cursor-pointer select-none rounded-md border px-3 py-1 text-sm transition-colors"
		:class="
			isActive
				? 'border-primary text-primary bg-primary/10'
				: 'border-border text-content-muted hover:border-border-strong hover:text-content'
		"
	>
		{{ name }}
	</div>
</template>
