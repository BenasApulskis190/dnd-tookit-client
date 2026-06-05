<script lang="ts" setup>
import { ref } from "vue"

const isOpen = ref(false)
</script>

<template>
	<div class="border-b border-gray-100">
		<div
			class="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer select-none"
			@click="isOpen = !isOpen"
		>
			<slot name="header" />

			<div class="ml-auto flex items-center gap-2 shrink-0" @click.stop>
				<slot name="actions" />

				<svg
					:class="isOpen ? 'rotate-180' : ''"
					class="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		</div>

		<Transition
			enter-active-class="transition-all duration-200 ease-out overflow-hidden"
			enter-from-class="max-h-0 opacity-0"
			enter-to-class="max-h-96 opacity-100"
			leave-active-class="transition-all duration-150 ease-in overflow-hidden"
			leave-from-class="max-h-96 opacity-100"
			leave-to-class="max-h-0 opacity-0"
		>
			<div v-if="isOpen" class="px-4 py-3 bg-gray-50 border-t border-gray-100">
				<slot name="details" />
			</div>
		</Transition>
	</div>
</template>
