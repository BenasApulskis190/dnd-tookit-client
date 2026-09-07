<script setup lang="ts">
import { useRouteDrawer } from "@/Module/Drawer/composables/useRouteDrawer";
import MonsterDetails from "@/Module/Bestiary/MonsterDetails.vue";

useRouteDrawer({
	name: "monster-detail",
	component: MonsterDetails,
	listRoute: "bestiary",
	width: "w-[45vw]",
});
</script>

