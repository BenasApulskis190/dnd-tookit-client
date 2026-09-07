<script setup lang="ts">
import { useRouteDrawer } from "@/Module/Drawer/composables/useRouteDrawer";
import ItemPanel from "@/Module/Items/ItemPanel.vue";

useRouteDrawer({ name: "item-detail", component: ItemPanel, listRoute: "items", width: "w-[45vw]" });
</script>

