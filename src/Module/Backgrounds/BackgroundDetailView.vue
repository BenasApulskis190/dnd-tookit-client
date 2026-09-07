<script setup lang="ts">
import { useRouteDrawer } from "@/Module/Drawer/composables/useRouteDrawer";
import BackgroundPanel from "@/Module/Backgrounds/BackgroundPanel.vue";

useRouteDrawer({
	name: "background-detail",
	component: BackgroundPanel,
	listRoute: "backgrounds",
	width: "w-[45vw]",
});
</script>

