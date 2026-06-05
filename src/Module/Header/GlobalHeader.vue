<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import MainLogo from "@/Module/Brand/MainLogo.vue";

defineProps<{
	collapsed?: boolean;
	toggleCollapse?: () => void;
	toggleSidebar?: () => void;
}>();

const route = useRoute();
const router = useRouter();
</script>

<template>
	<MainLogo :collapsed="collapsed" @click="router.push('/')" />

	<nav class="crumbs">
		<span class="crumb-current">{{ route.name ? String(route.name) : "" }}</span>
	</nav>

	<button class="search-trigger" type="button">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
		</svg>
		<span class="search-trigger-text">Search anything…</span>
		<kbd class="search-trigger-kbd"><span>⌘</span><span>K</span></kbd>
	</button>

	<div class="header-actions">
		<div class="divider-v" />
		<button class="icon-btn menu-btn" type="button" :aria-label="'Open menu'" @click="toggleSidebar?.()">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
			</svg>
		</button>
	</div>
</template>
