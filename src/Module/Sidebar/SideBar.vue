<script lang="ts" setup>
import { computed } from "vue";
import { routes } from "@/router";
import { PageCategories } from "@/type";

defineProps<{ collapsed?: boolean; close?: () => void }>();

const sections = computed(() => {
	const navRoutes = routes.filter((r) => !r.meta?.hideFromNav && r.meta?.glyph);

	return Object.entries(PageCategories)
		.map(([key, label]) => ({
			label,
			items: navRoutes.filter((r) => r.meta?.category === key),
		}))
		.filter((section) => section.items.length > 0);
});
</script>

<template>
	<div class="flex flex-col h-full pb-10">
		<div v-for="section in sections" :key="section.label">
			<div v-if="!collapsed" class="sidebar-section">{{ section.label }}</div>
			<div v-else class="py-3" />

			<RouterLink
				v-for="item in section.items"
				:key="String(item.name)"
				:to="item.path"
				class="nav-item"
				:active-class="item.path === '/' ? '' : 'is-active'"
				:exact-active-class="item.path === '/' ? 'is-active' : ''"
				:style="{ '--cat': item.meta?.color }"
				:title="collapsed ? String(item.name) : undefined"
				@click="close?.()"
			>
				<span class="nav-glyph">{{ item.meta?.glyph }}</span>
				<span v-if="!collapsed" class="truncate">{{ String(item.name) }}</span>
			</RouterLink>
		</div>
	</div>
</template>
