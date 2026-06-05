<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = withDefaults(
	defineProps<{
		type?: "auto" | "manual";
		color?: string;
	}>(),
	{
		type: "auto",
	},
);

const route = useRoute();

const cat = computed((): string | undefined => {
	switch (props.type) {
		case "auto":
			return route.meta.color;
		case "manual":
			if (props.color) return props.color;
			throw new Error("Manual type selected, color prop is required");
		default:
			throw new Error("Invalid type provided");
	}
});
</script>

<template>
	<div
		class="flex flex-col gap-[10px] mb-4 px-[14px] py-3 rounded-[var(--radius)]"
		:style="{
			'--cat': cat,
			background: 'linear-gradient(180deg, color-mix(in srgb, var(--cat) 8%, transparent), transparent 80%), var(--bg-elev)',
			border: '1px solid color-mix(in srgb, var(--cat) 22%, var(--border))',
		}"
	>
		<slot />
	</div>
</template>
