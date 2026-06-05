<script lang="ts" setup>
import { ref } from "vue"

const props = withDefaults(
	defineProps<{
		searchBy?: string[]
	}>(),
	{
		searchBy: () => ["name"],
	},
)

const search = ref("")

const placeholder = props.searchBy.join(", ")
</script>

<template>
	<div class="flex flex-col h-full">
		<div class="p-3 border-b border-gray-200">
			<input
				v-model="search"
				type="text"
				:placeholder="`Search by ${placeholder}...`"
				class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
			/>
			<slot name="header" :search="search" />
		</div>

		<div class="overflow-y-auto flex-1">
			<slot :search="search" />
		</div>
	</div>
</template>
