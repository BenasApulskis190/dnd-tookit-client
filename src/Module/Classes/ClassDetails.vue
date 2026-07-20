<script lang="ts" setup>
import type { IClass } from "@/Module/Classes/types"

defineProps<{ dndClass: IClass }>()
</script>

<template>
	<div>
		<pre>{{ dndClass }}</pre>
	</div>
</template>
