<script setup lang="ts">
import { useRouteDrawer } from "@/Module/Drawer/composables/useRouteDrawer";
import NpcPanel from "@/Module/Npcs/NpcPanel.vue";

useRouteDrawer({ name: "npc-detail", component: NpcPanel, listRoute: "npcs", width: "w-[45vw]" });
</script>

