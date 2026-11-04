import type { IDrawerConfig, IDrawerInstance } from "@/Module/Drawer/types";
import { defineStore } from "pinia";
import { useWindowSize } from "@vueuse/core";
import { computed, markRaw, reactive } from "vue";

const BASE_Z_INDEX = 1000;
const Z_INDEX_STEP = 10;
/** Sliver of page kept visible beside the deepest drawer in a cascade. */
const MIN_EDGE_GAP = 16;

export const useDrawerStore = defineStore("drawerStore", () => {
	const stack = reactive<IDrawerInstance[]>([]);
	const { width: viewportWidth } = useWindowSize();
	const resolvers = new Map<string, () => void>();

	// Closing instances are dropped from all of these so the rest of the stack
	// reflows immediately, while the closing one keeps rendering (frozen at its
	// last position) until BaseDrawer's leave transition finishes.
	const activeStack = computed(() => stack.filter((instance) => !instance.closing));

	const topName = computed(() => activeStack.value[activeStack.value.length - 1]?.name);

	function isOpen(name: string) {
		return activeStack.value.some((instance) => instance.name === name);
	}

	function indexOf(name: string) {
		return activeStack.value.findIndex((instance) => instance.name === name);
	}

	function zIndexOf(name: string) {
		const index = indexOf(name);
		return index === -1 ? BASE_Z_INDEX : BASE_Z_INDEX + index * Z_INDEX_STEP;
	}

	function offsetOf(name: string) {
		const index = indexOf(name);
		const instance = index === -1 ? undefined : activeStack.value[index];
		if (!instance) return 0;

		const peers = activeStack.value.filter((entry) => entry.position === instance.position);
		const rawOffsetAt = (depth: number) =>
			peers.slice(0, depth).reduce((sum, earlier) => sum + earlier.widthPx, 0);

		const raw = rawOffsetAt(peers.indexOf(instance));

		// The deepest peer sets how far the cascade spreads. Once stacking it at
		// full width would push it past the far edge (3+ drawers on a narrow
		// viewport), compress every offset by the same factor so the whole stack
		// stays on screen and each drawer still peeks out from under the next.
		const deepestWidth = peers[peers.length - 1]?.widthPx ?? instance.widthPx;
		const rawSpread = rawOffsetAt(peers.length - 1);
		const maxSpread = Math.max(0, viewportWidth.value - deepestWidth - MIN_EDGE_GAP);
		if (rawSpread <= maxSpread) return raw;

		return (raw * maxSpread) / rawSpread;
	}

	function setWidth(name: string, widthPx: number) {
		const instance = stack.find((entry) => entry.name === name);
		if (instance) instance.widthPx = widthPx;
	}

	function open(name: string, rawConfig: IDrawerConfig): IDrawerInstance {
		// Drop explicitly-`undefined` keys (e.g. a caller forwarding an optional
		// prop straight through) so they can't clobber the defaults below —
		// `{ ...defaults, ...config }` only skips *missing* keys, not `undefined` ones.
		const config = Object.fromEntries(
			Object.entries(rawConfig).filter(([, value]) => value !== undefined),
		) as IDrawerConfig;

		// The stack is `reactive`, so a component object put in it would be deeply
		// proxied — pointless overhead, and Vue warns about it.
		if (config.component) config.component = markRaw(config.component);

		const existing = stack.find((instance) => instance.name === name);
		if (existing) {
			Object.assign(existing, config, { closing: false });
			stack.splice(stack.indexOf(existing), 1);
			stack.push(existing);
			return existing;
		}

		const closed = new Promise<void>((resolve) => {
			resolvers.set(name, resolve);
		});

		const instance: IDrawerInstance = {
			position: "right",
			width: "w-full sm:max-w-lg",
			backdrop: true,
			...config,
			name,
			widthPx: 0,
			closed,
			closing: false,
			frozenOffsetPx: 0,
			frozenZIndex: BASE_Z_INDEX,
		};

		stack.push(instance);
		return instance;
	}

	// Marks the instance as closing (so it stops affecting the rest of the
	// stack's layout and z-order) but leaves it in `stack` until BaseDrawer
	// reports its leave transition finished via `finalizeClose`.
	function close(name: string, opts: { silent?: boolean } = {}) {
		const instance = stack.find((entry) => entry.name === name);
		if (!instance || instance.closing) return;
		instance.frozenOffsetPx = offsetOf(name);
		instance.frozenZIndex = zIndexOf(name);
		instance.closing = true;
		if (!opts.silent) instance.onClose?.();
		resolvers.get(name)?.();
		resolvers.delete(name);
	}

	function finalizeClose(name: string) {
		const index = stack.findIndex((entry) => entry.name === name && entry.closing);
		if (index !== -1) stack.splice(index, 1);
	}

	function closeAll(opts: { except?: string[] } = {}) {
		const names = stack.map((instance) => instance.name).filter((name) => !opts.except?.includes(name));
		names.forEach((name) => close(name));
	}

	function closeGroup(group: string) {
		const names = stack.filter((instance) => instance.group === group).map((instance) => instance.name);
		names.forEach((name) => close(name));
	}

	return {
		stack,
		topName,
		isOpen,
		zIndexOf,
		offsetOf,
		setWidth,
		open,
		close,
		finalizeClose,
		closeAll,
		closeGroup,
	};
});
