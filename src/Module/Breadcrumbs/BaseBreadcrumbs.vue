<script lang="ts" setup>
import { RouterLink, type RouteLocationRaw } from "vue-router";

export interface Breadcrumb {
	label: string;
	to?: RouteLocationRaw;
}

defineProps<{
	items: Breadcrumb[];
}>();
</script>

<template>
	<nav class="mb-4 flex items-center gap-1.5 text-xs text-ink-mute" aria-label="Breadcrumb">
		<RouterLink
			:to="{ name: 'dashboard' }"
			class="hover:text-ink transition-colors"
			aria-label="Home"
		>
			⌂
		</RouterLink>

		<template v-for="(item, index) in items" :key="index">
			<span class="text-ink-faint">›</span>
			<RouterLink
				v-if="item.to && index !== items.length - 1"
				:to="item.to"
				class="truncate max-w-[16rem] hover:text-ink transition-colors"
			>
				{{ item.label }}
			</RouterLink>
			<span v-else class="truncate max-w-[16rem] text-ink" :aria-current="index === items.length - 1 ? 'page' : undefined">
				{{ item.label }}
			</span>
		</template>
	</nav>
</template>
