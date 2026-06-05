<script lang="ts" setup>
defineProps<{ collapsed?: boolean }>();
</script>

<template>
	<div class="brand">
		<div class="brand-mark">D</div>
		<span v-if="!collapsed" class="brand-text">DnD <em>Toolkit</em></span>
	</div>
</template>
