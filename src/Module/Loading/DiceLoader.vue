<script lang="ts" setup>
withDefaults(
	defineProps<{
		text?: string;
		sub?: string;
	}>(),
	{
		text: "Rolling the dice",
		sub: "Consulting the tome",
	},
);
</script>

<template>
	<div class="loading-state" role="status" aria-live="polite">
		<div class="dice-loader">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M12 1.6 22 7.4v9.2L12 22.4 2 16.6V7.4z" />
				<path d="M12 1.6 6.6 10h10.8z" />
				<path d="M6.6 10 2 7.4M17.4 10 22 7.4M6.6 10v6.6L12 22.4l5.4-5.8V10" />
				<text
					x="12"
					y="16.4"
					text-anchor="middle"
					font-size="5"
					font-family="var(--font-mono)"
					fill="currentColor"
					stroke="none"
				>
					20
				</text>
			</svg>
		</div>
		<div class="loading-state-text">
			{{ text }}<span class="loading-state-dots" />
		</div>
		<div class="loading-state-sub">{{ sub }}</div>
	</div>
</template>
