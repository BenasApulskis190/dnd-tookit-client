<script setup lang="ts">
import { useRouteDrawer } from "@/Module/Drawer/composables/useRouteDrawer";
import ConditionPanel from "@/Module/Conditions/ConditionPanel.vue";

useRouteDrawer({
	name: "condition-detail",
	component: ConditionPanel,
	listRoute: "conditions",
	width: "w-[45vw]",
});
</script>


<template>
	<!-- Renders through DrawerHost, not here. -->
</template>
