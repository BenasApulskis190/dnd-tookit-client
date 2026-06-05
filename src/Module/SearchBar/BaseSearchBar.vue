<script lang="ts" setup>
const model = defineModel<string>({ default: "" });

defineProps<{
	placeholder?: string;
	loading?: boolean;
}>();
</script>

<template>
	<div
		class="flex items-center gap-[10px] h-[40px] px-[14px] bg-[var(--bg-elev)] border border-[var(--border)] rounded-[10px] flex-1 min-w-[200px] max-w-[420px] has-[:focus]:border-[var(--accent)] has-[:focus]:shadow-[0_0_0_4px_var(--accent-soft)] transition-shadow"
	>
		<svg
			v-if="!loading"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="shrink-0 text-[var(--ink-faint)]"
		>
			<circle cx="11" cy="11" r="7" />
			<path d="m20 20-3.5-3.5" />
		</svg>

		<svg
			v-else
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="shrink-0 text-[var(--ink-faint)] animate-spin"
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>

		<input
			v-model="model"
			:placeholder="placeholder ?? 'Search...'"
			class="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none"
		/>
	</div>
</template>
