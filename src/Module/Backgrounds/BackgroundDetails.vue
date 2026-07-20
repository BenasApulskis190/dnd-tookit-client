<script lang="ts" setup>
import type { IBackground } from "@/Module/Backgrounds/types"

defineProps<{ background: IBackground }>()
</script>

<template>
	<div>
		<pre>{{ background }}</pre>
	</div>
</template>
