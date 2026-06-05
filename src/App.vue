<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { PageLayouts, type PageLayoutKey } from "@/type";
import SideBar from "@/Module/Sidebar/SideBar.vue";
import GlobalHeader from "@/Module/Header/GlobalHeader.vue";

const route = useRoute();

const layout = computed<PageLayoutKey>(() => {
	return (route.meta.layout ?? "default") as PageLayoutKey;
});

const layoutComponent = computed(() => PageLayouts[layout.value]);
</script>

<template>
	<component :is="layoutComponent">
		<template #header="{ collapsed, toggleCollapse, toggleSidebar }">
			<GlobalHeader
				:collapsed="collapsed"
				:toggle-collapse="toggleCollapse"
				:toggle-sidebar="toggleSidebar"
			/>
		</template>
		<template #sidebar="{ collapsed, close }">
			<SideBar :collapsed="collapsed" :close="close" />
		</template>
		<RouterView />
	</component>
</template>
