<script lang="ts" setup>
import BaseTitle from "@/Module/BaseTitle/BaseTitle.vue";
import { ref } from "vue";

const collapsed = ref(false);
const sidebarOpen = ref(false);

const toggleCollapse = () => { collapsed.value = !collapsed.value; };
const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };
const closeSidebar = () => { sidebarOpen.value = false; };

defineSlots<{
	header(props: { collapsed: boolean; toggleCollapse: () => void; toggleSidebar: () => void }): void;
	sidebar(props: { collapsed: boolean; close: () => void }): void;
	default(): void;
}>();
</script>

<template>
	<div
		class="app"
		:style="collapsed ? { '--sidebar-w': '56px' } : {}"
	>
		<header class="app-header">
			<slot
				name="header"
				:collapsed="collapsed"
				:toggle-collapse="toggleCollapse"
				:toggle-sidebar="toggleSidebar"
			/>
		</header>

		<aside class="app-sidebar" :class="{ 'is-open': sidebarOpen }">
			<slot name="sidebar" :collapsed="collapsed" :close="closeSidebar" />

			<button
				class="absolute bottom-4 right-3 p-1.5 rounded text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--bg-elev-2)] transition-colors text-xs leading-none"
				:title="collapsed ? 'Expand' : 'Collapse'"
				@click="toggleCollapse"
			>
				{{ collapsed ? '›' : '‹' }}
			</button>
		</aside>

		<div
			class="sidebar-backdrop"
			:class="{ 'is-open': sidebarOpen }"
			@click="closeSidebar"
		/>

		<main class="app-main p-4">
			<BaseTitle />
			<slot />
		</main>
	</div>
</template>
