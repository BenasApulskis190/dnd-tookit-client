<script setup lang="ts">
import { useRouteDrawer } from "@/Module/Drawer/composables/useRouteDrawer";
import FeatPanel from "@/Module/Feats/FeatPanel.vue";

useRouteDrawer({ name: "feat-detail", component: FeatPanel, listRoute: "feats", width: "w-[45vw]" });
</script>

