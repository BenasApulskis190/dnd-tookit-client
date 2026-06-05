<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = withDefaults(
	defineProps<{
		type?: "auto" | "manual" | "auto-title" | "auto-category";
		title?: string;
		category?: string;
		glyph?: string;
		color?: string;
	}>(),
	{
		type: "auto",
	},
);

const route = useRoute();

const category = computed((): string => {
	switch (props.type) {
		case "auto":
		case "auto-category":
			return route.meta.category as string;
		case "manual":
			if (props.category) return props.category;
			throw new Error("Manual type selected, category prop is required");
		default:
			throw new Error("Invalid type provided");
	}
});

const title = computed((): string => {
	switch (props.type) {
		case "auto":
		case "auto-title":
			return route.name as string;
		case "manual":
			if (props.title) return props.title;
			throw new Error("Manual type selected, title prop is required");
		default:
			throw new Error("Invalid type provided");
	}
});

const glyph = computed((): string | undefined => {
	switch (props.type) {
		case "auto":
		case "auto-title":
		case "auto-category":
			return route.meta.glyph;
		case "manual":
			return props.glyph;
		default:
			throw new Error("Invalid type provided");
	}
});

const color = computed((): string | undefined => {
	switch (props.type) {
		case "auto":
		case "auto-title":
		case "auto-category":
			return route.meta.color;
		case "manual":
			return props.color;
		default:
			throw new Error("Invalid type provided");
	}
});
</script>

<template>
    <div class="mb-5">
        <span
            class="text-[11px] tracking-[2px] uppercase font-semibold"
            :style="{ color }"
        >{{ glyph }} {{ category }}</span>

        <h2 class="capitalize font-display text-[28px] font-medium tracking-[-0.3px] m-0 text-[var(--ink)] text-balance">
            {{ title }}
        </h2>
    </div>
</template>
