<script setup lang="ts">
import { useRouteDrawer } from "@/Module/Drawer/composables/useRouteDrawer";
import RacePanel from "@/Module/Races/RacePanel.vue";

useRouteDrawer({ name: "race-detail", component: RacePanel, listRoute: "races", width: "w-[45vw]" });
</script>

