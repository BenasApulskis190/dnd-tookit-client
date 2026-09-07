<script lang="ts" setup>
withDefaults(defineProps<{ size?: number }>(), { size: 16 });
</script>

<template>
	<svg
		:width="size"
		:height="size"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.4"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M12 1.6 22 7.4v9.2L12 22.4 2 16.6V7.4z" />
		<path d="M12 1.6 6.6 10h10.8z" />
		<path d="M6.6 10 2 7.4M17.4 10 22 7.4M6.6 10v6.6L12 22.4l5.4-5.8V10" />
	</svg>
</template>
