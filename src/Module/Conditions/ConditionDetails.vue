<script lang="ts" setup>
import type { ICondition } from "@/Module/Conditions/types"

defineProps<{ condition: ICondition }>()
</script>

<template>
	<div>
		<pre>{{ condition}}</pre>
	</div>
</template>
