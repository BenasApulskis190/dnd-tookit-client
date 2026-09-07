<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import MainLogo from "@/Module/Brand/MainLogo.vue";
import GlobalSearch from "@/Module/GlobalSearch/GlobalSearch.vue";
import { useUserStore } from "@/Module/User/store/useUserStore";

defineProps<{
	collapsed?: boolean;
	toggleCollapse?: () => void;
	toggleSidebar?: () => void;
}>();

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, user } = storeToRefs(userStore);

const searchVisible = ref(false);

function handleSeach() {
	searchVisible.value = true;
}

function onKeydown(e: KeyboardEvent) {
	if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
		e.preventDefault();
		searchVisible.value = !searchVisible.value;
	}
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>

	<GlobalSearch v-model:visible="searchVisible" />
	<MainLogo :collapsed="collapsed" @click="router.push('/')" />

	<nav class="crumbs">
		<span class="crumb-current">{{ route.name ? String(route.name) : "" }}</span>
	</nav>

	<button class="search-trigger" type="button" @click="handleSeach">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
		</svg>
		<span class="search-trigger-text">Search anything…</span>
		<kbd class="search-trigger-kbd"><span>⌘</span><span>K</span></kbd>
	</button>

	<div class="header-actions">
		<RouterLink
			v-if="!isLoggedIn"
			to="/login"
			class="rounded-lg border border-border px-3 py-1.5 text-sm text-ink hover:bg-bg-elev transition-colors"
		>
			Login
		</RouterLink>
		<RouterLink
			v-else
			to="/profile"
			class="rounded-lg border border-border px-3 py-1.5 text-sm text-ink hover:bg-bg-elev transition-colors"
		>
			{{ user?.name ?? "Profile" }}
		</RouterLink>

		<div class="divider-v" />
		<button class="icon-btn menu-btn" type="button" :aria-label="'Open menu'" @click="toggleSidebar?.()">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
			</svg>
		</button>
	</div>
</template>
