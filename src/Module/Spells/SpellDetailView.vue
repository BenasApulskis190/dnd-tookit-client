<script setup lang="ts">
import { useRouteDrawer } from "@/Module/Drawer/composables/useRouteDrawer";
import SpellPanel from "@/Module/Spells/SpellPanel.vue";

useRouteDrawer({ name: "spell-detail", component: SpellPanel, listRoute: "spells", width: "w-[45vw]" });
</script>

