<script lang="ts" setup>
withDefaults(defineProps<{ imageUrl?: string | null; name: string; size?: "sm" | "md" }>(), {
	size: "sm",
});
</script>

<template>
	<img
		v-if="imageUrl"
		:src="imageUrl"
		:alt="name"
		class="shrink-0 rounded-full object-cover"
		:class="size === 'sm' ? 'w-8 h-8' : 'w-12 h-12'"
	/>
	<div
		v-else
		class="shrink-0 rounded-full bg-bg-elev2 border border-border flex items-center justify-center font-display text-ink-mute"
		:class="size === 'sm' ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-base'"
	>
		{{ name.charAt(0).toUpperCase() }}
	</div>
</template>
