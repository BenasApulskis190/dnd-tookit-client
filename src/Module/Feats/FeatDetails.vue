<script lang="ts" setup>
import type { IFeat } from "@/Module/Feats/types"

defineProps<{ feat: IFeat }>()
</script>

<template>
	<div>
		<pre>{{ feat }}</pre>
	</div>
</template>
