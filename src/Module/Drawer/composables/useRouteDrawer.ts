import { onUnmounted, watch, type Component } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDrawerStore } from "@/Module/Drawer/store/useDrawerStore";

/**
 * Wires a drawer's open/closed state to a route param, for the detail routes
 * mounted as router children (e.g. `/spells/:id`) — opening tracks the param,
 * closing (backdrop/escape) navigates back to the list route.
 */
export function useRouteDrawer(opts: {
	name: string;
	component: Component;
	listRoute: string;
	position?: "left" | "right";
	width?: string;
	paramKey?: string;
}) {
	const route = useRoute();
	const router = useRouter();
	const drawers = useDrawerStore();
	const paramKey = opts.paramKey ?? "id";

	watch(
		() => String(route.params[paramKey] ?? ""),
		(id) => {
			if (id) {
				drawers.open(opts.name, {
					component: opts.component,
					props: { id },
					...(opts.position ? { position: opts.position } : {}),
					...(opts.width ? { width: opts.width } : {}),
					onClose: () => void router.push({ name: opts.listRoute }),
				});
			} else {
				drawers.close(opts.name, { silent: true });
			}
		},
		{ immediate: true },
	);

	onUnmounted(() => drawers.close(opts.name, { silent: true }));
}
