import { ref } from "vue";

// `BaseModal` renders a native <dialog> opened via `showModal()`, which puts
// it in the browser's top layer — a stacking context that always paints
// above regular DOM content regardless of z-index. A drawer teleported to
// `body` while a modal is open would render behind it and be invisible, so
// BaseDrawer teleports into the open dialog instead, falling back to `body`.
const topDialog = ref<HTMLElement | null>(null);

let observer: MutationObserver | null = null;

function refresh() {
	const dialogs = document.querySelectorAll("dialog[open]");
	topDialog.value = dialogs.length ? (dialogs[dialogs.length - 1] as HTMLElement) : null;
}

function ensureObserver() {
	if (observer || typeof document === "undefined") return;
	observer = new MutationObserver(refresh);
	observer.observe(document.body, { attributes: true, attributeFilter: ["open"], subtree: true });
	refresh();
}

export function useTopDialogTarget() {
	ensureObserver();
	return topDialog;
}
