import type { Component } from "vue";

export interface IDrawerConfig {
	component: Component;
	props?: Record<string, unknown>;
	position?: "left" | "right";
	/** Tailwind width classes. */
	width?: string;
	backdrop?: boolean;
	group?: string;
	/** Fired when this drawer closes via user action (backdrop/escape/close()). */
	onClose?: () => void;
}

export interface IDrawerInstance extends Required<Pick<IDrawerConfig, "component" | "position" | "width" | "backdrop">>,
	Pick<IDrawerConfig, "props" | "group" | "onClose"> {
	name: string;
	/** Measured rendered width in px, written by BaseDrawer's resize observer. */
	widthPx: number;
	/** Resolves once this instance closes. */
	closed: Promise<void>;
	/** True while playing its leave transition, just before removal from the stack. */
	closing: boolean;
	/** Offset/zIndex snapshotted the instant `closing` flips true, so it holds its position while animating out. */
	frozenOffsetPx: number;
	frozenZIndex: number;
}
