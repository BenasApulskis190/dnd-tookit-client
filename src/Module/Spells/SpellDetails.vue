<script lang="ts" setup>
import type { ISpell } from "@/Module/Spells/types"

defineProps<{ spell: ISpell }>()
</script>

<template>
	<div>
		<pre>
			{{ spell }}
		</pre>
	</div>
</template>
