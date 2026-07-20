<script lang="ts" setup>
import type { IItem } from "@/Module/Items/types"

defineProps<{ item: IItem }>()
</script>

<template>
	<div>
		<pre>{{ item }}</pre>
	</div>
</template>
